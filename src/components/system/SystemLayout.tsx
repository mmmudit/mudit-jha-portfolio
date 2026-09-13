"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { play } from "@/lib/sound";
import { SystemSidebar } from "./SystemSidebar";
import { SystemCommandMenu } from "./SystemCommandMenu";

interface SystemLayoutProps {
  activeView: string;
  onSelectView: (view: string, subAnchor?: string) => void;
  children: React.ReactNode;
}

export function SystemLayout({
  activeView,
  onSelectView,
  children,
}: SystemLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVersionHovered, setIsVersionHovered] = useState(false);

  // Enforce light mode on design system portal
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#fbfaf5] text-zinc-800 antialiased selection:bg-[#e5ecd9] selection:text-[#659752]">
      {/* ─────────────────────────────────────────────────────────────
          1. Full-Width Sticky Top Header Bar (Modal Breadcrumb Style)
         ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#e4dccb] bg-[#fbfaf5]/90 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 sm:px-10 h-16 w-full">
          {/* Left: Project Modal Style Breadcrumb Header */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex size-8 items-center justify-center rounded-md border border-[#d9d0bb] lg:hidden cursor-pointer shrink-0 mr-1"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>

            <Link
              href="/"
              data-cuelume-hover="tick"
              className="pressable inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 font-display text-lg sm:text-2xl font-normal transition-colors cursor-pointer shrink-0"
              title="Back to muditjha.me"
              aria-label="Back to muditjha.me"
            >
              muditjha.me
            </Link>

            <ChevronRight className="size-4 sm:size-4.5 text-zinc-400 shrink-0 stroke-[2]" aria-hidden="true" />

            <h1 className="font-display text-lg sm:text-2xl font-semibold text-zinc-900 tracking-tight truncate max-w-[170px] sm:max-w-none">
              Design System
            </h1>

            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full shrink-0">
              2026
            </span>

            {/* Version Badge with Interactive Hover Preview Pill */}
            <div className="relative inline-flex items-center">
              <span
                onMouseEnter={() => {
                  setIsVersionHovered(true);
                  play("tick", { volume: 0.25 });
                }}
                onMouseLeave={() => setIsVersionHovered(false)}
                onFocus={() => setIsVersionHovered(true)}
                onBlur={() => setIsVersionHovered(false)}
                tabIndex={0}
                role="button"
                aria-label="Version 2.4 - Last updated September 13, 2026"
                className="inline-flex items-center px-2 py-0.5 text-[10px] sm:text-xs font-mono font-medium tracking-wide bg-[#f5efe3] border border-[#e4dccb] hover:border-zinc-400 hover:bg-[#efe8d5] text-zinc-700 rounded-full shrink-0 transition-colors cursor-help outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              >
                v2.4
              </span>

              {/* Hover Preview Tooltip Pill (Signature Paper Aesthetic) */}
              <AnimatePresence>
                {isVersionHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      y: 2,
                      scale: 0.96,
                      transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
                    }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                  >
                    <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] border-zinc-950 bg-[#fffdfa] shadow-[3px_3px_0px_#18181b] whitespace-nowrap will-change-transform select-none">
                      {/* Top Pointer Tail */}
                      <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]" />
                      <div className="absolute -top-[4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[4px] border-b-[#fffdfa]" />

                      {/* Live status pulse dot */}
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />

                      {/* Last update date */}
                      <span className="font-mono text-[11px] font-semibold text-zinc-950 tracking-tight">
                        Updated Sep 13, 2026
                      </span>

                      {/* Release tag */}
                      <span className="font-mono text-[10px] text-zinc-400 font-medium tracking-tight">
                        [v2.4.0]
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Search & Return to Portfolio */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Button (⌘K) */}
            <button
              type="button"
              onClick={() => {
                play("toggle", { volume: 0.3 });
                setIsSearchOpen(true);
              }}
              data-cuelume-hover="tick"
              className="pressable flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-black/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:border-black/20 hover:shadow-[0_4px_14px_rgba(0,0,0,0.07)] transition-all text-xs text-zinc-600 hover:text-zinc-900 cursor-pointer select-none"
              aria-label="Search Design System"
            >
              <Search className="size-3.5 text-zinc-400" />
              <span className="hidden sm:inline font-sans font-medium">Search</span>
              <kbd className="inline-flex items-center rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-zinc-500">
                ⌘K
              </kbd>
            </button>

            {/* Back to Portfolio close button */}
            <Link
              href="/"
              data-cuelume-hover="tick"
              className="pressable p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 active:scale-[0.97] transition-all cursor-pointer flex items-center justify-center"
              title="Back to muditjha.me"
              aria-label="Back to muditjha.me"
            >
              <X className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. Full-Width Layout (Edge-to-Edge Sidebar + Main Content)
         ───────────────────────────────────────────────────────────── */}
      <div className="flex w-full min-h-[calc(100vh-4rem)]">
        {/* Desktop Left Sidebar (Sticky Full-Height) */}
        <aside className="hidden lg:block w-72 xl:w-80 shrink-0 border-r border-[#e4dccb] bg-[#fbfaf5] p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SystemSidebar
            activeView={activeView}
            onSelectView={onSelectView}
          />
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 z-30 border-b border-[#e4dccb] bg-[#fbfaf5] px-6 py-6 shadow-xl max-h-[80vh] overflow-y-auto">
            <SystemSidebar
              activeView={activeView}
              onSelectView={(view) => {
                onSelectView(view);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        )}

        {/* Main Content Area (Full Remaining Width & Height) */}
        <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)] overflow-x-hidden bg-[#fbfaf5]">
          {children}
        </main>
      </div>

      {/* Global ⌘K Command Menu */}
      <SystemCommandMenu
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectView={(view, subAnchor) => {
          onSelectView(view, subAnchor);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
}
