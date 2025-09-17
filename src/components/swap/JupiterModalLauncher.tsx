"use client";

import { useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const WSOL = "So11111111111111111111111111111111111111112";

type Props = {
  /** Рендер-функция: получаешь open() и рендеришь свою кнопку */
  children: (open: () => void) => React.ReactElement;
  onRequestConnectWallet?: () => void | Promise<void>;
};

export function JupiterModalLauncher({ children, onRequestConnectWallet }: Props) {
  const walletCtx = useWallet();

  useEffect(() => {
    if (typeof window === "undefined" || !window.Jupiter) return;
    window.Jupiter.syncProps({ passthroughWalletContextState: walletCtx });
  }, [walletCtx]);

  const open = useCallback(() => {
    if (typeof window === "undefined" || !window.Jupiter) return;
    window.Jupiter.init({
      displayMode: "modal",
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletCtx,
      onRequestConnectWallet,
      formProps: {
        initialInputMint: WSOL,
        initialOutputMint: USDC,
        swapMode: "ExactIn",
        initialAmount: "0.1",
      },
      onSuccess: ({ txid }) => console.log("Jupiter success:", txid),
      onSwapError: ({ error }) => console.warn("Jupiter error:", error),
    });
  }, [walletCtx, onRequestConnectWallet]);

  return children(open);
}
