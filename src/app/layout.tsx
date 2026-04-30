import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ExternalLink } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IF HOLO | 数字全息收藏馆",
  description: "一个酷炫、可玩的在线数字全息收藏馆原型。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          aria-label="打开 GitHub 仓库"
          className="fixed right-4 top-4 z-50 inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-black/45 px-3 text-sm font-medium text-white/80 shadow-2xl shadow-black/30 backdrop-blur transition hover:border-white/25 hover:bg-white/10 hover:text-white sm:right-6 sm:top-6"
          href="https://github.com/msh01/if-holo"
          rel="noreferrer"
          target="_blank"
        >
          <span>GitHub</span>
          <ExternalLink className="h-4 w-4" />
        </a>
        {children}
      </body>
    </html>
  );
}
