import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Container, Heading, VStack, Button, Text, HStack } from '@chakra-ui/react'
import React, { FC, MouseEventHandler, useCallback } from 'react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const Disconnected:FC = () => {

  const modalState = useWalletModal();
  const {wallet, connect} = useWallet();

  const handleClick:MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
        if(event.defaultPrevented){
            return ;
        }
        if(!wallet){
          modalState.setVisible(true);
        } else {
          connect().catch(()=>{});
        }
    },[wallet, modalState, connect]
  );


  return (
    <Container>
      <VStack spacing="20">
        <Heading color="white" size="3xl" noOfLines={2} textAlign="center">
          Mint your Build00r, Earn $DEV, Level up.
        </Heading>
        <Button
          bgColor="accent"
          color="white"
          maxW="320px"
          onClick={handleClick}
        >
          <HStack>
            <Text>Become a Build00r</Text>
            <ArrowForwardIcon />
          </HStack>
        </Button>
      </VStack>
    </Container>
  );
}

export default Disconnected