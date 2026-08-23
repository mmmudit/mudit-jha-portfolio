import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgentationClient from "../components/agentation-client";
import PageTransition from "../components/PageTransition";
import { Header } from "../components/header";
import { GrainOverlay } from "../components/grain-overlay";
import { IntroLoader } from "../components/IntroLoader";
import { CursorClickEffect } from "../components/cursor-click-effect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const myFont = localFont({
  src: "../../public/fonts/Myfont Regular.ttf",
  variable: "--font-myfont",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mudit Jha — Design Engineer",
  description:
    "Design engineer & creative generalist. Building thoughtful things at the intersection of tech and human behavior.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${myFont.variable} h-full antialiased`}
    >
      <head>
        <link rel="preload" href="/intro.webm" as="video" type="video/webm" />
        <link rel="preload" href="/intro.mp4" as="video" type="video/mp4" />
      </head>
      <body className="min-h-full text-zinc-800 relative">
        <IntroLoader>
          <GrainOverlay />
          <CursorClickEffect />
          <div className="sticky top-0 z-50 w-full px-6 pt-4 sm:px-14 sm:pt-6 pointer-events-none">
            <Header />
          </div>
          <div className="mx-auto flex w-full max-w-[1334px] flex-col px-6 sm:px-14 pt-8">
            <PageTransition>{children}</PageTransition>
          </div>
          <AgentationClient />
        </IntroLoader>
      </body>
    </html>
  );
}
