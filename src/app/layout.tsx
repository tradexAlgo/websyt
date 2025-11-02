import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeX - Trading Platform",
  description: "Modern trading platform with real-time data, portfolio management, and advanced trading tools",
  keywords: ["trading", "stocks", "commodities", "portfolio", "finance", "real-time"],
  authors: [{ name: "TradeX Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TradeX - Trading Platform",
    description: "Modern trading platform with real-time data and portfolio management",
    url: "https://tradex.com",
    siteName: "TradeX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeX - Trading Platform",
    description: "Modern trading platform with real-time data and portfolio management",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ReduxProvider>
          {children}
          <Toaster />
        </ReduxProvider>
      </body>
    </html>
  );
}
