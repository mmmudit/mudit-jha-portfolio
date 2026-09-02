"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Maximize2, ExternalLink } from "lucide-react";
import { FigmaEmbedBlockItem } from "@/types/project";

interface FigmaEmbedBlockProps {
  block: FigmaEmbedBlockItem;
  className?: string;
}

export function FigmaEmbedBlock({ block, className = "" }: FigmaEmbedBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Normalize Figma URL to safe embed URL
  const getEmbedUrl = (rawUrl?: string): string => {
    if (!rawUrl) return "";
    // If it's already an embed URL, return directly
    if (rawUrl.includes("figma.com/embed")) {
      return rawUrl;
    }
    // Encode the raw Figma sharing URL
    return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(rawUrl)}`;
  };

  const embedUrl = getEmbedUrl(block.figmaUrl);
  const directFigmaUrl = block.figmaUrl || "#";
  const size = block.size || "wide";

  const sizeClasses = {
    normal: "max-w-3xl mx-auto",
    wide: "max-w-5xl mx-auto",
    full: "w-full",
  }[size];

  const aspectRatioClass = {
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  }[block.aspectRatio || "16/10"];

  return (
    <figure
      id={block.id || block._key}
      className={`space-y-3.5 sm:space-y-4 scroll-mt-10 ${sizeClasses} ${className}`}
    >
      {/* Optional Eyebrow & Heading */}
      {(block.eyebrow || block.title) && (
        <div className="space-y-1.5 px-1">
          {block.eyebrow && (
            <p className="font-mono text-xs sm:text-[13px] font-medium tracking-wide text-zinc-500 uppercase">
              {block.eyebrow}
            </p>
          )}
          {block.title && (
            <h3 className="font-display text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight">
              {block.title}
            </h3>
          )}
        </div>
      )}

      {/* Tactile Figma Embed Frame */}
      <div
        className={`relative w-full rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#e8ebe4]/60 border border-black/8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-300 ${
          isExpanded ? "h-[85vh]" : aspectRatioClass
        }`}
      >
        {/* Top Figma Header Bar */}
        <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3.5 sm:px-4 py-2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border-b border-black/5 select-none">
          <div className="flex items-center gap-2">
            {/* Figma Icon SVG */}
            <svg
              className="size-4"
              viewBox="0 0 38 57"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
                fill="#1ABCFE"
              />
              <path
                d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
                fill="#0ACF83"
              />
              <path
                d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
                fill="#FF7262"
              />
              <path
                d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
                fill="#F24E1E"
              />
              <path
                d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
                fill="#A259FF"
              />
            </svg>

            <span className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-semibold">
              Live Figma Embed
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Expand / Collapse Height Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              data-cuelume-hover="tick"
              className="pressable hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-600 hover:text-zinc-950 bg-black/5 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
              title={isExpanded ? "Collapse View" : "Expand Height"}
            >
              <Maximize2 className="size-3" />
              <span>{isExpanded ? "Collapse" : "Expand"}</span>
            </button>

            {/* Direct Link to Figma */}
            {directFigmaUrl && directFigmaUrl !== "#" && (
              <a
                href={directFigmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cuelume-hover="tick"
                className="group/btn inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-zinc-700 hover:text-zinc-950 bg-black/5 hover:bg-black/10 rounded-full transition-colors cursor-pointer"
              >
                <span>Open in Figma</span>
                <ArrowUpRight className="size-3 text-zinc-500 group-hover/btn:text-zinc-900 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            )}
          </div>
        </div>

        {/* Loading Warm Dough Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center bg-[#f2f1ea] t-skeleton z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-xs">
              <span className="size-2 rounded-full bg-[#c8d5bb] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 font-medium">
                Loading live canvas…
              </span>
            </div>
          </div>
        )}

        {/* Live IFrame Embed */}
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={block.title || "Figma Design Canvas"}
            allowFullScreen
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`size-full pt-9 border-none transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <div className="size-full pt-10 flex flex-col items-center justify-center p-6 text-center bg-[#f5f4ee]/90 dot-grid">
            <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-700 uppercase">
              [ FIGMA EMBED URL MISSING ]
            </p>
            <p className="font-sans text-xs text-zinc-500 mt-2 max-w-sm">
              Add a Figma file or prototype share link in Sanity Studio to render the interactive file.
            </p>
          </div>
        )}

        {/* Subtle inner edge stroke */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[20px] sm:rounded-[26px] border border-black/5"
        />
      </div>

      {/* Caption */}
      {block.caption && (
        <figcaption className="text-center font-sans text-xs sm:text-[13px] text-[#47585c] max-w-xl mx-auto text-pretty">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
