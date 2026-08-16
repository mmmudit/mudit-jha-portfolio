"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Palette,
  Type,
  Layers,
  CircleDot,
  Maximize2,
  Sparkles,
  Zap,
  Component,
  ArrowLeft,
  Eye,
  Filter,
} from "lucide-react";
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
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "shadows", label: "Shadows", icon: Layers },
  { id: "radius", label: "Radius & Shapes", icon: CircleDot },
  { id: "spacing", label: "Spacing & Layout", icon: Maximize2 },
  { id: "effects", label: "Materials & Effects", icon: Sparkles },
  { id: "motion", label: "Motion & Physics", icon: Zap },
  { id: "components", label: "Live Components", icon: Component },
];

export function SystemPage() {
  const [activeSection, setActiveSection] = useState<string>("colors");
  const [filterTag, setFilterTag] = useState<TokenTag | "all">("all");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Instant scroll to top on entering design system page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  // IntersectionObserver for performant scroll-spy with safe element discovery
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
    <div className="w-full min-h-screen pb-32">
      {/* Top Header Breadcrumb & Secret Badge */}
      <header className="mb-10 pt-4 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200/80 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="pressable inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-zinc-700 bg-white/80 border border-zinc-300 hover:bg-zinc-100 shadow-2xs"
          >
            <ArrowLeft className="size-3.5" />
            <span>Portfolio</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-[#c8d5bb]/40 text-[#2d3a2e] border border-[#c8d5bb]">
            <Eye className="size-3.5" />
            <span>design system catalog</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-500">Unlinked Secret Route</span>
          <span className="size-2 rounded-full bg-status-green animate-pulse" />
        </div>
      </header>

      {/* Hero Overview */}
      <div className="mb-12 max-w-3xl">
        <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-2px] text-zinc-900 leading-tight">
          Visual Language &amp; Token Catalog
        </h1>
        <p className="mt-3 font-sans text-base sm:text-lg text-zinc-600 leading-relaxed text-pretty">
          An honest, unlinked audit of every color, typography scale, paper card shadow, squircle radius, material shader, and motion curve actually shipped in the portfolio.
        </p>
      </div>

      {/* Global Filter Bar */}
      <div className="mb-10 p-4 bg-white/70 rounded-2xl border border-zinc-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-zinc-500" />
          <span className="text-xs font-mono uppercase font-semibold text-zinc-600">
            Filter System Tokens:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Tokens" },
            { id: "canonical", label: "Canonical Only" },
            { id: "one-off", label: "One-Off Exceptions" },
            { id: "experiment", label: "Experiments" },
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setFilterTag(btn.id as TokenTag | "all")}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
                filterTag === btn.id
                  ? "bg-zinc-800 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Horizontal Scrollable Chip Strip */}
      <div className="lg:hidden sticky top-20 z-40 mb-8 -mx-6 px-6 py-2.5 bg-[#fbfaf5]/90 backdrop-blur-md border-y border-zinc-200/80 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={(e) => scrollToSection(e, sec.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#c8d5bb] text-zinc-900 font-semibold shadow-xs border border-[#b8c7ab]"
                    : "bg-white/80 text-zinc-600 font-normal hover:bg-zinc-100 border border-zinc-200"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sticky Sidebar (Desktop) + Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sticky Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="sticky top-28 flex flex-col gap-1 p-3 bg-white/70 rounded-2xl border border-zinc-200/80 shadow-xs">
            <span className="px-3 py-2 text-[11px] font-mono uppercase font-bold text-zinc-400">
              Table of Contents
            </span>
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-sans text-left transition-all ${
                    isActive
                      ? "bg-[#c8d5bb] text-zinc-900 font-medium shadow-xs"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{sec.label}</span>
                </button>
              );
            })}

            <div className="mt-4 pt-4 border-t border-zinc-200/80 px-2 text-[11px] font-mono text-zinc-400">
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
