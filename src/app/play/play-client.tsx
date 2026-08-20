"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  Carousel3D,
  CinematicLightLeaks,
  resolveAmbientColors,
  type Carousel3DItem,
} from "@/components/Carousel3D";
import {
  Sparkles,
  Layers,
  Video,
  Code,
  Compass,
  ChevronDown,
  Check,
  LayoutGrid,
  Box,
  ArrowUpRight,
  Play,
} from "lucide-react";

export function PlayPageClient({
  initialItems,
}: {
  initialItems: Carousel3DItem[];
}) {
  const [viewMode, setViewMode] = useState<"flat" | "3d">("3d");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [hoveredCardItem, setHoveredCardItem] = useState<Carousel3DItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const filterTabs = [
    { id: "all", label: "All Items", icon: Compass, desc: "All experiments & prototypes" },
    { id: "video", label: "Reels & Video", icon: Video, desc: "Motion studies & kinetic reels" },
    { id: "spatial", label: "Spatial & Canvas", icon: Layers, desc: "Vision UI & infinite canvas" },
    { id: "shaders", label: "Shaders", icon: Code, desc: "WebGL emulsion & foil shaders" },
    { id: "systems", label: "Design Systems", icon: Sparkles, desc: "Tactile tokens & UI physics" },
  ];

  const activeTab = useMemo(
    () => filterTabs.find((t) => t.id === selectedFilter) || filterTabs[0],
    [selectedFilter, filterTabs]
  );

  const filteredItems = useMemo(() => {
    if (selectedFilter === "all") return initialItems;
    if (selectedFilter === "video") {
      return initialItems.filter((i) => i.type === "video" || i.tag?.toLowerCase().includes("video") || i.category?.toLowerCase().includes("video"));
    }
    if (selectedFilter === "spatial") {
      return initialItems.filter(
        (i) =>
          i.category?.toLowerCase().includes("prototype") ||
          i.tag?.toLowerCase().includes("spatial") ||
          i.tag?.toLowerCase().includes("canvas") ||
          i.title?.toLowerCase().includes("vision") ||
          i.title?.toLowerCase().includes("spatial")
      );
    }
    if (selectedFilter === "shaders") {
      return initialItems.filter(
        (i) =>
          i.category?.toLowerCase().includes("shader") ||
          i.tag?.toLowerCase().includes("shader") ||
          i.title?.toLowerCase().includes("shader") ||
          i.tag?.toLowerCase().includes("gl") ||
          i.tag?.toLowerCase().includes("glare")
      );
    }
    if (selectedFilter === "systems") {
      return initialItems.filter(
        (i) =>
          i.category?.toLowerCase().includes("interactive") ||
          i.category?.toLowerCase().includes("note") ||
          i.tag?.toLowerCase().includes("design") ||
          i.tag?.toLowerCase().includes("viz") ||
          i.tag?.toLowerCase().includes("data") ||
          i.tag?.toLowerCase().includes("audio") ||
          i.tag?.toLowerCase().includes("physics")
      );
    }
    return initialItems;
  }, [initialItems, selectedFilter]);

  // Click outside & Escape key listeners for dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const ActiveIcon = activeTab.icon;

  // Ambient corner light leak colors for Flat layout based on currently hovered card
  const flatAmbientColors = useMemo(
    () => resolveAmbientColors(hoveredCardItem || undefined),
    [hoveredCardItem]
  );

  // Shared Header Content for both views
  const HeaderBlock = (
    <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto mb-4 pointer-events-auto">
      {/* Verified Badge Icon */}
      <motion.div
        className="mb-3 flex items-center justify-center"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-sm"
        >
          <path
            d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.66.152-.51.238-1.05.238-1.61 0-2.9-2.35-5.25-5.25-5.25-.56 0-1.1.086-1.61.238C12.95 1.025 11.58.15 10 .15c-1.58 0-2.95.875-3.66 2.148-.51-.152-1.05-.238-1.61-.238-2.9 0-5.25 2.35-5.25 5.25 0 .56.086 1.1.238 1.61C1.025 9.55.15 10.92.15 12.5c0 1.58.875 2.95 2.148 3.66-.152.51-.238 1.05-.238 1.61 0 2.9 2.35 5.25 5.25 5.25 0 .56-.086 1.1-.238 1.61 1.273-.71 2.148-2.08 2.148-3.66z"
            fill="#c8d5bb"
          />
          <path
            d="M10.2 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4-6.7 6.7z"
            fill="#ffffff"
          />
        </svg>
      </motion.div>

      {/* Serif Title */}
      <motion.h1
        className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-3"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      >
        Mudit&apos;s Playground
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="font-display text-zinc-600 text-base sm:text-lg leading-relaxed font-normal max-w-xl mx-auto mb-5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        A collection of unpublished design experiments, spatial UI prototypes, video
        motion studies, and real-time shaders.
      </motion.p>

      {/* Controls Row: Category Filter Dropdown + Interactive 3D Mode Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-3 z-40 mb-2">
        {/* Animated Category Dropdown Menu */}
        <div ref={dropdownRef} className="relative inline-block text-left">
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-sm text-xs sm:text-sm font-medium text-zinc-800 hover:text-zinc-950 hover:bg-zinc-200/50 transition-all duration-200 cursor-pointer"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <ActiveIcon className="size-4 text-zinc-600 group-hover:text-zinc-900 transition-colors" />
            <span className="font-semibold text-zinc-900">{activeTab.label}</span>
            <span className="text-zinc-400 font-mono text-xs">({filteredItems.length})</span>
            <ChevronDown
              className={`size-3.5 text-zinc-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180 text-zinc-900" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu Overlay Panel */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: "top center" }}
                className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 rounded-2xl border border-zinc-300/80 bg-[#fbfaf5]/95 backdrop-blur-xl shadow-xl p-1.5 z-50 flex flex-col gap-0.5"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-200/70 mb-1">
                  Filter Categories
                </div>

                {filterTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = selectedFilter === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(tab.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`relative flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer text-left ${
                        isSelected
                          ? "bg-willow-grey/50 text-zinc-950 font-semibold"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`size-4 shrink-0 ${
                            isSelected ? "text-zinc-950" : "text-zinc-500"
                          }`}
                        />
                        <span className="truncate">{tab.label}</span>
                      </div>

                      {isSelected && (
                        <Check className="size-4 text-zinc-900 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* View Mode Switcher Pill (Flat Grid vs Interactive 3D) */}
        <div className="flex items-center p-1 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode("flat")}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "flat"
                ? "text-zinc-950 font-semibold"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {viewMode === "flat" && (
              <motion.div
                layoutId="viewModePill"
                className="absolute inset-0 rounded-full bg-willow-grey/60 border border-willow-grey/80 -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <LayoutGrid className="size-3.5" />
            <span>Flat Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("3d")}
            className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              viewMode === "3d"
                ? "text-zinc-950 font-semibold"
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {viewMode === "3d" && (
              <motion.div
                layoutId="viewModePill"
                className="absolute inset-0 rounded-full bg-willow-grey/60 border border-willow-grey/80 -z-10 shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <Box className="size-3.5" />
            <span>Interactive 3D</span>
            <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center">
      {/* Background Light Leak Effect for Flat Mode */}
      {viewMode === "flat" && <CinematicLightLeaks colors={flatAmbientColors} />}

      <AnimatePresence mode="wait">
        {viewMode === "flat" ? (
          <motion.div
            key="flat-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* Header Content */}
            {HeaderBlock}

            {/* Flat Grid Layout of Play Items */}
            <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <FlatPlayCard
                  key={`${item.title}-${idx}`}
                  item={item}
                  onHover={() => setHoveredCardItem(item)}
                  onLeave={() => setHoveredCardItem(null)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="3d-view"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            {/* 3D Carousel Component with Header */}
            <Carousel3D
              items={filteredItems}
              itemWidth={360}
              itemHeight={480}
              perspective={1400}
              sensitivity={0.28}
              headerContent={HeaderBlock}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Flat Card Component for the 2D Grid View
function FlatPlayCard({
  item,
  onHover,
  onLeave,
}: {
  item: Carousel3DItem;
  onHover?: () => void;
  onLeave?: () => void;
}) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth physical spring tracking cursor movement
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.6 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    setIsCardHovered(true);
    onHover?.();
  };

  const handlePointerLeave = () => {
    setIsCardHovered(false);
    onLeave?.();
  };

  const handleClick = () => {
    window.open(
      item.href || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "_blank"
    );
  };

  return (
    <div
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="group relative flex flex-col rounded-[26px] border border-zinc-300/80 bg-[#fbfaf5] p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 cursor-none select-none"
    >
      {/* Dynamic Cursor-Following "Open to view" Hover Pill (Unclipped) */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: isCardHovered ? 1 : 0,
          scale: isCardHovered ? 1 : 0.6,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 z-50 pointer-events-none whitespace-nowrap drop-shadow-2xl"
      >
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-300/90 bg-[#fbfaf5]/95 backdrop-blur-md shadow-2xl text-xs font-semibold text-zinc-900">
          <span>Open to view</span>
          <ArrowUpRight className="size-3.5 text-zinc-800" />
        </div>
      </motion.div>

      {/* Header Info */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 rounded-full bg-willow-grey/60 border border-willow-grey/80">
            {item.tag || (item.type === "video" ? "Video Clip" : "Interactive")}
          </span>
          {item.badge && (
            <span className="px-2 py-0.5 text-[10px] font-mono uppercase bg-amber-100 border border-amber-200 text-amber-800 rounded-full">
              {item.badge}
            </span>
          )}
        </div>
        {item.year && (
          <span className="text-xs font-mono text-zinc-400">{item.year}</span>
        )}
      </div>

      {/* Card Visual Media */}
      <div className="relative w-full aspect-[16/10] rounded-[20px] overflow-hidden bg-zinc-900 border border-zinc-200 shadow-inner mb-3">
        {item.type === "video" ? (
          <video
            src={item.src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Video badge */}
        {item.type === "video" && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
            <Play className="size-2.5 fill-white" />
            <span>Video</span>
          </div>
        )}

        {/* Holographic light gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/10 via-rose-400/10 to-amber-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Footer Info */}
      <div className="flex items-start justify-between gap-2 px-1 pb-0.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-zinc-900 leading-snug group-hover:text-zinc-950 transition-colors">
            {item.title}
          </h3>
          {item.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-1 font-normal">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



