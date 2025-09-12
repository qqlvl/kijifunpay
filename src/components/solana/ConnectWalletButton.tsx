"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { WalletName } from "@solana/wallet-adapter-base";
import { Button } from "@/components/ui/Button";

const PHANTOM = "Phantom" as WalletName;

const hasPhantom = () =>
  typeof window !== "undefined" &&
  (((window as any).solana && (window as any).solana.isPhantom) ||
    (window as any).phantom?.solana?.isPhantom);

const short = (k: string) => `${k.slice(0, 4)}…${k.slice(-4)}`;

export function ConnectWalletButton() {
  const { select, connect, disconnect, connected, connecting, publicKey, wallet } = useWallet();
  const [err, setErr] = useState("");
  const busy = useRef(false); // защита от повторных кликов

  useEffect(() => {
    // сбрасываем ошибку когда начинаем коннектиться/отключились
    if (connecting || !connected) setErr("");
  }, [connecting, connected]);

  async function handleConnect() {
    if (busy.current || connecting) return;
    if (!hasPhantom()) return; // нет расширения — кнопку можно сделать disabled выше
    busy.current = true;
    setErr("");

    try {
      // 1) выбираем адаптер
      await select(PHANTOM);

      // 2) ждём, пока контекст реально переключит активный адаптер
      for (let i = 0; i < 20; i++) {
        if (wallet?.adapter?.name === PHANTOM) break;
        await new Promise((r) => setTimeout(r, 25));
      }

      // 3) коннектимся НАПРЯМУЮ через адаптер (надёжнее, чем хук connect())
      const adapter = wallet?.adapter;
      if (!adapter) throw new Error("Wallet adapter not ready");

      // если уже подключён — просто выходим
      // @ts-ignore в разных версиях поле может существовать
      if (adapter.connected) return;

      await adapter.connect();

      // альтернативно можно: await connect(); — но direct connect стабильнее
    } catch (e: any) {
      // 4001 — пользователь отменил — не считаем ошибкой
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
    <div className="flex flex-col items-end">
      <Button size="sm" onClick={handleConnect} disabled={connecting || !hasPhantom()}>
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
      {!hasPhantom() && (
        <span className="mt-1 text-xs text-zinc-500">Install Phantom to connect</span>
      )}
      {err && <span className="mt-1 text-xs text-red-400">{err}</span>}
    </div>
  );
}
