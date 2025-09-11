"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

function short(key: string) {
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

// простые проверки наличия расширений
function phantomInstalled() {
  return typeof window !== "undefined" && (window as any).solana?.isPhantom;
}
function solflareInstalled() {
  return typeof window !== "undefined" && (window as any).solflare?.isSolflare;
}

export function ConnectWalletModalButton() {
  const { select, connecting, connected, publicKey, disconnect, wallet } = useWallet();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (connected) setOpen(false);
  }, [connected]);

  // Подключено — показываем адрес + Disconnect (единый стиль)
  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-300">
          {wallet?.adapter.name && <span className="mr-2">{wallet.adapter.name}:</span>}
          <span className="text-zinc-100">{short(publicKey.toBase58())}</span>
        </span>
        <Button variant="secondary" size="sm" onClick={disconnect} disabled={connecting}>
          Disconnect
        </Button>
      </div>
    );
  }

  // Не подключено — одна кнопка + модалка выбора
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Select a wallet</h3>
        <div className="grid gap-2">
          <Button
            onClick={() => select("Phantom")}
            disabled={connecting || !phantomInstalled()}
          >
            Phantom {!phantomInstalled() && "(not installed)"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => select("Solflare")}
            disabled={connecting || !solflareInstalled()}
          >
            Solflare {!solflareInstalled() && "(not installed)"}
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
