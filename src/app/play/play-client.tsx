"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { DragCanvas, DragCanvasItem } from "@/components/DragCanvas";
import { TactileFolderCard } from "@/components/TactileFolderCard";
import { InteractiveTsuLogo } from "@/components/tsu-logo";
import { Grid3X3, MousePointer2, Sparkles } from "lucide-react";
import { play } from "@/lib/sound";

function PlayModeBadge({
  mode,
  isExpanded,
  onExpandedChange,
  onSelectMode,
}: {
  mode: "canvas" | "grid";
  isExpanded: boolean;
  onExpandedChange: (isExpanded: boolean) => void;
  onSelectMode: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const CollapsedIcon = mode === "canvas" ? MousePointer2 : Grid3X3;
  const HoverIcon = mode === "canvas" ? Grid3X3 : MousePointer2;
  const text = mode === "canvas" ? "Switch to Gallery View" : "Switch to Canvas View";
  const ariaLabel = mode === "canvas"
    ? "Switch from interactive canvas to gallery view"
    : "Switch from gallery view to interactive canvas";

  return (
    <motion.button
      type="button"
      onClick={onSelectMode}
      data-cuelume-hover="tick"
      data-cuelume-press
      aria-label={ariaLabel}
      onHoverStart={() => onExpandedChange(true)}
      onHoverEnd={() => onExpandedChange(false)}
      onFocus={() => onExpandedChange(true)}
      onBlur={() => onExpandedChange(false)}
      className="pressable relative inline-flex size-11 cursor-pointer rounded-full pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 active:scale-[0.96]"
    >
      <motion.span
        aria-hidden="true"
        animate={{ opacity: isExpanded ? 0 : 1, transform: "scale(1)" }}
        transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
        className="absolute inset-0 rounded-full border border-zinc-300/90 bg-[#fbfaf5]/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-md will-change-[transform,opacity]"
      />
      <motion.span
        aria-hidden="true"
        animate={{
          opacity: isExpanded ? 1 : 0,
          transform: reduceMotion
            ? "translateX(-50%)"
            : `translateX(-50%) scaleX(${isExpanded ? 1 : 0.88})`,
        }}
        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="absolute inset-y-0 left-1/2 w-[196px] origin-center rounded-full border border-[#47585c]/30 bg-willow-grey shadow-[0_4px_20px_rgba(0,0,0,0.08)] will-change-[transform,opacity]"
      />
      <span aria-hidden="true" className="absolute inset-y-0 left-1/2 z-10 w-[196px] -translate-x-1/2 text-[#47585c]">
        <motion.span
          animate={{
            opacity: isExpanded ? 0 : 1,
            transform: reduceMotion || !isExpanded
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) translateX(-76px) scale(0.25)",
          }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-1/2 top-1/2 flex size-5 items-center justify-center will-change-[transform,opacity]"
        >
          <CollapsedIcon className="size-4" />
        </motion.span>
        <motion.span
          animate={{
            opacity: isExpanded ? 1 : 0,
            transform: reduceMotion || !isExpanded
              ? "translate(-50%, -50%) scale(0.25)"
              : "translate(-50%, -50%) translateX(-76px) scale(1)",
          }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-1/2 top-1/2 flex size-5 items-center justify-center will-change-[transform,opacity]"
        >
          <HoverIcon className="size-4" />
        </motion.span>
        <motion.span
          animate={{
            opacity: isExpanded ? 1 : 0,
            transform: reduceMotion || isExpanded
              ? "translateY(-50%)"
              : "translateY(-50%) translateX(-4px)",
          }}
          transition={{ duration: 0.2, ease: [0.77, 0, 0.175, 1] }}
          className="absolute left-[40px] top-1/2 whitespace-nowrap font-mono text-[11px] font-normal uppercase tracking-tight will-change-[transform,opacity]"
        >
          {text}
        </motion.span>
      </span>
    </motion.button>
  );
}

export function PlayPageClient({
  items,
}: {
  items: DragCanvasItem[];
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [viewMode, setViewMode] = useState<"canvas" | "grid">("canvas");
  const [isModeControlExpanded, setIsModeControlExpanded] = useState(false);
  const hasPlayedCanvasEntryRef = useRef(false);

  // Initialize responsive view mode: gallery grid on mobile, interactive canvas on desktop
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setViewMode(mql.matches ? "grid" : "canvas");
    const handleChange = () => {
      if (mql.matches) setViewMode("grid");
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // The centered hero is portaled after this route renders. Preserve the
  // one-time route-entry transition, but do not replay it when switching views.
  useEffect(() => {
    if (portalContainer && viewMode === "canvas") {
      hasPlayedCanvasEntryRef.current = true;
    }
  }, [portalContainer, viewMode]);

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
          className="size-full border-none rounded-none shadow-none"
          showCenterHero={true}
          showCanvasBadge={false}
          animateCenterEyeFromHeader={!hasPlayedCanvasEntryRef.current}
          centerHeroBadge={
            <PlayModeBadge
              mode="canvas"
              isExpanded={isModeControlExpanded}
              onExpandedChange={setIsModeControlExpanded}
              onSelectMode={() => {
                play("toggle", { volume: 0.4 });
                setViewMode("grid");
              }}
            />
          }
          onItemClick={handleCardClick}
        />
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
            {/* Interactive Eye Logo */}
            <div className="mb-3 flex items-center justify-center">
              <motion.div
                layoutId="about-tsu-eye"
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                  mass: 0.85,
                }}
                className="size-[48px] sm:size-[56px]"
              >
                <InteractiveTsuLogo />
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-2">
              Mudit&apos;s Playground
            </h1>

            {/* Subtitle */}
            <p className="font-display text-zinc-600 text-base sm:text-lg leading-relaxed font-normal max-w-lg mb-4">
              Unpublished design experiments, spatial UI prototypes, video studies, and real-time shaders.
            </p>

            {/* Mode Switcher Badge (Grid Mode) */}
            <PlayModeBadge
              mode="grid"
              isExpanded={isModeControlExpanded}
              onExpandedChange={setIsModeControlExpanded}
              onSelectMode={() => {
                play("toggle", { volume: 0.4 });
                setViewMode("canvas");
              }}
            />
          </div>

          {/* Responsive Gallery Grid with Tight Closed Gaps */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3.5 sm:gap-4 w-full">
            {items.map((item) => (
              <div key={item.id} className="break-inside-avoid mb-3.5 sm:mb-4 w-full">
                <MobilePlayCard
                  item={item}
                  onClick={() => handleCardClick(item)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function parseAspectString(aspectStr?: string): number | undefined {
  if (!aspectStr) return undefined;
  if (aspectStr.includes("video")) return 16 / 9;
  if (aspectStr.includes("square")) return 1;
  const clean = aspectStr.replace("aspect-[", "").replace("]", "");
  const parts = clean.split("/");
  if (parts.length === 2) {
    const w = parseFloat(parts[0]);
    const h = parseFloat(parts[1]);
    if (!isNaN(w) && !isNaN(h) && h > 0) return w / h;
  }
  return undefined;
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
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(() => parseAspectString(item.aspect));
  const cardRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisible = useInViewport(cardRef);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isVisible) {
      void video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isVisible]);

  if (item.type === "folder" || item.category === "folder") {
    return (
      <div className="w-full flex justify-center py-1">
        <TactileFolderCard
          title={item.title}
          category={item.tag || "Interactive"}
          date={item.year || "2026"}
          itemCount={item.itemCount || "12 Assets"}
          previewImage={item.imageSrc || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
          description={item.caption || item.description || item.details || ""}
          accentColor={item.accentColor || "#6366f1"}
          href={item.href}
          onClick={onClick}
        />
      </div>
    );
  }

  if (item.type === "note") {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -5, scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 24, mass: 0.7 }}
        className="group relative w-full text-left rounded-2xl bg-[#fbf8f1] dark:bg-zinc-900 p-4 sm:p-5 border border-[#e8e2d4] dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700/60 shadow-xs hover:shadow-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800 shadow-2xs">
            <Sparkles className="size-3 text-amber-700 dark:text-amber-400" />
            <span>{item.tag || "Note"}</span>
          </div>
          {item.year && (
            <span className="text-[10px] font-mono text-zinc-400">{item.year}</span>
          )}
        </div>
        <p className="font-hand text-xl sm:text-2xl text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors">
          &ldquo;{item.caption || item.title}&rdquo;
        </p>
        {item.details && (
          <p className="font-sans text-xs text-zinc-600 dark:text-zinc-400 line-clamp-3 mt-2 leading-relaxed">
            {item.details}
          </p>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 380, damping: 24, mass: 0.7 }}
      className="group relative flex w-full flex-col text-left cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700"
    >
      {/* Media Aspect */}
      <div
        className="relative w-full rounded-xl overflow-hidden bg-zinc-200/80 border border-zinc-200/60 shadow-xs group-hover:shadow-md transition-[aspect-ratio,box-shadow] duration-300 ease-out mb-2.5"
        style={{ aspectRatio: aspectRatio ? `${aspectRatio}` : "4/3" }}
      >
        {item.type === "video" || item.videoSrc ? (
          <video
            ref={videoRef}
            src={item.videoSrc || "/intro.mp4"}
            loop
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(e) => {
              setMediaLoaded(true);
              const video = e.currentTarget;
              if (video.videoWidth && video.videoHeight) {
                const ratio = video.videoWidth / video.videoHeight;
                const clamped = Math.max(0.65, Math.min(2.0, ratio));
                setAspectRatio(clamped);
              }
            }}
            onCanPlay={() => setMediaLoaded(true)}
            className={`size-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-105 ${
              mediaLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : item.imageSrc ? (
          <Image
            src={item.imageSrc}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={(e) => {
              setMediaLoaded(true);
              const img = e.currentTarget;
              if (img.naturalWidth && img.naturalHeight) {
                const ratio = img.naturalWidth / img.naturalHeight;
                const clamped = Math.max(0.65, Math.min(2.0, ratio));
                setAspectRatio(clamped);
              }
            }}
            className={`object-cover size-full transition-[opacity,transform] duration-500 ease-out group-hover:scale-105 ${
              mediaLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}

        {item.tag && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-white bg-black/40 backdrop-blur-md rounded-full">
              {item.tag}
            </span>
          </div>
        )}
      </div>

      {/* Editorial Caption Header */}
      <div className="flex items-baseline justify-between gap-2 px-0.5">
        <h3 className="font-hand text-xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
          {item.title}
        </h3>
        <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest shrink-0">
          {item.year || "2026"}
        </span>
      </div>
      {item.caption && (
        <p className="font-sans text-xs text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed px-0.5">
          {item.caption}
        </p>
      )}
    </motion.button>
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
