"use client";

import React from "react";
import { EFFECT_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function EffectsSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const filteredTokens = EFFECT_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="effects"
        title="Materials, Blur & Effects"
        subtitle="Atmospheric spatial textures: tactile paper dot grid, infinite canvas coordinate grid, progressive gradient blur overlays, SVG turbulence noise, and light sweep shimmers."
        count={EFFECT_TOKENS.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTokens.map((token) => {
          let previewElement: React.ReactNode = null;

          if (token.id === "effect-paper-dot-grid") {
            previewElement = (
              <div className="w-full h-20 rounded-xl bg-[#fbfaf5] border border-zinc-200 flex items-center justify-center bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:16px_16px]">
                <span className="text-xs font-mono text-zinc-600 bg-white/80 px-2 py-0.5 rounded-full border border-zinc-200">
                  16px Radial Paper Grid
                </span>
              </div>
            );
          } else if (token.id === "effect-canvas-dot-grid") {
            previewElement = (
              <div className="w-full h-20 rounded-xl bg-[#fbfaf5] border border-zinc-200 flex items-center justify-center bg-[radial-gradient(circle,rgba(200,213,187,0.8)_1.5px,transparent_1.5px)] [background-size:20px_20px]">
                <span className="text-xs font-mono text-[#3d4c3f] bg-white/90 px-2 py-0.5 rounded-full border border-[#c8d5bb]">
                  20px Willow Coordinate Grid
                </span>
              </div>
            );
          } else if (token.id === "effect-header-gradient-blur") {
            previewElement = (
              <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gradient-to-r from-amber-100 via-rose-100 to-teal-100 flex items-center justify-center">
                <div
                  className="absolute inset-0 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(251, 250, 245, 0.9) 0%, rgba(251, 250, 245, 0.2) 100%)",
                  }}
                />
                <span className="relative z-10 text-xs font-mono font-medium text-zinc-800">
                  Progressive Blur Mask
                </span>
              </div>
            );
          } else if (token.id === "effect-footer-willow-blur") {
            previewElement = (
              <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gradient-to-r from-zinc-200 to-zinc-400 flex items-center justify-center">
                <div
                  className="absolute inset-0 backdrop-blur-md"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(200, 213, 187, 0.85) 0%, rgba(200, 213, 187, 0.2) 100%)",
                  }}
                />
                <span className="relative z-10 text-xs font-mono font-medium text-[#2d3a2e]">
                  Willow Frost Blur (Footer)
                </span>
              </div>
            );
          } else if (token.id === "effect-grain-overlay") {
            previewElement = (
              <div className="relative w-full h-20 rounded-xl bg-zinc-700 flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 opacity-40 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                <span className="relative z-10 text-xs font-mono text-white bg-black/40 px-2 py-0.5 rounded-full">
                  SVG Turbulence Noise
                </span>
              </div>
            );
          } else if (token.id === "effect-shimmer-text") {
            previewElement = (
              <div className="w-full h-20 rounded-xl bg-zinc-900 flex items-center justify-center p-3">
                <p className="font-display font-medium text-sm text-zinc-300 shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500">
                  tactile material surface shimmer sweep
                </p>
              </div>
            );
          } else {
            previewElement = (
              <div className="w-full h-16 rounded-xl bg-white flex items-center justify-center px-4">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c8d5bb] to-transparent" />
              </div>
            );
          }

          return (
            <TokenCard
              key={token.id}
              token={token}
              preview={previewElement}
            />
          );
        })}
      </div>
    </section>
  );
}
