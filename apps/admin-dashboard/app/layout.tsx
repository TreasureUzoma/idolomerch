import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@workspace/ui/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { TanstackProvider } from "@/components/tanstack-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin - Idolo Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TanstackProvider>
            {children}
            <Toaster />
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
