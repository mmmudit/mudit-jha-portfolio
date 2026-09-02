"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";
import { DragCanvas, DragCanvasItem } from "@/components/DragCanvas";
import { TactileFolderCard } from "@/components/TactileFolderCard";
import { Sparkles, ArrowUpRight, Play } from "lucide-react";
import { play } from "@/lib/sound";

export function PlayPageClient({
  items,
}: {
  items: DragCanvasItem[];
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [viewMode, setViewMode] = useState<"canvas" | "grid">("canvas");
  const [isMobile, setIsMobile] = useState(false);

  // Initialize responsive view mode: gallery grid on mobile, interactive canvas on desktop
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => {
      setIsMobile(mql.matches);
    };
    update();
    setViewMode(mql.matches ? "grid" : "canvas");
    const handleChange = () => {
      update();
      if (mql.matches) setViewMode("grid");
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Create dedicated portal container element on mount
  useEffect(() => {
    const el = document.createElement("div");
    el.id = "play-portal-root";
    document.body.appendChild(el);
    setPortalContainer(el);

    return () => {
      setPortalContainer(null);
      el.remove();
    };
  }, []);

  const handleCardClick = (item: DragCanvasItem) => {
    play("bloom", { volume: 0.35 });
    if (item.href) {
      window.open(item.href, "_blank");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. INTERACTIVE CANVAS (Portaled full-screen view)
  // ─────────────────────────────────────────────────────────────
  const canvasElement = portalContainer && viewMode === "canvas"
    ? createPortal(
        <div
          className="fixed inset-0 w-screen h-[100dvh] z-0 overflow-hidden select-none bg-[#fbfaf5]"
          id="play-canvas-portal"
        >
          <DragCanvas
            items={items}
            canvasWidth={3000}
            canvasHeight={2000}
            dragAxis="both"
            dragElastic={0.18}
            className="size-full border-none rounded-none shadow-none"
            showCenterHero={true}
            onItemClick={handleCardClick}
          />

          {/* Floating Mode Switcher Button when Canvas is active */}
          <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-auto select-none">
            <button
              type="button"
              onClick={() => {
                play("toggle", { volume: 0.4 });
                setViewMode("grid");
              }}
              data-cuelume-hover="tick"
              data-cuelume-press
              className="pressable inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-zinc-300/90 bg-[#fbfaf5]/90 backdrop-blur-md text-xs sm:text-[13px] font-mono font-medium text-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.08)] active:scale-95 transition-[transform,background-color,border-color] hover:bg-white hover:border-zinc-400 cursor-pointer"
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Interactive Mode</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600 hover:text-zinc-950 font-semibold underline underline-offset-2">
                Switch to Gallery
              </span>
            </button>
          </div>
        </div>,
        portalContainer
      )
    : null;

  return (
    <>
      {/* Interactive Drag Canvas — portaled to document.body when active */}
      {canvasElement}

      {/* ─────────────────────────────────────────────────────────────
          2. GALLERY GRID VIEW (Responsive 1/2/3-column view)
         ───────────────────────────────────────────────────────────── */}
      {viewMode === "grid" && (
        <div className="w-full min-h-screen pb-28 pt-4">
          {/* Header Block */}
          <div className="flex flex-col items-center justify-center text-center max-w-xl mx-auto mb-10 px-2">
            {/* Verified Badge Icon */}
            <motion.div
              data-cuelume-hover="chime"
              onClick={() => play("chime", { volume: 0.4 })}
              className="mb-3 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
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
                  d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.66.152-.51.238-1.05.238-1.61 0-2.9-2.35-5.25-5.25-5.25-.56 0-1.1.086-1.61.238C12.95 1.025 11.58.15 10 .15c-1.58 0-2.95.875-3.66 2.148-.51-.152-1.05-.238-1.61-.238-2.9 0-5.25 2.35-5.25 5.25 0 .56.086 1.1.238 1.61C1.025 9.55.15 10.92.15 12.5c0 1.58.875 2.95 2.148 3.66-.152.51-.238 1.05-.238 1.61 0 2.9 2.35 5.25 5.25 5.25 0 .56-.086 1.1-.238-1.61 1.273-.71 2.148-2.08 2.148-3.66z"
                  fill="#c8d5bb"
                />
                <path
                  d="M10.2 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4-6.7 6.7z"
                  fill="#ffffff"
                />
              </svg>
            </motion.div>

            {/* Title */}
            <h1 className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-2">
              Mudit&apos;s Playground
            </h1>

            {/* Subtitle */}
            <p className="font-display text-zinc-600 text-base sm:text-lg leading-relaxed font-normal max-w-lg">
              Unpublished design experiments, spatial UI prototypes, video studies, and real-time shaders.
            </p>

            {/* Mode Switcher Button */}
            <button
              type="button"
              onClick={() => {
                play("toggle", { volume: 0.4 });
                setViewMode("canvas");
              }}
              data-cuelume-hover="tick"
              data-cuelume-press
              className="pressable mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-300/90 bg-[#fbfaf5] text-[12px] sm:text-[13px] font-mono font-medium text-zinc-800 shadow-[0_2px_10px_rgba(0,0,0,0.04)] active:scale-95 transition-[transform,background-color,border-color] hover:bg-white hover:border-zinc-400 cursor-pointer select-none"
              aria-label="Switch to interactive canvas mode"
            >
              <Sparkles className="size-3.5 text-amber-600 animate-pulse" />
              <span className="font-semibold tracking-wide uppercase">
                {isMobile ? "Switch to Interactive Mode" : "Switch to Interactive Canvas"}
              </span>
              <span className="text-[11px] font-sans text-zinc-400">• {items.length} Items</span>
            </button>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {items.map((item) => (
              <MobilePlayCard
                key={item.id}
                item={item}
                onClick={() => handleCardClick(item)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// Mobile Grid Item Card Component
function MobilePlayCard({
  item,
  onClick,
}: {
  item: DragCanvasItem;
  onClick: () => void;
}) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useInViewport(cardRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isVisible]);

  if (item.type === "folder" || item.category === "folder") {
    return (
      <div className="w-full flex justify-center py-2">
        <TactileFolderCard
          title={item.title}
          category={item.tag || "Interactive"}
          date={item.year || "2026"}
          itemCount={item.itemCount || "12 Assets"}
          previewImage={item.imageSrc || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
          description={item.caption || item.description || item.details || ""}
          tags={item.tags || (item.tag ? [item.tag] : ["Interactive", "3D Canvas"])}
          accentColor={item.accentColor || "#6366f1"}
          href={item.href}
          onClick={onClick}
        />
      </div>
    );
  }

  if (item.type === "note") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="relative w-full text-left rounded-[22px] bg-gradient-to-br from-amber-100 to-yellow-100 p-5 border border-amber-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/70">
            {item.tag || "Note"}
          </span>
          {item.year && (
            <span className="text-[11px] font-mono text-amber-800/60">{item.year}</span>
          )}
        </div>
        <p className="font-hand text-xl text-zinc-900 leading-relaxed">
          &ldquo;{item.caption || item.title}&rdquo;
        </p>
      </button>
    );
  }

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onClick}
      className="group relative flex w-full flex-col rounded-[22px] border border-zinc-300/80 bg-[#fbfaf5] p-3 text-left shadow-[0_4px_16px_rgba(0,0,0,0.04)] active:scale-[0.98] transition-transform cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-700 rounded-full bg-willow-grey/60 border border-willow-grey/80">
            {item.tag || (item.type === "video" ? "Video" : "Experiment")}
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

      {/* Media Aspect */}
      <div className="relative w-full aspect-[16/10] rounded-[16px] overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 shadow-inner mb-2.5">
        {item.type === "video" || item.videoSrc ? (
          <video
            ref={videoRef}
            src={item.videoSrc || "/intro.mp4"}
            loop
            muted
            playsInline
            preload="none"
            onCanPlay={() => setMediaLoaded(true)}
            className={`size-full object-cover transition-opacity duration-300 ease-out ${
              mediaLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setMediaLoaded(true)}
            className={`object-cover size-full transition-opacity duration-300 ease-out ${
              mediaLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}

        {item.type === "video" && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
            <Play className="size-2.5 fill-white" />
            <span>Video</span>
          </div>
        )}
      </div>

      {/* Title & Caption */}
      <div className="flex items-start justify-between gap-2 px-1 pb-0.5">
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-semibold text-zinc-900 leading-snug">
            {item.title}
          </h3>
          {(item.caption || item.description) && (
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-0.5 font-normal">
              {item.caption || item.description}
            </p>
          )}
        </div>

        <span className="p-1 text-zinc-400">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </button>
  );
}

function useInViewport(ref: React.RefObject<Element | null>) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "240px 0px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}
