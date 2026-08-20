"use client";

import React, { useEffect, useState, useCallback, useSyncExternalStore } from "react";

interface ClickBurst {
  id: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

function subscribeReducedMotion(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function CursorClickEffect() {
  const [bursts, setBursts] = useState<ClickBurst[]>([]);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const handleClick = useCallback(
    (e: PointerEvent) => {
      // Only primary mouse button or touch/pen
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (reducedMotion) return;

      const x = e.clientX;
      const y = e.clientY;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      // Subtle organic tilt while preserving the top-left radiating direction
      const rotation = Math.floor((Math.random() - 0.5) * 16);

      const size = 34; // Compact, refined spark size

      const newBurst: ClickBurst = {
        id,
        x,
        y,
        rotation,
        size,
      };

      setBursts((prev) => [...prev.slice(-15), newBurst]);
    },
    [reducedMotion]
  );

  const removeBurst = useCallback((id: string) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  useEffect(() => {
    window.addEventListener("pointerdown", handleClick, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", handleClick);
    };
  }, [handleClick]);

  if (reducedMotion || bursts.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none"
    >
      {bursts.map((burst) => (
        <ThreeDashBurstInstance
          key={burst.id}
          burst={burst}
          onComplete={() => removeBurst(burst.id)}
        />
      ))}
    </div>
  );
}

function ThreeDashBurstInstance({
  burst,
  onComplete,
}: {
  burst: ClickBurst;
  onComplete: () => void;
}) {
  const { x, y, rotation, size } = burst;

  return (
    <div
      style={{
        position: "absolute",
        left: x - size * 0.85,
        top: y - size * 0.65,
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "bottom right",
      }}
      className="cursor-spark-container"
      onAnimationEnd={onComplete}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
      >
        {/* Top diagonal pill */}
        <line
          x1="52"
          y1="17"
          x2="67"
          y2="38"
          strokeWidth="10"
          strokeLinecap="round"
          className="cursor-spark-line cursor-spark-line-top"
        />
        {/* Middle horizontal pill */}
        <line
          x1="21"
          y1="42"
          x2="66"
          y2="51"
          strokeWidth="10"
          strokeLinecap="round"
          className="cursor-spark-line cursor-spark-line-mid"
        />
        {/* Bottom diagonal pill */}
        <line
          x1="29"
          y1="81"
          x2="66"
          y2="68"
          strokeWidth="10"
          strokeLinecap="round"
          className="cursor-spark-line cursor-spark-line-bot"
        />
      </svg>
    </div>
  );
}

export default CursorClickEffect;

