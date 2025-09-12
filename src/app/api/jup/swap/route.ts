import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const r = await fetch("https://quote-api.jup.ag/v6/swap", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!r.ok) {
    const text = await r.text();
    return NextResponse.json({ error: text || "Swap upstream error" }, { status: r.status });
  }

  const data = await r.json();
  return NextResponse.json(data);
}
