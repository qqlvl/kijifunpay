// минимальный тип (хватает для init/sync/close)
import type { WalletContextState } from "@solana/wallet-adapter-react";

declare global {
  interface Window {
    Jupiter: {
      init: (args: {
        // как показывать
        displayMode?: "modal" | "integrated" | "widget";
        integratedTargetId?: string;
        containerClassName?: string;
        containerStyles?: React.CSSProperties;

        // Passthrough кошелька
        enableWalletPassthrough?: boolean;
        passthroughWalletContextState?: WalletContextState;
        onRequestConnectWallet?: () => void | Promise<void>;

        // Начальные параметры формы
        formProps?: {
          initialInputMint?: string;
          initialOutputMint?: string;
          initialAmount?: string;
          swapMode?: "ExactIn" | "ExactOut" | "ExactInOrOut";
          fixedMint?: string;
          fixedAmount?: boolean;
          referralAccount?: string;
          referralFee?: number; // bps
        };

        // коллбеки
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