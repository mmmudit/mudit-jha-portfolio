"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { DialRoot, useDialKitController } from "dialkit";
import { RainbowTunnel, rainbowSettings } from "@/components/rainbow-tunnel/rainbow-tunnel";
import "dialkit/styles.css";

const subscribe = () => () => {};

const defaults = { ...rainbowSettings, showText: true };


function Playground() {
  const root = useRef<HTMLElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const dial = useDialKitController("Rainbow tunnel", {
    speed: [defaults.speed, 0, 3, 0.25],
    waist: [defaults.waist, 0.02, 0.18, 0.005],
    flare: [defaults.flare, 0.05, 0.65, 0.01],
    glow: [defaults.glow, 0, 2, 0.05],
    intensity: [defaults.intensity, 0.1, 1, 0.05],
    streaks: [defaults.streaks, 0, 2, 0.1],
    cursor: [defaults.cursor, 0, 2, 0.1],
    paused: false,
    showText: true,
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousGutter = document.documentElement.style.scrollbarGutter;
    document.body.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "auto";
    const siblings = [...document.body.children].filter((node) => node instanceof HTMLElement && !node.contains(root.current)) as HTMLElement[];
    const previousInert = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.scrollbarGutter = previousGutter;
      siblings.forEach((node, index) => { node.inert = previousInert[index]; });
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(dial.getValues(), null, 2));
      setCopyStatus("Settings copied");
    } catch { setCopyStatus("Clipboard unavailable — use the values in the panel."); }
  }

  return <main ref={root} id="rainbow-prototype" className="font-display fixed inset-0 z-[100] isolate overflow-hidden text-[#22262d] antialiased">
    <RainbowTunnel settings={dial.values} />
    <header className="absolute left-6 top-6 z-10 flex items-center gap-3 sm:left-10 sm:top-8">
      <Link href="/" className="flex min-h-11 items-center text-base font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4">mudit jha</Link>
      <span className="hidden text-sm text-[#6b7584] sm:inline">/ experiments</span>
    </header>

    {dial.values.showText && <div className="pointer-events-none absolute inset-x-5 top-[20%] mx-auto max-w-3xl text-center sm:top-[19%]">
      <p className="mb-5 text-xs font-medium tracking-[0.16em] text-[#637080] uppercase">Light study · 001</p>
      <h1 className="text-[clamp(40px,6vw,80px)] leading-[1.05] font-medium tracking-[-0.055em] text-balance">A little more spectrum.</h1>
      <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[#65717f] sm:text-lg">An exploration of light, color, and the space between.</p>
    </div>}

    <aside data-tunnel-controls className="absolute top-4 right-4 z-20 max-h-[calc(100dvh-100px)] overflow-y-auto sm:top-6 sm:right-6" aria-label="Shader controls">
      <details className="w-[160px] rounded-2xl bg-[#181818] text-white shadow-lg open:w-[min(280px,calc(100vw-32px))] sm:w-[280px]">
        <summary className="flex min-h-11 cursor-pointer items-center justify-between px-4 text-[13px] font-medium focus-visible:outline-2 focus-visible:outline-offset-2">Tune the light <span aria-hidden="true">↗</span></summary>
        <DialRoot mode="inline" theme="dark" productionEnabled />
        <div className="flex gap-2 px-3 pb-3 font-sans text-xs">
          <button onClick={copy} className="min-h-11 flex-1 cursor-pointer rounded-lg bg-white/10 px-3 hover:bg-white/15 focus-visible:outline-2">Copy settings</button>
          <button onClick={() => { dial.resetValues(); setCopyStatus(""); }} className="min-h-11 cursor-pointer rounded-lg px-3 hover:bg-white/10 focus-visible:outline-2">Reset</button>
        </div>
        <p role="status" className="px-4 pb-3 font-sans text-xs text-zinc-300">{copyStatus || "Speed: 0.25×–3× · 0 freezes time"}</p>
      </details>
    </aside>

    <footer className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-xs text-[#697583] sm:inset-x-10 sm:bottom-8">
      <p>Rainbow tunnel<br /><span className="mt-1 block text-[#808996]">Live WebGL · move your pointer</span></p>
      <button aria-pressed={dial.values.paused} onClick={() => dial.setValue("paused", !dial.values.paused)} className="min-h-11 cursor-pointer rounded-full border border-black/10 bg-white/40 px-5 text-[#4b5868] hover:bg-white/70 focus-visible:outline-2 focus-visible:outline-offset-2">{dial.values.paused ? "Resume" : "Pause"}</button>
    </footer>
  </main>;
}

export function RainbowPlayground() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? createPortal(<Playground />, document.body) : null;
}
