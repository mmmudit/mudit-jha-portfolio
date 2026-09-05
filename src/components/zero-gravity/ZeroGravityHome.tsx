"use client";

import React, { Children, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useZeroGravity } from "@/context/zero-gravity-context";

interface ZeroGravityHomeProps {
  children: React.ReactNode;
}

const DRIFT_PRESETS = [
  { y: -36, x: -14, rotate: -2.6, duration: 6.2, parallaxY: 38, parallaxX: -14, parallaxRot: 2.2 },
  { y: -50, x: 20, rotate: 3.4, duration: 5.5, parallaxY: -46, parallaxX: 18, parallaxRot: -2.6 },
  { y: -26, x: -12, rotate: 1.6, duration: 7.1, parallaxY: 32, parallaxX: -10, parallaxRot: 1.8 },
  { y: -56, x: -22, rotate: -3.2, duration: 5.8, parallaxY: -48, parallaxX: -16, parallaxRot: -2.4 },
  { y: -42, x: 16, rotate: 2.2, duration: 6.5, parallaxY: 40, parallaxX: 14, parallaxRot: 2.0 },
];

function ZeroGravitySectionItem({
  child,
  index,
  isZeroG,
  reduce,
}: {
  child: React.ReactNode;
  index: number;
  isZeroG: boolean;
  reduce: boolean;
}) {
  const itemRef = useRef<HTMLDivElement>(null);
  const preset = DRIFT_PRESETS[index % DRIFT_PRESETS.length];
  const staggerDelay = reduce ? 0 : index * 0.09;

  // Viewport scroll tracking for subtle 3D orbital parallax
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    isZeroG && !reduce ? [-preset.parallaxY, preset.parallaxY] : [0, 0]
  );
  const parallaxX = useTransform(
    scrollYProgress,
    [0, 1],
    isZeroG && !reduce ? [-preset.parallaxX, preset.parallaxX] : [0, 0]
  );
  const parallaxRotate = useTransform(
    scrollYProgress,
    [0, 1],
    isZeroG && !reduce ? [-preset.parallaxRot, preset.parallaxRot] : [0, 0]
  );

  return (
    <div ref={itemRef} className="w-full">
      {/* Scroll parallax layer: gently shifts and tilts as user scrolls through space */}
      <motion.div
        style={{
          y: parallaxY,
          x: parallaxX,
          rotate: parallaxRotate,
        }}
        className="will-change-transform transform-gpu"
      >
        {/* Liftoff & Gravitational settlement layer */}
        <motion.div
          animate={
            isZeroG
              ? {
                  y: reduce ? -10 : preset.y,
                  x: reduce ? 0 : preset.x,
                  rotate: reduce ? 0 : preset.rotate,
                  scale: 1,
                }
              : {
                  y: 0,
                  x: 0,
                  rotate: 0,
                  scale: 1,
                }
          }
          transition={
            isZeroG
              ? reduce
                ? { duration: 0.35, ease: [0.23, 1, 0.32, 1] }
                : {
                    type: "spring",
                    stiffness: 35,
                    damping: 11,
                    mass: 1.15,
                    delay: staggerDelay,
                  }
              : {
                  duration: 0.65,
                  ease: [0.23, 1, 0.32, 1],
                  delay: (4 - index) * 0.04,
                }
          }
          className="will-change-transform transform-gpu"
        >
          {/* Ambient microgravity oscillation layer */}
          <motion.div
            animate={
              isZeroG && !reduce
                ? {
                    y: [-8, 8, -8],
                    x: [-5, 5, -5],
                    rotate: [-1.0, 1.0, -1.0],
                  }
                : {
                    y: 0,
                    x: 0,
                    rotate: 0,
                  }
            }
            transition={
              isZeroG && !reduce
                ? {
                    duration: preset.duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: staggerDelay + 1.1,
                  }
                : {
                    duration: 0.35,
                    ease: [0.23, 1, 0.32, 1],
                  }
            }
            className="will-change-transform transform-gpu"
          >
            {child}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ZeroGravityHome({ children }: ZeroGravityHomeProps) {
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const reduce = useReducedMotion();

  const isZeroG = isZeroGravity && !isRestoring;

  return (
    <div className="flex w-full flex-col gap-12 relative">
      {Children.map(children, (child, index) => (
        <ZeroGravitySectionItem
          key={index}
          child={child}
          index={index}
          isZeroG={isZeroG}
          reduce={Boolean(reduce)}
        />
      ))}
    </div>
  );
}
