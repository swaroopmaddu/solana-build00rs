import { Button, Text, VStack } from "@chakra-ui/react";
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  createInitializeStakeAccountInstruction,
  createRedeemInstruction,
  createStakingInstruction,
  createUnstakeInstruction,
} from "../utils/instructions";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { PROGRAM_ID, STAKE_MINT } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { getStakeAccount } from "../utils/accounts";

export const StakeOptinsDisplay = ({
  nftData,
  isStaked,
  daysStaked,
  totalEarned,
  claimable,
}: {
  nftData: any;
  isStaked: boolean;
  daysStaked: number;
  totalEarned: number;
  claimable: number;
}) => {
  const walletAdapter = useWallet();
  const { connection } = useConnection();
  const [isStaking, setIsStaking] = useState(isStaked);
  const [nftTokenAccount, setNftTokenAccount] = useState<PublicKey>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStakingStatus();

    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address as PublicKey)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address));
    }
  }, [nftData, walletAdapter, connection]);

  const checkStakingStatus = useCallback(async () => {

    console.log("checking staking status");
    console.log(nftData);
    if (!walletAdapter.publicKey || !nftTokenAccount) {
      return;
    }

    try {
      const account = await getStakeAccount(
        connection,
        walletAdapter.publicKey,
        nftTokenAccount
      );
      console.log("stake account:", account);

      setIsStaking(account.state === 0);
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }, [walletAdapter, connection, nftTokenAccount]);


  const sendAndConfirmTransaction = useCallback(
    async (transaction: Transaction) => {
       try {
         const signature = await walletAdapter.sendTransaction(
           transaction,
           connection
         );
         console.log(
           `View transaction at: https://explorer.solana.com/tx/${signature}?cluster=devnet`
         );
         const latestBlockhash = await connection.getLatestBlockhash();
         await connection.confirmTransaction(
           {
             blockhash: latestBlockhash.blockhash,
             lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
             signature: signature,
           },
           "finalized"
         );
       } catch (e) {
         setLoading(false);
         console.log(e);
       }
    },
    [walletAdapter, connection]
  );

  const handleStake = useCallback(async () => {
    console.log("Stake");
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet handleStake");
      return;
    }
    setLoading(true);

    const [stakeAccount] = PublicKey.findProgramAddressSync(
      [walletAdapter.publicKey.toBuffer(), nftTokenAccount.toBuffer()],
      PROGRAM_ID
    );

    const transaction = new Transaction();

    const account = await connection.getAccountInfo(stakeAccount);
    if (!account) {
      transaction.add(
        createInitializeStakeAccountInstruction(
          walletAdapter.publicKey,
          nftTokenAccount,
          PROGRAM_ID
        )
      );
    }

    const stake_ix = createStakingInstruction(
      walletAdapter.publicKey,
      nftTokenAccount,
      nftData.mint.address as PublicKey,
      nftData.edition.address as PublicKey,
      TOKEN_PROGRAM_ID,
      METADATA_PROGRAM_ID,
      PROGRAM_ID
    );
    transaction.add(stake_ix);

    await sendAndConfirmTransaction(transaction);
    await checkStakingStatus();
    setLoading(false);
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleClaim = useCallback(async () => {
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount
    ) {
      alert("Please connect your wallet handleClaim");
      return;
    }
    setLoading(true);
    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    );
    console.log("userStakeATA", userStakeATA.toBase58());
    const account = connection.getAccountInfo(userStakeATA);

    const transaction = new Transaction();

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      );
    }

    transaction.add(
      createRedeemInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        STAKE_MINT,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        PROGRAM_ID
      )
    );
    console.log(transaction);

    await sendAndConfirmTransaction(transaction);
    await checkStakingStatus();
    setLoading(false);
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleUnStake = useCallback(async () => {
    console.log("Unstake");
    if (!walletAdapter.connected || !walletAdapter.publicKey || !nftTokenAccount) {
      alert("Please connect your wallet handleUnStake");
      return;
    }
    setLoading(true);
    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    );
    const account = connection.getAccountInfo(userStakeATA);

    const transaction = new Transaction();

    if (!account) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          walletAdapter.publicKey,
          userStakeATA,
          walletAdapter.publicKey,
          STAKE_MINT
        )
      );
    }

    transaction.add(
      createUnstakeInstruction(
        walletAdapter.publicKey,
        nftTokenAccount,
        nftData.address as PublicKey,
        nftData.edition.address as PublicKey,
        STAKE_MINT,
        userStakeATA,
        TOKEN_PROGRAM_ID,
        METADATA_PROGRAM_ID,
        PROGRAM_ID
      )
    );
    console.log(transaction);
    await sendAndConfirmTransaction(transaction);
    setLoading(false);
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  return (
    <VStack
      bgColor={"containerBg"}
      borderRadius={"20px"}
      p={"20px 40px"}
      spacing={5}
    >
      <Text
        bgColor="containerBgSecondary"
        borderRadius={"20px"}
        p={"4px 8px"}
        color={"bodyText"}
        as={"b"}
        fontSize={"sm"}
      >
        {isStaking
          ? `STAKING ${daysStaked} DAY${daysStaked === 1 ? "" : "s"}`
          : "READY TO STAKE"
          }
      </Text>
      <VStack spacing={"-1"}>
        <Text color={"white"} as={"b"} fontSize={"4xl"}>
          {isStaking ? `${totalEarned} $DEV` : "0 $DEV"}
        </Text>
        <Text color={"bodyText"} as={"b"} fontSize={"sm"}>
          {isStaking ? `${claimable} $DEV earned` : "Earn $DEV by staking"}
        </Text>
      </VStack>
      <Button
        onClick={isStaking ? handleClaim : handleStake}
        bgColor={"buttonGreen"}
        width={"200px"}
        isLoading={loading}
      >
        <Text as={"b"}>{isStaking ? "Claim $DEV" : "Stake CRAB"}</Text>
      </Button>
      {isStaking && <Button onClick={handleUnStake}>Unstake</Button>}
    </VStack>
  );
};
