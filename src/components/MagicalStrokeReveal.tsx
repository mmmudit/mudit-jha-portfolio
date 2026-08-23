"use client";

import React, { useEffect, useRef, useState, useId } from "react";
import { useReducedMotion } from "framer-motion";

export interface MagicalStrokeRevealProps {
  svgPath?: string;
  svgPaths?: string[];
  viewBox?: string;
  trigger?: boolean;
  duration?: number;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  autoPlayOnMount?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  initialAlpha: number;
  life: number;
  maxLife: number;
  color: string;
  isStar: boolean;
  rotation: number;
  rotSpeed: number;
}

const SPARKLE_COLORS = [
  "#FFD700", // Gold
  "#FFF8DB", // Warm white
  "#FFE57F", // Bright pale amber
  "#FFFFFF", // Pure star white
  "#FBBF24", // Golden yellow
  "#FEF08A", // Light lemon
  "#F59E0B", // Deep amber
];

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function MagicalStrokeReveal({
  svgPath,
  svgPaths,
  viewBox = "0 0 176.431 57.9158",
  trigger = true,
  duration = 1600,
  className = "",
  strokeColor = "#3f3f46",
  strokeWidth = 2.2,
  autoPlayOnMount = false,
}: MagicalStrokeRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);

  // Normalize paths list
  const pathsList = svgPaths && svgPaths.length > 0
    ? svgPaths
    : svgPath
    ? [svgPath]
    : [
        "M3.2 26.5C10 20 22 11 31 7.2C30 18 24 36 11 54C13 57.8 14.5 56.5 22 44C33 24 45 12 51 7.5C49 17 45 32 42.5 38C44 39.5 46 38 48 36C56 26 64 15 73.5 3.5C76 1 74 6 72.5 11C68 28 62 44 59.5 53.5C62 54.5 68 40 71 32C76 12 77 2 73.5 0.5",
        "M1.5 17C35 15.5 88 13.5 123 12C121 12 112 20 95 30.5C65 48 41 50 43 45C49 39 81 30 120 22.5C138 16.5 141 14 139 15.5C130 21 123 26 124 28C130 26.5 152 27 164 22.5C164 20 155 20.5 153 23.5C158 26.5 174 27.5 175 26.5",
      ];

  const pathLengthsRef = useRef<number[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Parse viewBox values [minX, minY, vbWidth, vbHeight]
  const vbParts = viewBox.split(" ").map(Number);
  const vbWidth = vbParts[2] || 176;
  const vbHeight = vbParts[3] || 58;

  useEffect(() => {
    // Measure lengths on mount
    pathLengthsRef.current = pathRefs.current.map((pathEl) => {
      if (!pathEl) return 0;
      try {
        const len = pathEl.getTotalLength();
        pathEl.style.strokeDasharray = `${len}`;
        pathEl.style.strokeDashoffset = `${len}`;
        return len;
      } catch {
        return 0;
      }
    });
    setIsReady(true);
  }, [pathsList.length]);

  useEffect(() => {
    if (!isReady) return;

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const container = containerRef.current;
    if (!container || !canvas || !ctx) return;

    if (!trigger && !autoPlayOnMount) {
      // Reset stroke
      pathRefs.current.forEach((p, idx) => {
        if (p) {
          const len = pathLengthsRef.current[idx] || 0;
          p.style.strokeDashoffset = `${len}`;
        }
      });
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = [];
      return;
    }

    // Handle Reduced Motion
    if (shouldReduceMotion) {
      pathRefs.current.forEach((p) => {
        if (p) p.style.strokeDashoffset = "0";
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Setup Canvas DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const scaleX = rect.width / vbWidth;
    const scaleY = rect.height / vbHeight;

    const totalLengths = pathLengthsRef.current;
    const grandTotalLength = totalLengths.reduce((a, b) => a + b, 0) || 1;

    let startTime: number | null = null;
    particlesRef.current = [];

    const spawnParticles = (canvasX: number, canvasY: number, count: number) => {
      if (particlesRef.current.length >= 120) return;

      for (let i = 0; i < count; i++) {
        // Bias outward and upward: angle between -150deg and -30deg
        const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.9;
        const speed = 0.6 + Math.random() * 1.8;
        const isStar = Math.random() < 0.18; // 18% magical twinkle stars
        const life = 400 + Math.random() * 350; // 400 - 750ms

        particlesRef.current.push({
          x: canvasX + (Math.random() - 0.5) * 4,
          y: canvasY + (Math.random() - 0.5) * 4,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.4, // upward drift
          size: isStar ? 4 + Math.random() * 3.5 : 1.8 + Math.random() * 2.8,
          alpha: 1,
          initialAlpha: 0.85 + Math.random() * 0.15,
          life,
          maxLife: life,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          isStar,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
    };

    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      rot: number
    ) => {
      let rotOffset = rot;
      const step = Math.PI / spikes;
      c.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(rotOffset) * r;
        const y = cy + Math.sin(rotOffset) * r;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
        rotOffset += step;
      }
      c.closePath();
      c.fill();
    };

    let lastFrameTime = performance.now();

    const animateLoop = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const dt = Math.min(now - lastFrameTime, 40);
      lastFrameTime = now;

      const rawProgress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(rawProgress);

      // Animate stroke draw across sequential paths
      let cumulativeLength = 0;
      const currentTargetLength = easedProgress * grandTotalLength;
      let tipX: number | null = null;
      let tipY: number | null = null;

      for (let idx = 0; idx < pathRefs.current.length; idx++) {
        const pathEl = pathRefs.current[idx];
        if (!pathEl) continue;
        const pathLen = totalLengths[idx] || 0;
        const pathStart = cumulativeLength;
        const pathEnd = cumulativeLength + pathLen;

        if (currentTargetLength <= pathStart) {
          pathEl.style.strokeDashoffset = `${pathLen}`;
        } else if (currentTargetLength >= pathEnd) {
          pathEl.style.strokeDashoffset = "0";
          if (rawProgress < 1 && idx === pathRefs.current.length - 1) {
            try {
              const pt = pathEl.getPointAtLength(pathLen);
              tipX = pt.x * scaleX;
              tipY = pt.y * scaleY;
            } catch {}
          }
        } else {
          const pathProgressLength = currentTargetLength - pathStart;
          const offset = pathLen - pathProgressLength;
          pathEl.style.strokeDashoffset = `${offset}`;
          try {
            const pt = pathEl.getPointAtLength(pathProgressLength);
            tipX = pt.x * scaleX;
            tipY = pt.y * scaleY;
          } catch {}
        }
        cumulativeLength += pathLen;
      }

      // Spawn particles at current tip if drawing is active
      if (rawProgress < 1 && tipX !== null && tipY !== null) {
        spawnParticles(tipX, tipY, 2 + Math.floor(Math.random() * 3));
      }

      // Update and render particles on canvas
      ctx.clearRect(0, 0, rect.width, rect.height);

      const activeParticles: Particle[] = [];

      for (const p of particlesRef.current) {
        p.life -= dt;
        if (p.life > 0) {
          const progress = 1 - p.life / p.maxLife;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.015; // gentle gravity
          p.rotation += p.rotSpeed;
          p.alpha = p.initialAlpha * (1 - progress);
          const currentSize = Math.max(0.2, p.size * (1 - progress * 0.7));

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.isStar ? 6 : 3;

          if (p.isStar) {
            drawStar(ctx, p.x, p.y, 4, currentSize * 1.5, currentSize * 0.35, p.rotation);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          activeParticles.push(p);
        }
      }

      particlesRef.current = activeParticles;

      // Keep loop running until stroke finishes AND remaining sparkle particles fade away
      if (rawProgress < 1 || activeParticles.length > 0) {
        animFrameIdRef.current = requestAnimationFrame(animateLoop);
      } else {
        animFrameIdRef.current = null;
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [trigger, isReady, duration, vbWidth, vbHeight, shouldReduceMotion, autoPlayOnMount]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      {/* SVG Handwriting Stroke Path Layer */}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible pointer-events-none"
        style={{ display: "block" }}
      >
        {pathsList.map((d, index) => (
          <path
            key={index}
            ref={(el) => {
              pathRefs.current[index] = el;
            }}
            d={d}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: shouldReduceMotion ? "opacity 0.4s ease" : "none",
              opacity: shouldReduceMotion ? (trigger ? 1 : 0) : 1,
            }}
          />
        ))}
      </svg>

      {/* High-performance Particle Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{ display: shouldReduceMotion ? "none" : "block" }}
      />
    </div>
  );
}
