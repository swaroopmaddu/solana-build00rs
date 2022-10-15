import { Center, Flex, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import { NextPage } from "next";
import { useState } from "react";
import { ItemBox } from "../components/ItemBox";
import MainLayout from "../components/MainLayout";
import { StakeOptinsDisplay } from "../components/StakeOptionsDisplay";


interface StakeProps {
  mint: PublicKey;
  imageSrc: string;
}
const Stake:NextPage<StakeProps> = ( {
    mint, imageSrc, 
}) => {
    const [isStaking, setIsStaking] = useState(false);
    const [level, setLevel] = useState(1);

    return (
      <MainLayout>
        <VStack spacing={7} justify={"flex-start"} align={"flex-start"}>
          <Heading color={"white"} as="h1" size="2xl">
            Level up Your Crab
          </Heading>
          <Text color="bodyText" fontSize="xl" textAlign="start" maxW="600px">
            Stake your Crab to earn 10 $DEV per day and also get access to
            randomised lootbox of upgrades for your Crab
          </Text>
          <HStack spacing={20} alignItems={"flex-start"}>
            <VStack align={"flex-start"} minWidth={"200px"}>
              <Flex direction={"column"}>
                <Image
                  src={imageSrc ?? ""}
                  alt="Crab NFT"
                  zIndex={1}
                  w={"200px"}
                />
                <Center
                  bgColor={"secondaryPurple"}
                  borderRadius="0 0 8px 8px"
                  marginTop={"-8px"}
                  zIndex={"2"}
                  height={"32px"}
                >
                  <Text
                    color={"white"}
                    fontSize={"md"}
                    width={"100%"}
                    textAlign={"center"}
                  >
                    {isStaking ? "STAKING" : "UNSTAKED"}
                  </Text>
                </Center>
              </Flex>
              <Text color={"white"} as="b" fontSize={"2xl"}>
                LEVEL {level}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack align={"flex-start"} spacing={10}>
          <StakeOptinsDisplay
            isStaking={true}
            daysStaked={3}
            totalEarned={40}
            claimable={20}
          />
          <HStack spacing={10}>
            <VStack align={"flex-start"}>
              <Text color={"white"} as="b" fontSize={"2xl"}>
                Gear
              </Text>
              <HStack spacing={10}>
                <ItemBox>mock</ItemBox>
                <ItemBox>mock</ItemBox>
              </HStack>
            </VStack>
            <VStack align={"flex-start"}>
              <Text color={"white"} as="b" fontSize={"2xl"}>
                Loot Boxes
              </Text>
              <HStack spacing={10}>
                <ItemBox>mock</ItemBox>
                <ItemBox>mock</ItemBox>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </MainLayout>
    );
}

Stake.getInitialProps = async ({ query }: any) => {
  const { mint, imageSrc } = query;

  if (!mint || !imageSrc) throw { error: "no mint" };

  try {
    const mintPubkey = new PublicKey(mint);
    return { mint: mintPubkey, imageSrc:imageSrc };
  } catch {
    throw { error: "invalid mint" };
  }
};

export default Stake;