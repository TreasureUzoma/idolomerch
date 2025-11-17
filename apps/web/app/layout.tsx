import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "idolomerch - Shop weirdly interesting merchs by idolodev.",
  description:
    "Uncover limited drops, playful designs, and chaoqtic-good merch by idolodev. Built for fans who like it different, weird, and a little wonderful.",
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
          <Header />
          <main className=" min-h-svh p-4 md:p-8">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
