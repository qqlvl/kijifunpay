"use client";

import { ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { clusterApiUrl } from "@solana/web3.js";

export function WalletProviders({ children }: { children: React.ReactNode }) {
  const endpoint = clusterApiUrl("devnet");

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: "devnet" }),
      // new LedgerWalletAdapter(), // если понадобиться — добавишь
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider
    wallets={[new PhantomWalletAdapter(), new SolflareWalletAdapter({ network: "devnet" })]}
    autoConnect={false}
    onError={(e) => console.debug("Wallet error:", e?.message ?? e)}
    >
    <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
  );
}
