"use client";

import React, { useEffect, useRef } from "react";

interface PixelAudioVisualizerProps {
  color?: string;
  secondaryColor?: string;
  columns?: number;
  maxBlocks?: number;
  blockSize?: number;
  gap?: number;
  speed?: number;
  triggerKey?: string;
  active?: boolean;
  className?: string;
}

export function PixelAudioVisualizer({
  color = "#27272a",
  secondaryColor = "#ff2a85",
  columns = 44,
  maxBlocks = 11,
  blockSize = 4,
  gap = 2,
  speed = 0.065,
  triggerKey,
  active = true,
  className = "",
}: PixelAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef({ color, secondaryColor });
  const triggerRef = useRef(triggerKey);
  const activeRef = useRef(active);

  colorRef.current = { color, secondaryColor };
  triggerRef.current = triggerKey;
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    let time = 0;
    let transitionProgress = 0; // 0 to 1 progressive bottom-to-top reveal
    let prevTriggerKey = triggerRef.current;

    // Accessibility check for reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const width = columns * (blockSize + gap) - gap;
    const height = maxBlocks * (blockSize + gap);

    // Retina display scaling
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // IntersectionObserver to pause loop when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    // Precalculate bottom-to-top vertical rise thresholds with organic column stagger
    const pixelDissolveThresholds: number[][] = Array.from(
      { length: columns },
      (_, col) =>
        Array.from({ length: maxBlocks }, (_, row) => {
          const verticalRatio = row / maxBlocks;
          const colJitter = (((col * 13) % 7) / 7) * 0.12;
          return Math.min(0.85, verticalRatio * 0.72 + colJitter);
        })
    );

    // Initialize columns with peak hold timing
    const colData = Array.from({ length: columns }, (_, i) => ({
      freq1: 0.08 + Math.sin(i * 0.3) * 0.04,
      freq2: 0.15 + Math.cos(i * 0.5) * 0.06,
      phase: i * 0.28,
      speedMult: 0.85 + (i % 5) * 0.15,
      currentBlocks: 1,
      peakBlock: 1,
      peakHoldFrames: 0,
      peakDropVelocity: 0,
    }));

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Check if trigger key changed -> reset surge animation seamlessly
      if (triggerRef.current !== prevTriggerKey) {
        prevTriggerKey = triggerRef.current;
        transitionProgress = 0;
      }

      // Advance bottom-to-top surge progress with cubic ease-out
      if (transitionProgress < 1) {
        transitionProgress = Math.min(1, transitionProgress + 0.042);
      }
      // Cubic ease-out curve: starts fast, lands smoothly
      const easedProgress = prefersReducedMotion
        ? 1
        : 1 - Math.pow(1 - transitionProgress, 3);

      const isActive = activeRef.current;
      const { color: curColor, secondaryColor: curSecColor } = colorRef.current;

      colData.forEach((col, i) => {
        const normIndex = i / columns;
        const envelope = Math.sin(Math.PI * normIndex) * 0.65 + 0.35;

        // Dynamic harmonic wave calculations
        const animSpeed = prefersReducedMotion ? 0.005 : speed;
        const wave1 = Math.sin(time * col.speedMult + col.phase);
        const wave2 = Math.cos(time * 0.7 * col.speedMult + col.phase * 1.4);
        const wave3 = Math.sin(time * 1.8 + i * 0.4);

        const rawHeight = (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + 1) / 2;
        const availableMax = isActive ? maxBlocks : Math.min(3, maxBlocks);

        const targetBlocks = Math.max(
          1,
          Math.min(
            availableMax,
            Math.round(rawHeight * availableMax * envelope + (isActive ? Math.random() * 0.4 : 0))
          )
        );

        // Smooth height interpolation
        col.currentBlocks += (targetBlocks - col.currentBlocks) * (isActive ? 0.25 : 0.12);

        // Authentic Hi-Fi Peak Physics (Peak Hold + Gravity Acceleration)
        if (targetBlocks >= col.peakBlock) {
          col.peakBlock = targetBlocks;
          col.peakHoldFrames = 12; // Hold at apex for ~200ms
          col.peakDropVelocity = 0;
        } else {
          if (col.peakHoldFrames > 0) {
            col.peakHoldFrames--;
          } else {
            // Gravity acceleration
            col.peakDropVelocity += 0.035;
            col.peakBlock = Math.max(1, col.peakBlock - col.peakDropVelocity);
          }
        }

        const activeCount = Math.round(col.currentBlocks);
        const x = i * (blockSize + gap);

        // Draw stacked blocks from bottom up
        for (let b = 0; b < maxBlocks; b++) {
          const y = height - (b + 1) * (blockSize + gap);
          const isFilled = b < activeCount;
          const isPeak = b === Math.round(col.peakBlock) - 1;

          if (isFilled || (isActive && isPeak)) {
            // Bottom-to-top threshold check
            const threshold = pixelDissolveThresholds[i][b];
            if (threshold > easedProgress && isActive) {
              continue;
            }

            // Pixel spawn flash & rise effect
            const ageProgress = (easedProgress - threshold) / 0.16;
            const isSpawning = isActive && ageProgress >= 0 && ageProgress < 1;

            if (isSpawning) {
              // Flash brighter / secondary color on upward surge
              ctx.fillStyle = curSecColor || "#ffffff";
              ctx.globalAlpha = 1;
            } else if (isPeak && !isFilled) {
              ctx.fillStyle = curSecColor || curColor;
              ctx.globalAlpha = 0.95;
            } else {
              const heightRatio = b / maxBlocks;
              if (isActive) {
                ctx.fillStyle = heightRatio > 0.65 ? curSecColor : curColor;
                ctx.globalAlpha = isFilled ? 0.85 + heightRatio * 0.15 : 0.4;
              } else {
                ctx.fillStyle = "#a1a1aa";
                ctx.globalAlpha = 0.35;
              }
            }

            // Rising scale-pop from bottom
            const pixelScale = isSpawning ? Math.min(1, 0.35 + ageProgress * 0.65) : 1;
            const offset = ((1 - pixelScale) * blockSize) / 2;
            const currentBlockSize = blockSize * pixelScale;

            ctx.beginPath();
            if (ctx.roundRect) {
              ctx.roundRect(
                x + offset,
                y + offset,
                currentBlockSize,
                currentBlockSize,
                0.8
              );
            } else {
              ctx.rect(x + offset, y + offset, currentBlockSize, currentBlockSize);
            }
            ctx.fill();
          }
        }
      });

      time += prefersReducedMotion ? 0.005 : speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [columns, maxBlocks, blockSize, gap, speed]);

  const width = columns * (blockSize + gap) - gap;
  const height = maxBlocks * (blockSize + gap);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className={`pointer-events-none ${className}`}
    />
  );
}
