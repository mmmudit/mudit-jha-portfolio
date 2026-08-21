"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

const BASE_CLIPS_URL = "https://assets.spacefs.com/public/clips";
const BASE_POSTERS_URL = "https://assets.spacefs.com/public/clips/posters";

const CLIPS = [
  "bridge-nyc",
  "burger",
  "california-sunset",
  "canola",
  "space-team",
  "west-village",
  "chicago-summer",
  "carnival-night",
  "goldengate-sunset",
  "jason-lockedin",
  "toronto-islands",
  "nyc-drone",
  "field",
  "soho-summer",
  "matt-ari",
  "mountains",
  "trinity-bellwoods",
  "cinematic-vlog",
  "chicago-summer-2",
  "vancouver",
  "space-photoshoot",
  "main-seq",
];

const FILE_SIZES = [
  "3.2 GB",
  "1.8 GB",
  "4.6 GB",
  "2.4 GB",
  "1.1 GB",
  "2.9 GB",
  "5.3 GB",
  "1.6 GB",
  "3.7 GB",
  "2.2 GB",
  "1.4 GB",
  "4.1 GB",
  "2.7 GB",
  "3.5 GB",
  "1.9 GB",
  "2.1 GB",
  "3.9 GB",
  "1.3 GB",
  "6.2 GB",
  "2.6 GB",
  "4.4 GB",
  "1.7 GB",
];

const CLIP_COUNT = 10;
const TWO_PI = 2 * Math.PI;

function getClipUrl(name: string) {
  return `${BASE_CLIPS_URL}/${name}.mp4`;
}

function getPosterUrl(name: string) {
  return `${BASE_POSTERS_URL}/${name}.jpg`;
}

function cubicEaseOut(t: number) {
  const clamped = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - clamped, 3);
}

function wrapAngle(rad: number) {
  return Math.atan2(Math.sin(rad), Math.cos(rad));
}

interface SpaceFSOrbitHeroProps {
  className?: string;
  /**
   * Scale factor for the carousel. Default is 1.25.
   * Increase this value (e.g. 1.4 or 1.6) to make cards and orbit even larger.
   */
  scale?: number;
}

export function SpaceFSOrbitHero({
  className = "",
  scale: userScale = 1.25,
}: SpaceFSOrbitHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const radiusRef = useRef(420 * userScale);
  const angleRef = useRef(Math.PI);
  const baseSpeedRef = useRef(shouldReduceMotion ? 0 : 0.1);
  const lastScrollYRef = useRef<number | null>(null);
  const scrollVelocityRef = useRef(0);
  const hasKickedInRef = useRef(false);
  const kickStartTimeRef = useRef<number | null>(null);

  const initialAngleDeltasRef = useRef<(number | null)[]>(
    Array(CLIP_COUNT).fill(null)
  );
  const hoveredIndexRef = useRef<number | null>(null);
  const wasBehindRef = useRef<boolean[]>(Array(CLIP_COUNT).fill(false));
  const nextClipPointerRef = useRef(CLIP_COUNT);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(Math.round(340 * userScale));
  const [clipIndices, setClipIndices] = useState<number[]>(() =>
    Array.from({ length: CLIP_COUNT }, (_, i) => i)
  );

  const updateTooltipPos = useCallback((clientX: number, clientY: number) => {
    mousePosRef.current = { x: clientX, y: clientY };
    if (tooltipRef.current) {
      // Pinned to bottom-right of cursor (+20px right, +24px down)
      tooltipRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
    }
  }, []);

  // Initial entry kick after 800ms
  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = window.setTimeout(() => {
      scrollVelocityRef.current = 2.8;
      hasKickedInRef.current = true;
    }, 800);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  // Randomize initial clip starting index
  useEffect(() => {
    const startIndex = Math.floor(Math.random() * CLIPS.length);
    if (startIndex !== 0) {
      nextClipPointerRef.current = startIndex + CLIP_COUNT;
      setClipIndices(
        Array.from({ length: CLIP_COUNT }, (_, i) => (startIndex + i) % CLIPS.length)
      );
    }
  }, []);

  // Responsive radius & card width on container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function handleResize() {
      if (!el) return;
      const h = el.offsetHeight;
      const w = window.innerWidth;

      // Proportional radius with user scale multiplier
      const computedRadius = Math.min(
        Math.max(0.42 * h, 300),
        0.44 * w,
        540
      ) * (userScale / 1.25);

      radiusRef.current = computedRadius;
      // Proportional card width (larger, high-impact presence)
      setCardWidth(Math.round(Math.max(0.88 * computedRadius, 280)));
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userScale]);

  // Global mousemove and scroll listeners to keep tooltip firmly at bottom-right of cursor
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (hoveredIndexRef.current !== null && tooltipRef.current) {
        tooltipRef.current.style.transform = `translate3d(${e.clientX + 20}px, ${e.clientY + 24}px, 0)`;
      }
    };

    const onScroll = () => {
      if (hoveredIndexRef.current !== null && tooltipRef.current) {
        const { x, y } = mousePosRef.current;
        tooltipRef.current.style.transform = `translate3d(${x + 20}px, ${y + 24}px, 0)`;
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Main animation frame loop
  useEffect(() => {
    let animId: number;
    let lastTime = 0;

    const frame = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const rawDelta = timestamp - lastTime;
      lastTime = timestamp;
      const dt = Math.min(rawDelta, 64) / 1000;

      if (!shouldReduceMotion) {
        const currentScrollY = window.scrollY;
        const scrollDiff =
          lastScrollYRef.current === null
            ? 0
            : currentScrollY - lastScrollYRef.current;
        lastScrollYRef.current = currentScrollY;

        const scrollImpulse =
          scrollVelocityRef.current + 0.004 * Math.abs(scrollDiff);
        scrollVelocityRef.current =
          Math.min(5, scrollImpulse) * Math.exp(-1.6 * dt);

        const targetBaseSpeed = hoveredIndexRef.current === null ? 0.1 : 0;
        const blendFactor = 1 - Math.exp(-3.2 * dt);
        baseSpeedRef.current +=
          (targetBaseSpeed - baseSpeedRef.current) * blendFactor;

        const effectiveExtraSpeed =
          hoveredIndexRef.current === null ? scrollVelocityRef.current : 0;
        angleRef.current -= (baseSpeedRef.current + effectiveExtraSpeed) * dt;
      }

      if (hasKickedInRef.current && kickStartTimeRef.current === null) {
        kickStartTimeRef.current = timestamp;
      }

      const elapsedKickSec = shouldReduceMotion
        ? Infinity
        : kickStartTimeRef.current === null
          ? -1
          : (timestamp - kickStartTimeRef.current) / 1000;

      const expansionProgress =
        elapsedKickSec === Infinity
          ? 1
          : 0.45 + 0.55 * cubicEaseOut(elapsedKickSec / 1.9);

      const effectiveRadius = radiusRef.current * expansionProgress;
      const angleStep = TWO_PI / CLIP_COUNT;

      cardRefs.current.forEach((cardEl, idx) => {
        if (!cardEl) return;

        const cardAngle = angleRef.current + idx * angleStep;
        const entryProgress =
          elapsedKickSec === Infinity
            ? 1
            : cubicEaseOut((elapsedKickSec - 0.08 * idx) / 0.85);

        if (entryProgress <= 0) {
          cardEl.style.visibility = "hidden";
          cardEl.style.opacity = "0";
          wasBehindRef.current[idx] = Math.cos(cardAngle) > 0.5;
          return;
        }

        if (initialAngleDeltasRef.current[idx] === null) {
          initialAngleDeltasRef.current[idx] = wrapAngle(-0.25 - cardAngle);
        }

        const deltaAngle = initialAngleDeltasRef.current[idx] ?? 0;
        const interpolatedAngle =
          cardAngle + (entryProgress >= 1 ? 0 : deltaAngle) * (1 - entryProgress);

        const scale = 0.7 + 0.3 * entryProgress;
        const posX = Math.cos(interpolatedAngle) * effectiveRadius;
        const posY = Math.sin(interpolatedAngle) * effectiveRadius;

        // Physical 3D Z-depth separation to completely eliminate clipping between cards
        const zDepth = -Math.cos(interpolatedAngle) * 160;

        const rotX = 4 * Math.sin(interpolatedAngle);
        const rotY = 10 * Math.cos(interpolatedAngle);
        const rotZ =
          wrapAngle(interpolatedAngle - Math.PI) * (180 / Math.PI) * 0.14;

        const isHovered = hoveredIndexRef.current === idx;
        const zIndexValue = isHovered
          ? 100
          : Math.round(40 * (1 - Math.cos(interpolatedAngle)));

        cardEl.style.visibility = "visible";
        cardEl.style.opacity = entryProgress.toFixed(3);
        cardEl.style.zIndex = String(zIndexValue);

        cardEl.style.transform = `translate(-50%, -50%) translate3d(${posX.toFixed(
          2
        )}px, ${posY.toFixed(2)}px, ${zDepth.toFixed(
          2
        )}px) perspective(1100px) rotateX(${rotX.toFixed(
          2
        )}deg) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(
          2
        )}deg) scale(${scale.toFixed(3)})`;

        // Infinite clip swapping when card is on far side of orbit
        const isBehind = Math.cos(cardAngle) > 0.5;
        if (isBehind && !wasBehindRef.current[idx]) {
          const nextClipIdx = nextClipPointerRef.current % CLIPS.length;
          nextClipPointerRef.current += 1;
          setClipIndices((prev) => {
            const next = [...prev];
            next[idx] = nextClipIdx;
            return next;
          });
        }
        wasBehindRef.current[idx] = isBehind;
      });

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [shouldReduceMotion]);

  const handleCardEnter = (idx: number, e: React.MouseEvent) => {
    hoveredIndexRef.current = idx;
    setHoveredIndex(idx);
    const video = videoRefs.current[idx];
    if (video) {
      video.play().catch(() => { });
    }
    updateTooltipPos(e.clientX, e.clientY);
  };

  const handleCardMove = (e: React.MouseEvent) => {
    updateTooltipPos(e.clientX, e.clientY);
  };

  const handleCardLeave = (idx: number) => {
    hoveredIndexRef.current = null;
    setHoveredIndex(null);
    const video = videoRefs.current[idx];
    if (video) {
      video.pause();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[700px] sm:h-[800px] md:h-[900px] overflow-visible pointer-events-none select-none ${className}`}
    >
      {/* 3D Orbit Center: Positioned on the right viewport edge */}
      <div className="relative h-full w-full pointer-events-none overflow-visible">
        <div
          className="absolute right-[2%] md:right-[4%] top-1/2 will-change-transform"
          style={{ perspective: "1100px" }}
        >
          {clipIndices.map((clipIdx, cardIndex) => {
            const clipName = CLIPS[clipIdx];
            const isHovered = hoveredIndex === cardIndex;
            const isAnyHovered = hoveredIndex !== null;

            return (
              <div
                key={cardIndex}
                ref={(el) => {
                  cardRefs.current[cardIndex] = el;
                }}
                className="invisible pointer-events-auto absolute left-0 top-0 will-change-transform"
                onMouseEnter={(e) => handleCardEnter(cardIndex, e)}
                onMouseMove={handleCardMove}
                onMouseLeave={() => handleCardLeave(cardIndex)}
              >
                <div
                  className={`aspect-video overflow-hidden rounded-2xl bg-black/40 border border-black/10 dark:border-white/10 shadow-[0_20px_55px_-12px_rgba(0,0,0,0.45)] transition-[transform,filter,box-shadow] duration-500 ease-out ${isHovered
                    ? "shadow-[0_36px_90px_-16px_rgba(0,0,0,0.75)] ring-2 ring-black/20 dark:ring-white/30"
                    : ""
                    } ${isAnyHovered && !isHovered
                      ? "brightness-[0.55] saturate-[0.8]"
                      : "brightness-100 saturate-100"
                    }`}
                  style={{
                    width: cardWidth,
                    transform: isHovered
                      ? "translateZ(90px) scale(1.06)"
                      : "translateZ(0px) scale(1)",
                  }}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[cardIndex] = el;
                    }}
                    src={getClipUrl(clipName)}
                    poster={getPosterUrl(clipName)}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget;
                      if (v.paused && v.currentTime === 0) {
                        v.currentTime = 0.01;
                      }
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Mouse Cursor Tooltip: Always rendered in DOM with opacity transition & bottom-right offset */}
        <div
          ref={tooltipRef}
          className={`pointer-events-none fixed left-0 top-0 z-[200] flex items-center gap-2.5 whitespace-nowrap rounded-full border border-black/10 dark:border-white/15 bg-zinc-900/90 dark:bg-zinc-900/95 px-4 py-2 text-xs shadow-[0_12px_36px_rgba(0,0,0,0.3)] backdrop-blur-md transition-opacity duration-150 ${hoveredIndex !== null ? "opacity-100" : "opacity-0"
            }`}
          style={{
            willChange: "transform, opacity",
          }}
        >
          <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium text-white tracking-tight">
            {hoveredIndex !== null
              ? `${CLIPS[(clipIndices[hoveredIndex] ?? 0) % CLIPS.length]}.braw`
              : ""}
          </span>
          <span className="text-white/40">·</span>
          <span className="font-mono text-white/70">
            {hoveredIndex !== null
              ? FILE_SIZES[(clipIndices[hoveredIndex] ?? 0) % FILE_SIZES.length]
              : ""}
          </span>
          <span className="text-white/40">·</span>
          <span className="text-white/50 text-[11px]">Zero bytes on disk</span>
        </div>
      </div>
    </div>
  );
}
