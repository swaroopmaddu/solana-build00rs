import React, { FC } from 'react';
import { HStack, Spacer } from '@chakra-ui/react';
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import Styles from '../styles/Home.module.css';

const NavBar:FC = () => {
  return (
    <HStack w="full" padding="4">
      <Spacer />
      <WalletMultiButton className={Styles["wallet-adapter-button-trigger"]} />
    </HStack>
  );
}

export default NavBar