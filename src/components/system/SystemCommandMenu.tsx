"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Palette,
  Type,
  Layers,
  Sparkles,
  Zap,
  Box,
  Bookmark,
  Command,
  ArrowRight,
} from "lucide-react";
import { play } from "@/lib/sound";

export interface SearchResultItem {
  id: string;
  title: string;
  category: "Foundations" | "Components" | "Tokens" | "Guides";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  badge?: string;
}

interface SystemCommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: string, subAnchor?: string) => void;
}

export function SystemCommandMenu({
  isOpen,
  onClose,
  onSelectView,
}: SystemCommandMenuProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items: SearchResultItem[] = useMemo(
    () => [
      {
        id: "intro",
        title: "Introduction",
        category: "Guides",
        description: "Overview of the design system, bento showcase, and architecture",
        icon: Bookmark,
        action: () => onSelectView("introduction"),
      },
      {
        id: "principles",
        title: "Design Principles & Rules",
        category: "Guides",
        description: "The 6 non-negotiable design rules from DESIGN.md and accessibility constraints",
        icon: Bookmark,
        badge: "DESIGN.md",
        action: () => onSelectView("principles"),
      },
      {
        id: "brand",
        title: "Brand Mark & Logo",
        category: "Guides",
        description: "Interactive Tsu mark with cursor pupil tracking and construction clearspace",
        icon: Sparkles,
        action: () => onSelectView("brand"),
      },
      {
        id: "colors",
        title: "Colors & Palettes",
        category: "Foundations",
        description: "Dough, Willow Grey, Rust Grey, Status Green, and Zinc alpha tokens",
        icon: Palette,
        action: () => onSelectView("colors"),
      },
      {
        id: "typography",
        title: "Typography & Layout",
        category: "Foundations",
        description: "Figtree Display, Body Sans, Pixel Square HUD Mono, and Handwriting roles",
        icon: Type,
        action: () => onSelectView("typography"),
      },
      {
        id: "materials",
        title: "Paper Surfaces & Shadows",
        category: "Foundations",
        description: "Paper card elevation (.paper-card), specular highlight ring, and grain overlay",
        icon: Layers,
        action: () => onSelectView("materials"),
      },
      {
        id: "motion",
        title: "Motion & Physics",
        category: "Foundations",
        description: "Spring dynamics (240/22/0.85), duration tokens, and reduced motion rules",
        icon: Zap,
        action: () => onSelectView("motion"),
      },
      // Components directly from live site
      {
        id: "comp-navtabs",
        title: "NavigationTabs",
        category: "Components",
        description: "Primary route tabs with sliding Willow pill and audio clicks",
        icon: Box,
        action: () => onSelectView("components", "comp-navigation-tabs"),
      },
      {
        id: "comp-liveclock",
        title: "LiveClock",
        category: "Components",
        description: "Header time indicator with rotating sun/moon and tabular mono coordinates",
        icon: Box,
        action: () => onSelectView("components", "comp-live-clock"),
      },
      {
        id: "comp-projectcard",
        title: "ProjectCard",
        category: "Components",
        description: "Tactile portfolio project cards with video preview & modal ownership",
        icon: Box,
        action: () => onSelectView("components", "comp-project-card"),
      },
      {
        id: "comp-tactilefolder",
        title: "TactileFolderCard",
        category: "Components",
        description: "Spatial physics-based tactile folder cards with paper tab geometry",
        icon: Box,
        action: () => onSelectView("components", "comp-drag-canvas"),
      },
      {
        id: "comp-smartlink",
        title: "SmartLinkPreview & EmailBadge",
        category: "Components",
        description: "Micro-rich hover cards with live metadata and audio cues",
        icon: Box,
        action: () => onSelectView("components", "comp-smart-link-preview"),
      },
      {
        id: "comp-tsulogo",
        title: "InteractiveTsuLogo",
        category: "Components",
        description: "Shared interactive eye toon brand mark with mouse-tracking pupils",
        icon: Box,
        action: () => onSelectView("components", "comp-interactive-tsu-logo"),
      },
      // Tokens
      {
        id: "token-dough",
        title: "Dough (--dough / #fbfaf5)",
        category: "Tokens",
        description: "Base tactile paper canvas and card surface",
        icon: Palette,
        badge: "#fbfaf5",
        action: () => onSelectView("colors"),
      },
      {
        id: "token-willow",
        title: "Willow Grey (--willow-grey / #c8d5bb)",
        category: "Tokens",
        description: "Single selection accent for active route and pill highlights",
        icon: Palette,
        badge: "#c8d5bb",
        action: () => onSelectView("colors"),
      },
      {
        id: "token-rust",
        title: "Rust Grey (--rust-grey / #47585c)",
        category: "Tokens",
        description: "Secondary metadata, labels, and subdued mono captions",
        icon: Palette,
        badge: "#47585c",
        action: () => onSelectView("colors"),
      },
      {
        id: "token-status",
        title: "Status Green (--status-green / #31b564)",
        category: "Tokens",
        description: "Reserved exclusively for live system status indicators",
        icon: Palette,
        badge: "#31b564",
        action: () => onSelectView("colors"),
      },
    ],
    [onSelectView]
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Handle arrow key navigation inside search modal
  const handleKeyNavigation = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredItems.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      play("toggle", { volume: 0.35 });
      filteredItems[selectedIndex].action();
      onClose();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-[#d9d0bb] bg-[#fbfaf5] shadow-xl"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-[#e4dccb] px-4 py-3.5 bg-white/60">
              <Search className="size-4.5 text-zinc-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyNavigation}
                placeholder="Search design system, tokens, components..."
                className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none font-sans"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#d9d0bb] bg-[#fbfaf5] px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-600">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 scroll-smooth">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-zinc-400 font-sans">
                  No matching tokens, components, or documentation found for &quot;{query}&quot;.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          play("toggle", { volume: 0.35 });
                          item.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#eae3d2] text-zinc-900 font-medium border border-[#d9d0bb]"
                            : "text-zinc-600 hover:bg-[#f5efe3]/80 hover:text-zinc-900"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${
                              isSelected
                                ? "border-[#d9d0bb] bg-white text-zinc-900"
                                : "border-[#e4dccb] bg-[#f5efe3] text-zinc-600"
                            }`}
                          >
                            <Icon className="size-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate text-zinc-900 text-xs sm:text-[13px]">
                                {item.title}
                              </span>
                              {item.badge && (
                                <span className="rounded bg-[#eae3d2] border border-[#d9d0bb] px-1.5 py-0.2 text-[10px] font-mono text-zinc-700">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="truncate text-[11px] text-zinc-500">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                          <ArrowRight
                            className={`size-3.5 transition-transform ${
                              isSelected
                                ? "text-zinc-800 translate-x-0.5"
                                : "text-transparent"
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-[#e4dccb] bg-[#f5efe3]/70 px-4 py-2 text-[11px] text-zinc-500">
              <div className="flex items-center gap-2">
                <span>Navigate</span>
                <kbd className="rounded bg-white border border-[#d9d0bb] px-1 font-mono text-[10px]">
                  ↑
                </kbd>
                <kbd className="rounded bg-white border border-[#d9d0bb] px-1 font-mono text-[10px]">
                  ↓
                </kbd>
                <span>Select</span>
                <kbd className="rounded bg-white border border-[#d9d0bb] px-1 font-mono text-[10px]">
                  ↵
                </kbd>
              </div>
              <div className="flex items-center gap-1 font-mono text-[10px]">
                <Command className="size-3" />
                <span>Command Menu</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
