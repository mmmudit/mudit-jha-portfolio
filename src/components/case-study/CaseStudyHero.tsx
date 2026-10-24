"use client";

import { useState } from "react";
import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { useReducedMotion } from "framer-motion";
import { Project } from "@/types/project";
import { CaseStudyMetadata } from "./CaseStudyMetadata";

interface CaseStudyHeroProps {
  project: Project;
  className?: string;
}

const CLARITY_PRODUCT_VISUALS = [
  {
    src: "https://image.mux.com/WkFllBhN2ddiHrlMJhWVeZaU0001gSvk02zmlXikFkuewk/thumbnail.jpg?time=1&width=900",
    alt: "Clarity adaptive friction scroll prototype",
    label: "Adaptive friction",
  },
  {
    src: "https://image.mux.com/01DiQd02dePOFaXAMrBe01Blzi9SldAcPZj02fiG2E46lkQ/thumbnail.jpg?time=1&width=900",
    alt: "Clarity Dynamic Island prototype",
    label: "Ambient awareness",
  },
  {
    src: "https://image.mux.com/BOLlqfR6S5V7BZh00cmCnxN5Cey8cy1Ym1UQHxrr3Wjg/thumbnail.jpg?time=1&width=900",
    alt: "Clarity Apple Watch prototype",
    label: "Off-screen reset",
  },
];

function ClarityProjectBrief() {
  return (
    <section
      aria-label="Clarity case study summary"
      className="relative isolate overflow-hidden rounded-[24px] border border-sky-950/10 bg-[#e9f5f8] shadow-[0_14px_40px_rgba(52,113,139,0.12)]"
    >
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full bg-sky-300/30 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-28 left-1/3 size-64 rounded-full bg-amber-100/60 blur-3xl" />

      <div className="relative space-y-7 p-5 sm:p-7 md:p-8">
        <div className="grid gap-5 md:grid-cols-[1.05fr_0.95fr] md:items-end">
          <div className="space-y-3">
            <p className="font-sans text-xs font-semibold text-sky-950/60">The design move</p>
            <h2 className="max-w-xl font-display text-2xl font-semibold leading-[1.08] tracking-[-0.03em] text-sky-950 sm:text-3xl">
              Turn a passive scroll loop into a felt signal.
            </h2>
          </div>
          <p className="max-w-md font-sans text-sm leading-relaxed text-sky-950/75 sm:text-[15px]">
            Clarity makes overstimulation visible while it is happening—using progressive resistance, visual softening, and grounding audio instead of another notification users can dismiss.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {CLARITY_PRODUCT_VISUALS.map((visual) => (
            <figure key={visual.label} className="relative aspect-[4/5] overflow-hidden rounded-[15px] bg-sky-950 shadow-[0_8px_20px_rgba(29,78,98,0.16)] sm:aspect-[16/10]">
              <Image
                src={visual.src}
                alt={visual.alt}
                fill
                loading={visual.label === "Adaptive friction" ? "eager" : "lazy"}
                sizes="(max-width: 640px) 32vw, 300px"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sky-950/80 via-sky-950/25 to-transparent px-2.5 pb-2.5 pt-8 font-sans text-[10px] font-medium leading-tight text-white sm:px-3 sm:pb-3 sm:text-xs">
                {visual.label}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="grid gap-5 border-t border-sky-950/10 pt-5 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="font-sans text-xs font-semibold text-sky-950/60">My contribution</p>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-sky-950 sm:text-[15px]">
              I led the interaction design and prototyping: defining the escalation model and choreographing haptic, visual, and audio feedback into one understandable system.
            </p>
          </div>
          <div>
            <p className="font-sans text-xs font-semibold text-sky-950/60">What the prototype established</p>
            <ul className="mt-2 grid gap-1.5 font-sans text-sm leading-snug text-sky-950/80 sm:grid-cols-3 sm:text-xs">
              <li>Friction can preserve agency without a hard lockout.</li>
              <li>An abstract state can be recognized at a glance.</li>
              <li>Awareness can extend beyond the app in use.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
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
  const isBorderless = Boolean(heroMedia?.borderless);
  const isClarity = project.slug === "clarity" || project.id === "clarity";

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

      {isClarity && <ClarityProjectBrief />}

      {/* Large Hero Demo Container — shown only when the author has supplied media */}
      {hasHeroMedia && <div
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
            <MuxPlayer
              playbackId={muxPlaybackId}
              autoPlay={!prefersReducedMotion}
              muted
              playsInline
              loop
              thumbnailTime={muxThumbTime}
              metadataVideoTitle={project.title}
              className={`w-full max-w-full h-auto max-h-[82vh] object-contain mx-auto block ${
                isBorderless ? "rounded-[16px] sm:rounded-[22px]" : "rounded-[20px] sm:rounded-[26px]"
              }`}
              title={heroMedia?.alt || `${project.title} Hero Demo`}
              style={{ "--controls": "none", aspectRatio: "var(--aspect-ratio, auto)" }}
            />
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
        ) : null}

        {/* Soft edge inner ring (only if tactile border enabled) */}
        {!isBorderless && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none rounded-[20px] sm:rounded-[26px] border border-black/5"
          />
        )}
      </div>}

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
