import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Figtree, Geist } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import AgentationClient from "../components/agentation-client";
import PageTransition from "../components/PageTransition";
import { Header } from "../components/header";
import { GrainOverlay } from "../components/grain-overlay";
import { IntroLoader } from "../components/IntroLoader";
import { CursorClickEffect } from "../components/cursor-click-effect";
import { SoundProvider } from "../components/sound-provider";
import { AboutEyeProvider } from "../context/about-eye-context";
import { ZeroGravityProvider } from "../context/zero-gravity-context";
import { ZeroGravityCosmos } from "../components/zero-gravity/ZeroGravityCosmos";
import { ZeroGravityNotification } from "../components/zero-gravity/ZeroGravityNotification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const myFont = localFont({
  src: "../../public/fonts/Myfont Regular.ttf",
  variable: "--font-myfont",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fbfaf5",
};

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
      className={`${geistSans.variable} ${GeistPixelSquare.variable} ${figtree.variable} ${myFont.variable} h-full antialiased`}
    >
      <body className="min-h-full text-zinc-800 relative">
        <IntroLoader>
          <ZeroGravityProvider>
            <AboutEyeProvider>
              <SoundProvider />
              <GrainOverlay />
              <ZeroGravityCosmos />
              <CursorClickEffect />
              <div className="sticky md:relative top-0 z-50 w-full px-6 pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:px-14 sm:pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pointer-events-none">
                <Header />
              </div>
              <div className="mx-auto flex w-full max-w-[1334px] flex-col px-6 sm:px-14 pt-8">
                <PageTransition>{children}</PageTransition>
              </div>
              <ZeroGravityNotification />
              <AgentationClient />
            </AboutEyeProvider>
          </ZeroGravityProvider>
        </IntroLoader>
      </body>
    </html>
  );
}
