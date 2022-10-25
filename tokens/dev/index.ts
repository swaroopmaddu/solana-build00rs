import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  findMetadataPda,
} from "@metaplex-foundation/js";
import {
  DataV2,
  createCreateMetadataAccountV2Instruction
} from "@metaplex-foundation/mpl-token-metadata";
import * as fs from "fs";

const TOKEN_NAME="DEV Coin";
const TOKEN_SYMBOL="DEV";
const TOKEN_DESCRIPTION = "DEV Coin is a token for the Solana Buildoors project";
const TOKEN_DECIMALS=2;
const TOKEN_IMAGE="tokens/dev/assets/icon.jpg";
const TOKEN_IMAGE_NAME = "icon.jpg";


async function buildDevCoin(connection:web3.Connection, payer: web3.Keypair, programId: web3.PublicKey) {

  const [mintAuth] = await web3.PublicKey.findProgramAddress(
    [Buffer.from("mint")],
    programId
  );

  const mint = await token.createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    TOKEN_DECIMALS
  );

  // metaplex setup
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );

  // file to buffer
  const buffer = fs.readFileSync(TOKEN_IMAGE);

  // buffer to metaplex file
  const file = toMetaplexFile(buffer, TOKEN_IMAGE_NAME);

  // upload image and get image uri
  const imageUri = await metaplex.storage().upload(file);

  // upload metadata and get metadata uri (off chain metadata)
  const { uri } = await metaplex
    .nfts()
    .uploadMetadata({
      name: TOKEN_NAME,
      description: TOKEN_DESCRIPTION,
      image: imageUri,
    })
    .run();

  console.log("metadata uri:", uri);

  const metadataPDA = findMetadataPda(mint);

  // onchain metadata format
  const tokenMetadata = {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    uri: uri,
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  } as DataV2;

  // create metadata account
  const instruction = createCreateMetadataAccountV2Instruction(
    {
      metadata: metadataPDA,
      mint: mint,
      mintAuthority: payer.publicKey,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
    },
    {
      createMetadataAccountArgsV2: {
        data: tokenMetadata,
        isMutable: true,
      },
    }
  );

    const tx = new web3.Transaction().add(instruction);
    const transactionSignature = await web3.sendAndConfirmTransaction(
        connection,
        tx,
        [payer],
    );

    console.log(`Transaction signature: ${transactionSignature}`);
    
    await token.setAuthority(
      connection,
      payer,
      mint,
      payer.publicKey,
      token.AuthorityType.MintTokens,
      mintAuth
    );
    
    fs.writeFileSync("tokens/dev/devcoin.json", JSON.stringify({
        mint: mint.toBase58(),
        tokenMetadata: metadataPDA.toBase58(),
        metadataUri: uri,
        imageUri: imageUri,
        transactionSignature: transactionSignature
    }))
}

async function main() {
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));
    const user = await initializeKeypair(connection);

    await buildDevCoin(
      connection,
      user,
      new web3.PublicKey("AxJjgFUbaQn8ypKgRy56EKco2cQ95oGEN7oJUdo7VCUY")
    );
}

main()
  .then(() => {
    console.log("Finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
