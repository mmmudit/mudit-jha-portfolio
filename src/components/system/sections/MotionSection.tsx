"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { MOTION_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function MotionSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const [playTrigger, setPlayTrigger] = useState(0);
  const [isHoveredSquare, setIsHoveredSquare] = useState(false);
  const reduce = useReducedMotion();

  const handleReplay = () => {
    setPlayTrigger((prev) => prev + 1);
  };

  const filteredTokens = MOTION_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="motion"
        title="Motion & Animation Physics"
        subtitle="Standard transitions.dev motion scale featuring physical spring physics, tactile press-down feedback (scale 0.96), and natural cubic-bezier(0.22, 1, 0.36, 1) smooth-out curves."
        count={MOTION_TOKENS.length}
      />

      {/* Global Interactive Motion Control Bar */}
      <div className="mb-8 p-4 bg-white/80 rounded-2xl border border-zinc-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-zinc-500 font-bold block">
            Live Motion Scale Playground
          </span>
          <span className="text-xs text-zinc-600">
            Click &quot;Play All Animations&quot; to test real durations and easing curves simultaneously.
          </span>
        </div>
        <button
          type="button"
          onClick={handleReplay}
          className="pressable inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-medium bg-[#c8d5bb] text-zinc-900 border border-[#c8d5bb] shadow-sm hover:brightness-95 active:scale-95"
        >
          <Play className="size-3.5 fill-current" />
          <span>Play All Animations</span>
        </button>
      </div>

      {/* Side-by-Side Live Duration Comparison Strip */}
      <div className="mb-10 p-5 bg-[#fbfaf5] rounded-2xl border border-zinc-300">
        <h3 className="font-sans font-semibold text-sm text-zinc-800 mb-4">
          Real-Time Duration Comparison (0px $\rightarrow$ 140px Translate)
        </h3>
        <div className="flex flex-col gap-3">
          {[
            { label: "80ms (micro)", dur: 0.08, color: "bg-emerald-400" },
            { label: "150ms (quick)", dur: 0.15, color: "bg-teal-400" },
            { label: "250ms (fast)", dur: 0.25, color: "bg-[#c8d5bb]" },
            { label: "350ms (medium)", dur: 0.35, color: "bg-amber-400" },
            { label: "400ms (slow)", dur: 0.4, color: "bg-rose-400" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="w-28 text-xs font-mono text-zinc-600 shrink-0">
                {item.label}
              </span>
              <div className="flex-1 bg-zinc-200/80 rounded-full h-7 relative overflow-hidden p-1 border border-zinc-300">
                <motion.div
                  key={`${playTrigger}-${item.label}`}
                  initial={{ x: 0 }}
                  animate={{ x: [0, 140, 0] }}
                  transition={{
                    duration: reduce ? 0 : item.dur * 4,
                    times: [0, 0.5, 1],
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`size-5 rounded-full ${item.color} shadow-xs border border-black/10`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Motion Tokens with Live Animated Demo Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTokens.map((token) => {
          let previewContent: React.ReactNode = null;

          if (token.id === "motion-duration-micro") {
            previewContent = (
              <div className="w-full flex items-center justify-around">
                <motion.div
                  key={`micro-${playTrigger}`}
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 0.08, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 2 }}
                  className="size-10 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-[10px] font-mono shadow-sm"
                >
                  80ms
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-duration-quick") {
            previewContent = (
              <div className="w-full flex items-center justify-around">
                <motion.div
                  key={`quick-${playTrigger}`}
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1.5 }}
                  className="size-10 rounded-xl bg-[#c8d5bb] text-zinc-900 border border-[#b8c7ab] flex items-center justify-center text-[10px] font-mono shadow-sm"
                >
                  150ms
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-duration-fast") {
            previewContent = (
              <div className="w-full flex items-center justify-around">
                <motion.div
                  key={`fast-${playTrigger}`}
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1.5 }}
                  className="size-10 rounded-xl bg-zinc-700 text-white flex items-center justify-center text-[10px] font-mono shadow-sm"
                >
                  250ms
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-duration-medium") {
            previewContent = (
              <div className="w-full flex items-center justify-around">
                <motion.div
                  key={`med-${playTrigger}`}
                  animate={{ scaleX: [1, 1.6, 1] }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1 }}
                  className="h-10 w-12 rounded-xl bg-zinc-300 text-zinc-800 flex items-center justify-center text-[10px] font-mono shadow-sm"
                >
                  350ms
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-duration-slow") {
            previewContent = (
              <div className="w-full flex items-center justify-around">
                <motion.div
                  key={`slow-${playTrigger}`}
                  animate={{ opacity: [0.3, 1, 0.3], y: [10, 0, 10] }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1 }}
                  className="size-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-[10px] font-mono shadow-sm"
                >
                  400ms
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-ease-smooth-out") {
            previewContent = (
              <div className="w-full flex flex-col items-center justify-center gap-1.5 p-2">
                <motion.div
                  key={`smooth-${playTrigger}`}
                  animate={{ x: [-35, 35, -35] }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 0.8 }}
                  className="size-9 rounded-xl bg-[#c8d5bb] border border-[#a8b79b] flex items-center justify-center text-[10px] font-mono text-zinc-900 shadow-sm"
                >
                  smooth
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-ease-bounce") {
            previewContent = (
              <div className="w-full flex flex-col items-center justify-center gap-1.5 p-2">
                <motion.div
                  key={`bounce-${playTrigger}`}
                  animate={{ y: [-14, 8, -14], scaleY: [1, 0.85, 1] }}
                  transition={{ duration: 1, ease: [0.34, 1.36, 0.64, 1], repeat: Infinity, repeatDelay: 0.6 }}
                  className="size-9 rounded-xl bg-amber-200 border border-amber-400 flex items-center justify-center text-[10px] font-mono text-amber-900 shadow-sm"
                >
                  bounce
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-spring-nav-pill") {
            previewContent = (
              <div className="w-full flex items-center justify-center">
                <motion.div
                  key={`spring-pill-${playTrigger}`}
                  animate={{ x: [-28, 28, -28] }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 32,
                    mass: 0.8,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                  }}
                  className="px-3.5 py-1 rounded-full bg-[#c8d5bb] text-zinc-900 text-xs font-mono font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.06)] border border-[#b8c7ab]"
                >
                  spring pill
                </motion.div>
              </div>
            );
          } else if (token.id === "motion-pressable-feedback") {
            previewContent = (
              <div className="w-full flex items-center justify-center">
                <button
                  type="button"
                  className="pressable px-4 py-1.5 rounded-full bg-zinc-800 text-white text-xs font-mono font-medium shadow-sm hover:bg-zinc-700 active:scale-[0.96]"
                >
                  Click Me (:active)
                </button>
              </div>
            );
          } else if (token.id === "motion-keyframe-pulse") {
            previewContent = (
              <div className="w-full flex items-center justify-center">
                <div className="relative size-6 flex items-center justify-center">
                  <span className="green-pulse-ring" />
                  <span className="relative size-3 rounded-full bg-status-green" />
                </div>
              </div>
            );
          } else if (token.id === "motion-keyframe-blink") {
            previewContent = (
              <div className="w-full flex items-center justify-center">
                <div className="animate-toon-blink flex gap-1.5">
                  <div className="size-4 rounded-full bg-black" />
                  <div className="size-4 rounded-full bg-black" />
                </div>
              </div>
            );
          } else {
            previewContent = (
              <div className="w-full flex items-center justify-center">
                <motion.div
                  key={`default-${playTrigger}`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1 }}
                  className="size-8 rounded-lg bg-zinc-400"
                />
              </div>
            );
          }

          return (
            <TokenCard
              key={token.id}
              token={token}
              preview={previewContent}
            />
          );
        })}
      </div>
    </section>
  );
}
