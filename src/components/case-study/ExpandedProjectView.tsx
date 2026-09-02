"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { play } from "@/lib/sound";
import { Project } from "@/types/project";
import { CaseStudyRenderer } from "./CaseStudyRenderer";

interface ExpandedProjectViewProps {
  project: Project;
  projects: Project[];
  currentIndex: number;
}

const DEFAULT_SECTIONS = [
  { id: "sec-overview", label: "Overview" },
  { id: "sec-details", label: "Details" },
  { id: "sec-vision", label: "Vision" },
  { id: "sec-challenge", label: "Challenge" },
  { id: "sec-execution", label: "Solution" },
  { id: "sec-reflection", label: "Reflection" },
];

export function ExpandedProjectView({
  project,
  projects,
  currentIndex,
}: ExpandedProjectViewProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [activeSectionId, setActiveSectionId] = useState("sec-overview");
  const [timelineHoveredIdx, setTimelineHoveredIdx] = useState<number | null>(null);
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null);

  // Compute other projects for "Also check out..." section
  const otherProjects = React.useMemo(() => {
    if (!projects || projects.length <= 1) return [];
    const count = Math.min(2, projects.length - 1);
    const result = [];
    for (let i = 1; i <= count; i++) {
      const idx = (currentIndex + i) % projects.length;
      result.push({ project: projects[idx], index: idx });
    }
    return result;
  }, [projects, currentIndex]);

  const formatSectionLabel = (str: string) => {
    let clean = str.replace(/^\d+\s*[—–-]\s*/, "").trim();
    if (/making the invisible visible/i.test(clean)) return "Visualizing State";
    if (/designing beyond the app/i.test(clean)) return "Beyond The App";
    if (/the problem/i.test(clean)) return "The Problem";
    if (/the idea/i.test(clean)) return "The Idea";
    if (/core experience/i.test(clean)) return "Core Experience";
    if (/final experience/i.test(clean)) return "Final Experience";

    if (clean.length > 20) {
      clean = clean.slice(0, 20) + "...";
    }
    if (clean === clean.toUpperCase()) {
      clean = clean
        .toLowerCase()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
    return clean;
  };

  // Derive dynamic navigation sections from case study blocks
  const activeSections = React.useMemo(() => {
    if (project.caseStudy && project.caseStudy.length > 0) {
      const items: { id: string; label: string }[] = [];
      for (let idx = 0; idx < project.caseStudy.length; idx++) {
        const block = project.caseStudy[idx];
        const eyebrow = "eyebrow" in block ? block.eyebrow : undefined;
        const heading = "heading" in block ? block.heading : undefined;
        const blockId = block.id || block._key;

        if (blockId && (eyebrow || heading)) {
          const rawLabel = eyebrow || heading || "";
          const label = formatSectionLabel(rawLabel);
          if (!items.some((i) => i.id === blockId)) {
            items.push({ id: blockId, label });
          }
        }
      }
      if (items.length > 0) return items;
    }
    return DEFAULT_SECTIONS;
  }, [project.caseStudy]);

  // Track active section on window scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeSections.length === 0) return;

      // 1. Top of page
      if (window.scrollY < 140) {
        setActiveSectionId(activeSections[0].id);
        return;
      }

      // 2. Bottom of page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSectionId(activeSections[activeSections.length - 1].id);
        return;
      }

      // 3. Middle sections
      const scrollThreshold = Math.min(220, window.innerHeight * 0.35);
      let currentActive = activeSections[0].id;
      for (const sec of activeSections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= scrollThreshold) {
            currentActive = sec.id;
          }
        }
      }
      setActiveSectionId(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSections]);

  const scrollToSection = (id: string) => {
    if (id === activeSections[0]?.id || id === "sec-hero") {
      play("page", { volume: 0.35 });
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSectionId(activeSections[0]?.id || id);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      play("page", { volume: 0.35 });
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
      setActiveSectionId(id);
    }
  };

  // Keyboard navigation: J / K / Left / Right switches projects
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      if (e.key === "Escape") {
        router.push("/");
        return;
      }

      if (projects.length > 1) {
        if (e.key === "ArrowRight" || e.key === "j" || e.key === "J") {
          e.preventDefault();
          const nextIdx = (currentIndex + 1) % projects.length;
          const nextSlug = projects[nextIdx].slug || projects[nextIdx].id;
          play("page", { volume: 0.35 });
          router.push(`/projects/${nextSlug}`);
        } else if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") {
          e.preventDefault();
          const prevIdx = (currentIndex - 1 + projects.length) % projects.length;
          const prevSlug = projects[prevIdx].slug || projects[prevIdx].id;
          play("page", { volume: 0.35 });
          router.push(`/projects/${prevSlug}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, projects, router]);

  return (
    <div className="w-full text-zinc-800">
      {/* Full-bleed Top Navigation Header */}
      <header className="flex items-center justify-between py-4 pb-8 border-b border-black/5 shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/"
            data-cuelume-hover="tick"
            className="pressable inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-display text-lg sm:text-2xl font-normal transition-colors cursor-pointer shrink-0"
            title="Back to Work"
            aria-label="Back to Work"
          >
            Work
          </Link>

          <ChevronRight className="size-4 sm:size-4.5 text-zinc-400 shrink-0 stroke-[2]" aria-hidden="true" />

          <h1 className="font-display text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight truncate max-w-[180px] sm:max-w-none">
            {project.title}
          </h1>

          <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full shrink-0">
            {project.year || "2026"}
          </span>
        </div>

        {/* Avatar Stack Switcher Pill */}
        {projects && projects.length > 1 && (
          <nav
            className="group/pill flex items-center gap-1 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/90 border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] backdrop-blur-md transition-all duration-200 select-none"
            aria-label="Project switcher"
          >
            <span className="hidden sm:inline text-[12px] sm:text-[13px] font-sans font-normal text-zinc-500 tracking-tight whitespace-nowrap pl-0.5">
              {currentIndex + 1} of {projects.length}
            </span>

            <div className="flex items-center -space-x-2 group-hover/pill:-space-x-0.5 transition-[margin,gap] duration-200 ease-out pl-0.5">
              {projects.map((p, idx) => {
                const isActive = currentIndex === idx;
                const isHovered = hoveredAvatarIdx === idx;
                const title = p.title || `Project ${idx + 1}`;
                const targetSlug = p.slug || p.id;

                return (
                  <div key={p._id || p.id || p.slug || idx} className="relative flex items-center justify-center">
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -2, scale: 0.96 }}
                          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                          className="absolute top-full mt-3 z-50 pointer-events-none"
                        >
                          <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-zinc-950 bg-[#fffdfa] shadow-[3px_3px_0px_#18181b] whitespace-nowrap select-none">
                            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]" />
                            <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#fffdfa]" />

                            {p.image && (
                              <div className="relative size-3.5 rounded-full overflow-hidden border border-zinc-950/20 shrink-0">
                                <Image src={p.image} alt="" fill sizes="16px" className="object-cover" />
                              </div>
                            )}

                            <span className="font-mono text-[12px] font-bold text-zinc-950 tracking-tight">
                              {title}
                            </span>

                            <span className="font-mono text-[10px] text-zinc-400 font-medium tracking-tight">
                              [{idx + 1}]
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Link
                      href={`/projects/${targetSlug}`}
                      onClick={() => play("page", { volume: 0.35 })}
                      onMouseEnter={() => setHoveredAvatarIdx(idx)}
                      onMouseLeave={() => setHoveredAvatarIdx(null)}
                      onFocus={() => setHoveredAvatarIdx(idx)}
                      onBlur={() => setHoveredAvatarIdx(null)}
                      title={`${title} [${idx + 1}]`}
                      aria-label={`Switch to ${title}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative size-5 sm:size-[26px] rounded-full overflow-hidden border-[1.5px] border-white bg-zinc-100 transition-all duration-200 ease-out cursor-pointer ${
                        isActive
                          ? "grayscale-0 opacity-100 ring-1 ring-black/10 scale-105 z-20 shadow-sm"
                          : "grayscale opacity-45 hover:grayscale-0 hover:opacity-100 hover:scale-115 hover:z-30"
                      } focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/10`}
                    >
                      {p.image ? (
                        <Image
                          src={p.image}
                          alt={title}
                          fill
                          sizes="32px"
                          className="size-full object-cover pointer-events-none"
                        />
                      ) : (
                        <div
                          className={`size-full bg-gradient-to-br ${
                            p.gradient || "from-zinc-300 to-zinc-400"
                          } flex items-center justify-center font-mono text-[9px] font-bold text-zinc-700`}
                        >
                          {title.charAt(0)}
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Grid: Left Sticky Timeline Minimap & Right Case Study Content */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 pt-8 pb-16">
        {/* Left Side Sticky Timeline Sidebar */}
        <aside className="hidden md:flex flex-col w-[200px] lg:w-[220px] shrink-0 sticky top-24 self-start justify-between py-2 pr-4 border-r border-black/5 min-h-[calc(100vh-140px)]">
          <div>
            {/* Back button */}
            <Link
              href="/"
              data-cuelume-hover="tick"
              className="pressable group inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wider text-zinc-500 hover:text-zinc-900 uppercase transition-colors cursor-pointer select-none mb-8"
              title="Back to Work"
              aria-label="Back"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span>BACK</span>
            </Link>

            {/* Optical Lens Precision Motion Timeline */}
            <nav
              className="relative flex flex-col gap-1.5 select-none py-1 pl-1"
              aria-label="Case study timeline navigation"
              onMouseLeave={() => setTimelineHoveredIdx(null)}
            >
              {activeSections.map((sec, idx) => {
                const activeIdx = activeSections.findIndex((s) => s.id === activeSectionId);
                const isActive = activeIdx === idx;
                const isPassed = idx < activeIdx;
                const isHovered = timelineHoveredIdx === idx;
                const focusIndex = timelineHoveredIdx !== null ? timelineHoveredIdx : Math.max(0, activeIdx);
                const distance = Math.abs(idx - focusIndex);

                // Optical Gaussian lens formula
                const lensScale = Math.max(0, 1 - distance * 0.28);
                const tickWidth = 4 + lensScale * 14;
                const fontSize = 12.5 + lensScale * 1.5;
                const opacity = isActive ? 1 : 0.35 + lensScale * 0.55;

                return (
                  <button
                    key={sec.id}
                    type="button"
                    onMouseEnter={() => setTimelineHoveredIdx(idx)}
                    onClick={() => scrollToSection(sec.id)}
                    data-cuelume-hover="tick"
                    className="group flex items-center justify-between w-full text-left py-1 cursor-pointer select-none focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Fisheye Magnified Tick */}
                      <div className="w-5 flex items-center justify-start shrink-0">
                        <motion.div
                          initial={false}
                          animate={{
                            width: tickWidth,
                            backgroundColor: isActive
                              ? "#37522d"
                              : isHovered
                                ? "#18181b"
                                : isPassed
                                  ? "#71717a"
                                  : "#d4d4d8",
                          }}
                          transition={{ type: "spring", stiffness: 480, damping: 32 }}
                          className="h-[2px] rounded-full"
                        />
                      </div>

                      {/* Optical Scale Typography */}
                      <motion.span
                        animate={{
                          fontSize: `${fontSize}px`,
                          opacity: opacity,
                          x: isActive ? 2 : 0,
                          fontWeight: isActive ? 600 : 400,
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className={`truncate transition-colors duration-150 ${
                          isActive
                            ? "text-zinc-950 font-semibold"
                            : "text-zinc-700 group-hover:text-zinc-950"
                        }`}
                      >
                        {sec.label}
                      </motion.span>
                    </div>

                    {isPassed && (
                      <span className="text-[10px] font-mono text-[#37522d] font-medium shrink-0 ml-1 opacity-85">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Live Site Link */}
          {project.href && project.href !== "#" && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-zinc-600 hover:text-zinc-900 transition-colors pt-4 border-t border-black/5"
            >
              <span>Visit Live Site</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </aside>

        {/* Right Side Editorial Case Study Content */}
        <div className="flex-1 min-w-0 space-y-12 sm:space-y-16">
          {/* Dynamic Structured Case Study Content */}
          <CaseStudyRenderer project={project} />

          {/* "Also check out..." related project previews */}
          {otherProjects.length > 0 && (
            <div className="pt-10 sm:pt-14 pb-4 border-t border-black/5 space-y-6">
              <p className="text-zinc-500 font-sans text-sm sm:text-base font-normal tracking-tight italic">
                psst... here's more cool stuff...
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherProjects.map(({ project: nextP, index: nextIdx }) => {
                  if (!nextP) return null;
                  const nextSlug = nextP.slug || nextP.id;

                  return (
                    <Link
                      key={nextP._id || nextP.id || nextIdx}
                      href={`/projects/${nextSlug}`}
                      onClick={() => play("page", { volume: 0.35 })}
                      data-cuelume-hover="ready"
                      className="group pressable relative flex flex-col gap-2.5 items-start w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-[24px] transition-opacity duration-200 ease-out"
                    >
                      <div
                        className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[20px] sm:rounded-[24px] shrink-0 w-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none"
                        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                      >
                        <div className="aspect-[16/10] relative isolate rounded-[20px] sm:rounded-[24px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${
                              nextP.gradient || "from-zinc-200 to-zinc-300"
                            } transition-opacity duration-200 ease-out`}
                          />

                          {nextP.image && (
                            <Image
                              src={nextP.image}
                              alt={nextP.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 360px"
                              className="absolute max-w-none object-contain size-full rounded-[20px] sm:rounded-[24px] transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none pointer-events-none z-10"
                              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                            />
                          )}

                          <div
                            aria-hidden="true"
                            className="absolute border border-black/10 inset-0 pointer-events-none rounded-[20px] sm:rounded-[24px] z-20"
                          />
                        </div>
                      </div>

                      <div className="flex items-baseline gap-1.5 px-1">
                        <span className="font-sans font-medium text-[#18181b] text-sm sm:text-base [@media(hover:hover)]:group-hover:text-black transition-colors duration-200">
                          {nextP.title}
                        </span>
                        <span className="text-[#a1a1aa] text-xs sm:text-sm font-sans font-normal [@media(hover:hover)]:group-hover:text-zinc-600 transition-colors duration-200">
                          • {nextP.year || "2025"}
                        </span>
                      </div>

                      {nextP.description && (
                        <div className="px-1 -mt-1">
                          <p className="font-sans text-xs sm:text-sm text-zinc-500 font-medium [@media(hover:hover)]:group-hover:text-black line-clamp-2 leading-relaxed text-pretty transition-colors duration-200">
                            <span
                              className="inline-block transition-transform duration-200 motion-reduce:transform-none [@media(hover:hover)]:group-hover:translate-x-0.5"
                              style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                            >
                              {nextP.description}
                            </span>
                          </p>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Centered View All Projects Pill Button */}
              <div className="flex justify-center pt-6 pb-2">
                <Link
                  href="/"
                  data-cuelume-hover="tick"
                  className="pressable inline-flex items-center justify-center px-6 py-2 rounded-full border border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-black/5 hover:border-black/20 text-xs sm:text-sm font-sans font-medium transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                >
                  View all projects
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
