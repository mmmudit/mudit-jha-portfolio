"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { Hand, Sparkles, X, ArrowUpRight, Play, Maximize2 } from "lucide-react";
import { play } from "@/lib/sound";

import { PlaygroundCardSize, SIZE_DIMENSIONS } from "@/lib/generateScatterLayout";

export interface DragCanvasItem {
  id: string;
  imageSrc?: string;
  videoSrc?: string;
  type?: "image" | "video" | "note";
  title: string;
  caption?: string;
  description?: string;
  top?: number | string;
  left?: number | string;
  x?: number | string;
  y?: number | string;
  size?: PlaygroundCardSize;
  rotation?: number;
  width?: number | string;
  aspect?: string;
  href?: string;
  tag?: string;
  year?: string;
  badge?: string;
  details?: string;
  category?: string;
}

export interface DragCanvasProps {
  items?: DragCanvasItem[];
  canvasWidth?: number;
  canvasHeight?: number;
  className?: string;
  dragAxis?: "both" | "x" | "y";
  dragElastic?: number;
  initialCenter?: boolean;
  hintText?: string;
  showCenterHero?: boolean;
  onItemClick?: (item: DragCanvasItem) => void;
}

// Natural scatter layout around center (1500, 1000)
export const DEFAULT_DRAG_ITEMS: DragCanvasItem[] = [
  // 1. North-West Hero Reel
  {
    id: "motion-identity-reel",
    title: "Kinetic Identity Reel",
    caption: "Tactile physics, frame-accurate momentum, and micro-delight motion branding.",
    videoSrc: "/intro.mp4",
    type: "video",
    size: "lg",
    top: 480,
    left: 1040,
    x: 1040,
    y: 480,
    rotation: -2.8,
    width: 340,
    tag: "Motion & Video",
    badge: "Featured",
    year: "2025",
    details:
      "A high-energy reel testing physics-driven transitions, optical momentum curves, and micro-delights for modern web and native experiences.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // 2. North-East Interactive Shader
  {
    id: "polaroid-studio",
    title: "Polaroid Camera Shader",
    caption: "Real-time film emulsion curve simulation & chemical development process in WebGL.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    type: "image",
    size: "lg",
    top: 490,
    left: 1620,
    x: 1620,
    y: 490,
    rotation: 3.6,
    width: 340,
    tag: "WebGL Shader",
    badge: "Interactive",
    year: "2025",
    details:
      "A custom WebGL canvas implementation simulating analog film development curves, grain density, and light leaks in real-time.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // 3. East Spatial Workspace
  {
    id: "canvas-os",
    title: "Canvas OS & Nodes",
    caption: "Infinite spatial workspace with physics-based card links and gesture flow.",
    imageSrc: "/assets/projects/canvas_os.png",
    type: "image",
    size: "lg",
    top: 840,
    left: 1820,
    x: 1820,
    y: 840,
    rotation: -1.5,
    width: 340,
    tag: "Interface",
    badge: "OS Design",
    year: "2025",
    details:
      "An experiment in infinite visual node mapping, bi-directional connections, and spring-driven card layout algorithms.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // 4. West Hardware UI
  {
    id: "screentime-receipt",
    title: "Screentime Thermal Print",
    caption: "Visualizing personal digital consumption as thermal printed itemized store receipts.",
    imageSrc: "/assets/projects/screentime_receipt.png",
    type: "image",
    size: "md",
    top: 820,
    left: 830,
    x: 830,
    y: 820,
    rotation: 4.2,
    width: 260,
    tag: "Data Viz",
    badge: "Hardware UI",
    year: "2025",
    details:
      "Translating screen time analytics into physical receipts with itemized application usage, pickup metrics, and digital wellbeing summaries.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // 5. South-West 3D Glare
  {
    id: "holographic-shader",
    title: "Holographic Foil Shader",
    caption: "Multi-layered rainbow holographic foil reflection with dynamic cursor glare.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    type: "image",
    size: "md",
    top: 1220,
    left: 960,
    x: 960,
    y: 1220,
    rotation: -3.8,
    width: 260,
    tag: "WebGL Shader",
    year: "2025",
    details:
      "Real-time 3D tilt matrix transformation calculating specular light reflections and spectral color dispersion.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  // 6. South Philosophy Note
  {
    id: "malleable-medium",
    title: "Malleable Medium",
    caption: "Software is the ultimate malleable medium — interfaces should feel tactile, alive, and responsive.",
    type: "note",
    size: "md",
    top: 1280,
    left: 1330,
    x: 1330,
    y: 1280,
    rotation: 1.8,
    width: 260,
    tag: "Thought Note",
    year: "2025",
    details:
      "Notes on UI polish: unseen details compound into something that feels right. Good default physics and intentional easings make software feel human.",
  },
  // 7. South-East Studio Portrait
  {
    id: "avatar-portrait",
    title: "Analog Studio Portrait",
    caption: "Hand-printed studio portrait on warm heavyweight textured stock paper.",
    imageSrc: "/assets/avatar.png",
    type: "image",
    size: "md",
    top: 1210,
    left: 1680,
    x: 1680,
    y: 1210,
    rotation: 2.8,
    width: 260,
    tag: "Portrait",
    year: "2026",
    details: "Studio self-portrait taken in Minneapolis with physical medium format camera.",
    href: "https://muditjha.me",
  },
  // 8. North Accent Vision
  {
    id: "spatial-vision",
    title: "Spatial Vision UI",
    caption: "Dynamic glass shaders and physical eye-tracking feedback primitives for visionOS.",
    imageSrc: "/assets/projects/apple_vision.png",
    type: "image",
    size: "lg",
    top: 200,
    left: 1340,
    x: 1340,
    y: 200,
    rotation: 1.2,
    width: 340,
    tag: "Spatial UI",
    badge: "Prototype",
    year: "2025",
    details:
      "Explorations in spatial interface design, exploring eye-tracking affordances, translucent glass depth, and physical gesture feedback for spatial computing platforms.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

export function DragCanvas({
  items = DEFAULT_DRAG_ITEMS,
  canvasWidth = 3000,
  canvasHeight = 2000,
  className = "h-screen w-screen",
  dragAxis = "both",
  dragElastic = 0.18,
  initialCenter = true,
  hintText = "Scroll or drag to explore canvas",
  showCenterHero = true,
  onItemClick,
}: DragCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  // Persistent drag coordinates (initialized to center)
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  // Dynamic drag constraints computed from viewport and canvas dimensions
  const [constraints, setConstraints] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  }>({ left: -1800, right: 0, top: -1200, bottom: 0 });

  // State for active dragging and one-time hint
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Normalized cursor coordinates (-0.5 to 0.5) for ambient whole-canvas parallax
  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);

  // Lower stiffness spring (stiffness: 60, damping: 20) for slow, drifting ambient parallax
  const ambientX = useSpring(mouseNormX, { stiffness: 60, damping: 20 });
  const ambientY = useSpring(mouseNormY, { stiffness: 60, damping: 20 });

  // Dismiss one-time instructional hint and persist in sessionStorage
  const dismissHint = useCallback(() => {
    setShowHint(false);
    try {
      sessionStorage.setItem("playground_drag_canvas_hint_seen", "true");
    } catch {
      // Ignore
    }
  }, []);

  // Initialize hint visibility from sessionStorage
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("playground_drag_canvas_hint_seen");
      if (!seen) {
        setShowHint(true);
        const timer = setTimeout(() => {
          setShowHint(false);
          sessionStorage.setItem("playground_drag_canvas_hint_seen", "true");
        }, 4500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Calculate constraints and center canvas origin inside viewport on mount & resize
  useEffect(() => {
    const updateConstraints = () => {
      if (!containerRef.current) return;
      const vw = containerRef.current.clientWidth;
      const vh = containerRef.current.clientHeight;

      const minX = vw - canvasWidth;
      const minY = vh - canvasHeight;

      setConstraints({
        left: minX,
        right: 0,
        top: minY,
        bottom: 0,
      });

      if (initialCenter) {
        // Place the center of the large canvas in the center of the viewport
        panX.set(minX / 2);
        panY.set(minY / 2);
      }
    };

    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, [canvasWidth, canvasHeight, initialCenter, panX, panY]);

  // Track window-level mousemove for ambient parallax across entire viewport
  useEffect(() => {
    if (reduce) {
      mouseNormX.set(0);
      mouseNormY.set(0);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Zero out ambient parallax target values while actively dragging to prevent visual competition
      if (isDragging) {
        mouseNormX.set(0);
        mouseNormY.set(0);
        return;
      }

      // Normalize cursor position to -0.5 to 0.5 range based on window dimensions
      const normX = e.clientX / window.innerWidth - 0.5;
      const normY = e.clientY / window.innerHeight - 0.5;

      // Map to small ambient offset (max ~15px range: -15px to +15px)
      mouseNormX.set(normX * 30);
      mouseNormY.set(normY * 30);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDragging, reduce, mouseNormX, mouseNormY]);

  // Support trackpad & mouse wheel panning
  const handleWheel = (e: React.WheelEvent) => {
    if (showHint) dismissHint();
    if (!containerRef.current) return;

    const vw = containerRef.current.clientWidth;
    const vh = containerRef.current.clientHeight;
    const minX = vw - canvasWidth;
    const minY = vh - canvasHeight;

    const currentX = panX.get();
    const currentY = panY.get();

    panX.set(Math.min(0, Math.max(minX, currentX - e.deltaX)));
    panY.set(Math.min(0, Math.max(minY, currentY - e.deltaY)));
  };

  const handleDragStart = () => {
    setIsDragging(true);
    // Zero out ambient parallax targets while dragging
    mouseNormX.set(0);
    mouseNormY.set(0);
    if (showHint) dismissHint();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCardInspect = (item: DragCanvasItem) => {
    play("bloom", { volume: 0.35 });
    if (item.href) {
      window.open(item.href, "_blank");
    }
    onItemClick?.(item);
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      className={`relative w-full overflow-hidden select-none bg-[#fbfaf5] ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
    >
      {/* Subtle Dot Grid Canvas Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(120, 130, 110, 0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Inner Draggable Canvas */}
      <motion.div
        drag={dragAxis === "both" ? true : dragAxis}
        dragConstraints={constraints}
        dragElastic={reduce ? 0 : dragElastic}
        dragMomentum={!reduce}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        style={{
          x: panX,
          y: panY,
          width: canvasWidth,
          height: canvasHeight,
        }}
        className="relative transform-gpu will-change-transform"
      >
        {/* Ambient Parallax Floating Layer */}
        <motion.div
          style={{
            x: ambientX,
            y: ambientY,
            width: "100%",
            height: "100%",
          }}
          className="relative size-full transform-gpu pointer-events-none"
        >
          {/* Center Hero Intro Block — truly centered via transform */}
          {showCenterHero && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 560,
              }}
              className="flex flex-col items-center justify-center text-center pointer-events-none select-none z-10 p-4"
            >
              {/* Verified Checkmark Badge Icon */}
              <motion.div
                className="mb-3 flex items-center justify-center pointer-events-auto cursor-pointer"
                onClick={() => play("chime", { volume: 0.4 })}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.66.152-.51.238-1.05.238-1.61 0-2.9-2.35-5.25-5.25-5.25-.56 0-1.1.086-1.61.238C12.95 1.025 11.58.15 10 .15c-1.58 0-2.95.875-3.66 2.148-.51-.152-1.05-.238-1.61-.238-2.9 0-5.25 2.35-5.25 5.25 0 .56.086 1.1.238 1.61C1.025 9.55.15 10.92.15 12.5c0 1.58.875 2.95 2.148 3.66-.152.51-.238 1.05-.238 1.61 0 2.9 2.35 5.25 5.25 5.25 0 .56-.086 1.1-.238-1.61 1.273-.71 2.148-2.08 2.148-3.66z" fill="#c8d5bb" />
                  <path d="M10.2 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4-6.7 6.7z" fill="#ffffff" />
                </svg>
              </motion.div>

              {/* Serif Title */}
              <motion.h1
                className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-2.5"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                Mudit&apos;s Playground
              </motion.h1>

              {/* Subtitle Paragraph */}
              <motion.p
                className="font-display text-zinc-600 text-base sm:text-lg leading-relaxed font-normal max-w-lg"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                Unpublished design experiments, spatial UI prototypes, video studies, and real-time shaders. Drag around to explore.
              </motion.p>
            </div>
          )}

          {/* Cards — positioned in a circle around center */}
          <div className="relative size-full pointer-events-auto">
            {items.map((item, idx) => {
              // If the item has explicit top/left that are NOT the defaults (0),
              // use them. Otherwise compute a radial position around the center.
              const hasExplicitPosition =
                (typeof item.top === "number" && item.top > 0) ||
                (typeof item.top === "string" && item.top !== "0");

              if (hasExplicitPosition) {
                return (
                  <CanvasImageCard
                    key={item.id}
                    item={item}
                    onItemClick={handleCardInspect}
                  />
                );
              }

              // Compute radial position
              const angle = (idx / items.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 420;
              const cx = canvasWidth / 2;
              const cy = canvasHeight / 2;
              const cardW = typeof item.width === "number" ? item.width : 360;

              const computedItem = {
                ...item,
                top: cy + Math.sin(angle) * radius - 120,
                left: cx + Math.cos(angle) * radius - cardW / 2,
              };

              return (
                <CanvasImageCard
                  key={item.id}
                  item={computedItem}
                  onItemClick={handleCardInspect}
                />
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Center / Bottom One-Time Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={dismissHint}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-950/15 bg-white/90 backdrop-blur-md text-xs font-mono font-medium text-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.08)] cursor-pointer"
          >
            <Hand className="size-3.5 text-zinc-500 animate-pulse" />
            <span>{hintText}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Spatial Badge HUD */}
      <div className="absolute top-5 left-5 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300/70 bg-[#fbfaf5]/80 backdrop-blur-md text-[11px] font-mono text-zinc-500 shadow-xs">
        <Sparkles className="size-3 text-amber-600/70" />
        <span>PLAYGROUND CANVAS • {items.length} PIECES</span>
      </div>

    </div>
  );
}

// Individual Scattered Mood-board Card Component
function CanvasImageCard({
  item,
  onItemClick,
}: {
  item: DragCanvasItem;
  onItemClick?: (item: DragCanvasItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const sizeWidth = item.size ? SIZE_DIMENSIONS[item.size] : undefined;
  const widthVal = item.width ?? sizeWidth ?? 260;
  const widthStyle = typeof widthVal === "number" ? `${widthVal}px` : widthVal;
  const topVal = item.top ?? item.y ?? 0;
  const leftVal = item.left ?? item.x ?? 0;
  const topStyle = typeof topVal === "number" ? `${topVal}px` : topVal;
  const leftStyle = typeof leftVal === "number" ? `${leftVal}px` : leftVal;
  const rot = item.rotation ?? 0;

  if (item.type === "note") {
    return (
      <motion.div
        initial={false}
        animate={{
          rotate: isHovered && !reduce ? rot * 0.5 : rot,
          scale: isHovered && !reduce ? 1.03 : 1,
          zIndex: isHovered ? 30 : 10,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 26,
          mass: 0.8,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onItemClick?.(item)}
        style={{
          position: "absolute",
          top: topStyle,
          left: leftStyle,
          width: widthStyle,
        }}
        className="group select-none cursor-pointer will-change-transform"
      >
        <div className="relative rounded-[22px] bg-gradient-to-br from-amber-100 to-yellow-100 p-5 border border-amber-200/80 shadow-[0_8px_24px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition-shadow">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-900/60 block mb-2">
            {item.tag || "Note"}
          </span>
          <p className="font-hand text-xl text-zinc-900 leading-relaxed">
            &ldquo;{item.caption || item.title}&rdquo;
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{
        rotate: isHovered && !reduce ? rot * 0.5 : rot,
        scale: isHovered && !reduce ? 1.025 : 1,
        zIndex: isHovered ? 30 : 10,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 26,
        mass: 0.8,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemClick?.(item)}
      style={{
        position: "absolute",
        top: topStyle,
        left: leftStyle,
        width: widthStyle,
      }}
      className="group select-none cursor-pointer will-change-transform"
    >
      <div className="relative rounded-[22px] bg-white p-3 border border-zinc-300/80 shadow-[0_8px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-300 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
        {/* Media Container with 16:10 or Custom Aspect Ratio */}
        <div
          className={`relative w-full rounded-[14px] overflow-hidden bg-zinc-900 border border-zinc-200/80 ${
            item.aspect || "aspect-[16/10]"
          }`}
        >
          {item.type === "video" || item.videoSrc ? (
            <video
              src={item.videoSrc || "/intro.mp4"}
              autoPlay
              loop
              muted
              playsInline
              className="size-full object-cover pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 300px, 460px"
              draggable={false}
              className="object-cover size-full pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : null}

          {/* Optional Tag Pill */}
          {item.tag && (
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-800 bg-[#fbfaf5]/90 backdrop-blur-md rounded-md border border-zinc-300/80 shadow-xs">
                {item.tag}
              </span>
            </div>
          )}

          {/* Video Play Icon */}
          {item.type === "video" && (
            <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10">
              <Play className="size-2.5 fill-white" />
              <span>Video</span>
            </div>
          )}

          {/* Frosted Caption Overlay — Fades in on Hover */}
          <div
            className={`absolute inset-x-0 bottom-0 z-20 pointer-events-none p-3.5 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-200 ease-out ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <h3 className="font-display font-bold text-sm text-white tracking-tight leading-snug drop-shadow-xs flex items-center justify-between">
              <span>{item.title}</span>
              <Maximize2 className="size-3 text-zinc-300" />
            </h3>
            {item.caption && (
              <p className="font-sans text-[11.5px] text-zinc-200 font-normal leading-relaxed mt-0.5 line-clamp-2 drop-shadow-xs text-pretty">
                {item.caption}
              </p>
            )}
          </div>
        </div>

        {/* Polaroid Style Clean Bottom Label (Visible Always) */}
        <div className="flex items-center justify-between px-1 pt-2 text-zinc-700">
          <span className="font-sans font-medium text-xs text-zinc-800 tracking-tight truncate max-w-[75%]">
            {item.title}
          </span>
          <span className="font-mono text-[10px] text-zinc-400">
            {rot > 0 ? `+${rot}°` : `${rot}°`}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DragCanvas;
