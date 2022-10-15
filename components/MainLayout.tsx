import {FC, ReactNode} from 'react';
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Box, Center, Spacer, Stack, Text, Link } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { useWallet } from "@solana/wallet-adapter-react";


const MainLayout: FC<{children:ReactNode}> = ({children}) => {

    const { connected } = useWallet();

    return (
      <div className={styles.container}>
        <Head>
          <title>Buildoors</title>
          <meta name="description" content="Solana devs NFT collections" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box
          w="full"
          h="calc(100vh)"
          bgImage={connected ? "" : "url(/background.svg)"}
          backgroundPosition="center"
        >
          <Stack w="full" h="calc(100vh)" justify="center">
            <NavBar />
            <Spacer />

            <Center>{ children }</Center>
            <Spacer />

            <Center>
              <Box marginBottom={4} color="white">
                <Text>
                  Follow me on Twitter&nbsp;
                  <Link
                    color="blue.500"
                    href="https://twitter.com/madduswaroop"
                    isExternal
                  >
                    @madduswaroop
                  </Link>
                </Text>
              </Box>
            </Center>
          </Stack>
        </Box>
      </div>
    );
}

export default MainLayout;