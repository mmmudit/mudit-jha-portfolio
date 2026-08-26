"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowLeft,
  Layers,
  Sparkles,
  Folder,
  ArrowUpRight,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  Image as ImageIcon,
  FileText,
  Eye,
  Terminal,
  Bookmark,
  Compass,
} from "lucide-react";
import { TactileFolderCard } from "@/components/TactileFolderCard";

// ============================================================================
// VARIANT 1: TACTILE ARCHIVE (Canonical Specification)
// Mechanical dark zinc folder, 3 depth planes, -32deg flap hinge, -75px slide
// ============================================================================
function VariantTactileArchive({ keyTrigger }: { keyTrigger: number }) {
  return (
    <div key={keyTrigger} className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8 py-8">
        <TactileFolderCard
          title="Spatial Interface Systems"
          category="Interaction Design"
          date="2026.04"
          itemCount="12 Assets"
          previewImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
          description="Experimental 3D spatial UI patterns, physical spring kinetics & tactile folder depth shaders."
          tags={["Framer Motion", "3D Canvas", "WebGPU"]}
          accentColor="#6366f1"
        />

        <TactileFolderCard
          title="Tactile Sound Synthesis"
          category="Audio Engineering"
          date="2026.02"
          itemCount="8 Presets"
          previewImage="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
          description="Haptic auditory feedback engines paired with low-latency browser WebAudio oscillator nodes."
          tags={["WebAudio", "Haptics", "DSP"]}
          accentColor="#10b981"
        />
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-900/60 border border-zinc-800/80 px-3.5 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
        <span>Hover over folder cards to trigger 3D cursor tilt &amp; physics opening</span>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT 2: SPATIAL GLASS (Translucent Frosted Dossier)
// Glassmorphic acrylic panes, cyan/indigo refractive borders, dual floating cards
// ============================================================================
function VariantSpatialGlass({ keyTrigger }: { keyTrigger: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltConfig = { stiffness: 260, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, tiltConfig);
  const smoothY = useSpring(mouseY, tiltConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8 py-8" style={{ perspective: 1200 }}>
        {/* Glass Folder 1 */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="group relative w-[330px] sm:w-[360px] h-[400px] cursor-pointer outline-none rounded-3xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Ambient Glow */}
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-14 rounded-full pointer-events-none"
            animate={{
              opacity: isHovered ? 0.6 : 0.2,
              scale: isHovered ? 1.2 : 0.9,
              filter: isHovered ? "blur(30px)" : "blur(18px)",
            }}
            transition={{ duration: 0.35 }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(56,189,248,0.7) 0%, rgba(99,102,241,0.4) 40%, transparent 80%)",
            }}
          />

          {/* 3D Tilted Stage */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              rotateX: prefersReducedMotion ? 0 : rotateX,
              rotateY: prefersReducedMotion ? 0 : rotateY,
            }}
          >
            {/* Base Glass Layer */}
            <div
              className="absolute inset-0 rounded-3xl bg-zinc-900/40 backdrop-blur-2xl border border-white/15 p-5 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ transform: "translateZ(0px)" }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  <span className="font-mono text-xs font-semibold text-cyan-200 tracking-wider">DOSSIER // 009</span>
                </div>
                <span className="font-mono text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  FROSTED GLASS
                </span>
              </div>
              <div className="text-right font-mono text-[10px] text-zinc-500 tracking-widest uppercase">
                CONFIDENTIAL RECORD
              </div>
            </div>

            {/* Emerging Card (Dual Layer Glass Asset) */}
            <motion.div
              className="absolute left-4 right-4 top-12 h-[230px] rounded-2xl overflow-hidden bg-zinc-950/80 border border-cyan-400/30 shadow-2xl backdrop-blur-md"
              initial={false}
              animate={{
                translateZ: isHovered ? 40 : 10,
                y: isHovered ? -85 : 0,
                rotateZ: isHovered ? -3 : 0,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop"
                alt="Glass preview"
                className="w-full h-full object-cover brightness-90 group-hover:brightness-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="font-mono text-[10px] text-cyan-300 font-bold uppercase">Holographic Canvas</span>
                <h4 className="font-sans font-bold text-sm text-zinc-100">Quantum Neural Render</h4>
              </div>
            </motion.div>

            {/* Front Acrylic Flap */}
            <motion.div
              className="absolute left-0 right-0 bottom-0 h-[200px] rounded-b-3xl rounded-t-2xl bg-zinc-950/60 backdrop-blur-2xl border-t border-cyan-300/30 border-x border-b border-white/10 p-5 flex flex-col justify-between origin-bottom"
              initial={false}
              animate={{
                translateZ: isHovered ? 70 : 20,
                rotateX: isHovered ? -34 : 0,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
            >
              <div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  COLLECTION // 2026
                </span>
                <h3 className="font-sans font-bold text-lg text-white mt-1">Spatial Glassmorphism</h3>
                <p className="text-xs text-zinc-300/80 mt-1 line-clamp-2">
                  Multi-pass blur shader with iridescent edge diffraction and spring physics.
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded">
                  #Acrylic
                </span>
                <span className="font-mono text-[10px] text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  #Optics
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-cyan-400/80 bg-cyan-950/40 border border-cyan-800/50 px-3.5 py-1.5 rounded-full">
        <Sparkles className="size-3.5" />
        <span>Frosted Acrylic / Iridescent Specular Glare / Elevated 70px Front Pocket</span>
      </div>
    </div>
  );
}

// ============================================================================
// VARIANT 3: EDITORIAL KRAFT (Multi-Asset Skeuomorphic Binder)
// Brass rivet fastener, 3 staggered fanned cards emerging at different angles
// ============================================================================
function VariantEditorialKraft({ keyTrigger }: { keyTrigger: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltConfig = { stiffness: 260, damping: 20, mass: 0.6 };
  const smoothX = useSpring(mouseX, tiltConfig);
  const smoothY = useSpring(mouseY, tiltConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div key={keyTrigger} className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-8 py-8" style={{ perspective: 1200 }}>
        {/* Binder Card */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="group relative w-[330px] sm:w-[360px] h-[400px] cursor-pointer outline-none rounded-2xl"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Dynamic Shadow */}
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[90%] h-14 rounded-full pointer-events-none"
            animate={{
              opacity: isHovered ? 0.75 : 0.35,
              scale: isHovered ? 1.15 : 0.95,
              filter: isHovered ? "blur(24px)" : "blur(14px)",
            }}
            transition={{ duration: 0.35 }}
            style={{
              background: "radial-gradient(ellipse at center, rgba(120,53,15,0.6) 0%, rgba(0,0,0,0.7) 40%, transparent 80%)",
            }}
          />

          {/* 3D Body */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              rotateX: prefersReducedMotion ? 0 : rotateX,
              rotateY: prefersReducedMotion ? 0 : rotateY,
            }}
          >
            {/* Base Manila / Dark Leather Backing */}
            <div
              className="absolute inset-0 rounded-2xl bg-[#1c1917] border border-amber-950/80 shadow-2xl p-5 flex flex-col justify-between"
              style={{
                transform: "translateZ(0px)",
                backgroundImage: "radial-gradient(#292524 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            >
              {/* Brass Rivet Top Corner */}
              <div className="flex items-center justify-between">
                <div className="size-4 rounded-full bg-gradient-to-tr from-amber-700 via-amber-400 to-amber-200 shadow-md border border-amber-900 flex items-center justify-center">
                  <div className="size-1.5 rounded-full bg-amber-950" />
                </div>
                <span className="font-mono text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                  STUDIO BINDER // VOL. 04
                </span>
              </div>

              <div className="border-t border-amber-900/40 pt-2 flex items-center justify-between text-stone-500 font-mono text-[10px]">
                <span>ARCHIVAL NO. 884-J</span>
                <span className="text-amber-600/80 uppercase font-bold">STAMPED</span>
              </div>
            </div>

            {/* Fanned Asset Card 3 (Left tilt) */}
            <motion.div
              className="absolute left-5 right-5 top-12 h-[200px] rounded-xl overflow-hidden bg-stone-900 border border-stone-700 shadow-lg"
              animate={{
                translateZ: isHovered ? 20 : 2,
                y: isHovered ? -60 : 0,
                rotateZ: isHovered ? -7 : 0,
                scale: isHovered ? 0.95 : 0.9,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="p-3 text-[11px] font-mono text-stone-400 bg-stone-950 h-full flex flex-col justify-between">
                <div>
                  <span className="text-amber-500 font-bold">FIG 03.</span> ARCHITECTURE SPEC
                  <div className="mt-2 text-stone-500 text-[10px]">System schematics &amp; CAD layout</div>
                </div>
                <div className="h-1 w-full bg-amber-900/30 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-amber-600" />
                </div>
              </div>
            </motion.div>

            {/* Fanned Asset Card 2 (Right tilt) */}
            <motion.div
              className="absolute left-4 right-4 top-10 h-[210px] rounded-xl overflow-hidden bg-stone-900 border border-amber-600/40 shadow-xl"
              animate={{
                translateZ: isHovered ? 30 : 6,
                y: isHovered ? -75 : 0,
                rotateZ: isHovered ? 4.5 : 0,
                scale: isHovered ? 1.0 : 0.95,
              }}
              transition={{ type: "spring", stiffness: 230, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial Artwork"
                className="w-full h-full object-cover brightness-95"
              />
            </motion.div>

            {/* Fanned Asset Card 1 (Center Hero Card) */}
            <motion.div
              className="absolute left-4 right-4 top-8 h-[220px] rounded-xl overflow-hidden bg-stone-950 border border-amber-500/50 shadow-2xl"
              animate={{
                translateZ: isHovered ? 42 : 10,
                y: isHovered ? -90 : 0,
                rotateZ: isHovered ? -1.5 : 0,
                scale: isHovered ? 1.04 : 1.0,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 18 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"
                alt="Architecture hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="font-mono text-[9px] text-amber-400 font-bold uppercase">HERO ASSET</span>
                <h4 className="font-sans font-bold text-sm">Tactile Concrete Pavilion</h4>
              </div>
            </motion.div>

            {/* Front Flap Pocket with Manila Tag */}
            <motion.div
              className="absolute left-0 right-0 bottom-0 h-[210px] rounded-b-2xl rounded-t-xl bg-[#292524] border-t-2 border-amber-700/60 border-x border-b border-stone-800 p-5 flex flex-col justify-between origin-bottom"
              animate={{
                translateZ: isHovered ? 68 : 16,
                rotateX: isHovered ? -35 : 0,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    PORTFOLIO DOSSIER
                  </span>
                  <h3 className="font-sans font-bold text-base text-stone-100 mt-0.5">Editorial Architecture</h3>
                </div>
                <div className="px-2 py-1 rounded bg-amber-950 border border-amber-700/50 text-amber-300 font-mono text-[10px] font-bold">
                  3 ASSETS
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed font-sans line-clamp-2">
                Curated architectural photography and material case studies stored in multi-leaf spring layers.
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-700/60">
                <span className="font-mono text-[10px] text-stone-400">STATUS // PUBLISHED</span>
                <span className="font-mono text-[10px] text-amber-500 font-semibold">VIEW BUNDLE →</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 bg-amber-950/40 border border-amber-800/50 px-3.5 py-1.5 rounded-full">
        <Bookmark className="size-3.5" />
        <span>3-Card Fan Out (-7deg, +4.5deg, -1.5deg) / Brass Fasteners / Tactile Manila Texture</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PROTOTYPE HARNESS WITH VERBATIM PICKER
// ============================================================================
export default function FolderCardPrototypePage() {
  const [activeVariant, setActiveVariant] = useState(0);
  const [keyTrigger, setKeyTrigger] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const variants = [
    {
      name: "Tactile Archive",
      component: <VariantTactileArchive keyTrigger={keyTrigger} />,
      desc: "Canonical 3D mechanical dark folder with precise Z-space planes, tab notch, and contact shadow.",
    },
    {
      name: "Spatial Glass",
      component: <VariantSpatialGlass keyTrigger={keyTrigger} />,
      desc: "Frosted glassmorphic acrylic dossier with cyan/purple diffraction edges and holographic card slide.",
    },
    {
      name: "Editorial Kraft",
      component: <VariantEditorialKraft keyTrigger={keyTrigger} />,
      desc: "Multi-leaf tactile binder with brass fastener rivet and staggered 3-card fan out.",
    },
  ];

  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveHighlight = useCallback((idx: number) => {
    const el = itemRefs.current[idx];
    const highlight = highlightRef.current;
    if (el && highlight) {
      highlight.style.width = `${el.offsetWidth}px`;
      highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, []);

  const switchVariant = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= variants.length) return;
      setActiveVariant(idx);
      moveHighlight(idx);
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(idx + 1));
      window.history.replaceState(null, "", url.toString());
    },
    [moveHighlight, variants.length]
  );

  const handleReplay = useCallback(() => {
    setKeyTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Read ?v= param on mount
    const params = new URLSearchParams(window.location.search);
    const vParam = parseInt(params.get("v") || "1", 10);
    const initialIndex = Math.max(0, Math.min(variants.length - 1, vParam - 1));
    setActiveVariant(initialIndex);

    // Position highlight without animation on initial paint
    requestAnimationFrame(() => {
      moveHighlight(initialIndex);
      requestAnimationFrame(() => {
        pickerRef.current?.setAttribute("data-ready", "");
      });
    });

    const handleResize = () => moveHighlight(initialIndex);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [moveHighlight, variants.length]);

  // Keyboard navigation wiring per PICKER.md
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) {
        switchVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        switchVariant((activeVariant + 1) % variants.length);
      } else if (e.key === "ArrowLeft") {
        switchVariant((activeVariant - 1 + variants.length) % variants.length);
      } else if (e.key === "r" || e.key === "R") {
        handleReplay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeVariant, switchVariant, handleReplay, variants.length]);

  const copyCodeSnippet = () => {
    const snippet = `import { TactileFolderCard } from "@/components/TactileFolderCard";

<TactileFolderCard
  title="Spatial Interface Systems"
  category="Interaction Design"
  date="2026.04"
  itemCount="12 Assets"
  previewImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
  description="Experimental 3D spatial UI patterns, physical spring kinetics & tactile folder depth shaders."
  tags={["Framer Motion", "3D Canvas", "WebGPU"]}
  accentColor="#6366f1"
/>`;
    navigator.clipboard.writeText(snippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white pb-28">
      {/* Background ambient mesh grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(#27272a 1px, transparent 1px), radial-gradient(circle at 50% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)",
          backgroundSize: "24px 24px, 100% 100%",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-10">
        {/* Header Bar */}
        <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Portfolio</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="size-3 text-indigo-400" />
                <span>3D Kinetic Prototype</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h1 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-white">
                Tactile 3D Folder &amp; Physics Card
              </h1>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                Physics-based hover kinematics with 3-plane Z-space hierarchy: -32° bottom flap hinge, -75px elevated media emerging card, dynamic contact drop shadows, and spring cursor tilt.
              </p>
            </div>

            <button
              onClick={copyCodeSnippet}
              className="self-start md:self-auto px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-mono text-xs font-semibold inline-flex items-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              {copiedCode ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Snippet Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5 text-zinc-400" />
                  <span>Copy Usage Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Active Exploration Display */}
        <div className="relative rounded-3xl bg-zinc-950/80 border border-zinc-800/80 p-8 sm:p-12 shadow-2xl min-h-[560px] flex flex-col items-center justify-center overflow-hidden">
          {/* Variant Metadata Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">Variant {activeVariant + 1} of {variants.length}:</span>
              <span className="text-indigo-400 font-semibold">{variants[activeVariant].name}</span>
            </div>
            <span className="text-zinc-500 hidden sm:inline">{variants[activeVariant].desc}</span>
          </div>

          {/* Render Active Variant */}
          <div className="w-full flex items-center justify-center pt-8">
            {variants[activeVariant].component}
          </div>
        </div>

        {/* Technical Architecture Specs & Props Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <Layers className="size-4" />
              <span>1. Dynamic Cursor Tilt</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mapped normalized cursor offsets to <code className="text-zinc-200">rotateX</code> &amp; <code className="text-zinc-200">rotateY</code> (-14° to 14°) smoothed with a spring of <code className="text-zinc-200">stiffness: 260, damping: 20</code>. Resets on mouse leave without snaps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <ImageIcon className="size-4" />
              <span>2. Emerging Media Plane</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Layer 2 elevates from <code className="text-zinc-200">translateZ(5px)</code> to <code className="text-zinc-200">translateZ(30px)</code>, translating <code className="text-zinc-200">-75px</code> upward and rotating <code className="text-zinc-200">-2.5°</code> with an organic physical spring.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase">
              <Folder className="size-4" />
              <span>3. Hinged Pocket Flap</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Layer 3 uses <code className="text-zinc-200">transform-origin: bottom center</code>, hinging forward at <code className="text-zinc-200">rotateX: -32°</code> and lifting to <code className="text-zinc-200">translateZ(60px)</code> to reveal inner contents.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* VERBATIM PICKER FROM PICKER.md SPECIFICATION                          */}
      {/* ===================================================================== */}
      <nav ref={pickerRef} className="proto-picker" aria-label="Prototype variants">
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {variants.map((v, idx) => (
          <button
            key={idx}
            ref={(el) => {
              itemRefs.current[idx] = el;
            }}
            onClick={() => switchVariant(idx)}
            className="proto-picker-item"
            {...(activeVariant === idx ? { "data-active": "", "aria-current": "true" } : {})}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          onClick={handleReplay}
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          title="Replay animation (R)"
        >
          ↻
        </button>
      </nav>

      {/* Picker Styles injected verbatim from PICKER.md */}
      <style jsx global>{`
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
          .proto-picker[data-ready] .proto-picker-highlight {
            transition: none;
          }
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
      `}</style>
    </div>
  );
}
