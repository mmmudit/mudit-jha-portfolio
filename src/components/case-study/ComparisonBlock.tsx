import React from "react";
import Image from "next/image";
import { ComparisonBlockItem } from "@/types/project";

interface ComparisonBlockProps {
  block: ComparisonBlockItem;
  className?: string;
}

export function ComparisonBlock({ block, className = "" }: ComparisonBlockProps) {
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

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
        {/* Before */}
        <div className="space-y-2.5">
          <span className="inline-block font-mono text-[11px] font-semibold uppercase tracking-wider text-zinc-500 bg-zinc-200/60 px-2.5 py-0.5 rounded-full">
            {block.beforeLabel || "Before"}
          </span>
          <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#f5f4ee] border border-black/5 flex items-center justify-center p-4 text-center dot-grid">
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
          <div className="relative aspect-[4/3] w-full rounded-[18px] overflow-hidden bg-[#f5f4ee] border border-black/5 flex items-center justify-center p-4 text-center dot-grid">
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

      {block.caption && (
        <p className="text-center font-sans text-xs text-[#47585c] max-w-xl mx-auto text-pretty">
          {block.caption}
        </p>
      )}
    </section>
  );
}
