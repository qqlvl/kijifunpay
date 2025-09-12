"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { JupToken } from "@/lib/jupiter";

export function TokenSelect({
  tokens,
  value,
  onChange,
  id,
  label,
}: {
  tokens: JupToken[];
  value: string;
  onChange: (mint: string) => void;
  id: string;
  label?: string;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tokens.slice(0, 300);
    return tokens.filter(t =>
      t.symbol.toLowerCase().includes(s) || t.name.toLowerCase().includes(s)
    ).slice(0, 300);
  }, [q, tokens]);

  return (
    <div className="space-y-2">
      {label && <label htmlFor={id} className="text-xs text-zinc-400">{label}</label>}
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search token (e.g. USDC)"
        className="w-full rounded-xl bg-zinc-900 border border-white/10 px-3 py-2 text-sm"
      />
      <div className="max-h-56 overflow-auto rounded-xl border border-white/10 bg-zinc-900/60">
        {filtered.map(t => (
          <button
            key={t.address}
            onClick={()=>onChange(t.address)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/5 transition ${
              value===t.address ? "bg-white/5" : ""
            }`}
            type="button"
          >
            {t.logoURI ? (
              <Image src={t.logoURI} alt={t.symbol} width={20} height={20} className="rounded" />
            ) : (
              <div className="w-5 h-5 rounded bg-zinc-700" />
            )}
            <div className="flex-1">
              <div className="text-sm text-white">{t.symbol}</div>
              <div className="text-xs text-zinc-400">{t.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
