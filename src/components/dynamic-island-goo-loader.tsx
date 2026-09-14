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
 * Custom hook to drive the loader strictly from the scroll GESTURE (wheel & touchmove deltas),
 * not from scroll position. Non-passive preventDefault locks the native page scroll.
 */
export function useScrollUpRefreshGesture({
  enabled = true,
  onRefresh,
  sensitivity = 140,
}: {
  enabled?: boolean;
  onRefresh?: () => void;
  sensitivity?: number;
} = {}) {
  const [pullProgress, setPullProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const isGesturingRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPullProgress(1);
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

    const handleWheel = (e: WheelEvent) => {
      if (isRefreshing) return;

      const isAtTop = window.scrollY <= 1;

      // Scrolling UP produces negative deltaY (e.deltaY < 0).
      // Pulling a surface upward is the gesture that asks for a refresh.
      if (isAtTop && (e.deltaY < 0 || accumulatedDeltaRef.current > 0)) {
        // Prevent default native page scroll and overscroll rubberbanding
        e.preventDefault();

        accumulatedDeltaRef.current -= e.deltaY;
        const nextProg = Math.min(
          1,
          Math.max(0, accumulatedDeltaRef.current / sensitivity)
        );
        setPullProgress(nextProg);

        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);

        if (nextProg >= 0.94) {
          triggerRefresh();
        } else {
          // If user stops scrolling upward before threshold, smoothly spring back to 0
          wheelTimeoutRef.current = setTimeout(() => {
            if (!isRefreshing) {
              accumulatedDeltaRef.current = 0;
              setPullProgress(0);
            }
          }, 180);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isRefreshing) return;
      if (window.scrollY <= 2) {
        touchStartY.current = e.touches[0].clientY;
        isGesturingRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isGesturingRef.current || touchStartY.current === null || isRefreshing)
        return;

      const currentY = e.touches[0].clientY;
      // Dragging upward: startY - currentY > 0
      const pullUpDelta = touchStartY.current - currentY;

      if (pullUpDelta > 0 || accumulatedDeltaRef.current > 0) {
        if (e.cancelable) e.preventDefault();

        const prog = Math.min(1, Math.max(0, pullUpDelta / sensitivity));
        setPullProgress(prog);
      }
    };

    const handleTouchEnd = () => {
      if (!isGesturingRef.current || isRefreshing) return;
      isGesturingRef.current = false;
      touchStartY.current = null;

      if (pullProgress >= 0.92) {
        triggerRefresh();
      } else {
        setPullProgress(0);
        accumulatedDeltaRef.current = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [enabled, isRefreshing, pullProgress, sensitivity, triggerRefresh]);

  return {
    pullProgress,
    isRefreshing,
    setPullProgress,
    triggerRefresh,
    isGooActive: pullProgress > 0 || isRefreshing,
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

  // Spring animation for smooth, physical gesture tracking & snap-back
  const progressMotion = useMotionValue(effectiveProgress);
  const smoothProgress = useSpring(progressMotion, {
    stiffness: 420,
    damping: 32,
    mass: 0.6,
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
    [0, 0.85, 1],
    [PUCK_MIN_SCALE, 0.96, 1]
  );

  // Spinner entrance: brought in while the puck is STILL ATTACHED (between 0.32 and 0.72),
  // not after it lands. Held to the end it reads as a second animation starting;
  // bringing it in early makes it read as one thing becoming a loader.
  const spinnerOpacity = useTransform(
    smoothProgress,
    [0, 0.32, 0.72, 1],
    [0, 0, 1, 1]
  );
  const spinnerScale = useTransform(
    smoothProgress,
    [0, 0.32, 0.72, 1],
    [0.4, 0.4, 1, 1]
  );

  // Slight Island squash & stretch during downward pulling to feel organic
  const islandScaleX = useTransform(
    smoothProgress,
    [0, 0.4, 0.75, 1],
    [1, 0.97, 0.985, 1]
  );
  const islandScaleY = useTransform(
    smoothProgress,
    [0, 0.4, 0.75, 1],
    [1, 1.04, 1.01, 1]
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
