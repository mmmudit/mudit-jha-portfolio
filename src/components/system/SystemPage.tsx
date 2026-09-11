"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Type,
  Layers,
  CircleDot,
  Maximize2,
  Sparkles,
  Zap,
  Component,
  ChevronRight,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { play } from "@/lib/sound";
import { type TokenTag } from "./tokens";
import { ColorSection } from "./sections/ColorSection";
import { TypographySection } from "./sections/TypographySection";
import { ShadowSection } from "./sections/ShadowSection";
import { RadiusSection } from "./sections/RadiusSection";
import { SpacingSection } from "./sections/SpacingSection";
import { EffectsSection } from "./sections/EffectsSection";
import { MotionSection } from "./sections/MotionSection";
import { ComponentSection } from "./sections/ComponentSection";

interface SectionNav {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionNav[] = [
  { id: "colors", label: "01. COLOR TOKENS", icon: Palette },
  { id: "typography", label: "02. TYPOGRAPHY", icon: Type },
  { id: "shadows", label: "03. SHADOWS", icon: Layers },
  { id: "radius", label: "04. RADIUS & SHAPES", icon: CircleDot },
  { id: "spacing", label: "05. SPACING & RULERS", icon: Maximize2 },
  { id: "effects", label: "06. MATERIALS & EFFECTS", icon: Sparkles },
  { id: "motion", label: "07. MOTION & PHYSICS", icon: Zap },
  { id: "components", label: "08. LIVE COMPONENTS", icon: Component },
];

const FILTER_OPTIONS = [
  { id: "all", label: "All Tokens" },
  { id: "canonical", label: "Canonical Only" },
  { id: "one-off", label: "One-Off Exceptions" },
  { id: "experiment", label: "Experiments" },
];

export function SystemPage() {
  const [activeSection, setActiveSection] = useState<string>("colors");
  const [filterTag, setFilterTag] = useState<TokenTag | "all">("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [timelineHoveredIdx, setTimelineHoveredIdx] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Instant scroll to top on entering design system page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // IntersectionObserver for performant scroll-spy
  useEffect(() => {
    let obs: IntersectionObserver | null = null;

    const timer = setTimeout(() => {
      const handleIntersect: IntersectionObserverCallback = (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      };

      obs = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      });
      observerRef.current = obs;

      SECTIONS.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (el) {
          obs?.observe(el);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (obs) {
        obs.disconnect();
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  return (
    <div className="w-full min-h-screen pb-32 bg-white px-6 sm:px-12 pt-6">
      {/* Top Header Breadcrumb & Right Filter Button */}
      <header className="mb-10 pt-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-6">
        {/* Left: Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-2xl sm:text-3xl font-sans tracking-tight">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-900 font-normal transition-colors cursor-pointer select-none"
          >
            Work
          </Link>
          <ChevronRight className="size-5 sm:size-6 text-zinc-300 stroke-[1.75] shrink-0" />
          <span className="font-normal text-zinc-900">Design System</span>
          <span className="text-zinc-300 font-normal">/</span>
          <span className="font-normal text-zinc-900">muditjha.me</span>
          <span className="ml-0.5 inline-flex items-center px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-xs sm:text-sm font-normal tracking-normal select-none">
            2026
          </span>
        </div>

        {/* Right: Global Filter Pill Dropdown (About Page Style) */}
        <div className="relative inline-block select-none">
          <button
            type="button"
            onClick={() => {
              play("toggle", { volume: 0.3 });
              setIsFilterOpen(!isFilterOpen);
            }}
            className="pressable inline-flex items-center gap-2 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/60 px-3.5 py-1.5 text-xs sm:text-[13px] font-mono font-medium tracking-wide uppercase text-[#8a7c64] hover:border-[#b8a786] hover:text-zinc-900 hover:bg-[#f3eedf]/50 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d0bb] cursor-pointer"
            aria-expanded={isFilterOpen}
            aria-haspopup="listbox"
          >
            <span className="opacity-70 font-normal">FILTER:</span>
            <span className="text-zinc-900 font-semibold">
              {FILTER_OPTIONS.find((o) => o.id === filterTag)?.label || "ALL TOKENS"}
            </span>
            <ChevronsUpDown className="size-3.5 opacity-70 ml-0.5" />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <>
                {/* Backdrop closer */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsFilterOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: -4 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 4,
                    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.99,
                    y: -4,
                    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="absolute right-0 top-full z-50 mt-1 min-w-[200px] overflow-hidden rounded-xl border border-[#d9d0bb] bg-[#fbfaf5] p-1 shadow-lg shadow-black/5 backdrop-blur-md"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        if (opt.id !== filterTag) {
                          play("loading", { volume: 0.35 });
                        } else {
                          play("toggle", { volume: 0.35 });
                        }
                        setFilterTag(opt.id as TokenTag | "all");
                        setIsFilterOpen(false);
                      }}
                      className="pressable flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-mono font-medium tracking-wide uppercase text-zinc-700 hover:bg-[#eae3d2]/60 hover:text-zinc-900 active:scale-[0.98] transition-[color,background-color,transform] duration-150 ease-out cursor-pointer"
                    >
                      <span>{opt.label}</span>
                      {filterTag === opt.id && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Check className="size-3.5 text-zinc-800" />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Overview */}
      <div className="mb-10 max-w-3xl">
        <p className="font-sans text-base text-zinc-500 leading-relaxed text-pretty max-w-2xl">
          Visual design tokens, typography scales, paper shadows, squircle radii, material shaders, and live component specifications.
        </p>
      </div>

      {/* Mobile Horizontal Scrollable Chip Strip */}
      <div className="lg:hidden sticky top-0 z-40 mb-8 -mx-6 px-6 py-2.5 bg-white/90 backdrop-blur-md border-y border-zinc-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#c8d5bb] text-zinc-900 font-semibold shadow-xs border border-[#b8a786]"
                    : "bg-zinc-100 text-zinc-600 font-normal hover:bg-zinc-200 border border-zinc-200"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Desktop Sticky Timeline Sidebar + Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Optical Lens Precision Motion Timeline (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-12 flex flex-col gap-3">
            {/* Header Tag */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-100">
              <span className="font-mono text-xs font-semibold text-zinc-900 tracking-wide uppercase">
                SYSTEM TIMELINE
              </span>
            </div>

            {/* Optical Lens Precision Motion Navigation */}
            <nav
              className="relative flex flex-col gap-2 select-none py-1"
              aria-label="Design system timeline navigation"
              onMouseLeave={() => setTimelineHoveredIdx(null)}
            >
              {SECTIONS.map((sec, idx) => {
                const activeIdx = SECTIONS.findIndex((s) => s.id === activeSection);
                const isActive = activeIdx === idx;
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
                    onClick={(e) => scrollToSection(e, sec.id)}
                    className="group relative flex items-center w-full text-left py-1 cursor-pointer select-none focus-visible:outline-none"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
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

                      {/* Optical Scale Typography */}
                      <motion.span
                        animate={{
                          fontSize: `${fontSize}px`,
                          opacity: opacity,
                          x: isActive ? 1 : 0,
                          fontWeight: isActive ? 600 : 450,
                        }}
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className={`font-sans uppercase tracking-[0.08em] truncate transition-colors duration-150 ${
                          isActive ? "text-zinc-900 font-semibold" : "text-zinc-500 group-hover:text-zinc-900"
                        }`}
                      >
                        {sec.label}
                      </motion.span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Minimal Token Classification Legend (Relocated Below Sidebar) */}
            <div className="mt-4 pt-4 border-t border-zinc-100 flex flex-col gap-2 text-[11px] font-mono text-zinc-400">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Token Categories
              </span>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-zinc-400 shrink-0" />
                <span>Canonical: Core system</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
                <span>One-off: Single instance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>Experiment: Prototype</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 text-[11px] font-mono text-zinc-400">
              Mudit Jha Design System v1.0
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <div className="lg:col-span-9 flex flex-col min-w-0">
          <ColorSection filterTag={filterTag} />
          <TypographySection filterTag={filterTag} />
          <ShadowSection filterTag={filterTag} />
          <RadiusSection filterTag={filterTag} />
          <SpacingSection filterTag={filterTag} />
          <EffectsSection filterTag={filterTag} />
          <MotionSection filterTag={filterTag} />
          <ComponentSection />
        </div>
      </div>
    </div>
  );
}
