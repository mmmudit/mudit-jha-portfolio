"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useZeroGravity } from "@/context/zero-gravity-context";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function ZeroGravityCosmos() {
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const reduce = useReducedMotion();

  // Generate deterministic stars
  const stars: Star[] = useMemo(() => {
    const list: Star[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      // Deterministic pseudorandom values based on index
      const seed1 = Math.sin(i * 997.3) * 10000;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.cos(i * 541.7) * 10000;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin(i * 313.1) * 10000;
      const r3 = seed3 - Math.floor(seed3);

      list.push({
        id: i,
        x: Math.floor(r1 * 100),
        y: Math.floor(r2 * 100),
        size: 1 + r3 * 2,
        opacity: 0.25 + r3 * 0.65,
        duration: 3 + r1 * 4,
        delay: r2 * 2,
      });
    }
    return list;
  }, []);

  const isVisible = isZeroGravity && !isRestoring;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="zero-g-cosmos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Deep celestial ambient backdrop */}
          <div
            className="absolute inset-0 bg-[#090b10]/60 backdrop-blur-[2px] transition-colors duration-700"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 50% 25%, rgba(45, 60, 48, 0.35) 0%, rgba(9, 11, 16, 0.75) 60%, rgba(5, 7, 10, 0.92) 100%)",
            }}
          />

          {/* Twinkling and drifting micro-stars */}
          <div className="absolute inset-0">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  boxShadow: star.size > 2 ? "0 0 6px rgba(255, 255, 255, 0.8)" : "none",
                }}
                animate={
                  reduce
                    ? { opacity: star.opacity }
                    : {
                        opacity: [star.opacity * 0.4, star.opacity, star.opacity * 0.4],
                        y: ["0px", "-12px", "0px"],
                      }
                }
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
