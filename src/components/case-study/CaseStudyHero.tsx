"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { Project } from "@/types/project";
import { CaseStudyMetadata } from "./CaseStudyMetadata";

interface CaseStudyHeroProps {
  project: Project;
  className?: string;
}

export function CaseStudyHero({ project, className = "" }: CaseStudyHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const heroMedia = project.heroMedia;
  const hasHeroMedia = Boolean(heroMedia?.image || heroMedia?.video || project.image);
  const heroImage = heroMedia?.image || project.image;
  const heroVideo = heroMedia?.video;

  const displayTitle = project.tagline || project.title;
  const projectIdentifier = project.title.toUpperCase();

  const isBorderless = Boolean(heroMedia?.borderless);

  return (
    <header id="sec-hero" className={`space-y-6 sm:space-y-8 pt-2 sm:pt-4 scroll-mt-6 ${className}`}>
      {/* Project Identifier + Year */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-wider text-[#47585c] uppercase">
          {projectIdentifier}
        </span>
        <span className="text-zinc-300 font-mono">•</span>
        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-[#c8d5bb]/35 text-[#47585c] rounded-full">
          {project.projectType || project.event || project.year || "2026"}
        </span>
      </div>

      {/* Large Dominating Headline in Figtree */}
      <h1 className="font-display text-2xl sm:text-4xl md:text-[42px] font-semibold text-zinc-900 tracking-[-0.025em] leading-[1.1] text-pretty">
        {displayTitle}
      </h1>

      {/* Customizable 4-Field / Dynamic Metadata Grid */}
      <CaseStudyMetadata
        metadata={project.metadata}
        role={project.role}
        event={project.event || project.projectType}
        team={project.team}
        skills={project.skills}
        year={project.year}
        href={project.href}
      />

      {/* Large Hero Demo Container */}
      <div
        className={`relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden ${
          isBorderless
            ? "rounded-[16px] sm:rounded-[22px] bg-transparent"
            : "rounded-[20px] sm:rounded-[26px] bg-[#e8ebe4]/60 border border-black/8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_16px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
        }`}
      >
        {hasHeroMedia ? (
          heroVideo ? (
            <video
              src={heroVideo}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              className={`size-full object-contain ${
                isBorderless ? "rounded-[16px] sm:rounded-[22px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              aria-label={heroMedia?.alt || `${project.title} Hero Demo`}
            />
          ) : heroImage ? (
            <Image
              src={heroImage}
              alt={heroMedia?.alt || `${project.title} Hero Media`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 960px"
              onLoad={() => setImageLoaded(true)}
              className={`object-contain transition-all duration-300 ease-out ${
                imageLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-[4px] scale-[1.01]"
              }`}
            />
          ) : null
        ) : (
          <div className="size-full flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-[#f5f4ee]/90 dot-grid">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-black/5 shadow-xs mb-3">
              <span className="size-2 rounded-full bg-[#c8d5bb]" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-medium">
                Hero Showcase
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-zinc-800 uppercase max-w-md px-4 py-2 rounded-xl bg-white/80 border border-dashed border-zinc-300 shadow-2xs">
              [ {heroMedia?.placeholderTitle || `${projectIdentifier} — HERO PRODUCT DEMO`} ]
            </p>

            <p className="font-sans text-xs text-zinc-500 mt-2.5 max-w-sm">
              Featured interaction demonstration or hero artwork
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
    </header>
  );
}
