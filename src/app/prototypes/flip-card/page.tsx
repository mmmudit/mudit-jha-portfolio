"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowLeft,
  X,
  ExternalLink,
  Sparkles,
  Layers,
  Sliders,
  Maximize2,
  ChevronRight,
  RotateCcw,
  Compass,
  FileText,
  Activity,
  Code2,
  Volume2,
  Bookmark,
  Play,
  Pause,
  Columns,
  Cpu,
  Eye,
  Zap,
  RotateCw,
  Orbit,
  ArrowDownUp,
  Sparkle,
} from "lucide-react";
import { play } from "@/lib/sound";

// ============================================================================
// MOTION TOKENS
// ============================================================================
const EASE_OUT = [0.23, 1, 0.32, 1] as [number, number, number, number];

// ============================================================================
// SAMPLE WORK PROJECT DATA
// ============================================================================
const PROJECTS_DATA = [
  {
    id: "apple",
    title: "Apple",
    year: "2025",
    description: "Designing new features to drive spatial interaction and user delight.",
    image: "/assets/projects/apple_vision.png",
    gradient: "from-amber-100/80 via-rose-100/80 to-purple-100/80",
    actionText: "Try It Out!",
    href: "https://apple.com",
    role: "Lead Interaction Designer",
    timeline: "2024 – 2025",
    category: "Spatial Design",
    overview: "Pioneering fluid, physical gesture interactions and spatial window dynamics for visionOS. Creating tangible software feedback that bridges physical reality with spatial computing.",
    vision: "To make digital interfaces feel like physical material surfaces with weight, inertia, and optical depth.",
    challenge: "Traditional web interfaces often suffer from rigid layout transitions and generic hover states. The challenge was creating a responsive spatial design system that feels physical, alive, and effortless across spatial eye-and-pinch input.",
    solution: "Implemented custom RK4 differential physics engines, subpixel optic typography scaling, and adaptive dynamic level-of-detail shaders.",
    tech: ["visionOS", "SwiftUI", "RealityKit", "Metal"],
    metric: "0.8ms Latency",
  },
  {
    id: "polaroid-studio",
    title: "Polaroid Studio",
    year: "2025",
    description: "Interactive digital camera app with real-time film emulsion shaders.",
    image: "/assets/projects/polaroid_studio.png",
    gradient: "from-amber-100/80 via-orange-100/80 to-yellow-100/80",
    actionText: "Try It Out!",
    href: "https://polaroid.com",
    role: "Design Engineer",
    timeline: "2025",
    category: "Creative Tooling",
    overview: "A tactile analog camera simulation built in the browser. Emulates authentic photographic chemical processes, grain dispersion, and chromatic aberrations.",
    vision: "Reviving the warmth and serendipity of analog photography through real-time WebGL compute shaders.",
    challenge: "Simulating authentic chemical grain percolation at 60 FPS across mobile and desktop browser runtimes with zero frame stutter.",
    solution: "Multi-pass ping-pong framebuffers generating temporal grain noise and organic dye diffusion coupled to low-latency WebAudio shutter mechanisms.",
    tech: ["WebGL 2.0", "GLSL Shaders", "WebAudio", "Next.js"],
    metric: "60 FPS Emulsion",
  },
  {
    id: "canvas-os",
    title: "Canvas OS",
    year: "2024-25",
    description: "Infinite spatial workspace with physics-based nodes and gesture flow.",
    image: "/assets/projects/canvas_os.png",
    gradient: "from-violet-100/80 via-purple-100/80 to-fuchsia-100/80",
    actionText: "Try Prototype",
    href: "#",
    role: "Product Architect",
    timeline: "2024 – 2025",
    category: "System Architecture",
    overview: "An infinite 2.5D spatial canvas for thinking, synthesizing, and organizing thought nodes with magnetic spring connections and natural pan/zoom inertia.",
    vision: "Transforming static windowing desktops into boundless, frictionless mind palaces.",
    challenge: "Rendering 10,000+ interactive nodes with zero stutter during aggressive pan, pinch, and zoom gestures on high-density displays.",
    solution: "Spatial R-Tree indexing paired with WebGL instanced mesh rendering and virtualized viewport culling.",
    tech: ["Three.js", "Web Workers", "Tailwind CSS", "Framer Motion"],
    metric: "10k Active Nodes",
  },
  {
    id: "screentime-receipt",
    title: "Screentime Receipt",
    year: "2025",
    description: "Visualizing personal digital consumption as thermal printed store receipts.",
    image: "/assets/projects/screentime_receipt.png",
    gradient: "from-stone-200/80 via-zinc-200/80 to-neutral-300/80",
    actionText: "Try It Out!",
    href: "#",
    role: "Design Technologist",
    timeline: "2025",
    category: "Data Aesthetics",
    overview: "Translating digital screentime metrics into physical, tactile thermal cash register receipts with customized typography and dithered micro-graphics.",
    vision: "Grounding ephemeral screen usage in tangible, physical artifact metaphors.",
    challenge: "Client-side thermal printing emulation with authentic paper wrinkle distortion shaders and receipt tearing physics.",
    solution: "Procedural displacement maps with Floyd-Steinberg dithering algorithms and real-time audio sample synthesis.",
    tech: ["Canvas API", "Floyd-Steinberg", "SVG Filters", "TypeScript"],
    metric: "200 DPI Thermal",
  },
];

type ProjectItem = (typeof PROJECTS_DATA)[0];

interface CardRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface ActiveCardState {
  project: ProjectItem;
  origin: CardRect;
  target: CardRect;
}

const SECTIONS = [
  { id: "sec-media", label: "Media Preview" },
  { id: "sec-overview", label: "Tagline & Intro" },
  { id: "sec-details", label: "Project Details" },
  { id: "sec-vision", label: "01. Vision" },
  { id: "sec-challenge", label: "02. Challenge" },
  { id: "sec-execution", label: "03. Execution" },
];

export type MotionStyleType = "weighted-horizon" | "arc-cointoss" | "vertical-bookfold" | "elastic-spin";

// ============================================================================
// WORK PAGE CARD COMPONENT
// ============================================================================
const WorkPageCard = React.forwardRef<
  HTMLDivElement,
  {
    project: ProjectItem;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    isHidden?: boolean;
    cueLabel?: string;
  }
>(function WorkPageCard({ project, onClick, isHidden = false, cueLabel = "CLICK TO FLIP ↻" }, ref) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // 3D Parallax Tilt on Hover
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateXSpring = useSpring(useTransform(mouseY, [0, 1], [4, -4]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e as any);
        }
      }}
      style={{ perspective: "1000px" }}
      className="project-card pressable group relative flex flex-col gap-3 items-start w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 rounded-[28px] select-none opacity-100"
    >
      {/* Media Aspect Container with 3D Hover Tilt */}
      <motion.div
        style={
          prefersReducedMotion
            ? {}
            : {
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
              }
        }
        className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96]"
      >
        <div className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]">
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />

          {project.image && (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="absolute max-w-none object-cover size-full rounded-[26px] transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[1.02] pointer-events-none z-10"
            />
          )}
        </div>

        {/* Inner border stroke overlay */}
        <div
          aria-hidden="true"
          className="absolute border border-black/10 inset-0 pointer-events-none rounded-[26px] z-20"
        />

        {/* Floating pill badge on bottom left */}
        <div className="absolute bottom-0 left-0 p-3 z-30 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm border border-[#f4f4f5] flex items-center justify-center px-3.5 pt-[5px] pb-[4.8px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] [@media(hover:hover)]:group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] [@media(hover:hover)]:group-hover:bg-white transition-all duration-200 ease-out">
            <p className="font-sans font-medium tracking-[0.005em] leading-snug text-base text-[#18181b]">
              <span>{project.title}</span>
              <span className="font-normal text-[#a1a1aa] transition-colors duration-200">
                {" "}• {project.year}
              </span>
            </p>
          </div>
        </div>

        {/* Top-right click cue indicator */}
        <div className="absolute top-3 right-3 z-30 pointer-events-none">
          <div className="bg-[#c8d5bb] text-zinc-900 border border-black/5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="w-3.5 h-3.5 text-zinc-800" />
            <span>{cueLabel}</span>
          </div>
        </div>
      </motion.div>

      {/* Subtitle / Description text below card */}
      <div className="flex content-stretch items-start px-[13px] py-0 -mt-1.5 -mb-0.5 relative shrink-0 w-full">
        <p className="font-sans font-normal leading-snug transition-colors duration-200 ease-out text-base tracking-[0.005em] text-left text-pretty text-zinc-500 group-hover:text-zinc-900">
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">
            {project.description}
          </span>
          {project.actionText && (
            <span className="inline-flex items-center ms-1.5 font-medium text-zinc-900">
              <span className="me-1 font-normal opacity-60">•</span>
              <span>{project.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5 ms-1 inline-block text-zinc-500" />
            </span>
          )}
        </p>
      </div>
    </div>
  );
});

// ============================================================================
// MULTI-STYLE MODAL MORPH OVERLAY (4 Divergent 3D Flip Motions)
// ============================================================================
function DynamicModalMorphOverlay({
  activeCard,
  onClose,
  motionStyle = "weighted-horizon",
  perspective = 1400,
  openDuration = 0.88,
  closeDuration = 0.92,
}: {
  activeCard: ActiveCardState | null;
  onClose: () => void;
  motionStyle?: MotionStyleType;
  perspective?: number;
  openDuration?: number;
  closeDuration?: number;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!activeCard) {
      setIsFlipped(false);
      setIsClosing(false);
      return;
    }

    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    setIsClosing(false);
    const frame = requestAnimationFrame(() => {
      setIsFlipped(true);
    });
    play("bloom", { volume: 0.45 });

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [activeCard]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    play("droplet", { volume: 0.45 });
  }, [isClosing]);

  const handleAnimationComplete = useCallback(() => {
    if (isClosing) {
      onClose();
    }
  }, [isClosing, onClose]);

  useEffect(() => {
    if (!activeCard) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCard, handleClose]);

  if (!activeCard) return null;

  const { project, origin, target } = activeCard;

  const CINEMATIC_GENTLE_EASE = [0.19, 1, 0.22, 1] as [number, number, number, number];

  // Configure distinct transitions and 3D rotation transforms per motion style
  let openTransition: any = { duration: openDuration, ease: CINEMATIC_GENTLE_EASE };
  let initialRotation: any = { rotateY: 0, rotateX: 0, rotateZ: 0 };
  let targetRotation: any = { rotateY: 180, rotateX: 0, rotateZ: 0 };
  let backFaceStaticTransform = "rotateY(180deg)";

  if (prefersReducedMotion) {
    targetRotation = { rotateY: 0, rotateX: 0, rotateZ: 0 };
  } else if (motionStyle === "weighted-horizon") {
    // Style 1: Pure Weighted Y-Axis Physical Horizon Flip
    openTransition = { duration: openDuration, ease: CINEMATIC_GENTLE_EASE };
    targetRotation = { rotateY: 180, rotateX: 0, rotateZ: 0 };
    backFaceStaticTransform = "rotateY(180deg)";
  } else if (motionStyle === "arc-cointoss") {
    // Style 2: Compound 3D Arc with Elevation & Z-tilt
    openTransition = { duration: openDuration * 1.08, ease: [0.16, 1, 0.3, 1] };
    targetRotation = { rotateY: 180, rotateX: [0, -14, 0], rotateZ: [0, 6, 0] };
    backFaceStaticTransform = "rotateY(180deg)";
  } else if (motionStyle === "vertical-bookfold") {
    // Style 3: Vertical Top-Over-Bottom Bookfold Flip
    openTransition = { duration: openDuration, ease: CINEMATIC_GENTLE_EASE };
    targetRotation = { rotateY: 0, rotateX: 180, rotateZ: 0 };
    backFaceStaticTransform = "rotateX(180deg)";
  } else if (motionStyle === "elastic-spin") {
    // Style 4: High-Tension Elastic Kinetic Spring
    openTransition = { type: "spring", stiffness: 180, damping: 18, mass: 1.1 };
    targetRotation = { rotateY: 180, rotateX: 0, rotateZ: 0 };
    backFaceStaticTransform = "rotateY(180deg)";
  }

  const closeTransition = {
    duration: closeDuration,
    ease: CINEMATIC_GENTLE_EASE,
  };

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-auto select-none touch-none overscroll-contain"
      onWheel={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      {/* Backdrop Dimmer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={isClosing ? { duration: closeDuration, ease: CINEMATIC_GENTLE_EASE } : { duration: openDuration * 0.7, ease: CINEMATIC_GENTLE_EASE }}
        onClick={handleClose}
        className="fixed inset-0 bg-black/45 backdrop-blur-[3px] cursor-pointer"
        aria-hidden="true"
      />

      {/* Pure Numeric Trajectory Container */}
      <div
        style={{ perspective: prefersReducedMotion ? "none" : `${perspective}px` }}
        className="fixed inset-0 pointer-events-none"
      >
        <motion.div
          initial={
            prefersReducedMotion
              ? {
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  opacity: 0,
                  scale: 0.96,
                  position: "fixed",
                }
              : {
                  top: origin.top,
                  left: origin.left,
                  width: origin.width,
                  height: origin.height,
                  opacity: 1,
                  scale: 1,
                  position: "fixed",
                }
          }
          animate={
            isClosing
              ? {
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  opacity: 0,
                  scale: 0.90,
                  filter: "blur(8px)",
                  position: "fixed",
                }
              : prefersReducedMotion
              ? {
                  top: target.top,
                  left: target.left,
                  width: target.width,
                  height: target.height,
                  opacity: isFlipped ? 1 : 0,
                  scale: isFlipped ? 1 : 0.96,
                  position: "fixed",
                }
              : {
                  top: isFlipped ? target.top : origin.top,
                  left: isFlipped ? target.left : origin.left,
                  width: isFlipped ? target.width : origin.width,
                  height: isFlipped ? target.height : origin.height,
                  opacity: 1,
                  scale: 1,
                  position: "fixed",
                }
          }
          transition={isClosing ? closeTransition : openTransition}
          onAnimationComplete={handleAnimationComplete}
          className="pointer-events-auto relative will-change-transform"
        >
          {/* Inner 3D Flipper */}
          <motion.div
            initial={initialRotation}
            animate={
              isClosing
                ? initialRotation
                : isFlipped
                ? targetRotation
                : initialRotation
            }
            transition={isClosing ? { duration: closeDuration * 1.05, ease: CINEMATIC_GENTLE_EASE } : openTransition}
            style={{
              transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
              willChange: "transform",
            }}
            className="w-full h-full relative"
          >
            {/* FRONT FACE (Crossfades with Motion Blur during flight) */}
            <motion.div
              initial={{ opacity: 1, filter: "blur(0px)" }}
              animate={{
                opacity: isFlipped ? 0 : 1,
                filter: isFlipped ? "blur(4px)" : "blur(0px)",
              }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : openDuration * 0.38,
                delay: prefersReducedMotion ? 0 : isFlipped ? openDuration * 0.08 : 0,
                ease: CINEMATIC_GENTLE_EASE,
              }}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                pointerEvents: isFlipped ? "none" : "auto",
              }}
              className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden bg-[#fbfaf5]"
            >
              <WorkPageCard project={project} />

              {/* Specular Light Reflection Sweep on Flip */}
              {!prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: isFlipped ? [0, 0.45, 0] : 0,
                    x: isFlipped ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: openDuration * 0.9, ease: CINEMATIC_GENTLE_EASE }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-30"
                />
              )}
            </motion.div>

            {/* BACK FACE (Razor-sharp, 100% Crisp Canonical Modal) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: isFlipped ? 1 : 0,
              }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : openDuration * 0.45,
                delay: prefersReducedMotion ? 0 : isFlipped ? openDuration * 0.22 : 0,
                ease: CINEMATIC_GENTLE_EASE,
              }}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: prefersReducedMotion ? "none" : backFaceStaticTransform,
                pointerEvents: isFlipped ? "auto" : "none",
              }}
              className={`absolute inset-0 w-full h-full rounded-[28px] p-[1.5px] bg-gradient-to-br ${project.gradient} shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden select-text`}
            >
              <CanonicalCaseStudyModalContent project={project} onClose={handleClose} />

              {/* Specular Light Reflection Sweep on Arrival */}
              {!prefersReducedMotion && (
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={{
                    opacity: isFlipped ? [0, 0.35, 0] : 0,
                    x: isFlipped ? ["-100%", "200%"] : "-100%",
                  }}
                  transition={{ duration: openDuration * 0.85, delay: openDuration * 0.25, ease: CINEMATIC_GENTLE_EASE }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-40 rounded-[28px]"
                />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================================
// CANONICAL CASE STUDY MODAL CONTENT (Exact project-modal.tsx Design System)
// ============================================================================
function CanonicalCaseStudyModalContent({
  project,
  onClose,
}: {
  project: ProjectItem;
  onClose: () => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState("sec-media");
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - containerTop;
        if (relativeTop <= 120 && relativeTop + rect.height > 20) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      play("page", { volume: 0.35 });
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(id);
    }
  };

  return (
    <div className="relative flex flex-col size-full overflow-hidden rounded-[26.5px] bg-[#fbfaf5] text-zinc-800 text-left">
      {/* Modal Top Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-black/5 shrink-0 bg-[#fbfaf5] z-20">
        <div className="flex items-center gap-2.5">
          <h3
            id="modal-project-title"
            className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight"
          >
            {project.title}
          </h3>
          <span className="px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full">
            {project.year || "2025"}
          </span>
        </div>

        <button
          onClick={onClose}
          data-cuelume-hover="tick"
          data-cuelume-press
          className="pressable p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 active:scale-[0.96] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer"
          aria-label="Close modal [Esc]"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Main Body Grid Layout: Left Vertical Navigation Minimap & Right Scroll Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side Vertical Navigation Minimap Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-[210px] shrink-0 border-r border-black/5 p-6 justify-between bg-black/[0.015]">
          <div className="space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Navigation
            </p>

            {/* Vertical Line Marker Navigation List */}
            <nav className="flex flex-col gap-1.5" aria-label="Modal section minimap navigation">
              {SECTIONS.map((sec) => {
                const isActive = activeSectionId === sec.id;
                const isHovered = hoveredSectionId === sec.id;

                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    onMouseEnter={() => setHoveredSectionId(sec.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                    className="group flex items-center gap-3 py-1 cursor-pointer text-left focus:outline-none"
                  >
                    {/* Line Marker with spring expansion */}
                    <div className="relative flex items-center h-4 w-12 shrink-0">
                      <motion.div
                        style={{ transformOrigin: "left center" }}
                        animate={{
                          scaleX: isActive ? 1 : isHovered ? 0.64 : 0.32,
                          backgroundColor: isActive ? "#18181b" : isHovered ? "#52525b" : "#d4d4d8",
                          opacity: isActive ? 1 : isHovered ? 0.85 : 0.6,
                        }}
                        transition={{ type: "spring", stiffness: 360, damping: 26 }}
                        className="w-11 h-[2px] rounded-full"
                      />
                    </div>

                    {/* Section Label */}
                    <motion.span
                      animate={{
                        x: isActive ? 3 : isHovered ? 2 : 0,
                        color: isActive ? "#18181b" : isHovered ? "#3f3f46" : "#a1a1aa",
                        fontWeight: isActive ? 600 : 400,
                      }}
                      transition={{ duration: 0.15 }}
                      className="text-xs font-mono tracking-tight whitespace-nowrap"
                    >
                      {sec.label}
                    </motion.span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Link */}
          {project.href && project.href !== "#" && (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-black/5"
            >
              <span>Visit Site</span>
              <ExternalLink className="size-3" />
            </a>
          )}
        </aside>

        {/* Right Side Scrollable Modal Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 scroll-smooth overscroll-contain"
        >
          {/* Section 0: Media Preview */}
          <div
            id="sec-media"
            className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden bg-zinc-100 border border-black/5 shadow-sm scroll-mt-6"
          >
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover size-full"
                sizes="(max-width: 768px) 100vw, 760px"
              />
            ) : (
              <div className={`size-full bg-gradient-to-br ${project.gradient}`} />
            )}
          </div>

          {/* Section 1: Tagline / Subtitle */}
          <div id="sec-overview" className="scroll-mt-6">
            <p className="font-display text-lg sm:text-xl font-medium leading-relaxed text-zinc-800 text-pretty">
              {project.description}
            </p>
          </div>

          {/* Section 2: Metadata Grid */}
          <div
            id="sec-details"
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-black/5 scroll-mt-6"
          >
            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Role
              </p>
              <p className="text-sm font-sans font-medium text-zinc-800">
                {project.role || "Design Engineer"}
              </p>
            </div>

            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Timeline
              </p>
              <p className="text-sm font-sans font-medium text-zinc-800">
                {project.timeline || project.year || "2025"}
              </p>
            </div>

            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Category
              </p>
              <p className="text-sm font-sans font-medium text-zinc-800">
                {project.category || "Interface & System"}
              </p>
            </div>

            <div>
              <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Live Link
              </p>
              {project.href && project.href !== "#" ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="size-3.5" />
                </a>
              ) : (
                <span className="text-sm font-sans text-zinc-400 select-none">
                  Prototype
                </span>
              )}
            </div>
          </div>

          {/* Full Case Study Narrative Sections */}
          <div className="space-y-8 pt-4 font-sans border-t border-black/5">
            <div id="sec-vision" className="space-y-2.5 scroll-mt-6">
              <h4 className="text-base font-semibold text-zinc-900 font-display">
                01. Overview & Vision
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                {project.overview}
              </p>
            </div>

            <div id="sec-challenge" className="space-y-2.5 scroll-mt-6">
              <h4 className="text-base font-semibold text-zinc-900 font-display">
                02. The Design Challenge
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                {project.challenge}
              </p>
            </div>

            <div id="sec-execution" className="space-y-2.5 scroll-mt-6">
              <h4 className="text-base font-semibold text-zinc-900 font-display">
                03. Craft & Execution
              </h4>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Modal Footer Bar */}
          <div className="flex items-center justify-between gap-3 pt-6 border-t border-black/5">
            {project.href && project.href !== "#" ? (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pressable inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-sans text-sm font-medium hover:bg-zinc-800 shadow-sm transition-all"
              >
                <span>Visit Live Site</span>
                <ExternalLink className="size-4" />
              </a>
            ) : (
              <div />
            )}

            <button
              onClick={onClose}
              className="pressable px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-800 font-sans text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT 1: WEIGHTED HORIZON (Y-Axis Physical Horizon Flip)
// ============================================================================
function VariantWeightedHorizon({ keyTrigger, openDuration, closeDuration }: { keyTrigger: number; openDuration: number; closeDuration: number }) {
  const [activeCard, setActiveCard] = useState<ActiveCardState | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (project: ProjectItem) => {
    const el = cardRefs.current[project.id];
    if (el) {
      const r = el.getBoundingClientRect();
      const origin: CardRect = { top: r.top, left: r.left, width: r.width, height: r.height };
      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      setActiveCard({ project, origin, target: { top: targetTop, left: targetLeft, width: targetW, height: targetH } });
    }
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center gap-8 w-full max-w-5xl py-4">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d5bb]/40 border border-[#c8d5bb] text-xs font-mono text-zinc-800 font-medium">
          <RotateCw className="w-3.5 h-3.5 text-zinc-800" />
          <span>VARIANT 01 // WEIGHTED HORIZON (Y-AXIS PHYSICAL FLIP)</span>
        </div>
        <p className="text-xs text-zinc-600 max-w-lg">
          Classic horizontal Y-axis turn with weighted spring damping, specular light refraction, and subtle optical dissolve.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10 w-full">
        {PROJECTS_DATA.map((project, index) => {
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: EASE_OUT }}
              className="w-full"
            >
              <WorkPageCard
                ref={(el) => { cardRefs.current[project.id] = el; }}
                project={project}
                onClick={() => handleCardClick(project)}
                cueLabel="HORIZON FLIP ↻"
              />
            </motion.div>
          );
        })}
      </section>

      <DynamicModalMorphOverlay
        activeCard={activeCard}
        onClose={() => setActiveCard(null)}
        motionStyle="weighted-horizon"
        openDuration={openDuration}
        closeDuration={closeDuration}
      />
    </div>
  );
}

// ============================================================================
// VARIANT 2: ARC COIN-TOSS (Compound 3D Arc & Apex Elevation)
// ============================================================================
function VariantArcCoinToss({ keyTrigger, openDuration, closeDuration }: { keyTrigger: number; openDuration: number; closeDuration: number }) {
  const [activeCard, setActiveCard] = useState<ActiveCardState | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (project: ProjectItem) => {
    const el = cardRefs.current[project.id];
    if (el) {
      const r = el.getBoundingClientRect();
      const origin: CardRect = { top: r.top, left: r.left, width: r.width, height: r.height };
      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      setActiveCard({ project, origin, target: { top: targetTop, left: targetLeft, width: targetW, height: targetH } });
    }
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center gap-8 w-full max-w-5xl py-4">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d5bb]/40 border border-[#c8d5bb] text-xs font-mono text-zinc-800 font-medium">
          <Orbit className="w-3.5 h-3.5 text-zinc-800" />
          <span>VARIANT 02 // ARC COIN-TOSS (COMPOUND 3D ARC & ELEVATION)</span>
        </div>
        <p className="text-xs text-zinc-600 max-w-lg">
          Dynamic spatial trajectory that arcs along compound X/Y/Z angles with subtle apex elevation before settling flush.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10 w-full">
        {PROJECTS_DATA.map((project, index) => {
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: EASE_OUT }}
              className="w-full"
            >
              <WorkPageCard
                ref={(el) => { cardRefs.current[project.id] = el; }}
                project={project}
                onClick={() => handleCardClick(project)}
                cueLabel="COIN TOSS ⤾"
              />
            </motion.div>
          );
        })}
      </section>

      <DynamicModalMorphOverlay
        activeCard={activeCard}
        onClose={() => setActiveCard(null)}
        motionStyle="arc-cointoss"
        openDuration={openDuration}
        closeDuration={closeDuration}
      />
    </div>
  );
}

// ============================================================================
// VARIANT 3: VERTICAL BOOK-FOLD (X-Axis Top-Over-Bottom Flip)
// ============================================================================
function VariantVerticalBookfold({ keyTrigger, openDuration, closeDuration }: { keyTrigger: number; openDuration: number; closeDuration: number }) {
  const [activeCard, setActiveCard] = useState<ActiveCardState | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (project: ProjectItem) => {
    const el = cardRefs.current[project.id];
    if (el) {
      const r = el.getBoundingClientRect();
      const origin: CardRect = { top: r.top, left: r.left, width: r.width, height: r.height };
      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      setActiveCard({ project, origin, target: { top: targetTop, left: targetLeft, width: targetW, height: targetH } });
    }
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center gap-8 w-full max-w-5xl py-4">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d5bb]/40 border border-[#c8d5bb] text-xs font-mono text-zinc-800 font-medium">
          <ArrowDownUp className="w-3.5 h-3.5 text-zinc-800" />
          <span>VARIANT 03 // VERTICAL BOOK-FOLD (X-AXIS NOTEBOOK FLIP)</span>
        </div>
        <p className="text-xs text-zinc-600 max-w-lg">
          Rotates vertically along the X-axis like turning over a paper sketchpad or reporter notebook from bottom to top.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10 w-full">
        {PROJECTS_DATA.map((project, index) => {
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: EASE_OUT }}
              className="w-full"
            >
              <WorkPageCard
                ref={(el) => { cardRefs.current[project.id] = el; }}
                project={project}
                onClick={() => handleCardClick(project)}
                cueLabel="VERTICAL FLIP ⇅"
              />
            </motion.div>
          );
        })}
      </section>

      <DynamicModalMorphOverlay
        activeCard={activeCard}
        onClose={() => setActiveCard(null)}
        motionStyle="vertical-bookfold"
        openDuration={openDuration}
        closeDuration={closeDuration}
      />
    </div>
  );
}

// ============================================================================
// VARIANT 4: ELASTIC KINETIC SPRING (Overshoot & Tactile Settle)
// ============================================================================
function VariantElasticSpin({ keyTrigger, openDuration, closeDuration }: { keyTrigger: number; openDuration: number; closeDuration: number }) {
  const [activeCard, setActiveCard] = useState<ActiveCardState | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleCardClick = (project: ProjectItem) => {
    const el = cardRefs.current[project.id];
    if (el) {
      const r = el.getBoundingClientRect();
      const origin: CardRect = { top: r.top, left: r.left, width: r.width, height: r.height };
      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      setActiveCard({ project, origin, target: { top: targetTop, left: targetLeft, width: targetW, height: targetH } });
    }
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center gap-8 w-full max-w-5xl py-4">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c8d5bb]/40 border border-[#c8d5bb] text-xs font-mono text-zinc-800 font-medium">
          <Zap className="w-3.5 h-3.5 text-amber-700" />
          <span>VARIANT 04 // ELASTIC KINETIC SPRING (OVERSHOOT & SETTLE)</span>
        </div>
        <p className="text-xs text-zinc-600 max-w-lg">
          High-energy RK4 physical spring with a subtle 6° angular overshoot and elastic recoil settle into the modal frame.
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-8 md:gap-y-10 w-full">
        {PROJECTS_DATA.map((project, index) => {
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: EASE_OUT }}
              className="w-full"
            >
              <WorkPageCard
                ref={(el) => { cardRefs.current[project.id] = el; }}
                project={project}
                onClick={() => handleCardClick(project)}
                cueLabel="ELASTIC SPIN ⚡"
              />
            </motion.div>
          );
        })}
      </section>

      <DynamicModalMorphOverlay
        activeCard={activeCard}
        onClose={() => setActiveCard(null)}
        motionStyle="elastic-spin"
        openDuration={openDuration}
        closeDuration={closeDuration}
      />
    </div>
  );
}

// ============================================================================
// MAIN PROTOTYPE HARNESS WITH VERBATIM PICKER & CLOSING SPEED CONTROLLER
// ============================================================================
const VARIANTS = [
  { name: "Weighted Horizon", axis: "Y-Axis Physical Horizon Flip", comp: VariantWeightedHorizon },
  { name: "Arc Coin-Toss", axis: "Compound 3D Arc & Apex Elevation", comp: VariantArcCoinToss },
  { name: "Vertical Book-Fold", axis: "X-Axis Top-Over-Bottom Notebook Flip", comp: VariantVerticalBookfold },
  { name: "Elastic Spin", axis: "High-Tension Spring Overshoot & Settle", comp: VariantElasticSpin },
];

const SPEED_PRESETS = [
  { label: "Natural (500ms)", open: 0.5, close: 0.55 },
  { label: "Cinematic (880ms)", open: 0.88, close: 0.92 },
  { label: "Slow & Savor (1200ms)", open: 1.2, close: 1.25 },
  { label: "Dreamy (1600ms)", open: 1.6, close: 1.65 },
];

export default function FlipCardPrototypePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1); // Default to Cinematic (880ms)
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const updateHighlight = useCallback((index: number) => {
    const activeEl = itemsRef.current[index];
    const highlight = highlightRef.current;
    if (activeEl && highlight) {
      highlight.style.width = `${activeEl.offsetWidth}px`;
      highlight.style.transform = `translateX(${activeEl.offsetLeft}px)`;
    }
  }, []);

  const selectVariant = useCallback(
    (index: number) => {
      if (index < 0 || index >= VARIANTS.length) return;
      setActiveIndex(index);
      setKeyTrigger((k) => k + 1);
      updateHighlight(index);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("v", String(index + 1));
        window.history.replaceState(null, "", url);
      }
    },
    [updateHighlight]
  );

  const replayCurrent = useCallback(() => {
    setKeyTrigger((k) => k + 1);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("v");
      const parsed = parseInt(param || "1", 10);
      const initialIndex = isNaN(parsed) || parsed < 1 || parsed > VARIANTS.length ? 0 : parsed - 1;
      setActiveIndex(initialIndex);
      requestAnimationFrame(() => {
        updateHighlight(initialIndex);
        requestAnimationFrame(() => {
          pickerRef.current?.setAttribute("data-ready", "");
        });
      });
    }
  }, [updateHighlight]);

  useEffect(() => {
    const handleResize = () => updateHighlight(activeIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, updateHighlight]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) ||
        target.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        e.preventDefault();
        selectVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        selectVariant((activeIndex + 1) % VARIANTS.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        selectVariant((activeIndex - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        replayCurrent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, selectVariant, replayCurrent]);

  const CurrentComponent = VARIANTS[activeIndex].comp;

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-zinc-800 font-sans flex flex-col justify-between selection:bg-[#c8d5bb] selection:text-zinc-900 dot-grid pb-24">
      {/* Embedded Picker Styles per PICKER.md spec verbatim */}
      <style dangerouslySetInnerHTML={{ __html: `
        .proto-picker {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2147483647;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.82);
          -webkit-backdrop-filter: blur(12px) saturate(1.4);
          backdrop-filter: blur(12px) saturate(1.4);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 8px 24px rgba(0, 0, 0, 0.24),
            0 2px 6px rgba(0, 0, 0, 0.12);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          user-select: none;
          -webkit-user-select: none;
        }

        .proto-picker-highlight {
          position: absolute;
          top: 4px;
          left: 0;
          height: 28px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          will-change: transform;
        }

        .proto-picker[data-ready] .proto-picker-highlight {
          transition:
            transform 250ms cubic-bezier(0.23, 1, 0.32, 1),
            width 250ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .proto-picker[data-ready] .proto-picker-highlight { transition: none; }
        }

        .proto-picker-item {
          position: relative;
          display: flex;
          align-items: center;
          height: 28px;
          padding: 0 12px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font: inherit;
          cursor: pointer;
          transition: color 150ms ease-out;
        }

        .proto-picker-item:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .proto-picker-item:active {
          transform: scale(0.97);
        }

        .proto-picker-item:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.4);
          outline-offset: 2px;
        }

        .proto-picker-item[data-active] {
          color: #fff;
        }

        .proto-picker-divider {
          width: 1px;
          height: 16px;
          margin: 0 4px;
          background: rgba(255, 255, 255, 0.12);
        }

        .proto-picker-replay {
          padding: 0 10px;
          font-size: 14px;
        }
      `}} />

      {/* Header bar with Live Closing Speed Tuner */}
      <header className="border-b border-black/5 bg-[#fbfaf5]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-700 hover:text-zinc-950 transition-colors bg-white border border-black/5 px-3.5 py-1.5 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>WORK PAGE</span>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-300 hidden sm:block" />
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <span className="font-display">3D Card Flip Motion Lab</span>
              <span className="text-[10px] font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#c8d5bb] text-zinc-900">
                4 MOTION VARIANTS
              </span>
            </h1>
          </div>
        </div>

        {/* Live Motion Pace Controller */}
        <div className="flex items-center gap-3 bg-white border border-black/5 p-1.5 rounded-full shadow-sm">
          <span className="text-xs font-mono text-zinc-500 pl-2 select-none">
            Motion Pace:
          </span>
          <div className="flex items-center gap-1">
            {SPEED_PRESETS.map((preset, idx) => {
              const isSelected = speedIndex === idx;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setSpeedIndex(idx)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 text-white font-semibold shadow-sm"
                      : "bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Stage */}
      <main id="stage" className="flex-1 flex flex-col items-center justify-start p-6 sm:p-12 relative w-full">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-start relative z-10">
          <CurrentComponent
            keyTrigger={keyTrigger}
            openDuration={SPEED_PRESETS[speedIndex].open}
            closeDuration={SPEED_PRESETS[speedIndex].close}
          />
        </div>
      </main>

      {/* Floating Picker Harness Chrome */}
      <nav ref={pickerRef} className="proto-picker" aria-label="Prototype variants">
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => { itemsRef.current[i] = el; }}
            type="button"
            className="proto-picker-item"
            data-active={activeIndex === i ? "" : undefined}
            aria-current={activeIndex === i ? "true" : undefined}
            onClick={() => selectVariant(i)}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={replayCurrent}
        >
          ↻
        </button>
      </nav>
    </div>
  );
}

