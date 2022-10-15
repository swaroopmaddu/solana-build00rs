import { Button, Text, VStack } from "@chakra-ui/react";

export const StakeOptinsDisplay = ({
  isStaking,
  daysStaked,
  totalEarned,
  claimable,
}: {
  isStaking: boolean;
  daysStaked: number;
  totalEarned: number;
  claimable: number;
}) => {

    const handleClaim = () => {
        console.log("Claim");
    };
    const handleStake = () => {
        console.log("Stake");
    };
    const handleUnStake = () => {
    console.log("Stake");
    };

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
          : "READY TO STAKE"}
      </Text>
      <VStack spacing={"-1"}>
        <Text color={"white"} as={"b"} fontSize={"4xl"}>
          {isStaking ? `${totalEarned} $DEV` : "0 $DEV"}
        </Text>
        <Text color={"bodyText"} as={"b"} fontSize={"sm"}>
          {isStaking ? `${claimable} $DEV earned` : "Earn $DEV by staking"}
        </Text>
      </VStack>
      <Button onClick={isStaking ? handleClaim : handleStake} bgColor={"buttonGreen"} width={"200px"}>
        <Text as={"b"}>{isStaking ? "Claim $DEV" : "Stake CRAB"}</Text>
      </Button>
      {
            isStaking && <Button onClick={handleUnStake}>Unstake</Button>
      }
    </VStack>
  );
};
