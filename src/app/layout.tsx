import localFont from "next/font/local";
import "./globals.css";

const sfPro = localFont({
  src: [
    { path: "./fonts/SF-Pro-Display-Regular.otf", weight: "400" },
    { path: "./fonts/SF-Pro-Display-Medium.otf",  weight: "500" },
    { path: "./fonts/SF-Pro-Display-Semibold.otf",weight: "600" },
    { path: "./fonts/SF-Pro-Display-Bold.otf",    weight: "700" },
  ],
  variable: "--font-sf",
  display: "swap",
});

const offbit = localFont({
  src: [{ path: "./fonts/OffBitTrial-Bold.otf", weight: "700" }],
  variable: "--font-offbit",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sfPro.variable} ${offbit.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
