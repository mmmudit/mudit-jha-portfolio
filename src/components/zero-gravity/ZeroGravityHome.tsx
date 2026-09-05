"use client";

import React, { Children } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useZeroGravity } from "@/context/zero-gravity-context";

interface ZeroGravityHomeProps {
  children: React.ReactNode;
}

const DRIFT_PRESETS = [
  { y: -38, x: -14, rotate: -2.8, duration: 6.2 },
  { y: -52, x: 20, rotate: 3.5, duration: 5.5 },
  { y: -26, x: -12, rotate: 1.6, duration: 7.1 },
  { y: -58, x: -24, rotate: -3.4, duration: 5.8 },
  { y: -44, x: 16, rotate: 2.2, duration: 6.5 },
];

export function ZeroGravityHome({ children }: ZeroGravityHomeProps) {
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const reduce = useReducedMotion();

  const isZeroG = isZeroGravity && !isRestoring;

  return (
    <div className="flex w-full flex-col gap-12 relative">
      {Children.map(children, (child, index) => {
        const preset = DRIFT_PRESETS[index % DRIFT_PRESETS.length];

        const initialLiftY = reduce ? -10 : preset.y;
        const initialLiftX = reduce ? 0 : preset.x;
        const initialRotate = reduce ? 0 : preset.rotate;

        return (
          <motion.div
            key={index}
            animate={
              isZeroG
                ? reduce
                  ? { y: -10, x: 0, rotate: 0 }
                  : {
                      y: [initialLiftY, initialLiftY - 14, initialLiftY + 8, initialLiftY],
                      x: [initialLiftX, initialLiftX + 10, initialLiftX - 8, initialLiftX],
                      rotate: [
                        initialRotate,
                        initialRotate + 1.2,
                        initialRotate - 1.2,
                        initialRotate,
                      ],
                    }
                : { y: 0, x: 0, rotate: 0 }
            }
            transition={
              isZeroG
                ? reduce
                  ? { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
                  : {
                      duration: preset.duration,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
                : {
                    duration: 0.65,
                    ease: [0.23, 1, 0.32, 1],
                  }
            }
            className="will-change-transform transform-gpu"
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}
