import React, { FC, ReactNode, useMemo } from 'react';
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider:FC<{children:ReactNode}> = ({children}) => {

    const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
    const phantom = useMemo(() => new PhantomWalletAdapter(), []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[phantom]} autoConnect >
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default WalletContextProvider