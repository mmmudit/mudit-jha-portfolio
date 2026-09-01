"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { MediaBlockItem } from "@/types/project";
import { HanddrawnAnnotation } from "./HanddrawnAnnotation";

interface MediaBlockProps {
  block: MediaBlockItem;
  className?: string;
}

export function MediaBlock({ block, className = "" }: MediaBlockProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    normal: "max-w-2xl mx-auto",
    wide: "max-w-4xl mx-auto",
    full: "w-full",
  }[block.size || "wide"];

  const hasRealMedia = Boolean(block.image || block.video);
  const placeholderLabel = block.placeholderTitle || (block.mediaType === "video" ? "VIDEO DEMO" : "IMAGE ASSET");

  return (
    <figure className={`my-8 sm:my-12 ${sizeClasses} ${className}`}>
      <div className="relative isolate rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#e8ebe4]/50 border border-black/8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]">
        {block.annotation && <HanddrawnAnnotation annotation={block.annotation} />}

        {hasRealMedia ? (
          block.mediaType === "video" && block.video ? (
            <video
              src={block.video}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              controls={false}
              className="w-full h-auto object-cover max-h-[560px] rounded-[20px] sm:rounded-[26px]"
              aria-label={block.alt || placeholderLabel}
            />
          ) : block.image ? (
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
              <Image
                src={block.image}
                alt={block.alt || "Case study visual evidence"}
                fill
                sizes="(max-width: 768px) 100vw, 960px"
                onLoad={() => setImageLoaded(true)}
                className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              />
            </div>
          ) : null
        ) : (
          /* Tasteful Tactile Paper Development Placeholder */
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-[#f5f4ee]/80 dot-grid">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-xs mb-3">
              <span className="size-2 rounded-full bg-[#c8d5bb]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-medium">
                {block.mediaType === "video" ? "UI Demonstration" : "Visual Evidence"}
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-800 uppercase max-w-md px-4 py-2 rounded-xl bg-white/70 border border-dashed border-zinc-300 shadow-2xs">
              [ {placeholderLabel} ]
            </p>

            <p className="font-sans text-xs text-zinc-500 mt-2.5 max-w-sm">
              Replace via Sanity CMS or asset upload
            </p>
          </div>
        )}

        {/* Soft edge inner ring */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[20px] sm:rounded-[26px] border border-black/5"
        />
      </div>

      {block.caption && (
        <figcaption className="mt-3 text-center font-sans text-xs sm:text-[13px] text-[#47585c] max-w-xl mx-auto text-pretty">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
