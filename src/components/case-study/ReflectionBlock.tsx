"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ReflectionBlockItem } from "@/types/project";

interface ReflectionBlockProps {
  block: ReflectionBlockItem;
  className?: string;
}

export function ReflectionBlock({ block, className = "" }: ReflectionBlockProps) {
  const prefersReducedMotion = useReducedMotion();
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

      {/* Reflection Points */}
      {block.items && block.items.length > 0 && (
        <div className="space-y-4 sm:space-y-5 pt-2">
          {block.items.map((item, idx) => (
            <div
              key={item._key || idx}
              className="p-5 sm:p-6 rounded-[18px] sm:rounded-[22px] bg-[#f5f4ee]/70 border border-black/5 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#47585c]">
                  {item.number || `0${idx + 1}`}
                </span>
                <span className="text-zinc-300 font-mono">•</span>
                <h3 className="font-display text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
                  {item.heading}
                </h3>
              </div>

              <p className="font-sans text-xs sm:text-sm sm:leading-relaxed text-zinc-700 max-w-2xl text-pretty">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
