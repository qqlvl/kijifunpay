export function toAtomic(amountStr: string, decimals: number): string {
    const [w = "0", f = ""] = amountStr.replace(",", ".").split(".");
    const frac = (f + "0".repeat(decimals)).slice(0, decimals);
    const base = BigInt(10) ** BigInt(decimals);
    return (BigInt(w) * base + BigInt(frac)).toString();
  }