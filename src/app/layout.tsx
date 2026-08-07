import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgentationClient from "../components/agentation-client";

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
  weight: ["500", "600"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${myFont.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-dough text-zinc-800">
        {children}
        <AgentationClient />
      </body>
    </html>
  );
}
