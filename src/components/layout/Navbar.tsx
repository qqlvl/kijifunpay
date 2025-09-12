"use client";
import { Button } from "@/components/ui/Button";
import { ConnectWalletModalButton } from "@/components/solana/ConnectWalletModalButton";
import { JupiterModalLauncher } from "@/components/swap/JupiterModalLauncher";

export function Navbar() {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="font-anton text-2xl">KIJI</h1>

        <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/create" className="hover:text-white">Create</a>
          <a href="/about" className="hover:text-white">About</a>
        </nav>

        <div className="flex items-center gap-2">
          <JupiterModalLauncher className="inline-flex">
            <Button variant="secondary" size="sm">Swap</Button>
          </JupiterModalLauncher>
          <ConnectWalletModalButton />
        </div>
      </div>
    </header>
  );
}
