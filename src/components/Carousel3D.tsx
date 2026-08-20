"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  animate,
  AnimatePresence,
  useMotionValueEvent,
  type AnimationPlaybackControls,
} from "framer-motion";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";

export type Carousel3DItem = {
  type: "image" | "video";
  src: string;
  title: string;
  href?: string;
  description?: string;
  tag?: string;
  category?: string;
  year?: string;
  gradient?: string;
  details?: string;
  badge?: string;
  ambientColors?: {
    topLeft?: string;
    topRight?: string;
    bottomLeft?: string;
    bottomRight?: string;
    centerGlow?: string;
    primary?: string;
    secondary?: string;
    accent?: string;
  };
};

export type AmbientColors = {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  centerGlow: string;
};

function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function resolveAmbientColors(item?: Carousel3DItem): AmbientColors {
  if (item?.ambientColors) {
    return {
      topLeft:
        item.ambientColors.topLeft ||
        item.ambientColors.primary ||
        "rgba(251, 146, 60, 0.28)",
      topRight:
        item.ambientColors.topRight ||
        item.ambientColors.secondary ||
        "rgba(244, 63, 94, 0.22)",
      bottomLeft:
        item.ambientColors.bottomLeft ||
        item.ambientColors.accent ||
        "rgba(168, 85, 247, 0.20)",
      bottomRight:
        item.ambientColors.bottomRight ||
        item.ambientColors.secondary ||
        "rgba(56, 189, 248, 0.18)",
      centerGlow:
        item.ambientColors.centerGlow ||
        item.ambientColors.primary ||
        "rgba(200, 213, 187, 0.25)",
    };
  }

  const tag = (item?.tag || "").toLowerCase();
  const title = (item?.title || "").toLowerCase();

  if (tag.includes("video") || tag.includes("motion") || title.includes("reel")) {
    return {
      topLeft: "rgba(251, 146, 60, 0.32)", // warm amber tangerine flare
      topRight: "rgba(244, 63, 94, 0.26)", // cinematic rose neon
      bottomLeft: "rgba(168, 85, 247, 0.22)", // deep violet tungsten
      bottomRight: "rgba(251, 191, 36, 0.22)", // golden flare
      centerGlow: "rgba(251, 146, 60, 0.18)",
    };
  }
  if (tag.includes("spatial") || title.includes("vision") || title.includes("apple")) {
    return {
      topLeft: "rgba(168, 85, 247, 0.30)", // ethereal lavender violet
      topRight: "rgba(56, 189, 248, 0.26)", // spatial cyan
      bottomLeft: "rgba(244, 114, 182, 0.24)", // soft rose glass
      bottomRight: "rgba(129, 140, 248, 0.20)", // indigo aura
      centerGlow: "rgba(192, 132, 252, 0.16)",
    };
  }
  if (tag.includes("shader") || tag.includes("polaroid") || title.includes("camera")) {
    return {
      topLeft: "rgba(245, 158, 11, 0.32)", // vintage film burn amber
      topRight: "rgba(234, 88, 12, 0.26)", // burnt orange light leak
      bottomLeft: "rgba(253, 224, 71, 0.24)", // golden emulsion
      bottomRight: "rgba(249, 115, 22, 0.20)", // warm sepia
      centerGlow: "rgba(245, 158, 11, 0.18)",
    };
  }
  if (tag.includes("canvas") || tag.includes("os") || title.includes("roblox")) {
    return {
      topLeft: "rgba(59, 130, 246, 0.28)", // cobalt blue
      topRight: "rgba(6, 182, 212, 0.26)", // electric cyan
      bottomLeft: "rgba(99, 102, 241, 0.22)", // neon indigo
      bottomRight: "rgba(14, 165, 233, 0.20)", // sky flare
      centerGlow: "rgba(59, 130, 246, 0.16)",
    };
  }
  if (tag.includes("viz") || tag.includes("receipt") || tag.includes("data")) {
    return {
      topLeft: "rgba(100, 116, 139, 0.26)", // titanium slate
      topRight: "rgba(16, 185, 129, 0.25)", // thermal receipt mint green
      bottomLeft: "rgba(148, 163, 184, 0.22)", // soft graphite
      bottomRight: "rgba(52, 211, 153, 0.18)", // emerald sheen
      centerGlow: "rgba(148, 163, 184, 0.15)",
    };
  }
  if (tag.includes("system") || tag.includes("design") || title.includes("tactile")) {
    return {
      topLeft: "rgba(132, 204, 22, 0.28)", // willow green
      topRight: "rgba(234, 179, 8, 0.24)", // warm honey gold
      bottomLeft: "rgba(34, 197, 94, 0.20)", // soft emerald
      bottomRight: "rgba(200, 213, 187, 0.30)", // willow grey
      centerGlow: "rgba(200, 213, 187, 0.20)",
    };
  }

  // Default elegant fallback matching portfolio tones
  return {
    topLeft: "rgba(200, 213, 187, 0.35)",
    topRight: "rgba(254, 215, 170, 0.28)",
    bottomLeft: "rgba(226, 232, 240, 0.25)",
    bottomRight: "rgba(251, 207, 232, 0.20)",
    centerGlow: "rgba(200, 213, 187, 0.20)",
  };
}

export interface Carousel3DProps {
  items: Carousel3DItem[];
  itemWidth?: number;
  itemHeight?: number;
  perspective?: number;
  sensitivity?: number;
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
  onItemSelect?: (item: Carousel3DItem, index: number) => void;
  headerContent?: ReactNode;
}

export function Carousel3D({
  items,
  itemWidth = 360,
  itemHeight = 480,
  perspective = 1400,
  sensitivity = 0.26,
  autoplay = false,
  autoplayInterval = 4000,
  className = "",
  onItemSelect,
  headerContent,
}: Carousel3DProps) {
  const totalItems = items.length;
  const prefersReducedMotion = useReducedMotion();

  // Safety fallback for empty or single items
  const safeItems = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length < 5) {
      // Repeat items to give a rich 3D circular volume if fewer than 5 items
      const repeated: Carousel3DItem[] = [];
      while (repeated.length < 6) {
        repeated.push(...items);
      }
      return repeated.slice(0, Math.max(6, items.length * 2));
    }
    return items;
  }, [items]);

  const count = safeItems.length;
  const stepAngle = useMemo(() => 360 / Math.max(count, 1), [count]);

  // Radius calculation: r = (w / 2) / tan(PI / N)
  const radius = useMemo(() => {
    if (count <= 1) return 300;
    const calculated = (itemWidth / 2) / Math.tan(Math.PI / count);
    // Add comfortable visual padding and enforce minimum depth
    return Math.max(340, Math.round(calculated + 30));
  }, [count, itemWidth]);

  const rotation = useMotionValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const mounted = useIsMounted();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, time: 0 });
  const hasDraggedRef = useRef(false);
  const startRotationRef = useRef(0);
  const velocityHistoryRef = useRef<Array<{ x: number; time: number }>>([]);
  const animControlsRef = useRef<AnimationPlaybackControls | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useMotionValueEvent(rotation, "change", (latest) => {
    const norm = normalizeAngle(-latest);
    const approx = Math.round(norm / stepAngle) % count;
    const safeApprox = (approx + count) % count;

    if (safeApprox !== activeIndex) {
      setActiveIndex(safeApprox);
      onItemSelect?.(safeItems[safeApprox], safeApprox);
    }

    safeItems.forEach((item, idx) => {
      if (item.type !== "video") return;
      const el = videoRefs.current[idx];
      if (!el) return;
      const itemAngle = idx * stepAngle;
      const diff = Math.abs(normalizeAngle(norm - itemAngle));
      const isFacing = diff < 45 || diff > 315;
      if (isFacing) { if (el.paused) el.play().catch(() => {}); }
      else { if (!el.paused) el.pause(); }
    });
  });

  const snapToNearestCard = useCallback((currentAngle: number, velocity: number = 0) => {
    const momentumOffset = velocity * 0.15;
    const targetAngle = currentAngle + momentumOffset;
    const nearestStep = Math.round(targetAngle / stepAngle) * stepAngle;
    animControlsRef.current = animate(rotation, nearestStep, {
      type: "spring", stiffness: 140, damping: 24, mass: 0.8,
      onComplete: () => { animControlsRef.current = null; }
    });
  }, [rotation, stepAngle]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (prefersReducedMotion) return;
    if ((e.target as HTMLElement).closest('[data-no-drag="true"]')) return;
    hasDraggedRef.current = false;
    animControlsRef.current?.stop();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    startRotationRef.current = rotation.get();
    velocityHistoryRef.current = [{ x: e.clientX, time: performance.now() }];
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    if (Math.hypot(deltaX, deltaY) > 5) {
      hasDraggedRef.current = true;
    }
    velocityHistoryRef.current.push({ x: e.clientX, time: performance.now() });
    if (velocityHistoryRef.current.length > 5) velocityHistoryRef.current.shift();
    rotation.set(startRotationRef.current + deltaX * sensitivity);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
    const history = velocityHistoryRef.current;
    let velocity = 0;
    if (history.length >= 2) {
      const dt = history[history.length - 1].time - history[0].time;
      const dx = history[history.length - 1].x - history[0].x;
      if (dt > 0) velocity = (dx / dt) * sensitivity * 100;
    }
    snapToNearestCard(rotation.get(), velocity);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 4) {
      e.preventDefault();
      animControlsRef.current?.stop();
      rotation.set(rotation.get() - e.deltaX * 0.12);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); animControlsRef.current?.stop(); snapToNearestCard(rotation.get() + stepAngle); }
    else if (e.key === "ArrowRight") { e.preventDefault(); animControlsRef.current?.stop(); snapToNearestCard(rotation.get() - stepAngle); }
  }, [rotation, stepAngle, snapToNearestCard]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const rotateToIndex = (targetIdx: number) => {
    animControlsRef.current?.stop();
    const current = rotation.get();
    const currentNorm = normalizeAngle(-current);
    const targetNorm = targetIdx * stepAngle;
    let diff = targetNorm - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    animate(rotation, current - diff, { type: "spring", stiffness: 160, damping: 24, mass: 0.8 });
  };

  const handleNext = () => { animControlsRef.current?.stop(); const current = rotation.get(); animate(rotation, Math.round((current - stepAngle) / stepAngle) * stepAngle, { type: "spring", stiffness: 170, damping: 26 }); };
  const handlePrev = () => { animControlsRef.current?.stop(); const current = rotation.get(); animate(rotation, Math.round((current + stepAngle) / stepAngle) * stepAngle, { type: "spring", stiffness: 170, damping: 26 }); };

  const ambientColors = useMemo(() => resolveAmbientColors(safeItems[activeIndex]), [safeItems, activeIndex]);

  return (
    <div className={`relative w-full min-h-[640px] flex flex-col items-center justify-between ${className}`}>
      {mounted && <CinematicLightLeaks colors={ambientColors} />}
      {headerContent && <div className="w-full max-w-3xl mx-auto pt-2 pb-4 px-4 text-center z-20">{headerContent}</div>}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        style={{ perspective: `${perspective}px`, perspectiveOrigin: "center 48%" }}
        className="relative w-full h-[520px] flex items-center justify-center touch-none cursor-grab"
      >
        <motion.div
          animate={{ background: `radial-gradient(circle, ${ambientColors.centerGlow} 0%, transparent 70%)` }}
          className="absolute w-[600px] h-[340px] rounded-full blur-3xl pointer-events-none -z-10"
        />
        <motion.div
          style={{ transformStyle: "preserve-3d", rotateY: rotation, width: itemWidth, height: itemHeight }}
          className="relative will-change-transform flex items-center justify-center"
        >
          {safeItems.map((item, idx) => (
            <CarouselItemCard
              key={idx} index={idx} item={item} angle={idx * stepAngle} radius={radius}
              width={itemWidth} height={itemHeight} isActive={idx === activeIndex}
              onCardClick={() => {
                if (hasDraggedRef.current) return;
                if (idx === activeIndex) {
                  window.open(item.href || "#", "_blank");
                } else {
                  rotateToIndex(idx);
                }
              }}
              videoRefCallback={(el) => { videoRefs.current[idx] = el; }}
            />
          ))}
        </motion.div>
      </div>
      {/* Interactive Bottom Bar: Caleb Wu Style Navigation Indicator + Bottom-Right Help Tooltip */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-3 pb-8 flex items-center justify-center relative z-20">
        {/* Caleb Wu Style Navigation Pill */}
        <div
          data-no-drag="true"
          className="group/pill relative flex items-center rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-1.5 pl-4 pr-2 transition-all duration-300 hover:border-zinc-400"
        >
          {/* Step Back Arrow */}
          <button
            onClick={handlePrev}
            aria-label="Previous item"
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-200/60 transition-colors mr-1 cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Numeric Text "01 of 08" */}
          <div className="flex items-center text-xs font-mono whitespace-nowrap text-zinc-500 pr-1">
            <span className="font-semibold text-zinc-900">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mx-1 text-zinc-400">of</span>
            <span>{String(count).padStart(2, "0")}</span>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-4 bg-zinc-300 mx-2" />

          {/* Overlapping Expandable Circular Thumbnail Stack */}
          <div className="flex items-center pl-1 group-hover/pill:pl-3 transition-[padding] duration-300 ease-out">
            {safeItems.map((item, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={`thumb-${item.title}-${idx}`}
                  onClick={() => rotateToIndex(idx)}
                  className={`group/thumb relative size-7 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                    idx === 0 ? "ml-0" : "-ml-2.5 group-hover/pill:ml-1.5"
                  }`}
                  style={{ zIndex: isCurrent ? 20 : safeItems.length - idx }}
                >
                  {/* Tooltip Title on Thumbnail Hover */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap text-zinc-900 text-xs font-medium bg-[#fbfaf5] border border-zinc-300/90 px-2.5 py-1 rounded-full shadow-lg z-50">
                    {item.title}
                  </span>

                  {/* Thumbnail Avatar Bubble */}
                  <div
                    className={`size-full overflow-hidden rounded-full border-2 transition-transform duration-200 bg-zinc-900 ${
                      isCurrent
                        ? "border-[#c8d5bb] ring-2 ring-zinc-800 scale-110 shadow-sm"
                        : "border-[#fbfaf5] opacity-75 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    {item.type === "video" ? (
                      <div className="size-full flex items-center justify-center bg-zinc-900 text-white">
                        <Play className="size-2.5 fill-white text-white" />
                      </div>
                    ) : (
                      <div className="relative size-full">
                        <Image
                          src={item.src}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step Next Arrow */}
          <button
            onClick={handleNext}
            aria-label="Next item"
            className="p-1 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-200/60 transition-colors ml-2 cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Bottom Right Simple '?' Tooltip */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 group/help z-30">
          <button
            type="button"
            data-no-drag="true"
            aria-label="Navigation help"
            className="size-8 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 backdrop-blur-md shadow-sm text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="size-4" />
          </button>

          {/* Tooltip Popover */}
          <div className="absolute right-0 bottom-full mb-2 pointer-events-none opacity-0 translate-y-1 scale-95 group-hover/help:opacity-100 group-hover/help:translate-y-0 group-hover/help:scale-100 transition-all duration-200 ease-out z-50 whitespace-nowrap">
            <div className="rounded-xl border border-zinc-300/80 bg-[#fbfaf5]/95 backdrop-blur-md px-3 py-1.5 shadow-lg text-xs font-sans text-zinc-700">
              Drag or use ← → arrow keys to spin through items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CarouselItemCardProps {
  index: number; item: Carousel3DItem; angle: number; radius: number; width: number; height: number;
  isActive: boolean; onCardClick: () => void; videoRefCallback: (el: HTMLVideoElement | null) => void;
}

function CarouselItemCard({ index, item, angle, radius, width, height, isActive, onCardClick, videoRefCallback }: CarouselItemCardProps) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

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
  };

  const handlePointerLeave = () => {
    setIsCardHovered(false);
  };

  return (
    <div
      data-card-index={index}
      style={{
        transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
        width: `${width}px`,
        height: `${height}px`,
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: `-${width / 2}px`,
        marginTop: `-${height / 2}px`,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className="group select-none"
    >
      <div
        onClick={onCardClick}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`relative size-full flex flex-col justify-between rounded-[28px] border p-3.5 transition-colors ${
          isActive
            ? "bg-[#fbfaf5] border-zinc-400 shadow-xl cursor-none"
            : "bg-[#fbfaf5]/90 border-zinc-300 shadow-md cursor-pointer"
        }`}
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
            opacity: isCardHovered && isActive ? 1 : 0,
            scale: isCardHovered && isActive ? 1 : 0.6,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 z-50 pointer-events-none whitespace-nowrap drop-shadow-2xl"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-300/90 bg-[#fbfaf5]/95 backdrop-blur-md shadow-2xl text-xs font-semibold text-zinc-900">
            <span>Open to view</span>
            <ArrowUpRight className="size-3.5 text-zinc-800" />
          </div>
        </motion.div>

        <div className="relative flex-1 w-full rounded-[20px] overflow-hidden bg-zinc-900 border border-zinc-200/60 min-h-[300px]">
          {item.type === "video" ? (
            <video
              ref={videoRefCallback}
              src={item.src}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover"
            />
          )}
          {item.type === "video" && (
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1.5 shadow-sm">
              <Play className="size-2.5 fill-white text-white" />
              <span>Video</span>
            </div>
          )}
        </div>
        <div className="mt-3 px-1">
          <h4 className="font-semibold text-base text-zinc-900 truncate">
            {item.title}
          </h4>
          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
            {item.description || "Click to open project"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function CinematicLightLeaks({ colors }: { colors: AmbientColors }) {
  const mounted = useIsMounted();

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(
    <div
      id="carousel-3d-light-leaks"
      className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none select-none -z-50"
      style={{ zIndex: -50 }}
      aria-hidden="true"
    >
      {/* Top-Left Anamorphic Corner Flare */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 8% 8%, ${colors.topLeft} 0%, rgba(251, 250, 245, 0) 75%)`,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-[15%] -left-[12%] w-[75vw] max-w-[1100px] h-[70vh] max-h-[900px] blur-[110px] opacity-90 will-change-[background]"
      />

      {/* Top-Right Cinematic Corner Light Leak */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 92% 8%, ${colors.topRight} 0%, rgba(251, 250, 245, 0) 75%)`,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-[15%] -right-[12%] w-[75vw] max-w-[1100px] h-[70vh] max-h-[900px] blur-[110px] opacity-85 will-change-[background]"
      />

      {/* Bottom-Left Atmospheric Ground Flare */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 8% 92%, ${colors.bottomLeft} 0%, rgba(251, 250, 245, 0) 70%)`,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-[15%] -left-[12%] w-[75vw] max-w-[1100px] h-[65vh] max-h-[850px] blur-[120px] opacity-80 will-change-[background]"
      />

      {/* Bottom-Right Soft Prismatic Glow */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 92% 92%, ${colors.bottomRight} 0%, rgba(251, 250, 245, 0) 70%)`,
        }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -bottom-[15%] -right-[12%] w-[75vw] max-w-[1100px] h-[60vh] max-h-[800px] blur-[110px] opacity-75 will-change-[background]"
      />

      {/* Center Stage Atmospheric Halo */}
      <motion.div
        animate={{
          background: `radial-gradient(ellipse at 50% 50%, ${colors.centerGlow} 0%, rgba(251, 250, 245, 0) 70%)`,
        }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1000px] h-[65vh] max-h-[700px] blur-[90px] opacity-75 will-change-[background]"
      />
    </div>,
    document.body
  );
}

export default Carousel3D;

