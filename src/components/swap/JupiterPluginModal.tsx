"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Modal } from "@/components/ui/Modal";

// USDC mainnet — по желанию можно поменять дефолты
const USDC = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const SOL  = "So11111111111111111111111111111111111111112"; // wSOL mint

export function JupiterPluginModal({
  open,
  onClose,
  onRequestConnectWallet, // дерни нашу модалку кошельков, если надо
}: {
  open: boolean;
  onClose: () => void;
  onRequestConnectWallet: () => void | Promise<void>;
}) {
  const walletCtx = useWallet();

  // Инициализация один раз при открытии
  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined" || !window.Jupiter) return;

    window.Jupiter.init({
      displayMode: "integrated",
      integratedTargetId: "jup-plugin-container",
      containerClassName: "rounded-2xl border border-white/10 bg-zinc-900/60 p-2",

      // Важное: прокидываем существующий wallet-adapter
      enableWalletPassthrough: true,
      passthroughWalletContextState: walletCtx,
      onRequestConnectWallet, // плагин попросит открыть твою модалку

      // Начальные значения формы
      formProps: {
        initialInputMint: SOL,
        initialOutputMint: USDC,
        swapMode: "ExactIn",
        initialAmount: "0.1",
        // referralAccount: "<твой реферал аккаунт>", // опционально
        // referralFee: 50, // 0.5% если участвуешь в реферальной программе
      },

      onSuccess: ({ txid }) => {
        console.log("Jupiter swap success:", txid);
        onClose(); // закрываем после успешного свопа
      },
      onSwapError: ({ error }) => {
        console.warn("Jupiter swap error", error);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Синхронизация при смене кошелька/сети
  useEffect(() => {
    if (typeof window === "undefined" || !window.Jupiter) return;
    window.Jupiter.syncProps({
      passthroughWalletContextState: walletCtx,
    });
  }, [walletCtx]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-3">Swap</h3>
      <div id="jup-plugin-container" />
    </Modal>
  );
}
