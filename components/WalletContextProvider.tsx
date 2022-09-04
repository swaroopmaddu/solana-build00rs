import React, { FC, ReactNode } from 'react';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider:FC<{children:ReactNode}> = ({children}) => {
    const endpoint = clusterApiUrl('devnet');

    const wallets = [
        new PhantomWalletAdapter(),
        new SolflareWalletAdapter()
    ]

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} >
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default WalletContextProvider