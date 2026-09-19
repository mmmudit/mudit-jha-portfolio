"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import { Hand, Sparkles } from "lucide-react";
import { play } from "@/lib/sound";
import { TactileFolderCard } from "@/components/TactileFolderCard";
import { InteractiveTsuLogo } from "@/components/tsu-logo";

import { PlaygroundCardSize, SIZE_DIMENSIONS } from "@/lib/generateScatterLayout";

export interface DragCanvasItem {
  id: string;
  imageSrc?: string;
  videoSrc?: string;
  type?: "image" | "video" | "note" | "folder";
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
  itemCount?: number | string;
  accentColor?: string;
  tags?: string[];
}

export interface DragCanvasProps {
  items?: DragCanvasItem[];
  canvasWidth?: number;
  canvasHeight?: number;
  className?: string;
  dragAxis?: "both" | "x" | "y";
  initialCenter?: boolean;
  hintText?: string;
  showCenterHero?: boolean;
  showCanvasBadge?: boolean;
  /** Plays only when entering the play route, preserving the header eye's spatial origin. */
  animateCenterEyeFromHeader?: boolean;
  centerHeroBadge?: React.ReactNode;
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
  // 3. East Spatial Workspace (Tactile Folder Card)
  {
    id: "canvas-os",
    title: "Canvas OS & Spatial Nodes",
    caption: "Infinite spatial workspace with physics-based node links, gesture flow, and spring depth.",
    imageSrc: "/assets/projects/canvas_os.png",
    type: "folder",
    category: "folder",
    itemCount: "16 Nodes",
    accentColor: "#c8d5bb",
    tags: ["Spatial UI", "Canvas OS", "Gesture Physics"],
    size: "lg",
    top: 840,
    left: 1820,
    x: 1820,
    y: 840,
    rotation: -1.5,
    width: 340,
    tag: "Spatial OS",
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
  initialCenter = true,
  hintText = "Scroll or drag to explore canvas",
  showCenterHero = true,
  showCanvasBadge = true,
  animateCenterEyeFromHeader = false,
  centerHeroBadge,
  onItemClick,
}: DragCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const eyeEntryTransform = (() => {
    if (typeof window === "undefined") return null;

    const sourceX = window.innerWidth < 640
      ? 48
      : Math.max(0, (window.innerWidth - 1334) / 2) + 84;
    const sourceY = window.innerWidth < 640 ? 40 : 52;
    const centerHeroEyeY = window.innerHeight / 2 - 105;

    return `translate3d(${sourceX - window.innerWidth / 2}px, ${sourceY - centerHeroEyeY}px, 0) scale(0.96)`;
  })();

  // Initialize pan coordinates to centered canvas offset so layoutId registers center position immediately
  const getInitialPanX = () => {
    if (typeof window !== "undefined") {
      return (window.innerWidth - canvasWidth) / 2;
    }
    return (1200 - canvasWidth) / 2;
  };

  const getInitialPanY = () => {
    if (typeof window !== "undefined") {
      return (window.innerHeight - canvasHeight) / 2;
    }
    return (800 - canvasHeight) / 2;
  };

  const panX = useMotionValue(getInitialPanX());
  const panY = useMotionValue(getInitialPanY());

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

  // Responsive, fluid spring for prominent cursor parallax (stiffness: 120, damping: 22)
  const ambientX = useSpring(mouseNormX, { stiffness: 120, damping: 22 });
  const ambientY = useSpring(mouseNormY, { stiffness: 120, damping: 22 });

  // Reverse shallow parallax for the background dot grid to create genuine 3D depth
  const bgNormX = useMotionValue(0);
  const bgNormY = useMotionValue(0);
  const bgAmbientX = useSpring(bgNormX, { stiffness: 90, damping: 24 });
  const bgAmbientY = useSpring(bgNormY, { stiffness: 90, damping: 24 });

  // Velocity-driven physical inertia tilt for an elastic sheet feel
  const xVelocity = useVelocity(panX);
  const yVelocity = useVelocity(panY);

  const rawTiltX = useTransform(yVelocity, [-2000, 2000], [3.5, -3.5]);
  const rawTiltY = useTransform(xVelocity, [-2000, 2000], [-3.5, 3.5]);

  const tiltX = useSpring(rawTiltX, { stiffness: 320, damping: 22 });
  const tiltY = useSpring(rawTiltY, { stiffness: 320, damping: 22 });

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

  // Keep the ambient layer dormant on touch/coarse pointers and write directly to MotionValues.
  useEffect(() => {
    if (reduce) {
      mouseNormX.set(0);
      mouseNormY.set(0);
      bgNormX.set(0);
      bgNormY.set(0);
      return;
    }

    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!pointerQuery.matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Zero out ambient parallax target values while actively dragging to prevent visual competition
      if (isDragging) {
        mouseNormX.set(0);
        mouseNormY.set(0);
        bgNormX.set(0);
        bgNormY.set(0);
        return;
      }

      // Normalize cursor position to -0.5 to 0.5 range based on window dimensions
      const normX = e.clientX / window.innerWidth - 0.5;
      const normY = e.clientY / window.innerHeight - 0.5;

      // Map to stronger, noticeable ambient parallax (±45px range)
      mouseNormX.set(normX * 45);
      mouseNormY.set(normY * 45);

      // Inverse background layer movement for rich spatial depth
      bgNormX.set(normX * -24);
      bgNormY.set(normY * -24);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isDragging, reduce, mouseNormX, mouseNormY, bgNormX, bgNormY]);

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
    bgNormX.set(0);
    bgNormY.set(0);
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
      style={{ perspective: 1200 }}
      className={`relative w-full overflow-hidden select-none bg-[#fbfaf5] ${isDragging ? "cursor-grabbing" : "cursor-grab"
        } ${className}`}
    >
      {/* Dynamic 3D Dot Grid with Inverse Parallax Depth */}
      <motion.div
        style={{
          x: bgAmbientX,
          y: bgAmbientY,
          backgroundImage:
            "radial-gradient(circle, rgba(120, 130, 110, 0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
        className="absolute -inset-12 pointer-events-none opacity-40 transform-gpu"
      />

      {/* Inner Draggable Canvas with Elastic Physics & 3D Inertia Tilt */}
      <motion.div
        drag={dragAxis === "both" ? true : dragAxis}
        dragConstraints={constraints}
        dragElastic={reduce ? 0 : 0.38}
        dragMomentum={!reduce}
        dragTransition={{
          bounceStiffness: 340,
          bounceDamping: 18,
          power: 0.28,
          timeConstant: 220,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
        style={{
          x: panX,
          y: panY,
          rotateX: reduce ? 0 : tiltX,
          rotateY: reduce ? 0 : tiltY,
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
              {/* Interactive Eye Logo positioned above header */}
              <div className="mb-3 flex items-center justify-center pointer-events-auto">
                <motion.div
                  layoutId="about-tsu-eye"
                  initial={
                    animateCenterEyeFromHeader && eyeEntryTransform
                      ? reduce
                        ? { opacity: 0.82 }
                        : {
                            // Header eye center → centered hero eye center.
                            // Match the shared header's responsive padding and logo size.
                            opacity: 0.9,
                            transform: eyeEntryTransform,
                          }
                      : false
                  }
                  animate={{ opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" }}
                  transition={
                    reduce
                      ? { duration: 0.15, ease: [0.23, 1, 0.32, 1] }
                      : { type: "spring", duration: 0.55, bounce: 0.12 }
                  }
                  className="size-[48px] sm:size-[56px]"
                >
                  <InteractiveTsuLogo />
                </motion.div>
              </div>

              {/* Serif Title */}
              <motion.h1
                className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-2.5"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
              >
                Mudit&apos;s Playground
              </motion.h1>

              {/* Subtitle Paragraph */}
              <motion.p
                className="font-display text-zinc-600 text-base sm:text-lg leading-relaxed font-normal max-w-lg mb-4"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
                Unpublished design experiments, spatial UI prototypes, video studies, and real-time shaders. Drag around to explore.
              </motion.p>

              {/* Cursor / Mode Badge positioned below header and subheader */}
              {centerHeroBadge && (
                <div className="mt-4 pointer-events-auto flex items-center justify-center">
                  {centerHeroBadge}
                </div>
              )}
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
                    priority={idx < 3}
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
                  priority={idx < 3}
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

      {showCanvasBadge && (
        <div className="absolute top-5 left-5 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300/70 bg-[#fbfaf5]/80 backdrop-blur-md text-[11px] font-mono text-zinc-500 shadow-xs">
          <Sparkles className="size-3 text-amber-600/70" />
          <span>PLAYGROUND CANVAS • {items.length} PIECES</span>
        </div>
      )}

    </div>
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

// Individual Scattered Mood-board Card Component
function CanvasImageCard({
  item,
  priority = false,
  onItemClick,
}: {
  item: DragCanvasItem;
  priority?: boolean;
  onItemClick?: (item: DragCanvasItem) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(() => parseAspectString(item.aspect));
  const reduce = useReducedMotion();

  const sizeWidth = item.size ? SIZE_DIMENSIONS[item.size] : undefined;
  const widthVal = item.width ?? sizeWidth ?? 260;
  const widthStyle = typeof widthVal === "number" ? `${widthVal}px` : widthVal;
  const topVal = item.top ?? item.y ?? 0;
  const leftVal = item.left ?? item.x ?? 0;
  const topStyle = typeof topVal === "number" ? `${topVal}px` : topVal;
  const leftStyle = typeof leftVal === "number" ? `${leftVal}px` : leftVal;
  const rot = item.rotation ?? 0;

  if (item.type === "folder" || item.category === "folder") {
    return (
      <motion.div
        initial={false}
        animate={{
          rotate: isHovered && !reduce ? rot * 0.4 : rot,
          zIndex: isHovered ? 40 : 15,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 26,
          mass: 0.8,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "absolute",
          top: topStyle,
          left: leftStyle,
          width: widthStyle,
        }}
        className="group select-none cursor-pointer will-change-transform"
      >
        <TactileFolderCard
          title={item.title}
          category={item.tag || "Interactive"}
          date={item.year || "2026"}
          itemCount={item.itemCount || "12 Assets"}
          previewImage={item.imageSrc || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"}
          description={item.caption || item.description || item.details || ""}
          accentColor={item.accentColor || "#6366f1"}
          href={item.href}
          onClick={() => onItemClick?.(item)}
        />
      </motion.div>
    );
  }

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
        <div className="relative rounded-2xl border border-[#e8e2d4] bg-[#fbf8f1] p-5 shadow-xs transition-shadow duration-250 [@media(hover:hover)]:group-hover:shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
              <Sparkles className="size-3 text-amber-700" />
              <span>{item.tag || "Note"}</span>
            </div>
            {item.year && (
              <span className="font-mono text-[10px] text-zinc-400">{item.year}</span>
            )}
          </div>
          <p className="font-hand text-2xl text-zinc-900 leading-snug">
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
        stiffness: 420,
        damping: 20,
        mass: 0.7,
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
      {/* Editorial Card Layout */}
      <div className="relative flex flex-col">
        {/* Media Container */}
        <div
          className="relative w-full rounded-xl overflow-hidden bg-zinc-200/80 border border-zinc-200/60 shadow-xs transition-[aspect-ratio] duration-300 ease-out"
          style={{ aspectRatio: aspectRatio ? `${aspectRatio}` : "4/3" }}
        >
          {item.type === "video" || item.videoSrc ? (
            <video
              src={item.videoSrc || "/intro.mp4"}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              onLoadedMetadata={(e) => {
                setMediaLoaded(true);
                const video = e.currentTarget;
                if (video.videoWidth && video.videoHeight) {
                  const ratio = video.videoWidth / video.videoHeight;
                  const clamped = Math.max(0.65, Math.min(2.2, ratio));
                  setAspectRatio(clamped);
                }
              }}
              onCanPlay={() => setMediaLoaded(true)}
              className={`size-full object-cover pointer-events-none select-none transition-[opacity,transform] duration-500 ease-out [@media(hover:hover)]:group-hover:scale-105 ${
                mediaLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : item.imageSrc ? (
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 300px, 460px"
              draggable={false}
              onLoad={(e) => {
                setMediaLoaded(true);
                const img = e.currentTarget;
                if (img.naturalWidth && img.naturalHeight) {
                  const ratio = img.naturalWidth / img.naturalHeight;
                  const clamped = Math.max(0.65, Math.min(2.2, ratio));
                  setAspectRatio(clamped);
                }
              }}
              className={`object-cover size-full pointer-events-none select-none transition-[opacity,transform] duration-500 ease-out [@media(hover:hover)]:group-hover:scale-105 ${
                mediaLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          ) : null}

          {/* Tag Badge */}
          {item.tag && (
            <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider text-white bg-black/40 backdrop-blur-md rounded-full">
                {item.tag}
              </span>
            </div>
          )}
        </div>

        {/* Editorial Caption Header */}
        <div className="flex items-baseline justify-between gap-2 px-0.5 mt-2.5">
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
      </div>
    </motion.div>
  );
}

export default DragCanvas;
