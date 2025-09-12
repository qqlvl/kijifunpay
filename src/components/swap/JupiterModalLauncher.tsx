"use client";

import { useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const WSOL = "So11111111111111111111111111111111111111112";

export function JupiterModalLauncher({
  children = "Swap",
  onRequestConnectWallet,
  className,
}: {
  children?: React.ReactNode;
  onRequestConnectWallet?: () => void | Promise<void>;
  className?: string;
}) {
  const walletCtx = useWallet();

  // держим кошелёк в синхроне с плагином
  useEffect(() => {
    if (typeof window === "undefined" || !window.Jupiter) return;
    window.Jupiter.syncProps({
      passthroughWalletContextState: walletCtx,
    });
  }, [walletCtx]);

  const open = useCallback(() => {
    if (typeof window === "undefined" || !window.Jupiter) return;
    window.Jupiter.init({
      displayMode: "modal",                       // <<< родная модалка Jupiter
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletCtx,
      onRequestConnectWallet,                     // вызвать твою модалку кошельков при необходимости
      formProps: {
        initialInputMint: WSOL,
        initialOutputMint: USDC,
        swapMode: "ExactIn",
        initialAmount: "0.1",
        // referralAccount: "...", referralFee: 50, // опционально
      },
      onSuccess: ({ txid }) => {
        console.log("Jupiter success:", txid);
      },
      onSwapError: ({ error }) => {
        console.warn("Jupiter error:", error);
      },
    });
  }, [walletCtx, onRequestConnectWallet]);

  return (
    <button type="button" className={className} onClick={open}>
      {children}
    </button>
  );
}
