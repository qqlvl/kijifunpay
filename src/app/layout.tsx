import type { Metadata } from "next";
import localFont from "next/font/local";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Anton } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { ToastContainer } from "@/components/ui/Toast";
import { WalletProviders } from "@/components/solana/WalletProviders";
import "@solana/wallet-adapter-react-ui/styles.css";


// SF Pro Display — основные веса (добавь/убери по вкусу)
const sfPro = localFont({
  src: [
    { path: "./fonts/SF-Pro-Display-Thin.otf",       weight: "100", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Light.otf",      weight: "300", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Regular.otf",    weight: "400", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Medium.otf",     weight: "500", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Semibold.otf",   weight: "600", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Bold.otf",       weight: "700", style: "normal" },
    { path: "./fonts/SF-Pro-Display-Black.otf",      weight: "900", style: "normal" },
    // если нужны курсывы — добавь соответствующие *Italic.otf
  ],
  variable: "--font-sf",
  display: "swap",
});

// OffBit — акцентный (логотипы/хедлайны)
const offbit = localFont({
  src: [{ path: "./fonts/OffBitTrial-Bold.otf", weight: "700", style: "normal" }],
  variable: "--font-offbit",
  display: "swap",
});

const anton = Anton({
  subsets: ["latin"],
  weight: ["400"], // у Anton всего один вес
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "kijipay",
  description: "Solana",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sfPro.variable} ${offbit.variable} ${anton.variable}`}>
      <body className="font-sans">
        <WalletProviders>
          <Navbar />
          {children}
        </WalletProviders>
      </body>
    </html>
  );
}
