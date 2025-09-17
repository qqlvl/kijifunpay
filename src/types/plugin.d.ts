import type { WalletContextState } from "@solana/wallet-adapter-react";

declare global {
  interface Window {
    Jupiter: {
      init: (args: {
        displayMode?: "modal" | "integrated" | "widget";
        integratedTargetId?: string;
        containerClassName?: string;
        containerStyles?: React.CSSProperties;
        enableWalletPassthrough?: boolean;
        passthroughWalletContextState?: WalletContextState;
        onRequestConnectWallet?: () => void | Promise<void>;
        formProps?: {
          initialInputMint?: string;
          initialOutputMint?: string;
          initialAmount?: string;
          swapMode?: "ExactIn" | "ExactOut" | "ExactInOrOut";
        };
        onSuccess?: (p: { txid: string }) => void;
        onSwapError?: (p: { error?: any }) => void;
        onFormUpdate?: (f: any) => void;
        onScreenUpdate?: (s: any) => void;
      }) => void;
      syncProps: (p: { passthroughWalletContextState?: WalletContextState }) => void;
      close: () => void;
    };
  }
}
export {};
