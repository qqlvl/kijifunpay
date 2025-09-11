"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const PHANTOM = "Phantom" as WalletName;

const hasPhantom = () =>
  typeof window !== "undefined" &&
  (((window as any).solana && (window as any).solana.isPhantom) ||
    (window as any).phantom?.solana?.isPhantom);

const short = (k: string) => `${k.slice(0, 4)}…${k.slice(-4)}`;

export function ConnectWalletModalButton() {
  const { select, connect, disconnect, connecting, connected, publicKey, wallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const busy = useRef(false); // защита от повторов

  useEffect(() => {
    if (connected) setOpen(false);
  }, [connected]);

  async function connectPhantom() {
    if (busy.current || connecting) return; // не даём повторять
    busy.current = true;
    setErr("");

    try {
      await select(PHANTOM);         // выбрать адаптер
      await Promise.resolve();       // микротик, чтоб контекст обновился
      await connect();               // один вызов connect
      setOpen(false);
    } catch (e: any) {
      // 4001 — пользователь отменил; не считаем ошибкой
      if (e?.code !== 4001) {
        console.debug("Wallet connect error:", e?.message ?? e);
        setErr(e?.message ?? "Failed to connect");
      }
    } finally {
      busy.current = false;
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
          <Button onClick={connectPhantom} disabled={connecting || !hasPhantom()}>
            Phantom {!hasPhantom() && "(not installed)"}
          </Button>

          {err && <p className="text-sm text-red-400 mt-1">{err}</p>}

          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
