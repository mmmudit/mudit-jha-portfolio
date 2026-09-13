"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { play } from "@/lib/sound";
import { InteractiveTsuLogo } from "@/components/tsu-logo";

const SVG_MARK_CODE = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="36" cy="46" r="16" fill="currentColor" />
  <circle cx="64" cy="46" r="16" fill="currentColor" />
  <circle cx="41" cy="42" r="4.5" fill="#fbfaf5" />
  <circle cx="69" cy="42" r="4.5" fill="#fbfaf5" />
  <path d="M28 72 Q50 82 72 72" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
</svg>`;

export function BrandAssetsView() {
  const [copied, setCopied] = useState(false);

  const handleCopySvg = () => {
    navigator.clipboard?.writeText(SVG_MARK_CODE);
    play("toggle", { volume: 0.35 });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col p-8 sm:p-12 space-y-12 text-zinc-800">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
          <span>Overview</span> / <span>Brand Mark</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-3 font-sans">
          Brand Mark & Logo
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl leading-relaxed">
          Official interactive Tsu eye mark, geometry construction rules, clearspace specifications, and SVG vectors for the Mudit Jha portfolio.
        </p>
      </div>

      {/* Brand Mark Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Logo Canvas */}
        <div className="flex flex-col rounded-xl border border-[#e4dccb] bg-[#fbfaf5] overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#e4dccb] px-4 py-3 bg-[#f5efe3]/60">
            <span className="font-mono text-xs font-semibold text-zinc-800">
              Interactive Tsu Mark
            </span>
            <button
              type="button"
              onClick={handleCopySvg}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#d9d0bb] bg-white px-2.5 py-1 text-xs font-mono text-zinc-700 hover:bg-[#fbfaf5] active:scale-95 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>Copied SVG</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>
          </div>

          <div className="flex h-64 items-center justify-center p-8 bg-[radial-gradient(#d9d0bb_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="size-28">
              <InteractiveTsuLogo />
            </div>
          </div>

          <div className="border-t border-[#e4dccb] p-4 text-xs text-zinc-500 font-mono">
            Tracks cursor pupil position dynamically with spring damping (240 / 22 / 0.85).
          </div>
        </div>

        {/* Construction Blueprint */}
        <div className="flex flex-col rounded-xl border border-[#e4dccb] bg-[#fbfaf5] overflow-hidden shadow-2xs">
          <div className="border-b border-[#e4dccb] px-4 py-3 bg-[#f5efe3]/60">
            <span className="font-mono text-xs font-semibold text-zinc-800">
              Geometric Clearspace & Construction
            </span>
          </div>

          <div className="flex h-64 items-center justify-center p-6 relative bg-[radial-gradient(#d9d0bb_1px,transparent_1px)] [background-size:16px_16px]">
            {/* Architectural crosshair & concentric guide circles */}
            <div className="relative size-44 border border-dashed border-[#d9d0bb] rounded-full flex items-center justify-center">
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#d9d0bb]" />
              <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-[#d9d0bb]" />
              <div className="size-24 rounded-full border border-emerald-600/30 bg-emerald-500/10 flex items-center justify-center">
                <span className="font-mono text-[10px] text-emerald-800 font-semibold">
                  1X CLEARSPACE
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e4dccb] p-4 text-xs text-zinc-500 font-mono">
            Maintain minimum padding equal to 1/2 of the logo diameter on all sides.
          </div>
        </div>
      </div>

      {/* Brand Rules */}
      <div className="rounded-xl border border-[#e4dccb] p-6 bg-white/70 space-y-4">
        <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-zinc-800">
          Brand Identity Rules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-600 font-sans leading-relaxed">
          <div className="border-l-2 border-emerald-500 pl-3">
            <strong className="text-zinc-900 block mb-1">Authentic Paper Tone</strong>
            Use <code className="rounded bg-[#f5efe3] border border-[#e4dccb] px-1">--dough</code> (#fbfaf5) as the primary background canvas, never cold clinical whites.
          </div>
          <div className="border-l-2 border-emerald-500 pl-3">
            <strong className="text-zinc-900 block mb-1">Graphite Typography</strong>
            Use <code className="rounded bg-[#f5efe3] border border-[#e4dccb] px-1">--zinc-800</code> for high-emphasis headings. Keep text contrast at WCAG AAA levels.
          </div>
          <div className="border-l-2 border-emerald-500 pl-3">
            <strong className="text-zinc-900 block mb-1">Intentional Motion</strong>
            Interactive brand elements animate using spring physics (<code className="rounded bg-[#f5efe3] border border-[#e4dccb] px-1">stiffness: 240, damping: 22</code>).
          </div>
        </div>
      </div>
    </div>
  );
}
