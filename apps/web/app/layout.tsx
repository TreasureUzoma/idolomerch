import { Outfit, JetBrains_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CurrencySync } from "@/components/currency-sync";
import { Suspense } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { meta } from "@workspace/constants";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "idolo.dev store - Shop weirdly interesting merchs by idolodev.",
  description:
    "Uncover limited drops, playful designs, and chaoqtic-good merch by idolodev. Built for fans who like it different, weird, and a little wonderful.",
  keywords: [
    "merch",
    "idolodev",
    "idolo.dev",
    "idolo",
    "idolo.dev store",
    "idolo store",
    "idolo.dev store",
    "idolo.dev merch",
    "idolo merch",
  ],
  authors: [{ name: "idolodev", url: meta.website }],
  creator: "idolodev",
  publisher: "idolodev",
  openGraph: {
    title: "idolo.dev store - Shop weirdly interesting merchs by idolodev.",
    description:
      "Uncover limited drops, playful designs, and chaoqtic-good merch by idolodev. Built for fans who like it different, weird, and a little wonderful.",
    url: meta.website,
    siteName: "idolo.dev store",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "idolo.dev store - Shop weirdly interesting merchs by idolodev.",
    description:
      "Uncover limited drops, playful designs, and chaoqtic-good merch by idolodev. Built for fans who like it different, weird, and a little wonderful.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <ThemeProvider>
          <Suspense fallback={<Skeleton />}>
            <CurrencySync />
          </Suspense>
          <Header />
          <main className=" min-h-svh p-4 md:p-8">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
