"use client";
import { ConnectWalletModalButton } from "@/components/solana/ConnectWalletModalButton";

export function Navbar() {
  return (
    <header className="border-b border-white/10">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="font-anton text-2xl">KIJI</h1>
        <nav className="hidden md:flex gap-6 text-sm text-zinc-300">
          <a href="/" className="hover:text-white transition">Home</a>
          <a href="/create" className="hover:text-white transition">Create</a>
          <a href="/about" className="hover:text-white transition">About</a>
        </nav>
        <ConnectWalletModalButton />
      </div>
    </header>
  );
}
