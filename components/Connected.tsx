import {
  Container,
  Heading,
  VStack,
  Button,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";
import React, { FC, MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { CandyMachine, Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { useRouter } from "next/router";


const Connected: FC = () => {

  const {connection} = useConnection();
  const walletAdapter = useWallet();
  const [candyMachine, setCandyMachine] = useState<CandyMachine>();
  const [isMinting, setIsMinting] = useState(false);


  const metaplex = useMemo(() => {
    return Metaplex.make(connection).use(walletAdapterIdentity(walletAdapter));
  }, [connection, walletAdapter]);

    useEffect(() => {
      if (!metaplex) return;

      metaplex
        .candyMachines()
        .findByAddress({
          address: new PublicKey(
            "8mk5JriSXNxrXjqoUx12Xhz3nrWpdBa6FUBEKmmhEmEL"
          ),
        })
        .run()
        .then((candyMachine) => {
          console.log(candyMachine);
          setCandyMachine(candyMachine);
        })
        .catch((error) => {
          alert(error);
        });
    }, [metaplex]);

  const router = useRouter();

  const _handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      if (event.defaultPrevented) return;

      if (!walletAdapter.connected || !candyMachine) {
        return;
      }

      try {
        setIsMinting(true);
        const nft = await metaplex.candyMachines().mint({ candyMachine }).run();
        console.log(nft);
        router.push(`/newmint?mint=${nft.nft.address.toBase58()}`);
      } catch (error) {
        alert(error);
      } finally {
        setIsMinting(false);
      }
    },
    [metaplex, walletAdapter, candyMachine, router]
  );

  return (
    <VStack spacing="20">
      <Container>
        <VStack spacing={8}>
          <Heading color="white" size="2xl" noOfLines={1} textAlign="center">
            Welcome Build00r.
          </Heading>
          <Text color="bodyText" fontSize="xl" textAlign="center">
            Each Build00r is randomly generated and can be stacked to recieve{" "}
            <Text as="b">$DEV</Text>. Use Your <Text as="b">$DEV</Text> to
            upgrade your Build00r and recieve perks within the community!
          </Text>
        </VStack>
      </Container>
      <HStack spacing={10}>
        <Image src="avatars/1.png" alt="avatar" />
        <Image src="avatars/2.png" alt="avatar" />
        <Image src="avatars/3.png" alt="avatar" />
        <Image src="avatars/4.png" alt="avatar" />
        <Image src="avatars/5.png" alt="avatar" />
      </HStack>
      <Button
        bgColor="accent"
        color="white"
        maxW="380px"
        onClick={_handleClick}
        isLoading={isMinting}
      >
        <Text>Mint Studious Crab</Text>
      </Button>
    </VStack>
  );
};

export default Connected;
