"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { Maximize2, Minimize2, ExternalLink, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { play } from "@/lib/sound";
import { ProjectCard } from "./project-card";
import { CaseStudyRenderer } from "./case-study/CaseStudyRenderer";
import type { Project } from "@/types/project";

export type ProjectData = Project;

export interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface ActiveProjectCardState {
  project: ProjectData;
  origin: CardRect;
  target: CardRect;
}

export type ProjectModalProps = {
  project?: ProjectData | null;
  activeCard?: ActiveProjectCardState | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectProject?: (index: number) => void;
  projects?: ProjectData[];
  currentIndex?: number;
  totalCount?: number;
};

const DEFAULT_SECTIONS = [
  { id: "sec-overview", label: "Overview" },
  { id: "sec-details", label: "Details" },
  { id: "sec-vision", label: "Vision" },
  { id: "sec-challenge", label: "Challenge" },
  { id: "sec-execution", label: "Solution" },
  { id: "sec-reflection", label: "Reflection" },
];

const CINEMATIC_GENTLE_EASE = [0.19, 1, 0.22, 1] as [number, number, number, number];

export function ProjectModal({
  project: fallbackProject,
  activeCard: propActiveCard,
  onClose,
  onPrev,
  onNext,
  onSelectProject,
  projects,
  currentIndex = 0,
  totalCount,
}: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });
  const [activeSectionId, setActiveSectionId] = useState("sec-overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [timelineHoveredIdx, setTimelineHoveredIdx] = useState<number | null>(null);
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute next other projects for "Also check out..." section
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

  // Tinder Swipe Gesture Motion Values & Transforms
  const dragX = useMotionValue(0);
  const dragRotate = useTransform(dragX, [-260, 0, 260], [-8, 0, 8]);
  const dragScale = useTransform(dragX, [-260, 0, 260], [0.98, 1, 0.98]);
  const nextIndicatorOpacity = useTransform(dragX, [-90, -30, 0], [1, 0.7, 0]);
  const prevIndicatorOpacity = useTransform(dragX, [0, 30, 90], [0, 0.7, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 55;
    const velocityThreshold = 220;

    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      if (onNext) {
        play("page", { volume: 0.4 });
        onNext();
      }
    } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      if (onPrev) {
        play("page", { volume: 0.4 });
        onPrev();
      }
    }
  };

  // Normalize active card data from props
  const activeCard: ActiveProjectCardState | null = propActiveCard
    ? propActiveCard
    : fallbackProject
      ? {
        project: fallbackProject,
        origin: {
          top: typeof window !== "undefined" ? (window.innerHeight - Math.min(window.innerHeight <= 640 ? window.innerHeight - 36 : window.innerHeight * 0.88, 680)) / 2 : 100,
          left: typeof window !== "undefined" ? (window.innerWidth - Math.min(window.innerWidth <= 640 ? window.innerWidth - 24 : window.innerWidth * 0.92, 940)) / 2 : 100,
          width: typeof window !== "undefined" ? Math.min(window.innerWidth <= 640 ? window.innerWidth - 24 : window.innerWidth * 0.92, 940) : 940,
          height: typeof window !== "undefined" ? Math.min(window.innerHeight <= 640 ? window.innerHeight - 36 : window.innerHeight * 0.88, 680) : 680,
        },
        target: {
          top: typeof window !== "undefined" ? (window.innerHeight - Math.min(window.innerHeight <= 640 ? window.innerHeight - 36 : window.innerHeight * 0.88, 680)) / 2 : 100,
          left: typeof window !== "undefined" ? (window.innerWidth - Math.min(window.innerWidth <= 640 ? window.innerWidth - 24 : window.innerWidth * 0.92, 940)) / 2 : 100,
          width: typeof window !== "undefined" ? Math.min(window.innerWidth <= 640 ? window.innerWidth - 24 : window.innerWidth * 0.92, 940) : 940,
          height: typeof window !== "undefined" ? Math.min(window.innerHeight <= 640 ? window.innerHeight - 36 : window.innerHeight * 0.88, 680) : 680,
        },
      }
      : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle open / lock scrolling
  useEffect(() => {
    if (!activeCard) {
      setIsFlipped(false);
      setIsClosing(false);
      setIsFullScreen(false);
      return;
    }

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    setIsClosing(false);
    const frame = requestAnimationFrame(() => {
      setIsFlipped(true);
    });

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 120);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(focusTimer);
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [activeCard]);

  // Clean scroll position & section reset when switching projects
  const activeProjectId = activeCard?.project?._id || activeCard?.project?.id || activeCard?.project?.slug || activeCard?.project?.title;
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setActiveSectionId("sec-overview");
    setScrollProgress(0);
  }, [activeProjectId]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    play("droplet", { volume: 0.45 });
  }, [isClosing]);

  const handleAnimationComplete = useCallback(() => {
    if (isClosing) {
      onClose();
    }
  }, [isClosing, onClose]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!activeCard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (isFullScreen) {
          setIsFullScreen(false);
          play("droplet", { volume: 0.35 });
        } else {
          handleClose();
        }
        return;
      }

      // Next / Prev shortcuts: J / K / Left / Right
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === "ArrowRight" || e.key === "j" || e.key === "J") {
          e.preventDefault();
          onNext?.();
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K") {
          e.preventDefault();
          onPrev?.();
          return;
        }
      }

      // Trap Tab focus inside modal dialog
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCard, handleClose, onNext, onPrev]);

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

  const activeSections = React.useMemo(() => {
    const currentProject = activeCard?.project;
    if (currentProject?.caseStudy && currentProject.caseStudy.length > 0) {
      const items: { id: string; label: string }[] = [];
      for (let idx = 0; idx < currentProject.caseStudy.length; idx++) {
        const block = currentProject.caseStudy[idx];
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
  }, [activeCard?.project]);

  // Accurate, synced active section detection during container scrolling
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || activeSections.length === 0) return;

    // 0. Compute precise scroll progress ratio (0 to 1) for the bottom card progress bar
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(1, Math.max(0, container.scrollTop / maxScroll)));
    } else {
      setScrollProgress(0);
    }

    // 1. If at or near top of modal, activate the first section
    if (container.scrollTop < 120) {
      setActiveSectionId(activeSections[0].id);
      return;
    }

    // 2. If at bottom of modal, activate the last section
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 60;
    if (isAtBottom) {
      setActiveSectionId(activeSections[activeSections.length - 1].id);
      return;
    }

    // 3. Check section positions relative to upper portion of modal
    const containerRect = container.getBoundingClientRect();
    const threshold = Math.min(180, containerRect.height * 0.32);

    let currentActive = activeSections[0].id;
    for (const sec of activeSections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const elRect = el.getBoundingClientRect();
        const relativeTop = elRect.top - containerRect.top;
        if (relativeTop <= threshold) {
          currentActive = sec.id;
        }
      }
    }
    setActiveSectionId(currentActive);
  };

  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // If clicking first section or Overview, scroll directly to the top to see the hero & intro
    if (id === activeSections[0]?.id || id === "sec-hero") {
      play("page", { volume: 0.35 });
      container.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSectionId(activeSections[0]?.id || id);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      play("page", { volume: 0.35 });
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScrollTop = container.scrollTop + (elRect.top - containerRect.top) - 20;
      container.scrollTo({ top: Math.max(0, targetScrollTop), behavior: "smooth" });
      setActiveSectionId(id);
    }
  };

  if (!mounted || !activeCard) return null;

  const { project, origin, target } = activeCard;
  const gradientPreset = project.gradient || "from-zinc-200 to-zinc-300";

  // Dynamic responsive target recalibrated on viewport resize with expansive reading dimensions
  const dynamicTarget = {
    top: Math.max(12, (viewportSize.height - Math.min(viewportSize.height <= 640 ? viewportSize.height - 24 : viewportSize.height * 0.92, 900)) / 2),
    left: Math.max(10, (viewportSize.width - Math.min(viewportSize.width <= 640 ? viewportSize.width - 20 : viewportSize.width <= 1024 ? viewportSize.width * 0.94 : Math.min(1240, viewportSize.width * 0.92))) / 2),
    width: Math.min(viewportSize.width <= 640 ? viewportSize.width - 20 : viewportSize.width <= 1024 ? viewportSize.width * 0.94 : Math.min(1240, viewportSize.width * 0.92)),
    height: Math.min(viewportSize.height <= 640 ? viewportSize.height - 24 : viewportSize.height * 0.92, 900),
  };

  const currentTarget = isFullScreen
    ? { top: 0, left: 0, width: viewportSize.width, height: viewportSize.height }
    : (isFlipped ? dynamicTarget : target);

  // Transitions-Polish: Asymmetric Horizon Flip Timings
  // Open is an invitation (580ms weighted entrance); close gets out of the way (320ms crisp dismissal)
  const openDuration = 0.58;
  const closeDuration = 0.32;

  const openTransition = {
    duration: openDuration,
    ease: CINEMATIC_GENTLE_EASE,
  };

  const closeTransition = {
    duration: closeDuration,
    ease: CINEMATIC_GENTLE_EASE,
  };

  const springResizeTransition = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
  };

  const modalAnimationTransition = isClosing
    ? closeTransition
    : isFlipped
      ? {
          top: springResizeTransition,
          left: springResizeTransition,
          width: springResizeTransition,
          height: springResizeTransition,
          opacity: { duration: 0.25, ease: CINEMATIC_GENTLE_EASE },
          default: openTransition,
        }
      : openTransition;

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] pointer-events-auto select-none touch-none overscroll-contain"
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Backdrop Dimmer (Subtly lowers background opacity, 0 blur filters) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={isClosing ? { duration: 0.22, ease: CINEMATIC_GENTLE_EASE } : { duration: openDuration * 0.7, ease: CINEMATIC_GENTLE_EASE }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/15 cursor-pointer"
        aria-hidden="true"
      />

      {/* Pure Numeric Trajectory Container */}
      <div
        style={{ perspective: prefersReducedMotion ? "none" : "1400px" }}
        className="fixed inset-0 pointer-events-none"
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          initial={
            prefersReducedMotion
              ? {
                top: currentTarget.top,
                left: currentTarget.left,
                width: currentTarget.width,
                height: currentTarget.height,
                opacity: 0,
                scale: 0.96,
                position: "fixed",
              }
              : {
                top: origin.top,
                left: origin.left,
                width: origin.width,
                height: origin.height,
                opacity: 1,
                scale: 1,
                position: "fixed",
              }
          }
          animate={
            isClosing
              ? {
                top: currentTarget.top,
                left: currentTarget.left,
                width: currentTarget.width,
                height: currentTarget.height,
                opacity: 0,
                scale: 0.90,
                position: "fixed",
              }
              : prefersReducedMotion
                ? {
                  top: currentTarget.top,
                  left: currentTarget.left,
                  width: currentTarget.width,
                  height: currentTarget.height,
                  opacity: isFlipped ? 1 : 0,
                  scale: isFlipped ? 1 : 0.96,
                  position: "fixed",
                }
                : {
                  top: isFlipped ? currentTarget.top : origin.top,
                  left: isFlipped ? currentTarget.left : origin.left,
                  width: isFlipped ? currentTarget.width : origin.width,
                  height: isFlipped ? currentTarget.height : origin.height,
                  opacity: 1,
                  scale: 1,
                  position: "fixed",
                }
          }
          transition={modalAnimationTransition}
          onAnimationComplete={handleAnimationComplete}
          drag={isFullScreen ? false : "x"}
          dragDirectionLock
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.65}
          onDragEnd={handleDragEnd}
          style={{
            x: dragX,
            rotate: dragRotate,
            scale: dragScale,
          }}
          className="pointer-events-auto relative will-change-transform"
        >
          {/* Left / Prev Swipe Floating Indicator (Tinder Style) */}
          <motion.div
            style={{ opacity: prevIndicatorOpacity }}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none px-3 py-1.5 rounded-full bg-zinc-950/95 text-white font-mono text-xs font-semibold shadow-2xl flex items-center gap-1.5 border border-white/20 select-none"
          >
            <ChevronLeft className="size-4 text-emerald-400" />
            <span>Prev</span>
          </motion.div>

          {/* Right / Next Swipe Floating Indicator (Tinder Style) */}
          <motion.div
            style={{ opacity: nextIndicatorOpacity }}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none px-3 py-1.5 rounded-full bg-zinc-950/95 text-white font-mono text-xs font-semibold shadow-2xl flex items-center gap-1.5 border border-white/20 select-none"
          >
            <span>Next</span>
            <ChevronRight className="size-4 text-emerald-400" />
          </motion.div>
          {/* Inner 3D Flipper (Slow & Savory Horizon Flip) */}
          <motion.div
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: prefersReducedMotion
                ? 0
                : isClosing
                  ? 0
                  : isFlipped
                    ? 180
                    : 0,
            }}
            transition={isClosing ? { duration: closeDuration * 1.05, ease: CINEMATIC_GENTLE_EASE } : openTransition}
            style={{
              transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
              willChange: "transform",
            }}
            className="w-full h-full relative"
          >
            {/* FRONT FACE (exact ProjectCard design, 0 blur) */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{
                opacity: isFlipped ? 0 : 1,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : openDuration * 0.38,
                delay: prefersReducedMotion ? 0 : isFlipped ? openDuration * 0.08 : 0,
                ease: CINEMATIC_GENTLE_EASE,
              }}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                pointerEvents: isFlipped ? "none" : "auto",
              }}
              className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden bg-[#fbfaf5]"
            >
              <ProjectCard
                title={project.title}
                slug={project.slug}
                year={project.year}
                description={project.description}
                image={project.image}
                muxPlaybackId={project.muxPlaybackId || project.muxVideo?.playbackId}
                muxThumbTime={project.muxThumbTime ?? project.muxVideo?.thumbTime}
                gradient={project.gradient}
                href={project.href}
                actionText={project.actionText}
              />

              {/* Specular Light Reflection Sweep on Flip */}
              {!prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: isFlipped ? 0 : [0, 0.45, 0],
                    x: isFlipped ? "-100%" : ["-100%", "200%"],
                  }}
                  transition={{ duration: openDuration * 0.75, ease: CINEMATIC_GENTLE_EASE }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-30 rounded-[28px]"
                />
              )}
            </motion.div>

            {/* BACK FACE (100% Crisp Canonical Case Study Modal) */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: prefersReducedMotion ? "none" : "rotateY(180deg)",
                pointerEvents: isFlipped ? "auto" : "none",
              }}
              className={`absolute inset-0 w-full h-full flex flex-col overflow-hidden select-text transition-[border-radius] duration-500 ease-out ${isFullScreen ? "rounded-none" : "rounded-[22px] sm:rounded-[28px]"
                }`}
            >
              {/* Inner Modal Content Container */}
              <div
                className={`relative flex flex-col size-full overflow-hidden bg-[#fbfaf5] text-zinc-800 text-left transition-[border-radius] duration-500 ease-out ${isFullScreen ? "rounded-none" : "rounded-[22px] sm:rounded-[28px]"
                  }`}
              >
                {/* Mobile Drag Pill Handle */}
                <div className="sm:hidden pt-2.5 pb-0 flex justify-center items-center w-full shrink-0 bg-[#fbfaf5]">
                  <div className="w-9 h-1 rounded-full bg-zinc-300" />
                </div>

                {/* Modal Top Header */}
                <div className="relative flex items-center justify-between px-4 sm:px-6 pt-2.5 sm:pt-5 pb-3 sm:pb-4 shrink-0 bg-[#fbfaf5] z-20">
                  <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 overflow-hidden">
                    <AnimatePresence initial={false}>
                      {isFullScreen && (
                        <motion.div
                          key="fullscreen-breadcrumb"
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8, width: 0 }}
                          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0, width: "auto" }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -6, width: 0 }}
                          transition={{
                            duration: 0.32,
                            delay: prefersReducedMotion ? 0 : 0.58,
                            ease: [0.23, 1, 0.32, 1],
                          }}
                          className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 overflow-hidden"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setIsFullScreen(false);
                              play("droplet", { volume: 0.35 });
                            }}
                            data-cuelume-hover="tick"
                            className="pressable text-zinc-500 hover:text-zinc-900 font-display text-lg sm:text-2xl font-normal transition-colors cursor-pointer shrink-0"
                            title="Restore from full screen"
                            aria-label="Back to Work"
                          >
                            Work
                          </button>

                          <ChevronRight className="size-4 sm:size-4.5 text-zinc-400 shrink-0 stroke-[2]" aria-hidden="true" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Smooth directional slide from left on project flip with zero awkward readjustment */}
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={project._id || project.slug || project.id || project.title}
                        initial={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: -20 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { opacity: 1 }
                            : { opacity: 1, x: 0 }
                        }
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0 }
                            : { opacity: 0, x: 16 }
                        }
                        transition={{
                          duration: 0.28,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="flex items-center gap-2 min-w-0"
                      >
                        <h3
                          id="modal-project-title"
                          className="font-display text-lg sm:text-2xl font-semibold text-zinc-800 tracking-tight truncate max-w-[140px] sm:max-w-none"
                        >
                          {project.title}
                        </h3>

                        <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full shrink-0">
                          {project.year || "2025"}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                    {/* Caleb Wu Style Project Avatar Stack Navigation Pill */}
                    {projects && projects.length > 1 && (
                      <nav
                        className="group/pill flex items-center gap-1 sm:gap-2.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white border border-black/10 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-200 select-none"
                        aria-label="Project switcher"
                      >
                        {/* Status Count e.g. "1 of 6" (hidden on small mobile to fit) */}
                        <span className="hidden sm:inline text-[12px] sm:text-[13px] font-sans font-normal text-zinc-500 tracking-tight whitespace-nowrap pl-0.5">
                          {(currentIndex ?? 0) + 1} of {projects.length}
                        </span>

                        {/* Interactive Overlapping Avatar Icons */}
                        <div className="flex items-center -space-x-2 group-hover/pill:-space-x-0.5 transition-[margin,gap] duration-200 ease-out pl-0.5">
                          {projects.map((p, idx) => {
                            const isActive = (currentIndex ?? 0) === idx;
                            const isHovered = hoveredAvatarIdx === idx;
                            const title = p.title || `Project ${idx + 1}`;
                            const projectIcon = p.navIcon || p.icon || p.image;
                            return (
                              <div key={p._id || p.id || p.slug || idx} className="relative flex items-center justify-center">
                                {/* Hover Preview Tooltip Pill in SmartLinkPreview Paper Style */}
                                <AnimatePresence>
                                  {isHovered && (
                                    <motion.div
                                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -2, scale: 0.98, transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] } }}
                                      transition={{ duration: 0.15, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                                      className="absolute top-full mt-3 z-50 pointer-events-none"
                                    >
                                      <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-zinc-950 bg-[#fffdfa] shadow-[3px_3px_0px_#18181b] whitespace-nowrap will-change-transform select-none">
                                        {/* Top Pointer Tail */}
                                        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]" />
                                        <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#fffdfa]" />

                                        {/* Icon Thumbnail */}
                                        {projectIcon && (
                                          <div className="relative size-3.5 rounded-full overflow-hidden border border-zinc-950/20 shrink-0">
                                            <Image src={projectIcon} alt="" fill sizes="16px" className="object-cover" />
                                          </div>
                                        )}

                                        {/* Project Title */}
                                        <span className="font-mono text-[12px] font-bold text-zinc-950 tracking-tight">
                                          {title}
                                        </span>

                                        {/* Keyboard Shortcut Indicator */}
                                        <span className="font-mono text-[10px] text-zinc-400 font-medium tracking-tight">
                                          [{idx + 1}]
                                        </span>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                <button
                                  type="button"
                                  onClick={() => {
                                    play("page", { volume: 0.35 });
                                    onSelectProject?.(idx);
                                  }}
                                  onMouseEnter={() => setHoveredAvatarIdx(idx)}
                                  onMouseLeave={() => setHoveredAvatarIdx(null)}
                                  onFocus={() => setHoveredAvatarIdx(idx)}
                                  onBlur={() => setHoveredAvatarIdx(null)}
                                  title={`${title} [${idx + 1}]`}
                                  aria-label={`Switch to ${title}`}
                                  aria-current={isActive ? "true" : undefined}
                                  className={`relative size-5 sm:size-[26px] rounded-full overflow-hidden border-[1.5px] transition-all duration-200 ease-out cursor-pointer ${isActive
                                    ? "grayscale-0 opacity-100 border-[#c8d5bb] ring-2 ring-[#c8d5bb] scale-105 z-20 shadow-xs bg-white"
                                    : "grayscale opacity-45 border-white bg-zinc-100 hover:grayscale-0 hover:opacity-100 hover:scale-115 hover:z-30"
                                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8d5bb]`}
                                >
                                  {projectIcon ? (
                                    <Image
                                      src={projectIcon}
                                      alt={title}
                                      fill
                                      sizes="32px"
                                      className="size-full object-cover pointer-events-none"
                                    />
                                  ) : (
                                    <div
                                      className={`size-full bg-gradient-to-br ${p.gradient || "from-zinc-300 to-zinc-400"
                                        } flex items-center justify-center font-mono text-[9px] font-bold text-zinc-700`}
                                    >
                                      {title.charAt(0)}
                                    </div>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </nav>
                    )}

                    {!isFullScreen && (
                      <button
                        ref={closeButtonRef}
                        onClick={() => {
                          play("bloom", { volume: 0.45 });
                          setIsFullScreen(true);
                        }}
                        data-cuelume-hover="tick"
                        className="pressable p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 active:scale-[0.96] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer"
                        aria-label="Expand to full screen"
                        title="Expand to full screen"
                      >
                        <Maximize2 className="size-5 transition-transform duration-200" />
                      </button>
                    )}
                  </div>

                  {/* Willow Scroll Progress Bar (Directly Under Header, Mobile & Desktop) */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[2px] sm:h-[2.5px] bg-black/[0.04] overflow-hidden pointer-events-none"
                  >
                    <div
                      className="h-full bg-[#c8d5bb] shadow-[0_0_8px_rgba(200,213,187,0.8)]"
                      style={{
                        transform: `scaleX(${scrollProgress})`,
                        transformOrigin: "left",
                        transition: "transform 100ms ease-out",
                      }}
                    />
                  </div>
                </div>

                {/* Main Body Grid Layout: Left Vertical Navigation Minimap & Right Scroll Content */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Side Vertical Navigation Minimap Sidebar (Desktop) */}
                  <aside className="hidden md:flex flex-col w-[215px] shrink-0 p-4 sm:p-6 justify-between overflow-y-auto max-h-full">
                    <div className="space-y-4">
                      {/* Back button (Only visible in full-screen expanded mode) */}
                      {isFullScreen && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsFullScreen(false);
                            play("droplet", { volume: 0.35 });
                          }}
                          data-cuelume-hover="tick"
                          className="pressable group inline-flex items-center gap-1.5 text-xs font-mono font-medium tracking-wider text-zinc-500 hover:text-zinc-900 uppercase transition-colors cursor-pointer select-none mb-3"
                          title="Restore from full screen"
                          aria-label="Back"
                        >
                          <ArrowLeft className="size-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
                          <span>BACK</span>
                        </button>
                      )}

                      {/* Optical Lens Precision Motion Timeline */}
                      <nav
                        className="relative flex flex-col gap-2.5 sm:gap-3 select-none py-1"
                        aria-label="Case study section navigation"
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
                          const fontSize = 11.5 + lensScale * 1.5;
                          const opacity = isActive ? 1 : 0.45 + lensScale * 0.45;

                          return (
                            <button
                              key={sec.id}
                              type="button"
                              onMouseEnter={() => setTimelineHoveredIdx(idx)}
                              onClick={() => scrollToSection(sec.id)}
                              data-cuelume-hover="tick"
                              className="group relative flex items-center w-full text-left py-1 cursor-pointer select-none focus-visible:outline-none"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {/* Willow Green Square Chip Marker (■) */}
                                <div className="w-2.5 flex items-center justify-center shrink-0">
                                  <motion.div
                                    initial={false}
                                    animate={{
                                      scale: isActive ? 1 : isHovered ? 0.7 : 0,
                                      opacity: isActive ? 1 : isHovered ? 0.6 : 0,
                                      backgroundColor: isActive ? "#c8d5bb" : "#dce5d2",
                                    }}
                                    transition={{ type: "spring", stiffness: 480, damping: 32 }}
                                    className="size-2 rounded-[1.5px] border border-[#aebd9d]/50 shadow-2xs"
                                  />
                                </div>

                                {/* Optical Scale Typography (Uppercase with wide tracking) */}
                                <motion.span
                                  animate={{
                                    fontSize: `${fontSize}px`,
                                    opacity: opacity,
                                    x: isActive ? 1 : 0,
                                    fontWeight: isActive ? 600 : 450,
                                  }}
                                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                  className={`font-sans uppercase tracking-[0.08em] truncate transition-colors duration-150 ${
                                    isActive
                                      ? "text-[#7a926d] font-semibold"
                                      : "text-[#7f7f80] group-hover:text-zinc-800"
                                  }`}
                                >
                                  {sec.label}
                                </motion.span>
                              </div>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    {/* Sidebar Footer Link */}
                    {project.href && project.href !== "#" && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-zinc-600 hover:text-zinc-900 transition-colors pt-4"
                      >
                        <span>Visit Live Site</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </aside>

                  {/* Right Side Scrollable Modal Content */}
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 p-4 sm:p-7 md:p-10 lg:p-12 overflow-y-auto space-y-6 sm:space-y-8 scroll-smooth overscroll-contain touch-auto"
                  >
                    {/* Render Dynamic Structured Case Study Content */}
                    <CaseStudyRenderer project={project} />

                    {/* View Next Section ("Also check out...") */}
                    {otherProjects.length > 0 && (
                      <div className="pt-8 sm:pt-12 pb-4 space-y-5 sm:space-y-6">
                        <p className="text-zinc-500 font-sans text-sm sm:text-base font-normal tracking-tight italic">
                          psst... here's more cool stuff...
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                          {otherProjects.map(({ project: nextP, index: nextIdx }) => {
                            if (!nextP) return null;
                            return (
                              <button
                                key={nextP._id || nextP.id || nextIdx}
                                type="button"
                                onClick={() => {
                                  play("page", { volume: 0.35 });
                                  onSelectProject?.(nextIdx);
                                  scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                data-cuelume-hover="ready"
                                className="group pressable relative flex flex-col gap-2.5 items-start w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-[24px] transition-opacity duration-200 ease-out"
                              >
                                {/* Aspect Ratio Media Container with Home Card Hover Scale & Physics */}
                                <div
                                  className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[20px] sm:rounded-[24px] shrink-0 w-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none"
                                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                                >
                                  <div className="aspect-[16/10] relative isolate rounded-[20px] sm:rounded-[24px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]">
                                    {/* Fallback gradient */}
                                    <div
                                      className={`absolute inset-0 bg-gradient-to-br ${nextP.gradient || "from-zinc-200 to-zinc-300"
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

                                    {/* Inner border stroke overlay */}
                                    <div
                                      aria-hidden="true"
                                      className="absolute border border-black/10 inset-0 pointer-events-none rounded-[20px] sm:rounded-[24px] z-20"
                                    />
                                  </div>
                                </div>

                                {/* Title & Year with Hover Colors */}
                                <div className="flex items-baseline gap-1.5 px-1">
                                  <span className="font-sans font-medium text-[#18181b] text-sm sm:text-base [@media(hover:hover)]:group-hover:text-black transition-colors duration-200">
                                    {nextP.title}
                                  </span>
                                  <span className="text-[#a1a1aa] text-xs sm:text-sm font-sans font-normal [@media(hover:hover)]:group-hover:text-zinc-600 transition-colors duration-200">
                                    • {nextP.year || "2025"}
                                  </span>
                                </div>

                                {/* Description with Hover Slide & Contrast Shift */}
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
                              </button>
                            );
                          })}
                        </div>

                        {/* Centered View All Projects Pill Button */}
                        <div className="flex justify-center pt-3 pb-2">
                          <button
                            type="button"
                            onClick={handleClose}
                            data-cuelume-hover="tick"
                            className="pressable inline-flex items-center justify-center px-6 py-2 rounded-full border border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-black/5 hover:border-black/20 text-xs sm:text-sm font-sans font-medium transition-all shadow-2xs active:scale-[0.98] cursor-pointer"
                          >
                            View all projects
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Specular Light Reflection Sweep on Arrival */}
              {!prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: isFlipped ? [0, 0.35, 0] : 0,
                    x: isFlipped ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: openDuration * 0.85, delay: openDuration * 0.25, ease: CINEMATIC_GENTLE_EASE }}
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-40 transition-[border-radius] duration-500 ${isFullScreen ? "rounded-none" : "rounded-[28px]"
                    }`}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
