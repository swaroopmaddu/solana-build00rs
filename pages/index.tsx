import type { NextPage } from 'next'
import {Center } from '@chakra-ui/react'
import Disconnected from '../components/Disconnected'
import Connected from '../components/Connected';
import { useWallet } from '@solana/wallet-adapter-react';
import MainLayout from '../components/MainLayout';

const Home: NextPage = () => {

  const {connected} = useWallet();

  return (
    <MainLayout>
      <Center>{connected ? <Connected /> : <Disconnected />}</Center>
    </MainLayout>
  );
}

export default Home
