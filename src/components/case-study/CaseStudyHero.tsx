"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Project } from "@/types/project";
import { CaseStudyMetadata } from "./CaseStudyMetadata";

interface CaseStudyHeroProps {
  project: Project;
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

export function CaseStudyHero({ project, className = "" }: CaseStudyHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const heroMedia = project.heroMedia;
  const muxPlaybackId =
    heroMedia?.muxPlaybackId ||
    heroMedia?.muxVideo?.playbackId ||
    getMuxPlaybackId(heroMedia?.video) ||
    getMuxPlaybackId(heroMedia?.image) ||
    project.muxPlaybackId ||
    project.muxVideo?.playbackId ||
    getMuxPlaybackId(project.image);

  const muxThumbTime = heroMedia?.muxThumbTime ?? heroMedia?.muxVideo?.thumbTime ?? project.muxThumbTime ?? project.muxVideo?.thumbTime ?? 0;
  const muxPosterUrl = muxPlaybackId
    ? `https://image.mux.com/${muxPlaybackId}/thumbnail.webp?time=${muxThumbTime}&width=1920&fit_mode=smartcrop`
    : undefined;

  const hasHeroMedia = Boolean(heroMedia?.image || heroMedia?.video || muxPlaybackId || project.image);
  const heroImage = heroMedia?.image || muxPosterUrl || project.image;
  const heroVideo = heroMedia?.video;

  const displayTitle = project.tagline || project.title;
  const projectIdentifier = project.title.toUpperCase();

  const isBorderless = Boolean(heroMedia?.borderless);

  return (
    <header id="sec-hero" className={`space-y-6 sm:space-y-8 pt-2 sm:pt-4 scroll-mt-6 ${className}`}>
      {/* Project Identifier + Year */}
      <div className="flex items-center gap-2.5">
        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-[#c8d5bb]/35 text-[#47585c] rounded-full tabular-nums">
          {project.projectType || project.event || project.year || "2026"}
        </span>
      </div>

      {/* Large Dominating Headline in Figtree */}
      <div className="space-y-2">
        <h1 className="font-display text-2xl sm:text-4xl md:text-[42px] font-semibold text-zinc-900 tracking-[-0.025em] leading-[1.1] text-balance">
          {displayTitle}
        </h1>

        {/* Subtitle / Skills row */}
        {project.skills && project.skills.length > 0 && (
          <p className="font-mono text-xs text-[#47585c] tracking-wide">
            {project.projectType || project.event ? `${project.projectType || project.event} · ` : ""}
            {project.skills.map((s) => (typeof s === "string" ? s : s.text)).join(" · ")}
          </p>
        )}
      </div>


      {/* Large Hero Demo Container — Always Above Intro Narrative */}
      <div
        className={`relative w-full overflow-hidden flex items-center justify-center ${
          !hasHeroMedia ? "aspect-[16/10] sm:aspect-[16/9]" : ""
        } ${
          isBorderless
            ? "rounded-[16px] sm:rounded-[22px] bg-transparent"
            : "rounded-[20px] sm:rounded-[26px] bg-[#e8ebe4]/60 border border-black/8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
        }`}
      >
        {hasHeroMedia ? (
          muxPlaybackId ? (
            <video
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              poster={heroImage}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block ${
                isBorderless ? "rounded-[16px] sm:rounded-[22px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              aria-label={heroMedia?.alt || `${project.title} Hero Demo`}
            >
              <source src={`https://stream.mux.com/${muxPlaybackId}.m3u8`} type="application/x-mpegURL" />
              <source src={`https://stream.mux.com/${muxPlaybackId}/high.mp4`} type="video/mp4" />
              <source src={`https://stream.mux.com/${muxPlaybackId}/medium.mp4`} type="video/mp4" />
            </video>
          ) : heroVideo ? (
            <video
              src={heroVideo}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block ${
                isBorderless ? "rounded-[16px] sm:rounded-[22px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              aria-label={heroMedia?.alt || `${project.title} Hero Demo`}
            />
          ) : heroImage ? (
            <Image
              src={heroImage}
              alt={heroMedia?.alt || `${project.title} Hero Media`}
              width={1920}
              height={1080}
              priority
              sizes="(max-width: 768px) 100vw, 960px"
              onLoad={() => setImageLoaded(true)}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block transition-[opacity,filter,transform] duration-300 ease-out ${
                imageLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.01]"
              }`}
            />
          ) : null
        ) : (
          <div className="size-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-[#f5f4ee]/90 dot-grid">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-xs mb-3">
              <span className="size-2 rounded-full bg-[#c8d5bb]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-medium">
                Hero Product Demo
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-800 uppercase max-w-md px-4 py-2 rounded-xl bg-white/80 border border-dashed border-zinc-300 shadow-2xs">
              [ {heroMedia?.placeholderTitle || `${projectIdentifier} — HERO PRODUCT DEMO`} ]
            </p>

            <p className="font-sans text-xs text-zinc-500 mt-2.5 max-w-sm">
              8–12 sec polished product demo showcasing real-time interaction feedback
            </p>
          </div>
        )}

        {/* Soft edge inner ring (only if tactile border enabled) */}
        {!isBorderless && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[20px] sm:rounded-[26px] border border-black/5"
          />
        )}
      </div>

      {heroMedia?.caption && (
        <p className="text-center font-sans text-xs sm:text-[13px] text-[#47585c] max-w-xl mx-auto text-pretty">
          {heroMedia.caption}
        </p>
      )}

      {/* Case Study Metadata Field (Immediately After Hero Image) */}
      <div className="pt-2">
        <CaseStudyMetadata
          metadata={project.metadata}
          role={project.role}
          event={project.event || project.projectType}
          team={project.team}
          skills={project.skills}
          year={project.year}
          href={project.href}
        />
      </div>

      {/* Intro Narrative (Directly Below Metadata) */}
      {project.introParagraphs && project.introParagraphs.length > 0 && (
        <div className="space-y-3.5 pt-2 font-sans text-sm sm:text-base leading-[1.7] text-zinc-700 max-w-3xl text-pretty">
          {project.introParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
    </header>
  );
}
