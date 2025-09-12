import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL("https://quote-api.jup.ag/v6/quote");
  // Пробрасываем все query параметры как есть
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) {
    return NextResponse.json({ error: "Quote upstream error" }, { status: r.status });
  }
  const data = await r.json();
  return NextResponse.json(data);
}
