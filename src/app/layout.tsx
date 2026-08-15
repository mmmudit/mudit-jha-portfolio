import type { Metadata } from "next";
import localFont from "next/font/local";
import { Figtree, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgentationClient from "../components/agentation-client";
import PageTransition from "../components/PageTransition";
import { Header } from "../components/header";
import { GrainOverlay } from "../components/grain-overlay";
import { IntroLoader } from "../components/IntroLoader";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var seen = sessionStorage.getItem('portfolio_intro_seen');
                  var forced = window.location.search.indexOf('intro') !== -1;
                  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                  if (!forced && (seen === 'true' || reduced)) {
                    document.documentElement.classList.add('intro-dismissed');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <link rel="preload" href="/intro.webm" as="video" type="video/webm" />
        <link rel="preload" href="/intro.mp4" as="video" type="video/mp4" />
      </head>
      <body className="min-h-full bg-dough text-zinc-800 relative">
        <IntroLoader>
          <GrainOverlay />
          <div className="mx-auto w-full max-w-[1440px] px-6 pt-4 sm:px-14 sm:pt-8">
            <Header />
            <div className="mx-auto flex w-full max-w-[1334px] flex-col pt-8">
              <PageTransition>{children}</PageTransition>
            </div>
          </div>
          <AgentationClient />
        </IntroLoader>
      </body>
    </html>
  );
}



