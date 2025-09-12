export type JupToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
};

// Mainnet mints
export const SOL_MINT  = "So11111111111111111111111111111111111111112"; // wSOL
export const USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC (mainnet)


const POPULAR = new Set([
  "SOL","USDC","USDT","JUP","BONK","mSOL","MSOL","jitoSOL","JITOSOL","bSOL","BSOL",
  "RAY","ORCA","PYTH","WIF","JTO","MARINDEG","JLP","JLP0","JLP1"
]);

// убираем мусорные суффиксы в названии
const cleanName = (s: string) => s.replace(/\s*\(.*?\)\s*/g, "").trim();
// приводим символ (без знака $)
const cleanSymbol = (s: string) => s.replace(/^\$/,"").trim();

function looksSane(t: JupToken) {
  const verified = t.tags?.includes("strict") || t.tags?.includes("verified");
  if (!verified) return false;

  const sym = cleanSymbol(t.symbol);
  // символ из 2–8 алфанумерик, без пробелов/служебных
  const saneSymbol = /^[A-Z0-9]{2,8}$/.test(sym);
  const saneName   = !/\b(Automated|Wrapper|Bond|LP|Pool|Test|Fake|IOU)\b/i.test(t.name);
  const hasLogo    = !!t.logoURI;
  return saneSymbol && saneName && hasLogo;
}

export async function fetchJupTokens(): Promise<JupToken[]> {
  const res = await fetch("/api/jup/tokens");
  if (!res.ok) throw new Error("Failed to load tokens");
  const all = (await res.json()) as JupToken[];

  const filtered = all.filter(looksSane).map(t => ({
    ...t,
    symbol: cleanSymbol(t.symbol),
    name: cleanName(t.name),
  }));

  // популярные наверх, дальше по алфавиту
  return filtered.sort((a,b) => {
    const pa = POPULAR.has(a.symbol) ? 0 : 1;
    const pb = POPULAR.has(b.symbol) ? 0 : 1;
    if (pa!==pb) return pa-pb;
    return a.symbol.localeCompare(b.symbol);
  });
}

export async function buildSwapTx(params: {
    quoteResponse: any;
    userPublicKey: string;
  }) {
    const res = await fetch("/api/jup/swap", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quoteResponse: params.quoteResponse,
        userPublicKey: params.userPublicKey,
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: "auto",
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { swapTransaction, ... }
  }

  // ===== Quote (GET /api/jup/quote) =====
export async function getQuote(params: {
    inputMint: string;
    outputMint: string;
    amount: string;        // атомарное количество (min units)
    slippageBps?: number;  // 50 = 0.5%
    onlyDirectRoutes?: boolean;
  }) {
    const search = new URLSearchParams({
      inputMint: params.inputMint,
      outputMint: params.outputMint,
      amount: params.amount,
      slippageBps: String(params.slippageBps ?? 50),
      onlyDirectRoutes: String(params.onlyDirectRoutes ?? false),
    });
    const res = await fetch(`/api/jup/quote?${search.toString()}`);
    if (!res.ok) throw new Error("Quote request failed");
    return res.json();
  }