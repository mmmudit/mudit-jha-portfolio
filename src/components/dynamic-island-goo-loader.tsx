"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { play } from "@/lib/sound";

/**
 * Geometric parameters derived according to design specifications:
 * - Idle Island is 126 x 37, fully rounded.
 * - The puck is a CIRCLE: 32x32 at 50% radius, with 8px padding around a 16px spinner.
 * - Puck starts scaled down at rest to submerge completely within the Island.
 * - Derived Travel: folding in half the scaled-away height so the puck's edge never peeks out at rest.
 * - Travel direction: emerges DOWNWARD below the nav bar (+y direction).
 */
export const ISLAND_WIDTH = 126;
export const ISLAND_HEIGHT = 37;
export const PUCK_SIZE = 32;
export const SPINNER_SIZE = 16;
export const SPINNER_PADDING = 8; // 8px padding + 16px spinner + 8px padding = 32px

// Rest scale of the puck inside the island
export const PUCK_MIN_SCALE = 0.5;
// Fold in half the scaled-away height: (1 - 0.5) * 32 / 2 = 8px
export const SCALED_AWAY_HALF = (PUCK_SIZE * (1 - PUCK_MIN_SCALE)) / 2; // 8px

// Detachment separation distance needed for stdDeviation 8 to snap cleanly
export const DETACH_GAP = 16;

// Derived total downward travel distance below the nav bar:
// Island half-height (18.5) + detachment gap (16) + Puck half-height (16) + scaled-away half (8) = 58.5px
export const DERIVED_TRAVEL =
  ISLAND_HEIGHT / 2 + DETACH_GAP + PUCK_SIZE / 2 + SCALED_AWAY_HALF; // 58.5px

/**
 * Asymmetric elastic rubberband resistance curve:
 * Features an initial deadband to ignore minor inadvertent twitches,
 * and ramps up friction progressively as displacement grows, mimicking a viscous liquid droplet.
 */
function calculateElasticProgress(rawDelta: number, targetTravel = 240): number {
  if (rawDelta <= 24) return 0;
  const effectiveDelta = rawDelta - 24;
  const k = 0.55;
  const rubberband = (effectiveDelta * k) / (targetTravel * 0.42 + effectiveDelta * k);
  const normalized = rubberband * 1.78;
  return Math.min(1, Math.max(0, normalized));
}

/**
 * Custom hook to drive the loader strictly from deliberate scroll GESTURES (wheel, touch & pointer deltas),
 * with natural elastic resistance, scroll-from-below immunity, and immediate physical snap-back on gesture cessation.
 */
export function useScrollUpRefreshGesture({
  enabled = true,
  disableOnMobile = true,
  onRefresh,
  sensitivity = 240,
}: {
  enabled?: boolean;
  disableOnMobile?: boolean;
  onRefresh?: () => void;
  sensitivity?: number;
} = {}) {
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const pointerStartY = useRef<number | null>(null);
  const isGesturingRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const arrivedAtTopTimeRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const snapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const snapBack = useCallback(() => {
    if (isRefreshing) return;
    accumulatedDeltaRef.current = 0;
    touchStartY.current = null;
    pointerStartY.current = null;
    isGesturingRef.current = false;
    setIsSnapping(true);
    setPullProgress(0);

    if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    snapTimeoutRef.current = setTimeout(() => {
      setIsSnapping(false);
    }, 420);
  }, [isRefreshing]);

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPullProgress(1);
    setIsSnapping(false);
    play("droplet", { volume: 0.5 });
    onRefresh?.();

    setTimeout(() => {
      setIsRefreshing(false);
      setPullProgress(0);
      accumulatedDeltaRef.current = 0;
      play("success", { volume: 0.45 });
    }, 1600);
  }, [onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    if (disableOnMobile && typeof window !== "undefined") {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      if (isMobile) return;
    }

    const handleScroll = () => {
      if (window.scrollY > 4) {
        arrivedAtTopTimeRef.current = Date.now();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isRefreshing) return;
      if (disableOnMobile && window.innerWidth < 768) return;

      const currentScrollY = window.scrollY;
      if (currentScrollY > 4) {
        arrivedAtTopTimeRef.current = Date.now();
        return;
      }

      const isAtTop = currentScrollY <= 1;
      const isSettledAtTop = Date.now() - arrivedAtTopTimeRef.current >= 400;

      // Prevent accidental reload when user is just scrolling up from lower on the page:
      // If user hasn't settled at the top for at least 400ms, ignore upward wheel momentum.
      if (accumulatedDeltaRef.current === 0 && !isSettledAtTop) {
        return;
      }

      // When pulling down / overscrolling at top (negative deltaY):
      if (isAtTop && (e.deltaY < 0 || accumulatedDeltaRef.current > 0)) {
        // Handle reverse scroll retraction:
        if (e.deltaY > 0 && accumulatedDeltaRef.current > 0) {
          accumulatedDeltaRef.current = Math.max(0, accumulatedDeltaRef.current - e.deltaY * 1.5);
          const nextProg = calculateElasticProgress(accumulatedDeltaRef.current, sensitivity);
          setPullProgress(nextProg);
          if (nextProg <= 0.01) {
            snapBack();
          }
          return;
        }

        // Prevent default native page scroll and overscroll rubberbanding
        e.preventDefault();

        // Progressive friction: resistance increases as displacement grows
        const currentProg = calculateElasticProgress(accumulatedDeltaRef.current, sensitivity);
        const frictionMultiplier = Math.max(0.32, 1 - Math.pow(currentProg, 1.1) * 0.68);

        accumulatedDeltaRef.current += Math.abs(e.deltaY) * frictionMultiplier;
        const nextProg = calculateElasticProgress(accumulatedDeltaRef.current, sensitivity);
        setPullProgress(nextProg);

        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

        // Require deliberate, deep pull and minimum travel distance to activate
        if (nextProg >= 0.96 && accumulatedDeltaRef.current >= 230) {
          triggerRefresh();
        } else {
          // If user stops scrolling before threshold, snap back immediately
          wheelTimeoutRef.current = setTimeout(() => {
            if (!isRefreshing) {
              snapBack();
            }
          }, 110);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      if (disableOnMobile && window.innerWidth < 768) return;
      if (window.scrollY > 4) {
        arrivedAtTopTimeRef.current = Date.now();
        return;
      }
      if (Date.now() - arrivedAtTopTimeRef.current < 400) return;
      if (window.scrollY <= 1) {
        touchStartY.current = e.touches[0].clientY;
        isGesturingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGesturingRef.current || touchStartY.current === null || isRefreshing)
        return;

      const currentY = e.touches[0].clientY;
      const pullDelta = currentY - touchStartY.current;

      if (pullDelta > 0) {
        if (e.cancelable) e.preventDefault();
        accumulatedDeltaRef.current = pullDelta * 1.0;
        const prog = calculateElasticProgress(accumulatedDeltaRef.current, sensitivity);
        setPullProgress(prog);
        if (prog >= 0.96 && accumulatedDeltaRef.current >= 230) {
          triggerRefresh();
        }
      } else {
        accumulatedDeltaRef.current = 0;
        setPullProgress(0);
      }
    };

    const handleTouchEnd = () => {
      if (!isGesturingRef.current || isRefreshing) return;
      isGesturingRef.current = false;
      touchStartY.current = null;

      if (pullProgress >= 0.96 && accumulatedDeltaRef.current >= 230) {
        triggerRefresh();
      } else {
        snapBack();
      }
    };

    // Pointer (mouse drag) pull-down near top of viewport / island
    const handlePointerDown = (e: PointerEvent) => {
      if (isRefreshing || e.button !== 0) return;
      if (disableOnMobile && window.innerWidth < 768) return;
      if (window.scrollY > 4) {
        arrivedAtTopTimeRef.current = Date.now();
        return;
      }
      if (Date.now() - arrivedAtTopTimeRef.current < 400) return;
      if (window.scrollY <= 1 && e.clientY <= 140) {
        pointerStartY.current = e.clientY;
        isGesturingRef.current = true;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isGesturingRef.current || pointerStartY.current === null || isRefreshing) return;
      const pullDelta = e.clientY - pointerStartY.current;

      if (pullDelta > 0) {
        if (e.cancelable) e.preventDefault();
        accumulatedDeltaRef.current = pullDelta * 1.0;
        const prog = calculateElasticProgress(accumulatedDeltaRef.current, sensitivity);
        setPullProgress(prog);
        if (prog >= 0.96 && accumulatedDeltaRef.current >= 230) {
          triggerRefresh();
        }
      } else {
        accumulatedDeltaRef.current = 0;
        setPullProgress(0);
      }
    };

    const handlePointerUp = () => {
      if (!isGesturingRef.current || isRefreshing) return;
      isGesturingRef.current = false;
      pointerStartY.current = null;

      if (pullProgress >= 0.96 && accumulatedDeltaRef.current >= 230) {
        triggerRefresh();
      } else {
        snapBack();
      }
    };

    // Immediate snap-back if cursor leaves window or tab loses focus
    const handleWindowLeave = () => {
      if (!isRefreshing && (accumulatedDeltaRef.current > 0 || isGesturingRef.current || pullProgress > 0)) {
        snapBack();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    window.addEventListener("mouseleave", handleWindowLeave);
    document.addEventListener("mouseleave", handleWindowLeave);
    window.addEventListener("blur", handleWindowLeave);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("mouseleave", handleWindowLeave);
      document.removeEventListener("mouseleave", handleWindowLeave);
      window.removeEventListener("blur", handleWindowLeave);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      if (snapTimeoutRef.current) clearTimeout(snapTimeoutRef.current);
    };
  }, [enabled, isRefreshing, pullProgress, sensitivity, triggerRefresh, snapBack]);

  return {
    pullProgress,
    isRefreshing,
    setPullProgress,
    triggerRefresh,
    isGooActive: pullProgress > 0 || isRefreshing || isSnapping,
  };
}

export function DynamicIslandGooFilter() {
  return (
    <svg
      className="sr-only absolute pointer-events-none"
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0 }}
    >
      <defs>
        {/*
          The goo is an SVG filter:
          - feGaussianBlur stdDeviation 8
          - feColorMatrix with alpha row: 18 gain, -7 bias.
            Alpha under ~38.9% snaps to 0, over snaps to 1.
          - feComposite atop paints the sharp original (SourceGraphic) back over the blur
            so the spinner inside the puck stays razor crisp.
          - Filter bounds extended downward (y="-40%", height="340%") so downward travel is never clipped.
        */}
        <filter
          id="island-goo"
          colorInterpolationFilters="sRGB"
          x="-60%"
          y="-40%"
          width="220%"
          height="340%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

interface DynamicIslandGooLoaderProps {
  /** Controlled progress (0..1) */
  progress: number;
  /** Whether loading/refreshing is in progress */
  isLoading?: boolean;
  /** Extra class name */
  className?: string;
  /** Custom theme override ('light' | 'dark' | 'auto') */
  theme?: "light" | "dark" | "auto";
}

export function DynamicIslandGooLoader({
  progress,
  isLoading = false,
  className = "",
  theme = "auto",
}: DynamicIslandGooLoaderProps) {
  const effectiveProgress = isLoading ? 1 : progress;

  // Spring animation calibrated for Apple-like fluid elasticity:
  // Damping ratio (~0.76) allows organic, tactile recoil and snappy physical snap-back
  const progressMotion = useMotionValue(effectiveProgress);
  const smoothProgress = useSpring(progressMotion, {
    stiffness: 350,
    damping: 23,
    mass: 0.65,
  });

  useEffect(() => {
    progressMotion.set(effectiveProgress);
  }, [effectiveProgress, progressMotion]);

  // Derived travel transform: puck emerges DOWNWARD below the nav bar (+y direction)
  const puckY = useTransform(smoothProgress, [0, 1], [0, DERIVED_TRAVEL]);

  // Puck scale: starts at PUCK_MIN_SCALE (0.5) at rest to fit completely inside Island,
  // scaling to 1.0 as it detaches.
  const puckScale = useTransform(
    smoothProgress,
    [0, 0.82, 1],
    [PUCK_MIN_SCALE, 0.96, 1]
  );

  // Spinner entrance: brought in while the puck is STILL ATTACHED (between 0.30 and 0.70),
  // so it reads as one entity becoming a loader.
  const spinnerOpacity = useTransform(
    smoothProgress,
    [0, 0.30, 0.70, 1],
    [0, 0, 1, 1]
  );
  const spinnerScale = useTransform(
    smoothProgress,
    [0, 0.30, 0.70, 1],
    [0.4, 0.4, 1, 1]
  );

  // Pronounced Island squash & stretch during downward pulling for a highly elastic feel
  const islandScaleX = useTransform(
    smoothProgress,
    [0, 0.35, 0.75, 1],
    [1, 0.95, 0.98, 1]
  );
  const islandScaleY = useTransform(
    smoothProgress,
    [0, 0.35, 0.75, 1],
    [1, 1.06, 1.02, 1]
  );

  // Opacity of the decorative border ring on the detached puck
  const puckRingOpacity = useTransform(smoothProgress, [0, 0.65, 0.88, 1], [0, 0, 0.8, 1]);

  // Theme-aware colors matching the nav bar aesthetic:
  // Light mode: #fbfaf5 (warm dough / cream) with zinc-300 border and zinc-800 / Willow Green spinner
  // Dark mode: #18181b (zinc-900) with white/15 border and Willow Green #C8D5BB spinner
  const isExplicitDark = theme === "dark";
  const isExplicitLight = theme === "light";

  const islandBgClass = isExplicitDark
    ? "bg-zinc-900"
    : isExplicitLight
    ? "bg-[#fbfaf5]"
    : "bg-[#fbfaf5] dark:bg-zinc-900";

  const puckBgClass = isExplicitDark
    ? "bg-zinc-900"
    : isExplicitLight
    ? "bg-[#fbfaf5]"
    : "bg-[#fbfaf5] dark:bg-zinc-900";

  const ringBorderClass = isExplicitDark
    ? "border-white/15 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
    : isExplicitLight
    ? "border-zinc-300/80 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
    : "border-zinc-300/80 dark:border-white/15 shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]";

  const spinnerColorClass = isExplicitDark
    ? "text-[#C8D5BB]"
    : isExplicitLight
    ? "text-zinc-800"
    : "text-zinc-800 dark:text-[#C8D5BB]";

  const spinnerTrackClass = isExplicitDark
    ? "stroke-white/20"
    : isExplicitLight
    ? "stroke-zinc-300/70"
    : "stroke-zinc-300/70 dark:stroke-white/20";

  return (
    <>
      <DynamicIslandGooFilter />

      <div
        className={`relative flex flex-col items-center justify-center select-none overflow-visible ${className}`}
        style={{
          height: ISLAND_HEIGHT,
          width: ISLAND_WIDTH,
        }}
      >
        {/*
          THE GOO GROUP
          - Applies filter: "url(#island-goo)"
          - Strictly NO CSS blur and NO box-shadow inside this group.
          - Color matching the nav bar aesthetic:
            Light mode: #fbfaf5 (warm dough / cream)
            Dark mode: zinc-900 (#18181b)
          - Contains:
            1) The Island anchor body (126x37 fully rounded lozenge)
            2) The Puck (32x32 circle, opacity 1 always, emerges DOWNWARD)
        */}
        <div
          className="relative flex items-center justify-center pointer-events-none overflow-visible filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_4px_14px_rgba(0,0,0,0.4)]"
          style={{
            filter: "url(#island-goo)",
            width: ISLAND_WIDTH,
            height: ISLAND_HEIGHT,
          }}
        >
          {/* 1. Idle Island Anchor: 126 x 37, fully rounded, matching nav bar background */}
          <motion.div
            style={{
              width: ISLAND_WIDTH,
              height: ISLAND_HEIGHT,
              borderRadius: 9999,
              scaleX: islandScaleX,
              scaleY: islandScaleY,
              transformOrigin: "center center",
            }}
            className={`absolute inset-0 ${islandBgClass}`}
          />

          {/*
            2. The Puck:
            - EXACT CIRCLE: 32x32 at 50% radius.
            - NEVER faded in. Kept at opacity: 1 ALWAYS.
            - Parked INSIDE the Island at rest (matches nav bar color), hidden because it matches.
            - Travels DOWNWARD below the nav bar: y = +puckY.
          */}
          <motion.div
            style={{
              width: PUCK_SIZE,
              height: PUCK_SIZE,
              borderRadius: "50%",
              opacity: 1, // Opacity 1 always! Never faded in.
              y: puckY, // Positive Y = emerges DOWNWARD below the nav
              scale: puckScale,
              transformOrigin: "center center",
            }}
            className={`absolute flex items-center justify-center ${puckBgClass}`}
          >
            {/*
              3. The Spinner:
              - 16px spinner with 8px padding on every side inside the 32x32 circle.
              - Crisp and sharp because feComposite atop paints SourceGraphic over goo blur.
              - Enters while the puck is STILL ATTACHED to read as one entity becoming a loader.
              - Color fits nav bar aesthetic: zinc-800 in light, Willow Green #C8D5BB in dark.
            */}
            <motion.div
              style={{
                width: SPINNER_SIZE,
                height: SPINNER_SIZE,
                opacity: spinnerOpacity,
                scale: spinnerScale,
              }}
              className="flex items-center justify-center"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-4 h-4 animate-spin ${spinnerColorClass}`}
                style={{ animationDuration: "750ms" }}
              >
                {/* Track */}
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  strokeWidth="2"
                  className={spinnerTrackClass}
                />
                {/* Spinning arc */}
                <path
                  d="M14 8C14 4.68629 11.3137 2 8 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative tactile border ring around the Island anchor */}
        <div
          className={`absolute inset-0 rounded-full border pointer-events-none ${ringBorderClass}`}
          style={{
            width: ISLAND_WIDTH,
            height: ISLAND_HEIGHT,
          }}
          aria-hidden="true"
        />

        {/* Tactile border ring on the detached puck below the nav bar */}
        <motion.div
          style={{
            width: PUCK_SIZE,
            height: PUCK_SIZE,
            y: puckY,
            scale: puckScale,
            opacity: puckRingOpacity,
          }}
          className={`absolute rounded-full border pointer-events-none ${ringBorderClass}`}
          aria-hidden="true"
        />
      </div>
    </>
  );
}
