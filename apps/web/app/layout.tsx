import { CurrencyProvider } from "@/context/currency";
import { CartProvider } from "@/context/cart";
import type { Metadata } from "next";
import "@repo/ui/globals.css";
import "./page.module.css";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export const metadata: Metadata = {
  title: "idolomerch - Shop weirdly interesting merchs by idolodev.",
  description:
    "Uncover limited drops, playful designs, and chaotic-good merch by idolodev. Built for fans who like it different, weird, and a little wonderful.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600&f[]=switzer@300,400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <CurrencyProvider>
          <CartProvider>
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}

