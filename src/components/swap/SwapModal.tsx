"use client";

import { useEffect, useMemo, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  JupToken,
  fetchJupTokens,
  getQuote,
  buildSwapTx,
  SOL_MINT,
} from "@/lib/jupiter";
import { toAtomic } from "@/lib/units";
import { VersionedTransaction } from "@solana/web3.js";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TokenSelect } from "./TokenSelect";

export function SwapModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { connection } = useConnection();
  const { publicKey, wallet, signTransaction } = useWallet();
  const [tokens, setTokens] = useState<JupToken[]>([]);
  const [amount, setAmount] = useState("0.1");
  const [inMint, setInMint] = useState(SOL_MINT);
  const [outMint, setOutMint] = useState(SOL_MINT);
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const tokenMap = useMemo(
    () => new Map(tokens.map((t) => [t.address, t])),
    [tokens]
  );

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const list = await fetchJupTokens();
        setTokens(list);
        setOutMint(list.find((t) => t.symbol === "USDC")?.address || SOL_MINT);
      } catch (e: any) {
        setErr(e?.message || "Failed to load tokens");
      }
    })();
  }, [open]);

  async function fetchQuote() {
    setErr("");
    setQuote(null);
    try {
      const decIn = tokenMap.get(inMint)?.decimals ?? 9;
      const atomic = toAtomic(amount, decIn);
      const q = await getQuote({
        inputMint: inMint,
        outputMint: outMint,
        amount: atomic,
        slippageBps: 50,
      });
      setQuote(q);
    } catch (e: any) {
      setErr(e?.message || "Quote failed");
    }
  }
  

  async function doSwap() {
    if (!publicKey || !wallet || !signTransaction || !quote) return;
    setLoading(true);
    setErr("");

    try {
      const { swapTransaction } = await buildSwapTx({
        quoteResponse: quote,
        userPublicKey: publicKey.toBase58(),
      });

      const tx = VersionedTransaction.deserialize(
        Buffer.from(swapTransaction, "base64")
      );

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize(), {
        skipPreflight: false,
      });
      await connection.confirmTransaction(sig, "confirmed");
      onClose();
    } catch (e: any) {
      setErr(e?.message || "Swap failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  const inTok = tokenMap.get(inMint);
  const outTok = tokenMap.get(outMint);
  const estOut =
    quote?.outAmount && outTok
      ? Number(quote.outAmount) / 10 ** outTok.decimals
      : null;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-xl font-semibold mb-4">Swap</h3>

      <div className="grid gap-3">
        <div>
          <label className="text-xs text-zinc-400">From</label>
          <div className="mt-1 grid grid-cols-[1fr,auto] gap-2">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 text-sm"
              placeholder="0.1"
            />
            <span className="px-2 py-2 text-sm text-zinc-400">
              {inTok?.symbol || "SOL"}
            </span>
          </div>
          <div className="mt-2">
          <TokenSelect
            tokens={tokens}
            value={outMint}
            onChange={setOutMint}
            id="outMint"
            label="To token"
            />  
          </div>
        </div>

        <div>
          <label className="text-xs text-zinc-400">To</label>
          <TokenSelect
            tokens={tokens}
            value={outMint}
            onChange={setOutMint}
            id="outMint"
            label="To token"
            />
        </div>

        <div className="flex gap-2">
          <Button onClick={fetchQuote} disabled={!publicKey}>
            Get quote
          </Button>
          <Button
            variant="secondary"
            onClick={doSwap}
            disabled={!publicKey || !quote || loading}
          >
            {loading ? "Swapping..." : "Swap"}
          </Button>
        </div>

        {estOut != null && outTok && (
          <div className="text-sm text-zinc-300">
            Estimated receive:{" "}
            <span className="text-white">
              ~{estOut.toFixed(Math.min(6, outTok.decimals))} {outTok.symbol}
            </span>
          </div>
        )}

        {err && (
          <div className="text-center text-sm text-red-400 mt-1">{err}</div>
        )}
      </div>
    </Modal>
  );
}

