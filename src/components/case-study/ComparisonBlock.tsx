"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ComparisonBlockItem } from "@/types/project";
import { SlidersHorizontal, Columns2 } from "lucide-react";

interface ComparisonBlockProps {
  block: ComparisonBlockItem;
  className?: string;
}

export function ComparisonBlock({ block, className = "" }: ComparisonBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mode, setMode] = useState<"sideBySide" | "slider">("sideBySide");
  const [sliderPos, setSliderPos] = useState(50);

  const paragraphs = Array.isArray(block.body)
    ? block.body
    : block.body
      ? [block.body]
      : [];

  const hasBothMedia = Boolean(block.beforeMedia && block.afterMedia);

  return (
    <section
      id={block.id || block._key}
      className={`space-y-6 sm:space-y-8 scroll-mt-10 ${className}`}
    >
      {/* Eyebrow & Mode Switcher */}
      <div className="flex items-center justify-between gap-4">
        {block.eyebrow ? (
          <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
            {block.eyebrow}
          </p>
        ) : <div />}

        {hasBothMedia && (
          <div className="inline-flex items-center gap-1 p-1 bg-black/5 rounded-full border border-black/5">
            <button
              type="button"
              onClick={() => setMode("sideBySide")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                mode === "sideBySide"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Columns2 className="size-3" />
              <span>Side by Side</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("slider")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all ${
                mode === "slider"
                  ? "bg-white text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <SlidersHorizontal className="size-3" />
              <span>Interactive Wipe</span>
            </button>
          </div>
        )}
      </div>

      {/* Heading */}
      {block.heading && (
        <h2 className="font-display text-xl sm:text-2xl md:text-[28px] font-semibold text-zinc-900 tracking-[-0.02em] leading-[1.2] text-pretty">
          {block.heading}
        </h2>
      )}

      {/* Intro Body */}
      {paragraphs.length > 0 && (
        <div className="space-y-3 font-sans text-sm sm:text-base leading-[1.65] text-zinc-700 max-w-3xl text-pretty">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {/* Comparison Presentation */}
      {mode === "slider" && hasBothMedia ? (
        /* Interactive Split Slider Wipe */
        <div className="space-y-3">
          <div
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#f5f4ee] border border-black/8 select-none touch-none shadow-xs group"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
              setSliderPos((x / rect.width) * 100);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (!touch) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(rect.width, touch.clientX - rect.left));
              setSliderPos((x / rect.width) * 100);
            }}
          >
            {/* After Image (Base) */}
            <div className="absolute inset-0 size-full p-4 flex items-center justify-center dot-grid">
              <Image src={block.afterMedia!} alt="After" fill className="object-contain" />
            </div>

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 size-full p-4 flex items-center justify-center dot-grid bg-[#f5f4ee]"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <Image src={block.beforeMedia!} alt="Before" fill className="object-contain" />
            </div>

            {/* Split Scrub Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-zinc-900/80 shadow-[0_0_8px_rgba(0,0,0,0.3)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-7 rounded-full bg-white border border-black/10 shadow-md flex items-center justify-center text-zinc-700">
                <SlidersHorizontal className="size-3.5 rotate-90" />
              </div>
            </div>

            {/* Corner Badges */}
            <span className="absolute top-3 left-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-600 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
              {block.beforeLabel || "Before"}
            </span>
            <span className="absolute top-3 right-3 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#37522d] bg-[#c8d5bb]/80 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs">
              {block.afterLabel || "After"}
            </span>
          </div>

          <p className="text-center font-mono text-[11px] text-zinc-500 uppercase tracking-wide">
            Drag or hover across the canvas to compare states
          </p>
        </div>
      ) : (
        /* Standard Side-by-Side Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
          {/* Before */}
          <div className="space-y-2.5">
            <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-200/60 px-2.5 py-0.5 rounded-full">
              {block.beforeLabel || "Before"}
            </span>
            <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#f5f4ee] border border-black/5 flex items-center justify-center p-4 text-center dot-grid shadow-xs">
              {block.beforeMedia ? (
                <Image src={block.beforeMedia} alt="Before" fill className="object-contain" />
              ) : (
                <p className="font-mono text-xs font-semibold text-zinc-600 uppercase px-3 py-1.5 rounded bg-white/80 border border-dashed border-zinc-300">
                  [ BEFORE STATE ]
                </p>
              )}
            </div>
          </div>

          {/* After */}
          <div className="space-y-2.5">
            <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-[#47585c] bg-[#c8d5bb]/40 px-2.5 py-0.5 rounded-full">
              {block.afterLabel || "After / Clarity Intervention"}
            </span>
            <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#f5f4ee] border border-black/5 flex items-center justify-center p-4 text-center dot-grid shadow-xs">
              {block.afterMedia ? (
                <Image src={block.afterMedia} alt="After" fill className="object-contain" />
              ) : (
                <p className="font-mono text-xs font-semibold text-zinc-600 uppercase px-3 py-1.5 rounded bg-white/80 border border-dashed border-zinc-300">
                  [ AFTER STATE ]
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {block.caption && (
        <p className="text-center font-sans text-xs text-[#47585c] max-w-xl mx-auto text-pretty">
          {block.caption}
        </p>
      )}
    </section>
  );
}
