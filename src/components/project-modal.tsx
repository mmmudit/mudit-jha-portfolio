"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { play } from "@/lib/sound";
import { ProjectCard } from "./project-card";

export type ProjectData = {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  year?: string;
  description: string;
  image?: string;
  gradient?: string;
  href?: string;
  actionText?: string;
  role?: string;
  timeline?: string;
  category?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
};

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
};

const SECTIONS = [
  { id: "sec-media", label: "Media Preview" },
  { id: "sec-overview", label: "Tagline & Intro" },
  { id: "sec-details", label: "Project Details" },
  { id: "sec-vision", label: "01. Vision" },
  { id: "sec-challenge", label: "02. Challenge" },
  { id: "sec-execution", label: "03. Execution" },
];

const CINEMATIC_GENTLE_EASE = [0.19, 1, 0.22, 1] as [number, number, number, number];

export function ProjectModal({ project: fallbackProject, activeCard: propActiveCard, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("sec-media");
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Normalize active card data from props
  const activeCard: ActiveProjectCardState | null = propActiveCard
    ? propActiveCard
    : fallbackProject
    ? {
        project: fallbackProject,
        origin: {
          top: typeof window !== "undefined" ? (window.innerHeight - 680) / 2 : 100,
          left: typeof window !== "undefined" ? (window.innerWidth - 940) / 2 : 100,
          width: 940,
          height: 680,
        },
        target: {
          top: typeof window !== "undefined" ? (window.innerHeight - 680) / 2 : 100,
          left: typeof window !== "undefined" ? (window.innerWidth - 940) / 2 : 100,
          width: 940,
          height: 680,
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
        handleClose();
        return;
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
  }, [activeCard, handleClose]);

  // Track active section on scroll inside modal
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - containerTop;
        if (relativeTop <= 120 && relativeTop + rect.height > 20) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      play("page", { volume: 0.35 });
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(id);
    }
  };

  if (!mounted || !activeCard) return null;

  const { project, origin, target } = activeCard;
  const gradientPreset = project.gradient || "from-zinc-200 to-zinc-300";

  // Slow & Savory Weighted Horizon Timings
  const openDuration = 0.88;
  const closeDuration = 0.92;

  const openTransition = {
    duration: openDuration,
    ease: CINEMATIC_GENTLE_EASE,
  };

  const closeTransition = {
    duration: closeDuration,
    ease: CINEMATIC_GENTLE_EASE,
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] pointer-events-auto select-none touch-none overscroll-contain"
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Backdrop Dimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={isClosing ? closeTransition : { duration: openDuration * 0.7, ease: CINEMATIC_GENTLE_EASE }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/45 backdrop-blur-[3px] cursor-pointer"
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
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
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
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  opacity: 0,
                  scale: 0.90,
                  filter: "blur(8px)",
                  position: "fixed",
                }
              : prefersReducedMotion
              ? {
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  opacity: isFlipped ? 1 : 0,
                  scale: isFlipped ? 1 : 0.96,
                  position: "fixed",
                }
              : {
                  top: isFlipped ? target.top : origin.top,
                  left: isFlipped ? target.left : origin.left,
                  width: isFlipped ? target.width : origin.width,
                  height: isFlipped ? target.height : origin.height,
                  opacity: 1,
                  scale: 1,
                  position: "fixed",
                }
          }
          transition={isClosing ? closeTransition : openTransition}
          onAnimationComplete={handleAnimationComplete}
          className="pointer-events-auto relative will-change-transform"
        >
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
            {/* FRONT FACE (Motion Blur during flight, exact ProjectCard design) */}
            <motion.div
              initial={{ opacity: 1, filter: "blur(0px)" }}
              animate={{
                opacity: isFlipped ? 0 : 1,
                filter: isFlipped ? "blur(4px)" : "blur(0px)",
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
                gradient={project.gradient}
                href={project.href}
                actionText={project.actionText}
              />

              {/* Specular Light Reflection Sweep on Flip */}
              {!prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: isFlipped ? [0, 0.45, 0] : 0,
                    x: isFlipped ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: openDuration * 0.9, ease: CINEMATIC_GENTLE_EASE }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-30"
                />
              )}
            </motion.div>

            {/* BACK FACE (100% Crisp Canonical Case Study Modal) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: isFlipped ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : openDuration * 0.45,
                delay: prefersReducedMotion ? 0 : isFlipped ? openDuration * 0.22 : 0,
                ease: CINEMATIC_GENTLE_EASE,
              }}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: prefersReducedMotion ? "none" : "rotateY(180deg)",
                pointerEvents: isFlipped ? "auto" : "none",
              }}
              className={`absolute inset-0 w-full h-full rounded-[28px] p-[1.5px] bg-gradient-to-br ${gradientPreset} shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden select-text`}
            >
              {/* Inner Modal Content Container */}
              <div className="relative flex flex-col size-full overflow-hidden rounded-[26.5px] bg-[#fbfaf5] text-zinc-800 text-left">
                {/* Modal Top Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-black/5 shrink-0 bg-[#fbfaf5] z-20">
                  <div className="flex items-center gap-2.5">
                    <h3
                      id="modal-project-title"
                      className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight"
                    >
                      {project.title}
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full">
                      {project.year || "2025"}
                    </span>
                  </div>

                  <button
                    ref={closeButtonRef}
                    onClick={handleClose}
                    data-cuelume-hover="tick"
                    data-cuelume-press
                    className="pressable p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 active:scale-[0.96] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer"
                    aria-label="Close modal [Esc]"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                {/* Main Body Grid Layout: Left Vertical Navigation Minimap & Right Scroll Content */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Left Side Vertical Navigation Minimap Sidebar (Desktop) */}
                  <aside className="hidden md:flex flex-col w-[210px] shrink-0 border-r border-black/5 p-6 justify-between bg-black/[0.015]">
                    <div className="space-y-4">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                        Navigation
                      </p>

                      {/* Vertical Line Marker Navigation List */}
                      <nav className="flex flex-col gap-1.5" aria-label="Modal section minimap navigation">
                        {SECTIONS.map((sec) => {
                          const isActive = activeSectionId === sec.id;
                          const isHovered = hoveredSectionId === sec.id;

                          return (
                            <button
                              key={sec.id}
                              onClick={() => scrollToSection(sec.id)}
                              onMouseEnter={() => setHoveredSectionId(sec.id)}
                              onMouseLeave={() => setHoveredSectionId(null)}
                              className="group flex items-center gap-3 py-1 cursor-pointer text-left focus:outline-none"
                            >
                              {/* Line Marker with spring expansion */}
                              <div className="relative flex items-center h-4 w-12 shrink-0">
                                <motion.div
                                  style={{ transformOrigin: "left center" }}
                                  animate={{
                                    scaleX: isActive ? 1 : isHovered ? 0.64 : 0.32,
                                    backgroundColor: isActive ? "#18181b" : isHovered ? "#52525b" : "#d4d4d8",
                                    opacity: isActive ? 1 : isHovered ? 0.85 : 0.6,
                                  }}
                                  transition={{ type: "spring", stiffness: 360, damping: 26 }}
                                  className="w-11 h-[2px] rounded-full"
                                />
                              </div>

                              {/* Section Label */}
                              <motion.span
                                animate={{
                                  x: isActive ? 3 : isHovered ? 2 : 0,
                                  color: isActive ? "#18181b" : isHovered ? "#3f3f46" : "#a1a1aa",
                                  fontWeight: isActive ? 600 : 400,
                                }}
                                transition={{ duration: 0.15 }}
                                className="text-xs font-mono tracking-tight whitespace-nowrap"
                              >
                                {sec.label}
                              </motion.span>
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
                        className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-black/5"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="size-3" />
                      </a>
                    )}
                  </aside>

                  {/* Right Side Scrollable Modal Content */}
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 scroll-smooth overscroll-contain"
                  >
                    {/* Section 0: Media Preview */}
                    <div
                      id="sec-media"
                      className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden bg-zinc-100 border border-black/5 shadow-sm scroll-mt-6"
                    >
                      {project.image ? (
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover size-full"
                          sizes="(max-width: 768px) 100vw, 760px"
                        />
                      ) : (
                        <div className={`size-full bg-gradient-to-br ${gradientPreset}`} />
                      )}
                    </div>

                    {/* Section 1: Tagline / Subtitle */}
                    <div id="sec-overview" className="scroll-mt-6">
                      <p className="font-display text-lg sm:text-xl font-medium leading-relaxed text-zinc-800 text-pretty">
                        {project.description}
                      </p>
                    </div>

                    {/* Section 2: Metadata Grid */}
                    <div
                      id="sec-details"
                      className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-black/5 scroll-mt-6"
                    >
                      <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Role
                        </p>
                        <p className="text-sm font-sans font-medium text-zinc-800">
                          {project.role || "Design Engineer"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Timeline
                        </p>
                        <p className="text-sm font-sans font-medium text-zinc-800">
                          {project.timeline || project.year || "2025"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Category
                        </p>
                        <p className="text-sm font-sans font-medium text-zinc-800">
                          {project.category || "Interface & System"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                          Live Link
                        </p>
                        {project.href && project.href !== "#" ? (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <span>Visit Site</span>
                            <ExternalLink className="size-3.5" />
                          </a>
                        ) : (
                          <span className="text-sm font-sans text-zinc-400 select-none">
                            Prototype
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Full Case Study Narrative Sections */}
                    <div className="space-y-8 pt-4 font-sans border-t border-black/5">
                      <div id="sec-vision" className="space-y-2.5 scroll-mt-6">
                        <h4 className="text-base font-semibold text-zinc-900 font-display">
                          01. Overview & Vision
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                          {project.overview ||
                            `${project.title} was built to explore tactile digital surfaces and fluid spatial physics. By combining physical material feedback with modern web animation standards, it turns routine interactions into memorable moments of delight.`}
                        </p>
                      </div>

                      <div id="sec-challenge" className="space-y-2.5 scroll-mt-6">
                        <h4 className="text-base font-semibold text-zinc-900 font-display">
                          02. The Design Challenge
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                          {project.challenge ||
                            "Traditional web interfaces often suffer from rigid layout transitions and generic hover states. The challenge was creating a responsive design system that feels physical, alive, and effortless across both desktop pointer devices and mobile touch viewports."}
                        </p>
                      </div>

                      <div id="sec-execution" className="space-y-2.5 scroll-mt-6">
                        <h4 className="text-base font-semibold text-zinc-900 font-display">
                          03. Craft & Execution
                        </h4>
                        <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                          {project.solution ||
                            "Implemented custom Framer Motion spring physics, OKLCH color token palettes, and subpixel optic typography scaling. Micro-interactions were tuned for zero latency and natural interruptibility."}
                        </p>
                      </div>
                    </div>

                    {/* Modal Footer Bar */}
                    <div className="flex items-center justify-between gap-3 pt-6 border-t border-black/5">
                      {project.href && project.href !== "#" ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pressable inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-sans text-sm font-medium hover:bg-zinc-800 shadow-sm transition-all"
                        >
                          <span>Visit Live Site</span>
                          <ExternalLink className="size-4" />
                        </a>
                      ) : (
                        <div />
                      )}

                      <button
                        onClick={handleClose}
                        className="pressable px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-800 font-sans text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
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
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-40 rounded-[28px]"
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
