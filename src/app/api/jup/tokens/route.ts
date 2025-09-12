import { NextResponse } from "next/server";

export const revalidate = 3600; // кэш на час (можно менять)

export async function GET() {
  const r = await fetch("https://tokens.jup.ag/tokens", {
    // чуть аккуратнее с кэшем, чтобы не спамить в dev
    next: { revalidate },
  });

  if (!r.ok) {
    return NextResponse.json({ error: "Upstream error" }, { status: r.status });
  }

  const data = await r.json();
  // Можно не ставить CORS тут: клиент и сервер один origin (localhost:3000).
  return NextResponse.json(data);
}
