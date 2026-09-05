"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { MediaBlockItem } from "@/types/project";
import { HanddrawnAnnotation } from "./HanddrawnAnnotation";

import { FigmaEmbedBlock } from "./FigmaEmbedBlock";

interface MediaBlockProps {
  block: MediaBlockItem;
  className?: string;
}

function getMuxPlaybackId(val?: string): string | undefined {
  if (!val || typeof val !== "string") return undefined;
  const trimmed = val.trim();
  if (!trimmed) return undefined;
  const urlMatch = trimmed.match(/(?:stream|image)\.mux\.com\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].replace(/\.(m3u8|mp4|webp|png|jpg)$/i, "");
  }
  if (/^[a-zA-Z0-9_-]{10,}$/.test(trimmed) && !trimmed.startsWith("http")) {
    return trimmed;
  }
  return undefined;
}

export function MediaBlock({ block, className = "" }: MediaBlockProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // If mediaType is figma or figmaUrl is provided, render the interactive Figma embed frame
  if (block.mediaType === "figma" || block.figmaUrl) {
    return (
      <FigmaEmbedBlock
        block={{
          _type: "figmaEmbed",
          _key: block._key,
          id: block.id,
          figmaUrl: block.figmaUrl || block.video || "",
          caption: block.caption,
          size: block.size,
          title: block.alt || block.placeholderTitle,
        }}
        className={className}
      />
    );
  }

  const sizeClasses = {
    normal: "max-w-2xl mx-auto",
    wide: "max-w-4xl mx-auto",
    full: "w-full",
  }[block.size || "wide"];

  const muxPlaybackId =
    block.muxPlaybackId ||
    block.muxVideo?.playbackId ||
    getMuxPlaybackId(block.video) ||
    getMuxPlaybackId(block.image);
  const muxThumbTime = block.muxThumbTime ?? block.muxVideo?.thumbTime ?? 0;
  const muxPosterUrl = muxPlaybackId
    ? `https://image.mux.com/${muxPlaybackId}/thumbnail.webp?time=${muxThumbTime}&width=1920&fit_mode=smartcrop`
    : undefined;

  const hasRealMedia = Boolean(block.image || block.video || muxPlaybackId);
  const placeholderLabel =
    block.placeholderTitle ||
    (block.mediaType === "video" || block.mediaType === "mux" || muxPlaybackId ? "VIDEO DEMO" : "IMAGE ASSET");

  const posterImage = block.image || muxPosterUrl;

  const isBorderless = Boolean(block.borderless || block.removeBorder);

  // Draft media stays out of the public case study. The surrounding narrative
  // remains intact and the block becomes visible as soon as an asset is added.
  if (!hasRealMedia) return null;

  return (
    <figure
      id={block.id || block._key}
      className={`my-8 sm:my-12 scroll-mt-10 ${sizeClasses} ${className}`}
    >
      <div
        className={`relative isolate overflow-hidden flex items-center justify-center ${
          isBorderless
            ? "rounded-[14px] sm:rounded-[20px] bg-transparent"
            : "rounded-[20px] sm:rounded-[26px] bg-[#e8ebe4]/50 border border-black/8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
        }`}
      >
        {block.annotation && <HanddrawnAnnotation annotation={block.annotation} />}

        {hasRealMedia ? (
          muxPlaybackId ? (
            <video
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              controls={false}
              poster={posterImage}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block ${
                isBorderless ? "rounded-[14px] sm:rounded-[20px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              aria-label={block.alt || placeholderLabel}
            >
              <source src={`https://stream.mux.com/${muxPlaybackId}.m3u8`} type="application/x-mpegURL" />
              <source src={`https://stream.mux.com/${muxPlaybackId}/high.mp4`} type="video/mp4" />
              <source src={`https://stream.mux.com/${muxPlaybackId}/medium.mp4`} type="video/mp4" />
            </video>
          ) : block.mediaType === "video" && block.video ? (
            <video
              src={block.video}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              controls={false}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block ${
                isBorderless ? "rounded-[14px] sm:rounded-[20px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              aria-label={block.alt || placeholderLabel}
            />
          ) : block.image ? (
            <Image
              src={block.image}
              alt={block.alt || "Case study visual evidence"}
              width={1920}
              height={1080}
              sizes="(max-width: 768px) 100vw, 960px"
              onLoad={() => setImageLoaded(true)}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block transition-[opacity,filter,transform] duration-300 ease-out ${
                imageLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.01]"
              }`}
            />
          ) : null
        ) : null}

        {/* Soft edge inner ring (only if tactile border is enabled) */}
        {!isBorderless && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[20px] sm:rounded-[26px] border border-black/5"
          />
        )}
      </div>

      {block.caption && (
        <figcaption className="mt-3 text-center font-sans text-xs sm:text-[13px] text-[#47585c] max-w-xl mx-auto text-pretty">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
