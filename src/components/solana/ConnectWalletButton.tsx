"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base"; // << важное добавление
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

// Брендированные имена адаптеров:
const PHANTOM  = "Phantom"  as WalletName;
const SOLFLARE = "Solflare" as WalletName;

const hasPhantom = () =>
  typeof window !== "undefined" &&
  (((window as any).solana && (window as any).solana.isPhantom) ||
    (window as any).phantom?.solana?.isPhantom);

const hasSolflare = () =>
  typeof window !== "undefined" && (window as any).solflare?.isSolflare;

const short = (k: string) => `${k.slice(0, 4)}…${k.slice(-4)}`;

export function ConnectWalletModalButton() {
  const { select, connect, disconnect, connecting, connected, publicKey, wallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    if (connected) setOpen(false);
  }, [connected]);

  async function handleConnect(name: WalletName) {
    setErr("");
    try {
      await select(name);   // выбрать адаптер (WalletName!)
      await connect();      // подключиться
    } catch (e: any) {
      console.debug("Wallet connect error:", e?.message ?? e);
      setErr(e?.message ?? "Failed to connect");
    }
  }

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

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Select a wallet</h3>

        <div className="grid gap-2">
          <Button
            onClick={() => handleConnect(PHANTOM)}
            disabled={connecting || !hasPhantom()}
          >
            Phantom {!hasPhantom() && "(not installed)"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleConnect(SOLFLARE)}
            disabled={connecting || !hasSolflare()}
          >
            Solflare {!hasSolflare() && "(not installed)"}
          </Button>

          {err && <p className="text-sm text-red-400 mt-1">{err}</p>}

          {!hasPhantom() && (
            <a
              className="text-xs text-zinc-400 underline"
              href="https://phantom.app/download"
              target="_blank"
              rel="noreferrer"
            >
              Install Phantom
            </a>
          )}
          {!hasSolflare() && (
            <a
              className="text-xs text-zinc-400 underline"
              href="https://solflare.com/download"
              target="_blank"
              rel="noreferrer"
            >
              Install Solflare
            </a>
          )}

          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
