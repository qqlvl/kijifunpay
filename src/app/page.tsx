import { Button } from "@/components/ui/Button";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-zinc-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
        <h1 className="text-6xl font-anton tracking-wide">KIJI</h1>
            <p className="max-w-2xl mx-auto">
          Create and share Solana checks. Fast, non-custodial, beautiful.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg">Create Check</Button>
          <Button variant="secondary" size="lg">Connect Wallet</Button>
        </div>
        </section>

        {/* Demo form */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardTitle>New Check</CardTitle>
            <CardDesc className="mt-1">Set the amount and token</CardDesc>

            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" placeholder="0.25" />
              </div>
              <div>
                <Label htmlFor="token">Token</Label>
                <Input id="token" placeholder="SOL (default)" />
              </div>
              <div className="pt-2 flex gap-3">
                <Button>Create</Button>
                <Button variant="ghost">Preview</Button>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>History</CardTitle>
            <CardDesc className="mt-1">Recent transactions</CardDesc>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-zinc-300">Check • 0.25 SOL</span>
                <span className="text-emerald-400">Claimed</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="text-zinc-300">Check • 1.00 USDC</span>
                <span className="text-yellow-400">Pending</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-zinc-300">Multi-check • 10×0.1 SOL</span>
                <span className="text-zinc-400">Expired</span>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}
