"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  MotionValue,
} from "framer-motion";

interface AppleDockTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  radius?: number;
  maxScale?: number;
  maxLift?: number;
  baseColor?: string;
  willowColor?: string;
}

export function AppleDockText({
  text,
  className = "",
  charClassName = "",
  radius = 190,
  maxScale = 0.28,
  maxLift = 9,
  baseColor = "#18181b",
  willowColor = "#37522d",
}: AppleDockTextProps) {
  const mouseX = useMotionValue(Infinity);
  const containerRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (reduce) return;
    mouseX.set(e.clientX);
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
  };

  const chars = text.split("");

  return (
    <span
      ref={containerRef}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
      className={`inline-flex flex-wrap items-baseline select-none cursor-default py-1.5 -my-1.5 overflow-visible ${className}`}
    >
      {chars.map((char, index) => (
        <DockCharacter
          key={`${char}-${index}`}
          char={char}
          mouseX={mouseX}
          radius={radius}
          maxScale={maxScale}
          maxLift={maxLift}
          baseColor={baseColor}
          willowColor={willowColor}
          reduce={reduce}
          charClassName={charClassName}
        />
      ))}
    </span>
  );
}

function DockCharacter({
  char,
  mouseX,
  radius,
  maxScale,
  maxLift,
  baseColor,
  willowColor,
  reduce,
  charClassName,
}: {
  char: string;
  mouseX: MotionValue<number>;
  radius: number;
  maxScale: number;
  maxLift: number;
  baseColor: string;
  willowColor: string;
  reduce: boolean | null;
  charClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isSpace = char === " ";

  // Compute signed horizontal distance from cursor to center of this character
  const distance = useTransform(mouseX, (val: number) => {
    if (val === Infinity || !ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    return val - centerX;
  });

  // Non-linear Gaussian-style distribution: High intensity in epicenter, progressive long-tail falloff
  const distanceStops = [
    -radius,
    -radius * 0.65,
    -radius * 0.32,
    0,
    radius * 0.32,
    radius * 0.65,
    radius,
  ];

  const targetScale = useTransform(
    distance,
    distanceStops,
    [
      1,
      1 + maxScale * 0.18,
      1 + maxScale * 0.68,
      1 + maxScale,
      1 + maxScale * 0.68,
      1 + maxScale * 0.18,
      1,
    ],
    { clamp: true }
  );

  const targetY = useTransform(
    distance,
    distanceStops,
    [
      0,
      -maxLift * 0.18,
      -maxLift * 0.68,
      -maxLift,
      -maxLift * 0.68,
      -maxLift * 0.18,
      0,
    ],
    { clamp: true }
  );

  // Progressive color bloom: Rich intense willow at epicenter, feathered transition towards edges
  const targetColor = useTransform(
    distance,
    distanceStops,
    [
      baseColor,
      baseColor,
      willowColor,
      willowColor,
      willowColor,
      baseColor,
      baseColor,
    ],
    { clamp: true }
  );

  // Responsive, fluid Apple spring tuning
  const springConfig = { mass: 0.1, stiffness: 440, damping: 24 };
  const scale = useSpring(targetScale, springConfig);
  const y = useSpring(targetY, springConfig);

  if (isSpace) {
    return (
      <span ref={ref} className="inline-block w-[0.28em]">
        {"\u00A0"}
      </span>
    );
  }

  if (reduce) {
    return (
      <span ref={ref} className={`inline-block ${charClassName}`}>
        {char}
      </span>
    );
  }

  return (
    <motion.span
      ref={ref}
      style={{
        scale,
        y,
        color: targetColor,
      }}
      className={`inline-block origin-bottom will-change-transform ${charClassName}`}
    >
      {char}
    </motion.span>
  );
}
