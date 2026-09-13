import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Geist } from "next/font/google";
import { GeistPixelSquare } from "geist/font/pixel";
import "./globals.css";
import AgentationClient from "../components/agentation-client";
import { AppShell } from "../components/AppShell";
import { GrainOverlay } from "../components/grain-overlay";
import { IntroLoader } from "../components/IntroLoader";
import { CursorClickEffect } from "../components/cursor-click-effect";
import { SoundProvider } from "../components/sound-provider";
import { AboutEyeProvider } from "../context/about-eye-context";
import { ZeroGravityProvider } from "../context/zero-gravity-context";
import { NotificationProvider } from "../context/notification-context";
import { ZeroGravityCosmos } from "../components/zero-gravity/ZeroGravityCosmos";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const delightFont = localFont({
  src: [
    { path: "../../public/fonts/Delight-Thin.woff2", weight: "100", style: "normal" },
    { path: "../../public/fonts/Delight-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../../public/fonts/Delight-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Delight-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Delight-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Delight-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Delight-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Delight-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/Delight-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-figtree",
  display: "swap",
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
      className={`${geistSans.variable} ${GeistPixelSquare.variable} ${delightFont.variable} ${myFont.variable} h-full antialiased`}
    >
      <body className="min-h-full text-zinc-800 relative">
        <IntroLoader>
          <ZeroGravityProvider>
            <NotificationProvider>
              <AboutEyeProvider>
                <SoundProvider />
                <GrainOverlay />
                <ZeroGravityCosmos />
                <CursorClickEffect />
                <AppShell>{children}</AppShell>
                <AgentationClient />
              </AboutEyeProvider>
            </NotificationProvider>
          </ZeroGravityProvider>
        </IntroLoader>
      </body>
    </html>
  );
}
