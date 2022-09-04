import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Box,Center, Spacer, Stack, Text, Link } from '@chakra-ui/react'
import NavBar from '../components/NavBar';
import Disconnected from '../components/Disconnected'
import Connected from '../components/Connected';
import { useWallet } from '@solana/wallet-adapter-react';

const Home: NextPage = () => {

  const {connected} = useWallet();

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

          <Center>{connected ? <Connected /> : <Disconnected />}</Center>
          <Spacer />

          <Center>
            <Box marginBottom={4} color="white">
              <Text>
                Follow me on Twitter&nbsp;
                <Link color='blue.500' href="https://twitter.com/madduswaroop" isExternal>
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

export default Home
