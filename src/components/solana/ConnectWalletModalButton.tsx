"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const PHANTOM  = "Phantom"  as WalletName;
const SOLFLARE = "Solflare" as WalletName;

const hasPhantom = () =>
  typeof window !== "undefined" &&
  (((window as any).solana && (window as any).solana.isPhantom) ||
    (window as any).phantom?.solana?.isPhantom);

const hasSolflare = () =>
  typeof window !== "undefined" && (window as any).solflare?.isSolflare;

const short = (k: string) => `${k.slice(0, 4)}…${k.slice(-4)}`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ConnectWalletModalButton() {
  const { select, connected, connecting, publicKey, wallet, disconnect } = useWallet();
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const busy = useRef(false);

  useEffect(() => {
    if (connected) setOpen(false);
  }, [connected]);

  async function connectWallet(name: WalletName) {
    if (busy.current || connecting || cooldown) return;
    busy.current = true;
    setErr("");

    try {
      // 1) выбрать адаптер
      await select(name);

      // 2) дождаться, пока контекст реально переключит adapter
      let switched = false;
      for (let i = 0; i < 40; i++) { // ~1s
        if (wallet?.adapter?.name === name) { switched = true; break; }
        await wait(25);
      }
      if (!switched || !wallet?.adapter) {
        setErr("Wallet adapter not ready. Please try again.");
        return;
      }

      // 3) один явный connect через сам адаптер
      // @ts-ignore в разных версиях есть connected/connecting
      if (!wallet.adapter.connected) {
        try {
          await wallet.adapter.connect();
        } catch (e: any) {
          // 4001 — пользователь отменил
          if (e?.code !== 4001) setErr(e?.message ?? "Failed to connect");
          return;
        }
      }

      setOpen(false);
    } finally {
      busy.current = false;
      setCooldown(true);
      // короткий кулдаун от «дробовика по кнопке»
      setTimeout(() => setCooldown(false), 800);
    }
  }

  // подключено
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

  // не подключено
  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)} disabled={connecting}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-xl font-semibold mb-4">Select a wallet</h3>

        <div className="grid gap-2">
          <Button
            onClick={() => connectWallet(PHANTOM)}
            disabled={connecting || cooldown || !hasPhantom()}
          >
            Phantom {!hasPhantom() && "(not installed)"}
          </Button>

          <Button
            variant="secondary"
            onClick={() => connectWallet(SOLFLARE)}
            disabled={connecting || cooldown || !hasSolflare()}
          >
            Solflare {!hasSolflare() && "(not installed)"}
          </Button>
        </div>

        {/* аккуратный блок ошибки по центру */}
        {err && (
          <div className="mt-4">
            <div className="mx-auto w-full text-center text-sm text-red-400">
              {err}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button variant="ghost" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
}
