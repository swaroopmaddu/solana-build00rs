import { Button, Text, VStack } from "@chakra-ui/react";
import {
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { PROGRAM_ID as METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { STAKE_MINT } from "../utils/constants";
import { useCallback, useEffect, useState } from "react";
import { getStakeAccount } from "../utils/accounts";
import { useWorkspace } from "./WorkspaceProvider";

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

  const [loading, setLoading] = useState(false);
  const [isStaking, setIsStaking] = useState(isStaked);
  const [nftTokenAccount, setNftTokenAccount] = useState<PublicKey>();
  const workspace = useWorkspace();

  useEffect(() => {
    checkStakingStatus();

    if (nftData) {
      connection
        .getTokenLargestAccounts(nftData.mint.address as PublicKey)
        .then((accounts) => setNftTokenAccount(accounts.value[0].address));
    }
  }, [nftData, walletAdapter, connection]);

  const checkStakingStatus = useCallback(async () => {

    if (!walletAdapter.publicKey || !nftTokenAccount || !workspace.program) {
      return;
    }

    try {
      const account = await getStakeAccount(
        workspace.program,
        walletAdapter.publicKey,
        nftTokenAccount
      );

      setIsStaking(account.stakeState.staked);
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
    console.log(workspace);

    if (
         !walletAdapter.connected || !walletAdapter.publicKey || !nftTokenAccount || !workspace.program
    ) {
      alert("Please connect your wallet handleStake");
      return;
    }
    setLoading(true);

    const stakeIx = await workspace.program.methods.stake().accounts({
      nftTokenAccount: nftTokenAccount,
      nftMint: nftData.mint.address,
      nftEdition: nftData.edition.address,
      metadataProgram: METADATA_PROGRAM_ID
    }).instruction();


    const transaction = new Transaction();
    transaction.add(stakeIx);

    await sendAndConfirmTransaction(transaction);
    await checkStakingStatus();
    setLoading(false);
    
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleClaim = useCallback(async () => {
    if (
      !walletAdapter.connected ||
      !walletAdapter.publicKey ||
      !nftTokenAccount || !workspace.program
    ) {
      alert("Please connect your wallet handleClaim");
      return;
    }
    setLoading(true);
    
    const userStakeATA = await getAssociatedTokenAddress(
      STAKE_MINT,
      walletAdapter.publicKey
    );

    const redeemIx = await workspace.program.methods
      .redeem()
      .accounts({
        nftTokenAccount: nftTokenAccount,
        stakeMint: STAKE_MINT,
        userStakeAta: userStakeATA,
      })
      .instruction();

    const transaction = new Transaction();
    transaction.add(redeemIx);

    await sendAndConfirmTransaction(transaction);
    await checkStakingStatus();
    setLoading(false);
  }, [walletAdapter, connection, nftData, nftTokenAccount]);

  const handleUnStake = useCallback(async () => {

    if (!walletAdapter.connected || !walletAdapter.publicKey || !nftTokenAccount || !workspace.program) {
      alert("Please connect your wallet handleUnStake");
      return;
    }

    setLoading(true);
      const userStakeATA = await getAssociatedTokenAddress(
        STAKE_MINT,
        walletAdapter.publicKey
      );

    const unstakeIx = await workspace.program.methods.unstake().accounts({
      nftTokenAccount: nftTokenAccount,
      nftMint: nftData.mint.address,
      nftEdition: nftData.edition.address,
      metadataProgram: METADATA_PROGRAM_ID,
      stakeMint: STAKE_MINT,
      userStakeAta: userStakeATA
    }).instruction();

    const transaction = new Transaction();
    transaction.add(unstakeIx);

    await sendAndConfirmTransaction(transaction);
    await checkStakingStatus();
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
