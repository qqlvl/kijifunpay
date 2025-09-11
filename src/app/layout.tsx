import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "KIJIfunPay",
  description: "Solana чек-сервис",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Критично: на <html> должны быть ОТ НАС переменные, а не geist
  return (
    <html lang="en" className={`${sfPro.variable} ${offbit.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
