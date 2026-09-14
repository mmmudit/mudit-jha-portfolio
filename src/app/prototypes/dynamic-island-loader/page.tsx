"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Sliders, Hand, Info, CheckCircle2, Sun, Moon } from "lucide-react";
import {
  DynamicIslandGooLoader,
  useScrollUpRefreshGesture,
  ISLAND_WIDTH,
  ISLAND_HEIGHT,
  PUCK_SIZE,
  DERIVED_TRAVEL,
  SCALED_AWAY_HALF,
} from "@/components/dynamic-island-goo-loader";

export default function DynamicIslandLoaderPrototypePage() {
  const [mode, setMode] = useState<"gesture" | "scrubber">("scrubber");
  const [scrubValue, setScrubValue] = useState(0.5);
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  const {
    pullProgress: liveProgress,
    isRefreshing,
    triggerRefresh,
  } = useScrollUpRefreshGesture({
    enabled: mode === "gesture",
  });

  const activeProgress = mode === "scrubber" ? scrubValue : liveProgress;

  // Neck phase calculation
  let neckPhase = "Parked Inside Island";
  if (activeProgress >= 0.85) {
    neckPhase = "Pitched Off & Detached Below Nav";
  } else if (activeProgress >= 0.6) {
    neckPhase = "Neck Thinning & Stretching Downward";
  } else if (activeProgress >= 0.1) {
    neckPhase = "Liquid Goo Squeezing Below Nav";
  }

  // Spinner phase
  let spinnerPhase = "0% (Submerged / Hidden)";
  if (activeProgress >= 0.72) {
    spinnerPhase = "100% (Sharp & Active via feComposite)";
  } else if (activeProgress >= 0.32) {
    const pct = Math.round(((activeProgress - 0.32) / (0.72 - 0.32)) * 100);
    spinnerPhase = `${pct}% (Revealing While Still Attached)`;
  }

  const isLight = themeMode === "light";

  return (
    <div
      className={`min-h-screen font-sans p-6 sm:p-12 flex flex-col items-center justify-between transition-colors duration-500 ${
        isLight ? "bg-[#fbfaf5] text-zinc-900" : "bg-[#090b10] text-zinc-100"
      }`}
    >
      {/* Header */}
      <div
        className={`w-full max-w-4xl flex items-center justify-between border-b pb-6 ${
          isLight ? "border-zinc-200" : "border-white/10"
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#c8d5bb] text-zinc-950 text-xs font-mono font-bold tracking-wide">
              EMIL / CRAFT MOTION
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-mono ${
                isLight ? "bg-zinc-200/80 text-zinc-700" : "bg-white/10 text-zinc-300"
              }`}
            >
              DYNAMIC ISLAND
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Dynamic Island Loading Puck
          </h1>
          <p
            className={`text-sm mt-1 max-w-xl ${
              isLight ? "text-zinc-600" : "text-zinc-400"
            }`}
          >
            Squeezes out a circular 32×32 loading puck <strong>below</strong> the nav bar as you
            scroll UP, styled to match the warm dough & zinc nav aesthetic.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setThemeMode(isLight ? "dark" : "light")}
            className={`flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-full border transition-colors ${
              isLight
                ? "bg-white border-zinc-300 text-zinc-700 hover:text-zinc-950 shadow-sm"
                : "bg-white/5 border-white/10 text-zinc-300 hover:text-white"
            }`}
            title="Toggle theme aesthetic"
          >
            {isLight ? (
              <>
                <Moon className="w-3.5 h-3.5" />
                <span>DARK AESTHETIC</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5" />
                <span>LIGHT AESTHETIC</span>
              </>
            )}
          </button>

          <Link
            href="/prototypes"
            className={`flex items-center gap-1.5 text-xs font-mono px-3.5 py-2 rounded-full border transition-colors ${
              isLight
                ? "bg-white border-zinc-300 text-zinc-700 hover:text-zinc-950 shadow-sm"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PROTOTYPES</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full max-w-4xl my-10 flex flex-col items-center justify-center">
        {/* Stage Container */}
        <div
          className={`relative w-full h-80 sm:h-96 rounded-2xl border flex flex-col items-center justify-center overflow-visible shadow-xl transition-colors duration-500 ${
            isLight
              ? "bg-[#f4f2eb] border-zinc-300/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dot-grid"
              : "bg-zinc-950/80 border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          }`}
        >
          {/* Reference baseline guidelines */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-6 pointer-events-none opacity-30">
            <span className="text-[10px] font-mono text-zinc-500">
              IDLE NAV: 126×37
            </span>
            <div className="h-px flex-1 mx-4 border-b border-dashed border-zinc-400/40" />
            <span className="text-[10px] font-mono text-zinc-500">
              BELOW NAV: +{DERIVED_TRAVEL.toFixed(1)}px
            </span>
          </div>

          {/* The Dynamic Island with Goo Loader emerging BELOW */}
          <div className="relative z-10 flex items-center justify-center overflow-visible">
            <DynamicIslandGooLoader
              progress={activeProgress}
              isLoading={mode === "gesture" && isRefreshing}
              theme={themeMode}
            />
          </div>

          {/* Bottom status badge in stage */}
          <div className="absolute bottom-4 flex items-center gap-3">
            <span
              className={`text-xs font-mono px-3 py-1 rounded-full border ${
                isLight
                  ? "bg-white/90 text-zinc-700 border-zinc-300"
                  : "bg-white/5 text-zinc-400 border-white/10"
              }`}
            >
              PULL PROGRESS: {(activeProgress * 100).toFixed(0)}%
            </span>
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-500/20">
              {neckPhase}
            </span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mode Switcher & Scrub Slider */}
          <div
            className={`p-5 rounded-xl border space-y-4 ${
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-zinc-900/80 border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-mono font-medium uppercase tracking-wider ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                Interactive Control Mode
              </span>
              <div
                className={`flex items-center gap-1 p-1 rounded-lg border ${
                  isLight
                    ? "bg-zinc-100 border-zinc-200"
                    : "bg-black/40 border-white/5"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setMode("scrubber")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === "scrubber"
                      ? isLight
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                        : "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Scrubber</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("gesture")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    mode === "gesture"
                      ? isLight
                        ? "bg-white text-zinc-900 shadow-sm border border-zinc-200"
                        : "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  }`}
                >
                  <Hand className="w-3.5 h-3.5" />
                  <span>Scroll Gesture</span>
                </button>
              </div>
            </div>

            {mode === "scrubber" ? (
              <div className="space-y-2">
                <div
                  className={`flex justify-between text-xs font-mono ${
                    isLight ? "text-zinc-500" : "text-zinc-400"
                  }`}
                >
                  <span>Rest (0%)</span>
                  <span
                    className={`font-bold ${
                      isLight ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    Scrub: {(scrubValue * 100).toFixed(0)}% (+
                    {(scrubValue * DERIVED_TRAVEL).toFixed(1)}px Below)
                  </span>
                  <span>Detached (100%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.005"
                  value={scrubValue}
                  onChange={(e) => setScrubValue(parseFloat(e.target.value))}
                  className="w-full accent-[#8fa77e] dark:accent-[#c8d5bb] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-1">
                  <span>0% (Parked in nav)</span>
                  <span>~35% (Spinner fades in)</span>
                  <span>~75% (Detaches below)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p
                  className={`text-xs ${
                    isLight ? "text-zinc-600" : "text-zinc-400"
                  }`}
                >
                  Scroll <strong>UP</strong> on your trackpad, mouse wheel, or drag up
                  on touch. The puck emerges <strong>below</strong> the nav bar.
                </p>
                <button
                  type="button"
                  onClick={() => triggerRefresh()}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-mono transition-colors border ${
                    isLight
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300"
                      : "bg-white/10 hover:bg-white/15 text-white border-white/10"
                  }`}
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  <span>Simulate Pull & Refresh Sequence</span>
                </button>
              </div>
            )}
          </div>

          {/* Live Telemetry & Derivation Readout */}
          <div
            className={`p-5 rounded-xl border space-y-3 ${
              isLight
                ? "bg-white border-zinc-200 shadow-sm"
                : "bg-zinc-900/80 border-white/10"
            }`}
          >
            <span
              className={`text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1.5 ${
                isLight ? "text-zinc-500" : "text-zinc-400"
              }`}
            >
              <Info className="w-3.5 h-3.5 text-[#8fa77e] dark:text-[#c8d5bb]" />
              <span>Aesthetic & Derivation Math</span>
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div
                className={`p-2.5 rounded-lg border ${
                  isLight
                    ? "bg-[#f4f2eb] border-zinc-200"
                    : "bg-black/40 border-white/5"
                }`}
              >
                <span className="text-zinc-500 block text-[10px]">THEME COLOR</span>
                <span className="font-bold">
                  {isLight ? "#fbfaf5 (Dough)" : "#18181b (Zinc-900)"}
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  isLight
                    ? "bg-[#f4f2eb] border-zinc-200"
                    : "bg-black/40 border-white/5"
                }`}
              >
                <span className="text-zinc-500 block text-[10px]">PUCK (CIRCLE)</span>
                <span className="font-bold">
                  {PUCK_SIZE}×{PUCK_SIZE}px (50% rad)
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  isLight
                    ? "bg-[#f4f2eb] border-zinc-200"
                    : "bg-black/40 border-white/5"
                }`}
              >
                <span className="text-zinc-500 block text-[10px]">
                  TRAVEL DIRECTION
                </span>
                <span className="text-[#659752] dark:text-[#c8d5bb] font-bold">
                  Below Nav (+y)
                </span>
              </div>

              <div
                className={`p-2.5 rounded-lg border ${
                  isLight
                    ? "bg-[#f4f2eb] border-zinc-200"
                    : "bg-black/40 border-white/5"
                }`}
              >
                <span className="text-zinc-500 block text-[10px]">DERIVED TRAVEL</span>
                <span className="text-[#659752] dark:text-[#c8d5bb] font-bold">
                  +{DERIVED_TRAVEL.toFixed(1)}px
                </span>
              </div>
            </div>

            <div
              className={`p-2.5 rounded-lg border text-[11px] font-mono ${
                isLight
                  ? "bg-[#f4f2eb] border-zinc-200 text-zinc-600"
                  : "bg-black/40 border-white/5 text-zinc-400"
              }`}
            >
              <div className="flex justify-between pb-1 border-b border-zinc-300/40 dark:border-white/5 mb-1">
                <span>Spinner Accent:</span>
                <span className="font-bold">
                  {isLight ? "Zinc-800 + Willow" : "Willow Green #C8D5BB"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Filter Composite:</span>
                <span className="font-bold">atop (crisp SourceGraphic)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Soft Reload with Loading Skeletons Demonstration */}
        <div
          className={`w-full mt-6 p-6 rounded-2xl border space-y-4 ${
            isLight
              ? "bg-white border-zinc-200 shadow-sm"
              : "bg-zinc-900/80 border-white/10 shadow-lg"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span
                className={`text-xs font-mono font-medium uppercase tracking-wider flex items-center gap-1.5 ${
                  isLight ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-[#659752] dark:text-[#c8d5bb] ${
                    isRefreshing ? "animate-spin" : ""
                  }`}
                />
                <span>Live Soft Reload Page Skeleton Simulation</span>
              </span>
              <p className="text-xs text-zinc-500">
                When the scroll-up pull triggers, the page soft revalidates and displays
                authentic animated skeletons.
              </p>
            </div>

            <button
              type="button"
              onClick={() => triggerRefresh()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors border flex items-center gap-1.5 ${
                isLight
                  ? "bg-[#f4f2eb] hover:bg-zinc-200/80 text-zinc-800 border-zinc-300"
                  : "bg-white/10 hover:bg-white/15 text-white border-white/10"
              }`}
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span>Trigger Soft Reload</span>
            </button>
          </div>

          {/* Mini Viewport showing Content vs Skeleton */}
          <div
            className={`w-full p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
              isLight
                ? "bg-[#fbfaf5] border-zinc-200/90"
                : "bg-zinc-950 border-white/5"
            }`}
          >
            {isRefreshing ? (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-8 w-36 rounded-md ${
                      isLight ? "bg-zinc-200" : "bg-zinc-800"
                    }`}
                  />
                  <div
                    className={`h-4 w-24 rounded-md ${
                      isLight ? "bg-zinc-200" : "bg-zinc-800"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div
                    className={`aspect-video rounded-xl ${
                      isLight ? "bg-zinc-200/80" : "bg-zinc-800/80"
                    }`}
                  />
                  <div
                    className={`aspect-video rounded-xl ${
                      isLight ? "bg-zinc-200/80" : "bg-zinc-800/80"
                    }`}
                  />
                  <div
                    className={`aspect-video rounded-xl hidden sm:block ${
                      isLight ? "bg-zinc-200/80" : "bg-zinc-800/80"
                    }`}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Mudit Jha</span>
                    <span className="text-xs text-zinc-400 font-mono">
                      Design Engineer
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                    Live Data Fresh
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                      isLight
                        ? "bg-white border-zinc-200"
                        : "bg-zinc-900 border-white/5"
                    }`}
                  >
                    <span className="text-[10px] text-zinc-400 block">PROJECT</span>
                    <span className="font-medium text-xs">Neuform Isolated</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                      isLight
                        ? "bg-white border-zinc-200"
                        : "bg-zinc-900 border-white/5"
                    }`}
                  >
                    <span className="text-[10px] text-zinc-400 block">PROJECT</span>
                    <span className="font-medium text-xs">SpaceFS Orbit</span>
                  </div>
                  <div
                    className={`p-3 rounded-xl border text-xs font-mono space-y-1 hidden sm:block ${
                      isLight
                        ? "bg-white border-zinc-200"
                        : "bg-zinc-900 border-white/5"
                    }`}
                  >
                    <span className="text-[10px] text-zinc-400 block">PROJECT</span>
                    <span className="font-medium text-xs">Clarity Ecosystem</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Checklist */}
      <div
        className={`w-full max-w-4xl border-t pt-6 text-xs flex flex-wrap items-center justify-between gap-4 font-mono ${
          isLight ? "border-zinc-200 text-zinc-500" : "border-white/10 text-zinc-500"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#8fa77e] dark:text-[#c8d5bb]" />
          <span>Emerges below the nav bar (+58.5px travel)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#8fa77e] dark:text-[#c8d5bb]" />
          <span>Nav bar aesthetic: #fbfaf5 light / zinc-900 dark</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-[#8fa77e] dark:text-[#c8d5bb]" />
          <span>feColorMatrix 18 -7 + feComposite atop</span>
        </div>
      </div>
    </div>
  );
}
