"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, Check, Sliders, Activity, Disc, Sparkles } from "lucide-react";
import Link from "next/link";
import { CLARITY_PROJECT } from "@/data/projects";
import { CaseStudyRenderer } from "@/components/case-study/CaseStudyRenderer";
import { play } from "@/lib/sound";

interface TimelineSection {
  id: string;
  label: string;
  number: string;
  code: string;
}

const SECTIONS: TimelineSection[] = [
  { id: "sec-overview", label: "Overview", number: "01", code: "OVR" },
  { id: "sec-problem", label: "The Problem", number: "02", code: "PRB" },
  { id: "sec-idea", label: "The Idea", number: "03", code: "IDA" },
  { id: "sec-core-experience", label: "Core Experience", number: "04", code: "EXP" },
  { id: "sec-making-invisible-visible", label: "Visualizing State", number: "05", code: "VIS" },
  { id: "sec-beyond-app", label: "Beyond The App", number: "06", code: "APP" },
  { id: "sec-privacy", label: "Privacy", number: "07", code: "PRV" },
  { id: "sec-final-experience", label: "Final Experience", number: "08", code: "FIN" },
  { id: "sec-reflection", label: "Reflection", number: "09", code: "REF" },
];

/* =========================================================================
   VARIANT 1: ACOUSTIC WAVE (Soundwave / Frequency Harmonics)
   ========================================================================= */
function AcousticWaveTimeline({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === activeId));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className="relative flex flex-col py-2 select-none" aria-label="Acoustic Wave Timeline">
      <div className="flex flex-col gap-2">
        {SECTIONS.map((sec, idx) => {
          const isActive = sec.id === activeId;
          const isPassed = idx < activeIdx;
          const isHovered = hoveredIdx === idx;
          const dist = hoveredIdx !== null ? Math.abs(idx - hoveredIdx) : Math.abs(idx - activeIdx);

          // Wave amplitude
          const barWidth = isActive
            ? 20
            : isHovered
              ? 18
              : dist === 1
                ? 12
                : dist === 2
                  ? 8
                  : 5;

          return (
            <button
              key={sec.id}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelect(sec.id)}
              className="group flex items-center gap-3 text-left py-1 cursor-pointer select-none focus-visible:outline-none"
            >
              {/* Multi-frequency tick line */}
              <div className="w-6 flex items-center justify-start shrink-0">
                <motion.div
                  initial={false}
                  animate={{
                    width: barWidth,
                    backgroundColor: isActive
                      ? "#37522d"
                      : isHovered
                        ? "#18181b"
                        : isPassed
                          ? "#52525b"
                          : "#d4d4d8",
                    height: isActive ? 3 : 2,
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  className="rounded-full shadow-2xs"
                />
              </div>

              {/* Label */}
              <motion.div
                animate={{
                  x: isActive ? 3 : 0,
                  opacity: isActive ? 1 : isHovered ? 0.9 : isPassed ? 0.6 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className="flex items-baseline gap-2 min-w-0"
              >
                <span
                  className={`text-[13px] tracking-tight truncate transition-colors duration-150 ${
                    isActive ? "text-zinc-950 font-semibold" : "text-zinc-800 group-hover:text-zinc-950"
                  }`}
                >
                  {sec.label}
                </span>

                {isPassed && (
                  <span className="text-[10px] font-mono text-[#37522d] font-semibold opacity-90">
                    ✓
                  </span>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================================
   VARIANT 2: OPTICAL LENS (Apple Crown / Continuous Fisheye Magnification)
   ========================================================================= */
function OpticalLensTimeline({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === activeId));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className="relative flex flex-col py-2 select-none pl-1" aria-label="Optical Lens Timeline">
      <div className="flex flex-col gap-2">
        {SECTIONS.map((sec, idx) => {
          const isActive = sec.id === activeId;
          const isPassed = idx < activeIdx;
          const isHovered = hoveredIdx === idx;
          const focusIndex = hoveredIdx !== null ? hoveredIdx : activeIdx;
          const distance = Math.abs(idx - focusIndex);

          // Optical Gaussian lens formula
          const lensScale = Math.max(0, 1 - distance * 0.28);
          const tickWidth = 4 + lensScale * 14;
          const fontSize = 12 + lensScale * 2;
          const opacity = isActive ? 1 : 0.3 + lensScale * 0.6;

          return (
            <button
              key={sec.id}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelect(sec.id)}
              className="group flex items-center gap-3 text-left py-1 cursor-pointer select-none focus-visible:outline-none"
            >
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
                  isActive ? "text-zinc-950 font-semibold" : "text-zinc-800 group-hover:text-zinc-950"
                }`}
              >
                {sec.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================================
   VARIANT 3: KINETIC GAUGE (Expanding Precision Metric Bar & Rolling Digit)
   ========================================================================= */
function KineticGaugeTimeline({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === activeId));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className="relative flex flex-col py-2 select-none" aria-label="Kinetic Gauge Timeline">
      <div className="flex flex-col gap-1.5">
        {SECTIONS.map((sec, idx) => {
          const isActive = sec.id === activeId;
          const isPassed = idx < activeIdx;
          const isHovered = hoveredIdx === idx;

          return (
            <button
              key={sec.id}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelect(sec.id)}
              className="group flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors duration-150 cursor-pointer select-none text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Horizontal Expansion Gauge */}
                <motion.div
                  initial={false}
                  animate={{
                    width: isActive ? 24 : isHovered ? 16 : isPassed ? 10 : 6,
                    backgroundColor: isActive
                      ? "#37522d"
                      : isHovered
                        ? "#18181b"
                        : isPassed
                          ? "#71717a"
                          : "#d4d4d8",
                  }}
                  transition={{ type: "spring", stiffness: 460, damping: 30 }}
                  className="h-[2px] rounded-full shrink-0"
                />

                <span
                  className={`text-[12.5px] tracking-tight truncate transition-colors duration-150 ${
                    isActive
                      ? "text-zinc-950 font-semibold"
                      : isPassed
                        ? "text-zinc-700 font-normal group-hover:text-zinc-950"
                        : "text-zinc-400 font-normal group-hover:text-zinc-800"
                  }`}
                >
                  {sec.label}
                </span>
              </div>

              {/* Mono Index Badge */}
              <span
                className={`font-mono text-[10px] shrink-0 transition-colors duration-150 ${
                  isActive
                    ? "text-[#37522d] font-bold"
                    : isPassed
                      ? "text-zinc-400"
                      : "text-zinc-300 group-hover:text-zinc-400"
                }`}
              >
                {isPassed ? "✓" : sec.number}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================================
   VARIANT 4: MAGNETIC DOT-BAR (Elastic Bead & Tethered Snap)
   ========================================================================= */
function MagneticDotBarTimeline({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const activeIdx = Math.max(0, SECTIONS.findIndex((s) => s.id === activeId));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <nav className="relative flex flex-col py-2 select-none pl-3" aria-label="Magnetic Dot-Bar Timeline">
      {/* Background Micro Guide Track */}
      <div className="absolute left-[3px] top-4 bottom-4 w-[1px] bg-black/[0.06]" />

      <div className="flex flex-col gap-2 relative">
        {SECTIONS.map((sec, idx) => {
          const isActive = sec.id === activeId;
          const isPassed = idx < activeIdx;
          const isHovered = hoveredIdx === idx;

          return (
            <button
              key={sec.id}
              type="button"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelect(sec.id)}
              className="group relative flex items-center text-left py-1 cursor-pointer select-none focus-visible:outline-none"
            >
              {/* Elastic Magnetic Bead Snap */}
              <div className="absolute -left-3 flex items-center justify-center size-3">
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: isActive ? 2.6 : isHovered ? 1.8 : 1,
                    scaleY: isActive ? 0.85 : 1,
                    backgroundColor: isActive
                      ? "#37522d"
                      : isHovered
                        ? "#18181b"
                        : isPassed
                          ? "#37522d"
                          : "#d4d4d8",
                  }}
                  transition={{ type: "spring", stiffness: 520, damping: 28 }}
                  className="size-1.5 rounded-full origin-left shadow-2xs"
                />
              </div>

              {/* Label */}
              <motion.div
                animate={{
                  x: isActive ? 6 : isHovered ? 3 : 0,
                  opacity: isActive ? 1 : isHovered ? 0.9 : isPassed ? 0.6 : 0.35,
                }}
                transition={{ type: "spring", stiffness: 440, damping: 28 }}
                className="flex items-center justify-between w-full pr-2"
              >
                <span
                  className={`text-[12.5px] truncate transition-colors duration-150 ${
                    isActive
                      ? "text-zinc-950 font-semibold"
                      : "text-zinc-800 font-normal group-hover:text-zinc-950"
                  }`}
                >
                  {sec.label}
                </span>

                {isPassed && (
                  <span className="text-[10px] font-mono text-[#37522d] font-semibold opacity-80">
                    ✓
                  </span>
                )}
              </motion.div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================================
   PROTOTYPE HARNESS WITH EXACT PICKER.MD CHROMES
   ========================================================================= */
export default function TimelinePrototypePage() {
  const [variant, setVariant] = useState<0 | 1 | 2 | 3>(0);
  const [activeSectionId, setActiveSectionId] = useState("sec-overview");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  const variantNames = [
    "Acoustic Wave",
    "Optical Lens",
    "Kinetic Gauge",
    "Magnetic Dot-Bar",
  ];

  // Precision coordinate scroll tracking inside mock case study
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 100) {
      setActiveSectionId(SECTIONS[0].id);
      return;
    }

    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 60;
    if (isAtBottom) {
      setActiveSectionId(SECTIONS[SECTIONS.length - 1].id);
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const threshold = Math.min(180, containerRect.height * 0.32);

    let currentActive = SECTIONS[0].id;
    for (const sec of SECTIONS) {
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
  }, []);

  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (id === SECTIONS[0].id) {
      play("page", { volume: 0.35 });
      container.scrollTo({ top: 0, behavior: "smooth" });
      setActiveSectionId(id);
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

  // Move highlight on picker
  const moveHighlight = useCallback(() => {
    if (!pickerRef.current || !highlightRef.current) return;
    const items = pickerRef.current.querySelectorAll<HTMLButtonElement>(
      ".proto-picker-item:not(.proto-picker-replay)"
    );
    const el = items[variant];
    if (el) {
      highlightRef.current.style.width = `${el.offsetWidth}px`;
      highlightRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, [variant]);

  useEffect(() => {
    moveHighlight();
    const timer = setTimeout(() => {
      pickerRef.current?.setAttribute("data-ready", "");
    }, 50);
    return () => clearTimeout(timer);
  }, [moveHighlight]);

  useEffect(() => {
    window.addEventListener("resize", moveHighlight);
    return () => window.removeEventListener("resize", moveHighlight);
  }, [moveHighlight]);

  // Keyboard navigation for picker (1-4, arrows, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 4) {
        setVariant((num - 1) as 0 | 1 | 2 | 3);
      } else if (e.key === "ArrowRight") {
        setVariant((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3);
      } else if (e.key === "ArrowLeft") {
        setVariant((prev) => ((prev - 1 + 4) % 4) as 0 | 1 | 2 | 3);
      } else if (e.key === "r" || e.key === "R") {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSectionId(SECTIONS[0].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f3ed] text-zinc-900 flex flex-col items-center p-4 sm:p-8 pb-32">
      {/* Header bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>PORTFOLIO</span>
        </Link>
        <span className="font-mono text-xs text-zinc-400">
          PROTOTYPE · MAGNETIC THREAD EXPLORATIONS
        </span>
      </div>

      {/* Main Prototype Card Canvas (Simulating Live Modal Layout) */}
      <div className="w-full max-w-5xl rounded-[28px] bg-[#fbfaf5] border border-black/8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col h-[82vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-[#fbfaf5] z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-xl font-semibold text-zinc-900">
              Clarity
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-mono uppercase bg-zinc-200/70 text-zinc-700 rounded-full font-medium">
              2026
            </span>
          </div>

          <div className="font-mono text-xs text-[#37522d] font-semibold bg-[#c8d5bb]/30 px-3 py-1 rounded-full">
            Active: {variantNames[variant]}
          </div>
        </div>

        {/* Split Layout: Left Timeline Sidebar & Right Scroll Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Minimalist Timeline Sidebar Container */}
          <aside className="w-[215px] shrink-0 border-r border-black/5 p-4 sm:p-5 bg-black/[0.012] overflow-y-auto">
            {variant === 0 && (
              <AcousticWaveTimeline
                activeId={activeSectionId}
                onSelect={scrollToSection}
              />
            )}
            {variant === 1 && (
              <OpticalLensTimeline
                activeId={activeSectionId}
                onSelect={scrollToSection}
              />
            )}
            {variant === 2 && (
              <KineticGaugeTimeline
                activeId={activeSectionId}
                onSelect={scrollToSection}
              />
            )}
            {variant === 3 && (
              <MagneticDotBarTimeline
                activeId={activeSectionId}
                onSelect={scrollToSection}
              />
            )}
          </aside>

          {/* Right Scrollable Case Study Body */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 p-6 sm:p-10 overflow-y-auto scroll-smooth overscroll-contain"
          >
            <CaseStudyRenderer project={CLARITY_PROJECT} />
          </div>
        </div>
      </div>

      {/* EXACT VERBATIM PICKER.MD HARNESS */}
      <nav ref={pickerRef} className="proto-picker" aria-label="Prototype variants">
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {variantNames.map((name, i) => (
          <button
            key={name}
            type="button"
            onClick={() => setVariant(i as 0 | 1 | 2 | 3)}
            data-active={variant === i ? "" : undefined}
            aria-current={variant === i ? "true" : undefined}
            className="proto-picker-item"
          >
            {name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          onClick={() => {
            scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSectionId(SECTIONS[0].id);
          }}
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          title="Replay top scroll (R)"
        >
          ↻
        </button>
      </nav>
    </div>
  );
}
