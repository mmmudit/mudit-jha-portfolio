import React from "react";
import { TextSectionBlock } from "@/types/project";

interface CaseStudySectionProps {
  block: TextSectionBlock;
  className?: string;
}

export function CaseStudySection({ block, className = "" }: CaseStudySectionProps) {
  const paragraphs = Array.isArray(block.body)
    ? block.body
    : block.body
      ? [block.body]
      : [];

  return (
    <section
      id={block.id || block._key}
      className={`space-y-4 sm:space-y-5 scroll-mt-10 ${className}`}
    >
      {/* Eyebrow */}
      {block.eyebrow && (
        <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
          {block.eyebrow}
        </p>
      )}

      {/* Figtree Statement Heading */}
      {block.heading && (
        <h2 className="font-display text-xl sm:text-2xl md:text-[28px] font-semibold text-zinc-900 tracking-[-0.02em] leading-[1.2] text-pretty">
          {block.heading}
        </h2>
      )}

      {/* Body Copy in Geist Sans */}
      {paragraphs.length > 0 && (
        <div className="space-y-3.5 sm:space-y-4 font-sans text-sm sm:text-base leading-[1.65] text-zinc-700 max-w-3xl text-pretty">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {/* Optional Subheading */}
      {block.subheading && (
        <p className="font-display text-base sm:text-lg font-medium text-zinc-800 pt-2">
          {block.subheading}
        </p>
      )}

      {/* Large Callout Question */}
      {block.largeQuestion && (
        <div className="my-5 p-5 sm:p-6 rounded-[18px] bg-[#c8d5bb]/20 border border-[#c8d5bb]/50">
          <p className="font-display text-base sm:text-xl md:text-[22px] font-semibold text-zinc-900 tracking-[-0.015em] leading-snug text-pretty">
            "{block.largeQuestion}"
          </p>
        </div>
      )}
    </section>
  );
}
