"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { FeatureBlockItem } from "@/types/project";

interface FeatureBlockProps {
  block: FeatureBlockItem;
  className?: string;
}

export function FeatureBlock({ block, className = "" }: FeatureBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const paragraphs = Array.isArray(block.body)
    ? block.body
    : block.body
      ? [block.body]
      : [];

  return (
    <section
      id={block.id || block._key}
      className={`space-y-6 sm:space-y-8 scroll-mt-10 ${className}`}
    >
      {/* Eyebrow */}
      {block.eyebrow && (
        <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
          {block.eyebrow}
        </p>
      )}

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

      {/* Structured Features Grid / Stacks */}
      {block.features && block.features.length > 0 && (
        <div className="space-y-6 sm:space-y-8 pt-2">
          {block.features.map((feat, idx) => {
            const featKey = feat._key || `feat-${idx}`;
            return (
              <div
                key={featKey}
                className="p-5 sm:p-7 rounded-[20px] sm:rounded-[24px] bg-[#f5f4ee]/70 border border-black/6 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_2px_8px_rgba(0,0,0,0.02)] space-y-4"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#c8d5bb]/35 text-[#47585c] font-mono text-[11px] font-semibold uppercase tracking-wider">
                    {feat.number || `FEATURE 0${idx + 1}`}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight">
                    {feat.title}
                  </h3>
                </div>

                <p className="font-sans text-sm sm:text-[15px] leading-relaxed text-zinc-700 max-w-2xl text-pretty">
                  {feat.body}
                </p>

                {/* Feature Media / Placeholder */}
                <div className="relative aspect-[16/9] w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white/70 border border-black/5 flex flex-col items-center justify-center p-6 text-center dot-grid">
                  {feat.image ? (
                    <Image
                      src={feat.image}
                      alt={feat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 860px"
                      onLoad={() => setImagesLoaded((prev) => ({ ...prev, [featKey]: true }))}
                      className={`object-contain transition-all duration-300 ease-out ${
                        imagesLoaded[featKey] ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.01]"
                      }`}
                    />
                  ) : feat.video ? (
                    <video
                      src={feat.video}
                      autoPlay={!prefersReducedMotion}
                      muted
                      playsInline
                      loop
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="space-y-2">
                      <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-800 uppercase px-3.5 py-1.5 rounded-lg bg-white/80 border border-dashed border-zinc-300">
                        [ {feat.placeholderTitle || `${feat.title.toUpperCase()} DEMO`} ]
                      </p>
                      {feat.caption && (
                        <p className="font-sans text-xs text-zinc-500 max-w-md">
                          {feat.caption}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
