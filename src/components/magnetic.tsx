"use client";

import React, { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  range?: number;
}

export function Magnetic({
  children,
  className = "",
  intensity = 0.35,
  range = 100,
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const springConfig = { stiffness: 350, damping: 18, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!ref.current || reduce) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < range) {
      x.set(distanceX * intensity);
      y.set(distanceY * intensity);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduce) {
    return <span className={`inline-block ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.span>
  );
}

export default Magnetic;
