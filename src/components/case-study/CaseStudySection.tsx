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
        <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase tabular-nums">
          {block.eyebrow}
        </p>
      )}

      {/* Figtree Statement Heading */}
      {block.heading && (
        <h2 className="font-display text-xl sm:text-2xl md:text-[28px] font-semibold text-zinc-900 tracking-[-0.02em] leading-[1.2] text-balance">
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
        <p className="font-display text-base sm:text-lg font-medium text-zinc-800 tracking-tight pt-2 text-balance">
          {block.subheading}
        </p>
      )}

      {/* Large Callout Question */}
      {block.largeQuestion && (
        <div className="my-5 p-5 sm:p-6 rounded-[18px] bg-[#c8d5bb]/20 border border-[#c8d5bb]/50">
          <p className="font-display text-base sm:text-xl md:text-[22px] font-semibold text-zinc-900 tracking-[-0.015em] leading-snug text-balance">
            "{block.largeQuestion}"
          </p>
        </div>
      )}

      {/* Motion Pipeline / Sequence Flow (e.g. Final Experience) */}
      {block.pipeline && block.pipeline.length > 0 && (
        <div className="py-2">
          <div className="flex flex-wrap items-center gap-2 p-3 sm:p-4 rounded-[18px] bg-[#f5f4ee]/80 border border-black/5">
            {block.pipeline.map((step, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1.5 rounded-xl bg-white/90 border border-black/5 text-xs sm:text-[13px] font-sans font-medium text-zinc-800 shadow-2xs">
                  {step}
                </span>
                {idx < block.pipeline!.length - 1 && (
                  <span className="text-zinc-400 font-sans text-xs px-0.5" aria-hidden="true">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Compact Cards (e.g. 03 — Giving users control) */}
      {block.cards && block.cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {block.cards.map((card, idx) => (
            <div
              key={card._key || idx}
              className="p-4 sm:p-5 rounded-[18px] bg-[#f5f4ee]/70 border border-black/5 space-y-1.5 shadow-2xs"
            >
              <h3 className="font-display text-sm sm:text-base font-semibold text-zinc-900 tracking-tight text-balance">
                {card.title}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-zinc-600 leading-relaxed text-pretty">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Concluding Thesis Statement */}
      {block.conclusion && (
        <div className="p-5 sm:p-6 rounded-[20px] bg-[#e8ebe4]/40 border border-[#c8d5bb]/70">
          <p className="font-sans text-sm sm:text-base font-medium text-zinc-900 leading-relaxed text-pretty">
            {block.conclusion}
          </p>
        </div>
      )}
    </section>
  );
}
