"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { play } from "@/lib/sound";
import { InteractiveTsuLogo } from "@/components/tsu-logo";
import NavigationTabs from "@/components/NavigationTabs";
import { LiveClock } from "@/components/live-clock";
import { TactileFolderCard } from "@/components/TactileFolderCard";
import { TactilePhotoCard } from "@/components/TactilePhotoCard";

interface IntroductionViewProps {
  onSelectView: (view: string) => void;
}

export function IntroductionView({ onSelectView }: IntroductionViewProps) {
  // Interactive state for 3D Tactile Card variant
  const [tactileCardVariant, setTactileCardVariant] = useState<"folder" | "portrait">("folder");

  // Interactive state for Typography tester
  const [typeSize, setTypeSize] = useState(26);

  // Interactive state for Motion spring preview
  const [springKey, setSpringKey] = useState(0);

  // Interactive state for Colors
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = (e: React.MouseEvent, hex: string, label: string) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(hex);
    play("toggle", { volume: 0.35 });
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 1800);
  };

  return (
    <div className="flex flex-col text-zinc-800">
      {/* ─────────────────────────────────────────────────────────────
          Hero Header Block with Container Guide Lines
         ───────────────────────────────────────────────────────────── */}
      <section className="relative border-b border-[#e4dccb] p-8 sm:p-12">
        {/* Subtle grid corner markers */}
        <div className="pointer-events-none absolute -top-1.5 -left-1.5 text-zinc-400 select-none font-mono text-xs">
          +
        </div>
        <div className="pointer-events-none absolute -top-1.5 -right-1.5 text-zinc-400 select-none font-mono text-xs">
          +
        </div>
        <div className="pointer-events-none absolute -bottom-1.5 -left-1.5 text-zinc-400 select-none font-mono text-xs">
          +
        </div>
        <div className="pointer-events-none absolute -bottom-1.5 -right-1.5 text-zinc-400 select-none font-mono text-xs">
          +
        </div>

        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-mono text-emerald-800">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Site Production
            </span>
            <span className="inline-flex items-center rounded-md border border-[#d9d0bb] bg-[#f5efe3]/80 px-2 py-0.5 text-[11px] font-mono text-zinc-700">
              muditjha.me
            </span>
            <span className="inline-flex items-center rounded-md border border-[#d9d0bb] bg-[#f5efe3]/80 px-2 py-0.5 text-[11px] font-mono text-zinc-700">
              WCAG 2.2 AAA
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 mb-3 font-sans">
            Design System
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-sans max-w-2xl">
            A tactile, warm paper design system crafted for physical-feeling web experiences, graphite typography, and authored micro-interactions.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive Bento Showcase Grid (Actual Live Site Components)
         ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e4dccb]">
        {/* ── CARD 1: Brand Mark (InteractiveTsuLogo) ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("brand");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div className="relative mb-8 flex h-52 items-center justify-center rounded-lg border border-dashed border-[#d9d0bb] bg-white/70 p-6">
            <div className="size-24 transition-transform duration-300 group-hover:scale-110">
              <InteractiveTsuLogo />
            </div>
            <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-zinc-400">
              &lt;InteractiveTsuLogo /&gt;
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Brand Mark & Logo
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Interactive Tsu eye mark with cursor-tracking pupils and spring-damped physics.
            </p>
          </div>
        </div>

        {/* ── CARD 2: Navigation Tabs (NavigationTabs) ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("components");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mb-8 flex h-52 flex-col items-center justify-center rounded-lg border border-[#e4dccb] bg-white/70 p-6"
          >
            <div className="w-fit scale-90 sm:scale-100">
              <NavigationTabs />
            </div>
            <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-zinc-400">
              &lt;NavigationTabs /&gt;
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Primary Navigation Tabs
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Main route controller with sliding Willow Grey selection pill and audio clicks.
            </p>
          </div>
        </div>

        {/* ── CARD 3: Live Clock & Globe (LiveClock) ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("components");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mb-8 flex h-52 items-center justify-center rounded-lg border border-[#e4dccb] bg-white/70 p-6"
          >
            <div className="w-fit scale-95 sm:scale-100">
              <LiveClock />
            </div>
            <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-zinc-400">
              &lt;LiveClock /&gt;
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Live Clock HUD
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Real-time header clock with rotating sun/moon and tabular mono coordinates.
            </p>
          </div>
        </div>

        {/* ── CARD 4: Color System Tokens ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("colors");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div className="mb-8 flex h-52 flex-col justify-center gap-3 rounded-lg border border-[#e4dccb] bg-white/70 p-6">
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: "Dough", hex: "#fbfaf5", text: "text-zinc-800", border: "border-[#d9d0bb]" },
                { name: "Willow", hex: "#c8d5bb", text: "text-zinc-800", border: "border-transparent" },
                { name: "Rust Grey", hex: "#47585c", text: "text-white", border: "border-transparent" },
                { name: "Status Green", hex: "#31b564", text: "text-white", border: "border-transparent" },
              ].map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={(e) => handleCopyColor(e, swatch.hex, swatch.name)}
                  className={`relative flex h-20 flex-col justify-between rounded-lg p-2.5 shadow-xs transition-all hover:scale-105 border ${swatch.border} cursor-pointer`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className={`font-mono text-[10px] font-bold ${swatch.text}`}>
                    {swatch.name}
                  </span>
                  <span className={`font-mono text-[9px] opacity-80 ${swatch.text}`}>
                    {swatch.hex}
                  </span>
                </button>
              ))}
            </div>

            {copiedColor && (
              <div className="text-center font-mono text-[11px] text-emerald-700 font-medium">
                Copied {copiedColor} hex value to clipboard!
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Palette Tokens
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Warm Dough paper, Willow Grey selection accent, and Rust Grey typography.
            </p>
          </div>
        </div>

        {/* ── CARD 5: Tactile Paper Card (.paper-card) ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("materials");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div className="mb-8 flex h-52 items-center justify-center rounded-lg border border-[#e4dccb] bg-[radial-gradient(#d9d0bb_1px,transparent_1px)] [background-size:16px_16px] p-6 overflow-hidden">
            {/* The actual .paper-card surface */}
            <div className="paper-card w-64 rounded-2xl border border-[#e4dccb] p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-zinc-800">
                  .paper-card
                </span>
                <span className="size-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[11px] font-sans text-zinc-500 leading-normal">
                Layered diffuse drop-shadows with inset 1px specular white top highlight.
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Paper Surfaces & Shadows
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Physical-feeling paper elevation and subtle edge specular lighting.
            </p>
          </div>
        </div>

        {/* ── CARD 6: Live Typography Hierarchy ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("typography");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mb-8 flex h-52 flex-col justify-between rounded-lg border border-[#e4dccb] bg-white/70 p-5"
          >
            {/* Live Size Slider */}
            <div className="flex items-center justify-between gap-3 text-xs font-mono text-zinc-500">
              <span>Figtree / Sans / Pixel</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="16"
                  max="36"
                  value={typeSize}
                  onChange={(e) => setTypeSize(Number(e.target.value))}
                  className="w-24 accent-zinc-800 cursor-pointer"
                />
                <span className="w-8 text-right text-zinc-900 font-bold">{typeSize}px</span>
              </div>
            </div>

            {/* Specimen */}
            <div className="my-auto">
              <div
                style={{ fontSize: `${typeSize}px` }}
                className="font-display font-semibold tracking-[-0.035em] text-zinc-900 leading-none truncate"
              >
                mudit jha — portfolio
              </div>
              <div className="mt-2 font-mono text-xs text-zinc-500 truncate uppercase">
                12:48 PM UTC • 44.9778° N, 93.2650° W
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span>Figtree Display</span> · <span>Body Sans</span> · <span>Pixel Square Mono</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Typography & Scales
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Four-layer typography system: Display headlines, Body prose, HUD Mono, and Handwriting.
            </p>
          </div>
        </div>

        {/* ── CARD 7: 3D Tactile Cards (TactileFolderCard / TactilePhotoCard) ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("components");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative mb-8 flex h-52 items-center justify-center rounded-lg border border-[#e4dccb] bg-white/70 p-2 overflow-hidden"
          >
            {/* Variant Switcher Pill */}
            <div className="absolute top-2.5 left-3 z-30 flex items-center gap-1 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/90 p-0.5 backdrop-blur-xs shadow-xs">
              <button
                type="button"
                onClick={() => {
                  play("toggle", { volume: 0.2 });
                  setTactileCardVariant("folder");
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                  tactileCardVariant === "folder"
                    ? "bg-zinc-900 text-white font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Folder
              </button>
              <button
                type="button"
                onClick={() => {
                  play("toggle", { volume: 0.2 });
                  setTactileCardVariant("portrait");
                }}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                  tactileCardVariant === "portrait"
                    ? "bg-zinc-900 text-white font-semibold shadow-xs"
                    : "text-zinc-600 hover:text-zinc-900"
                }`}
              >
                Portrait
              </button>
            </div>

            {/* Robust Scaled 3D Stage (Rigidly bounded container prevents any layout or 3D overflow) */}
            <div className="relative w-[170px] h-[190px] flex items-center justify-center pointer-events-auto">
              <div
                className="absolute flex items-center justify-center"
                style={{
                  width: "340px",
                  height: "390px",
                  transform: "scale(0.39)",
                  transformOrigin: "center center",
                }}
              >
                {tactileCardVariant === "folder" ? (
                  <TactileFolderCard
                    title="Spatial Experiments"
                    category="Interactive"
                    itemCount={14}
                    onClick={() => play("toggle", { volume: 0.3 })}
                  />
                ) : (
                  <TactilePhotoCard
                    name="mudit jha"
                    role="Design Engineer"
                    statusText="3D Tilt Active"
                    onClick={() => play("press")}
                  />
                )}
              </div>
            </div>

            <span className="absolute bottom-2.5 right-3 font-mono text-[10px] text-zinc-400">
              {tactileCardVariant === "folder" ? "<TactileFolderCard />" : "<TactilePhotoCard />"}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                3D Tactile Card
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Multi-layer physics-based 3D tilt with depth shadows, archival backing, and glossy shine overlay.
            </p>
          </div>
        </div>

        {/* ── CARD 8: Tactile Spring Physics ── */}
        <div
          onClick={() => {
            play("toggle", { volume: 0.3 });
            onSelectView("motion");
          }}
          className="group relative flex flex-col justify-between bg-[#fbfaf5] p-8 hover:bg-[#f5efe3]/70 transition-colors cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mb-8 flex h-52 flex-col justify-between rounded-lg border border-[#e4dccb] bg-white/70 p-5"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-500">
                Primary Spring: 240 / 22 / 0.85
              </span>
              <button
                type="button"
                onClick={() => {
                  play("toggle", { volume: 0.3 });
                  setSpringKey((k) => k + 1);
                }}
                className="rounded-md border border-[#d9d0bb] bg-white px-2.5 py-0.5 text-[11px] font-mono text-zinc-700 hover:bg-[#fbfaf5] active:scale-95 transition-all cursor-pointer"
              >
                Trigger Spring ⟳
              </button>
            </div>

            {/* Interactive Spring Simulation */}
            <div className="flex items-center justify-center my-auto">
              <motion.div
                key={springKey}
                initial={{ scale: 0.6, y: -24 }}
                animate={{ scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                  mass: 0.85,
                }}
                className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md cursor-pointer active:scale-90 transition-transform"
              >
                <Zap className="size-6" />
              </motion.div>
            </div>

            <div className="font-mono text-[10px] text-zinc-500 text-center">
              Shared spring curve for Tsu Eye, Dynamic Island, and Modal transitions
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-base font-semibold text-zinc-900 group-hover:text-black">
                Motion & Physics
              </h2>
              <ArrowRight className="size-4 text-zinc-400 group-hover:text-zinc-900 transition-transform group-hover:translate-x-0.5" />
            </div>
            <p className="text-xs text-zinc-500 leading-normal">
              Authentic spring dynamics and zero transition-all performance rules.
            </p>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Next Section Footer Link
         ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-[#e4dccb] p-8">
        <div>
          <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider block mb-1">
            Next Foundation
          </span>
          <button
            type="button"
            onClick={() => {
              play("toggle", { volume: 0.3 });
              onSelectView("colors");
            }}
            className="group inline-flex items-center gap-2 text-lg font-semibold text-zinc-900 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            <span>Colors & Palettes</span>
            <ArrowRight className="size-4.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="rounded-full border border-[#d9d0bb] px-3.5 py-1.5 text-xs font-mono text-zinc-600 hover:bg-[#f5efe3] transition-colors cursor-pointer"
        >
          Back to Top ↑
        </button>
      </div>
    </div>
  );
}
