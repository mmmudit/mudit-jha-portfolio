"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { DecisionBlockItem } from "@/types/project";
import { MediaBlock } from "./MediaBlock";

interface DecisionBlockProps {
  block: DecisionBlockItem;
  className?: string;
}

export function DecisionBlock({ block, className = "" }: DecisionBlockProps) {
  const prefersReducedMotion = useReducedMotion();

  const toArray = (val?: string | string[]) => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const paragraphs = toArray(block.body);
  const contextList = toArray(block.context);
  const decisionList = toArray(block.decision);
  const whyList = toArray(block.why);
  const tradeoffList = toArray(block.tradeoff);

  const hasEditorialSections =
    contextList.length > 0 ||
    decisionList.length > 0 ||
    whyList.length > 0 ||
    tradeoffList.length > 0;

  return (
    <section
      id={block.id || block._key}
      className={`space-y-6 sm:space-y-8 scroll-mt-10 ${className}`}
    >
      {/* Eyebrow / Pill Badge */}
      {block.eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d5bb]/35 border border-[#c8d5bb]/60 shadow-2xs">
          <span className="size-1.5 rounded-full bg-[#47585c]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase tabular-nums">
            {block.eyebrow}
          </span>
        </div>
      )}

      {/* Heading & Highlight Subtitle */}
      <div className="space-y-2">
        {block.heading && (
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight leading-[1.25] text-balance">
            {block.heading}
          </h2>
        )}

        {block.subheading && (
          <p className="font-sans text-sm sm:text-base text-zinc-600 font-medium text-pretty">
            {block.subheading}
          </p>
        )}
      </div>

      {/* Standard Intro Body (Legacy or generic) */}
      {paragraphs.length > 0 && (
        <div className="space-y-3 font-sans text-sm sm:text-[15px] leading-[1.65] text-zinc-700 max-w-2xl text-pretty">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {/* Editorial Decision Story: Context -> Decision -> Why / Trade-off */}
      {hasEditorialSections && (
        <div className="space-y-5 sm:space-y-6 pt-1 max-w-3xl">
          {/* Context */}
          {contextList.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-2 border-l-2 border-[#c8d5bb] bg-[#c8d5bb]/12 px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-semibold">
                Context
              </p>
              <div className="space-y-2 font-sans text-sm sm:text-base leading-relaxed text-zinc-700">
                {contextList.map((c, i) => (
                  <p key={i}>{c}</p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Decision */}
          {(decisionList.length > 0 || (block.decisionPoints && block.decisionPoints.length > 0)) && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.25, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-2.5 border-l-2 border-zinc-900 bg-zinc-900/[0.035] px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-900 font-semibold">
                Decision
              </p>
              <div className="space-y-2 font-sans text-sm sm:text-base leading-relaxed text-zinc-800">
                {decisionList.map((d, i) => (
                  <p key={i}>{d}</p>
                ))}
              </div>

              {/* Decision Points List */}
              {block.decisionPoints && block.decisionPoints.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {block.decisionPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 sm:p-3.5 rounded-xl bg-[#f5f4ee]/80 border border-black/5 space-y-1"
                    >
                      <p className="font-display text-xs sm:text-sm font-semibold text-zinc-900">
                        {point.title}
                      </p>
                      <p className="font-sans text-xs text-zinc-600 leading-snug">
                        {point.body}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Why */}
          {whyList.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.25, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-2 border-l-2 border-[#aebd9d] bg-[#c8d5bb]/10 px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-semibold">
                Why
              </p>
              <div className="space-y-2 font-sans text-sm sm:text-base leading-relaxed text-zinc-700">
                {whyList.map((w, i) => (
                  <p key={i}>{w}</p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Trade-off */}
          {tradeoffList.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="space-y-2 border-l-2 border-amber-600/60 bg-amber-50/70 px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-amber-800 font-semibold">
                Trade-off
              </p>
              <div className="space-y-2 font-sans text-sm sm:text-base leading-relaxed text-zinc-700">
                {tradeoffList.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Product evidence only appears when a real asset exists. */}
      {(block.image || block.video || block.muxPlaybackId || block.muxVideo?.playbackId) && (
        <MediaBlock block={{ ...block, _type: "mediaBlock", size: "wide" }} />
      )}

      {/* Small Explanation Cards Underneath */}
      {block.cards && block.cards.length > 0 && (
        <div className={`grid grid-cols-1 ${block.cards.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"} gap-4 sm:gap-5 pt-1`}>
          {block.cards.map((card, idx) => (
            <div
              key={card._key || idx}
              className="p-4 sm:p-5 rounded-[18px] sm:rounded-[20px] bg-[#f5f4ee]/70 border border-black/6 shadow-2xs space-y-1.5"
            >
              <h3 className="font-display text-sm sm:text-base font-semibold text-zinc-900 tracking-tight text-balance">
                {card.title}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] leading-relaxed text-zinc-700 text-pretty">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Subsections Grid (Legacy fallback) */}
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

              {sub.media && <div className="relative aspect-[16/10] w-full rounded-[14px] overflow-hidden bg-white/70 border border-black/5"><Image src={sub.media} alt={sub.title} fill className="object-contain" /></div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
