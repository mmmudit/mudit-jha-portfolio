import React from "react";
import Image from "next/image";
import { DecisionBlockItem } from "@/types/project";

interface DecisionBlockProps {
  block: DecisionBlockItem;
  className?: string;
}

export function DecisionBlock({ block, className = "" }: DecisionBlockProps) {
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

      {/* Main Block Placeholder (if present) */}
      {block.placeholderTitle && (
        <div className="relative aspect-[16/9] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#f5f4ee]/80 border border-black/6 flex flex-col items-center justify-center p-6 text-center dot-grid shadow-xs">
          <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-800 uppercase px-4 py-2 rounded-xl bg-white/80 border border-dashed border-zinc-300 shadow-2xs">
            [ {block.placeholderTitle} ]
          </p>
        </div>
      )}

      {/* Subsections Grid / List */}
      {block.subsections && block.subsections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
          {block.subsections.map((sub, idx) => (
            <div
              key={sub._key || idx}
              className="p-5 sm:p-6 rounded-[18px] sm:rounded-[22px] bg-[#f5f4ee]/60 border border-black/5 space-y-3.5"
            >
              <h3 className="font-display text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
                {sub.title}
              </h3>
              <p className="font-sans text-xs sm:text-sm leading-relaxed text-zinc-700 text-pretty">
                {sub.body}
              </p>

              {sub.placeholderTitle && (
                <div className="relative aspect-[16/10] w-full rounded-[14px] overflow-hidden bg-white/70 border border-black/5 flex items-center justify-center p-4 text-center dot-grid">
                  <p className="font-mono text-[11px] sm:text-xs font-semibold tracking-tight text-zinc-700 uppercase px-2.5 py-1 rounded bg-white/90 border border-dashed border-zinc-300">
                    [ {sub.placeholderTitle} ]
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
