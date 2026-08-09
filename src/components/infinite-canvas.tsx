"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Sparkles,
  Move,
  Camera,
  Play,
  Pause,
  Layers,
} from "lucide-react";

export type CanvasItem = {
  id: string;
  title: string;
  category: "interactive" | "prototypes" | "shaders" | "notes";
  tag: string;
  year: string;
  description: string;
  x: number;
  y: number;
  width: number;
  image?: string;
  gradient: string;
  type: "image" | "interactive-polaroid" | "audio-node" | "3d-tilt" | "note" | "physics-node";
  details?: string;
};

const INITIAL_ITEMS: CanvasItem[] = [
  {
    id: "spatial-vision",
    title: "Spatial Vision UI",
    category: "prototypes",
    tag: "Spatial UI",
    year: "2025",
    description: "Designing spatial gesture primitives & dynamic glass materials.",
    x: -520,
    y: -280,
    width: 380,
    image: "/assets/projects/apple_vision.png",
    gradient: "from-purple-100/90 via-rose-100/90 to-amber-100/90",
    type: "image",
    details:
      "Explorations in spatial interface design, exploring eye-tracking affordances, translucent glass depth, and physical gesture feedback for spatial computing platforms.",
  },
  {
    id: "polaroid-studio",
    title: "Polaroid Camera Shader",
    category: "interactive",
    tag: "Shader & WebGL",
    year: "2025",
    description: "Interactive instant camera app with real-time film emulsion shaders.",
    x: 420,
    y: -300,
    width: 360,
    image: "/assets/projects/polaroid_studio.png",
    gradient: "from-amber-100/90 via-orange-100/90 to-yellow-100/90",
    type: "interactive-polaroid",
    details:
      "A custom WebGL canvas implementation simulating analog film development curves, grain density, and light leaks in real-time.",
  },
  {
    id: "screentime-receipt",
    title: "Screentime Thermal Print",
    category: "prototypes",
    tag: "Data Viz",
    year: "2025",
    description: "Visualizing personal digital consumption as thermal printed store receipts.",
    x: -540,
    y: 180,
    width: 340,
    image: "/assets/projects/screentime_receipt.png",
    gradient: "from-stone-200/90 via-zinc-200/90 to-neutral-300/90",
    type: "image",
    details:
      "Translating screen time analytics into physical receipts with itemized application usage, pickup metrics, and digital wellbeing summaries.",
  },
  {
    id: "canvas-os",
    title: "Canvas OS & Spatial Nodes",
    category: "interactive",
    tag: "Infinite Canvas",
    year: "2025",
    description: "Infinite spatial workspace with physics-based nodes and gesture flow.",
    x: 440,
    y: 160,
    width: 400,
    image: "/assets/projects/canvas_os.png",
    gradient: "from-sky-100/90 via-blue-100/90 to-indigo-100/90",
    type: "3d-tilt",
    details:
      "An experiment in infinite visual node mapping, bi-directional connections, and spring-driven card layout algorithms.",
  },
  {
    id: "thought-snippet-1",
    title: "Malleable Medium",
    category: "notes",
    tag: "Thought Note",
    year: "2025",
    description: "Software is the ultimate malleable medium — interfaces should feel responsive, tactile, and alive.",
    x: -180,
    y: -440,
    width: 320,
    gradient: "from-yellow-100/95 to-amber-100/95",
    type: "note",
    details:
      "Notes on UI polish: unseen details compound into something that feels right. Good default physics and intentional easings make software feel human.",
  },
  {
    id: "audio-synth-node",
    title: "Synthesizer & Audio Wave",
    category: "interactive",
    tag: "Web Audio",
    year: "2024",
    description: "Real-time audio frequency visualizer and harmonic wave generator.",
    x: -220,
    y: 400,
    width: 360,
    gradient: "from-emerald-100/90 via-teal-100/90 to-cyan-100/90",
    type: "audio-node",
    details:
      "Interactive audio visualizer built with Web Audio API, mapping oscillator frequencies to smooth spring-animated SVG waveform paths.",
  },
  {
    id: "holographic-foil",
    title: "Holographic Foil Shader",
    category: "shaders",
    tag: "3D Glare",
    year: "2025",
    description: "Multi-layered rainbow holographic card reflection with dynamic cursor glare.",
    x: 580,
    y: -120,
    width: 320,
    gradient: "from-rose-100/90 via-violet-100/90 to-cyan-100/90",
    type: "3d-tilt",
    details:
      "Real-time 3D tilt matrix transformation calculating specular light reflections and spectral color dispersion as the mouse traverses the card surface.",
  },
  {
    id: "physics-ball-pit",
    title: "Physics Ball Pit Node",
    category: "interactive",
    tag: "Canvas Physics",
    year: "2024",
    description: "Interactive mini-physics arena — click to drop bouncing spring bodies.",
    x: 240,
    y: 440,
    width: 340,
    gradient: "from-fuchsia-100/90 via-purple-100/90 to-indigo-100/90",
    type: "physics-node",
    details:
      "Mini 2D Verlet integration physics simulation inside an HTML5 Canvas node, handling collisions, gravity, and drag friction.",
  },
];

export function InfiniteCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Canvas Pan State (X, Y) and Scale
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Active Category Filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected Card for Modal Inspection
  const [activeModalItem, setActiveModalItem] = useState<CanvasItem | null>(null);

  // Smooth Springs for Pan and Scale
  const springX = useSpring(pan.x, { stiffness: 400, damping: 35 });
  const springY = useSpring(pan.y, { stiffness: 400, damping: 35 });
  const springZoom = useSpring(zoom, { stiffness: 350, damping: 30 });

  useEffect(() => {
    springX.set(pan.x);
    springY.set(pan.y);
  }, [pan, springX, springY]);

  useEffect(() => {
    springZoom.set(zoom);
  }, [zoom, springZoom]);

  // Handle Drag / Pan Events
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only trigger pan if clicking directly on canvas background
    if ((e.target as HTMLElement).closest("[data-no-pan]")) return;

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { x: pan.x, y: pan.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  // Wheel Zoom & Trackpad Pan
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Pinch zoom
        const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
        setZoom((prev) => Math.min(Math.max(0.5, prev + zoomDelta), 1.6));
      } else {
        // Trackpad pan
        setPan((prev) => ({
          x: prev.x - e.deltaX * 0.9,
          y: prev.y - e.deltaY * 0.9,
        }));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Recenter Handler
  const handleResetView = () => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  // Filter Items
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return INITIAL_ITEMS;
    return INITIAL_ITEMS.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="relative size-full overflow-hidden bg-dough select-none">
      {/* Dynamic Moving Infinite Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(200, 213, 187, 0.6) 1.5px, transparent 1.5px)",
          backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`size-full relative flex items-center justify-center ${isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
      >
        <motion.div
          className="absolute origin-center size-0"
          style={{
            x: springX,
            y: springY,
            scale: springZoom,
          }}
        >
          {/* Center Hero Intro Block at origin (0, 0) */}
          <div
            data-no-pan="true"
            className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center w-[580px] max-w-[90vw] pointer-events-none select-none z-10"
          >
            {/* Verified Checkmark Badge Icon */}
            <div className="mb-4 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.66.152-.51.238-1.05.238-1.61 0-2.9-2.35-5.25-5.25-5.25-.56 0-1.1.086-1.61.238C12.95 1.025 11.58.15 10 .15c-1.58 0-2.95.875-3.66 2.148-.51-.152-1.05-.238-1.61-.238-2.9 0-5.25 2.35-5.25 5.25 0 .56.086 1.1.238 1.61C1.025 9.55.15 10.92.15 12.5c0 1.58.875 2.95 2.148 3.66-.152.51-.238 1.05-.238 1.61 0 2.9 2.35 5.25 5.25 5.25.56 0 1.1-.086 1.61-.238 1.48 1.273 2.85 2.148 4.43 2.148 1.58 0 2.95-.875 3.66-2.148.51.152 1.05.238 1.61.238 2.9 0 5.25-2.35 5.25-5.25 0-.56-.086-1.1-.238-1.61 1.273-.71 2.148-2.08 2.148-3.66z" fill="#c8d5bb" />
                <path d="M10.2 16.2l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4-6.7 6.7z" fill="#ffffff" />
              </svg>
            </div>

            {/* Serif Title */}
            <h1 className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2.5px] text-zinc-900 mb-4">
              Mudit's Playground
            </h1>

            {/* Subtitle Paragraph */}
            <p className="font-display text-zinc-600 text-lg leading-relaxed font-normal max-w-lg">
              Welcome. Here's a peek into the mind and life of Mudit where you'll see
              unpublished design, montages, and a different side of Mudit outside of
              design. Drag around to get to know him.
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const isDimmed =
                selectedCategory !== "all" && item.category !== selectedCategory;

              return (
                <CanvasCard
                  key={item.id}
                  item={item}
                  isDimmed={isDimmed}
                  onInspect={() => setActiveModalItem(item)}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating HUD Bottom Center: Category Filter Bar */}
      <div
        data-no-pan="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      >
        {[
          { id: "all", label: "All Items" },
          { id: "interactive", label: "Interactive" },
          { id: "prototypes", label: "Prototypes" },
          { id: "shaders", label: "Shaders" },
          { id: "notes", label: "Notes" },
        ].map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`relative px-3.5 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${isActive
                ? "text-zinc-900 font-semibold"
                : "text-zinc-500 hover:text-zinc-800"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeFilterPill"
                  className="absolute inset-0 rounded-full bg-willow-grey/60 border border-willow-grey/80 -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Floating HUD Bottom Right: View Controls & Coordinates */}
      <div
        data-no-pan="true"
        className="absolute bottom-5 right-5 z-40 flex items-center gap-2"
      >
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-300/70 bg-[#fbfaf5]/90 backdrop-blur-md text-xs font-mono text-rust-grey shadow-sm">
          <Move className="size-3.5 text-zinc-500" />
          <span>
            X: {Math.round(pan.x)} | Y: {Math.round(pan.y)}
          </span>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-sm">
          <button
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-full transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="px-1 text-xs font-mono font-medium text-zinc-700 min-w-[38px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
            className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50 rounded-full transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="size-4" />
          </button>

          <div className="w-px h-4 bg-zinc-300 mx-1" />

          <button
            onClick={handleResetView}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200/60 rounded-full transition-colors cursor-pointer"
            title="Reset Canvas View"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Floating HUD Bottom Left: Gesture Hint */}
      <div className="absolute bottom-5 left-5 z-40 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-300/70 bg-[#fbfaf5]/90 backdrop-blur-md text-xs text-zinc-600 shadow-sm pointer-events-none">
        <Sparkles className="size-3.5 text-amber-500" />
        <span>Drag canvas to explore spatial items</span>
      </div>

      {/* Modal Detail Inspection Drawer */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalItem(null)}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              data-no-pan="true"
              className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-zinc-200 bg-[#fbfaf5] p-6 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/50 rounded-full transition-colors cursor-pointer z-10"
              >
                <X className="size-5" />
              </button>

              {activeModalItem.image && (
                <div className="relative w-full aspect-[16/9] rounded-[22px] overflow-hidden mb-5 bg-zinc-200 border border-zinc-200">
                  <Image
                    src={activeModalItem.image}
                    alt={activeModalItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-700 rounded-full bg-willow-grey/60 border border-willow-grey">
                  {activeModalItem.tag}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {activeModalItem.year}
                </span>
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">
                {activeModalItem.title}
              </h2>

              <p className="text-zinc-600 text-base leading-relaxed mb-4">
                {activeModalItem.description}
              </p>

              {activeModalItem.details && (
                <div className="p-4 rounded-2xl bg-zinc-100/70 border border-zinc-200/60 text-sm text-zinc-700 leading-relaxed mb-6 font-mono">
                  {activeModalItem.details}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-200/60">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200/60 rounded-full transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponent: Individual Spatial Card Node on Canvas
function CanvasCard({
  item,
  isDimmed,
  onInspect,
}: {
  item: CanvasItem;
  isDimmed: boolean;
  onInspect: () => void;
}) {
  // Polaroid snap state for interactive polaroid node
  const [snapped, setSnapped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [physicsDots, setPhysicsDots] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([
    { id: 1, x: 50, y: 40, color: "#f97316" },
    { id: 2, x: 120, y: 60, color: "#3b82f6" },
    { id: 3, x: 180, y: 35, color: "#10b981" },
  ]);

  const handleAddPhysicsDot = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899"];
    setPhysicsDots((prev) => [
      ...prev,
      {
        id: Date.now(),
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    ]);
  };

  return (
    <motion.div
      data-no-pan="true"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: isDimmed ? 0.35 : 1,
        scale: isDimmed ? 0.95 : 1,
        filter: isDimmed ? "grayscale(40%)" : "none",
      }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
      }}
      className="absolute cursor-default"
    >
      <div className="group relative flex flex-col rounded-[26px] border border-zinc-300/80 bg-[#fbfaf5] p-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)] hover:-translate-y-1">
        {/* Card Header Info */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 rounded-full bg-willow-grey/60 border border-willow-grey/80">
              {item.tag}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-400">{item.year}</span>
        </div>

        {/* Card Media / Interactive Body */}
        {item.type === "interactive-polaroid" && (
          <div className="relative w-full aspect-[4/3] rounded-[20px] bg-zinc-900 p-3 overflow-hidden flex flex-col items-center justify-between mb-3 border border-zinc-800">
            <div className="relative w-full h-[78%] rounded-[14px] overflow-hidden bg-zinc-950 flex items-center justify-center">
              {snapped ? (
                <motion.div
                  initial={{ opacity: 0, filter: "brightness(2)" }}
                  animate={{ opacity: 1, filter: "brightness(1)" }}
                  transition={{ duration: 1.2 }}
                  className="relative size-full"
                >
                  <Image
                    src={item.image || "/assets/projects/polaroid_studio.png"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-amber-500/10 mix-blend-color" />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-500">
                  <Camera className="size-7 text-zinc-400" />
                  <span className="text-xs font-mono">Press snap button</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSnapped((prev) => !prev)}
              className="w-full py-1.5 text-xs font-medium text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="size-3.5 text-amber-400" />
              <span>{snapped ? "Reset Film" : "Snap Instant Photo"}</span>
            </button>
          </div>
        )}

        {item.type === "audio-node" && (
          <div className="relative w-full p-4 rounded-[20px] bg-gradient-to-br from-emerald-950 to-teal-900 text-white mb-3 flex flex-col gap-3 border border-emerald-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-300">
                128 BPM | Sine Wave
              </span>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="p-2 rounded-full bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                {isPlayingAudio ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4 ml-0.5" />
                )}
              </button>
            </div>

            {/* Animated Waveform Visualizer */}
            <div className="flex items-end gap-1 h-12 px-1">
              {[40, 75, 30, 90, 60, 100, 45, 80, 65, 35, 95, 50, 70].map(
                (h, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      height: isPlayingAudio
                        ? [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`]
                        : "20%",
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: isPlayingAudio ? Infinity : 0,
                      repeatType: "mirror",
                      delay: idx * 0.05,
                    }}
                    className="flex-1 bg-emerald-400/80 rounded-full"
                  />
                )
              )}
            </div>
          </div>
        )}

        {item.type === "physics-node" && (
          <div
            onClick={handleAddPhysicsDot}
            className="relative w-full aspect-[16/9] rounded-[20px] bg-zinc-900 mb-3 border border-zinc-800 p-2 overflow-hidden cursor-crosshair flex flex-col justify-between"
          >
            <div className="text-[11px] font-mono text-zinc-400">
              Click arena to spawn physics nodes ({physicsDots.length})
            </div>

            <div className="relative size-full">
              {physicsDots.map((dot) => (
                <motion.div
                  key={dot.id}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  style={{
                    left: dot.x,
                    top: dot.y,
                    backgroundColor: dot.color,
                  }}
                  className="absolute size-4 rounded-full shadow-lg border border-white/20 -translate-x-1/2 -translate-y-1/2"
                />
              ))}
            </div>
          </div>
        )}

        {item.type === "note" && (
          <div className="w-full p-4 rounded-[20px] bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200/80 text-zinc-800 mb-3 shadow-inner">
            <p className="font-hand text-xl leading-relaxed text-zinc-800">
              &ldquo;{item.description}&rdquo;
            </p>
          </div>
        )}

        {item.type === "image" && item.image && (
          <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden bg-zinc-200 mb-3 border border-zinc-200">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {item.type === "3d-tilt" && item.image && (
          <div className="relative w-full aspect-[16/9] rounded-[20px] overflow-hidden bg-zinc-200 mb-3 border border-zinc-200 group-hover:shadow-lg transition-shadow">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            {/* Holographic foil overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-rose-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        )}

        {/* Card Footer Text & Inspect Trigger */}
        <div className="flex items-start justify-between gap-2 px-1">
          <div>
            <h3 className="font-display text-base font-semibold text-zinc-900 leading-snug">
              {item.title}
            </h3>
            {item.type !== "note" && (
              <p className="text-xs text-zinc-500 line-clamp-2 leading-tight mt-0.5">
                {item.description}
              </p>
            )}
          </div>

          <button
            onClick={onInspect}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 rounded-full transition-colors shrink-0 cursor-pointer"
            title="Inspect Details"
          >
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
