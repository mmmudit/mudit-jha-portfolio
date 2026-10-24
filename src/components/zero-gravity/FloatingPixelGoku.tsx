"use client";

import React, { useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useZeroGravity } from "@/context/zero-gravity-context";

export function FloatingPixelGoku() {
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Celestial parallax tracking across the cosmic background
  const scrollParallaxY = useTransform(scrollY, [0, 2400], [0, -85]);

  const [isHovered, setIsHovered] = useState(false);

  const isVisible = isZeroGravity && !isRestoring;

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Scroll parallax layer */}
      <motion.div
        style={{ y: reduce ? 0 : scrollParallaxY }}
        className="absolute inset-0 will-change-transform transform-gpu"
      >
        {/* Macro Orbital Drift Trajectory across the cosmic background */}
        <motion.div
          initial={
            reduce
              ? { x: "22vw", y: "45vh", rotate: -4, opacity: 0 }
              : { x: "-25vw", y: "62vh", rotate: -8, opacity: 0 }
          }
          animate={
            reduce
              ? { x: "22vw", y: "45vh", rotate: -4, opacity: 0.95 }
              : {
                  // Floating trajectory crossing the viewport from lower-left to upper-right, then looping
                  x: [
                    "-25vw", // Enters from lower-left offscreen
                    "15vw",  // Drifts past bottom-left
                    "45vw",  // Glides across mid-center
                    "75vw",  // Ascends towards upper-right
                    "115vw", // Blasts off past right edge
                    "115vw", // Re-orients behind deep cosmos
                    "80vw",  // Returns across lower-right
                    "40vw",  // Traverses across lower midground
                    "5vw",   // Drifts past left edge
                    "-25vw", // Loops smoothly back to start
                  ],
                  y: [
                    "62vh",
                    "54vh",
                    "42vh",
                    "30vh",
                    "22vh",
                    "75vh",
                    "70vh",
                    "78vh",
                    "68vh",
                    "62vh",
                  ],
                  rotate: [
                    -8,
                    -4,
                    2,
                    6,
                    -2,
                    12,
                    8,
                    -4,
                    -8,
                    -8,
                  ],
                  opacity: [0, 0.95, 1, 1, 0.85, 0.5, 0.9, 0.95, 0.8, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0.8, ease: "easeOut" }
              : {
                  duration: 48,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 2.5, // Staggered slightly behind the lightsaber for natural choreography
                }
          }
          className="absolute will-change-transform transform-gpu"
        >
          {/* Microgravity floating oscillation layer */}
          <motion.div
            animate={
              reduce
                ? { y: 0, rotate: 0 }
                : {
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                    rotate: [-2.5, 2.5, -2.5],
                  }
            }
            transition={
              reduce
                ? { duration: 0.3 }
                : {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
            className="relative will-change-transform transform-gpu"
          >
            {/* Interactive container */}
            <motion.div
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 15,
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              className="pointer-events-auto cursor-pointer group relative flex items-center justify-center -m-10 p-10"
              title="Super Smash Flash 2 Goku"
            >
              {/* Soft ambient blue glow in the background */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.85 : [0.5, 0.72, 0.5],
                  scale: isHovered ? 1.2 : [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(56, 189, 248, 0.75) 0%, rgba(37, 99, 235, 0.45) 50%, transparent 75%)",
                }}
              />

              {/* SSF2 Goku Sprite with simple, elegant blue drop-shadow glow */}
              <div
                className="relative will-change-transform transform-gpu transition-all duration-300"
                style={{
                  filter: isHovered
                    ? "drop-shadow(0 0 6px #38bdf8) drop-shadow(0 0 16px #0284c7) drop-shadow(0 0 30px rgba(37, 99, 235, 0.9))"
                    : "drop-shadow(0 0 4px #38bdf8) drop-shadow(0 0 12px rgba(14, 165, 233, 0.8)) drop-shadow(0 0 24px rgba(37, 99, 235, 0.55))",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sprites/goku-ssf2.png"
                  alt="Goku Super Smash Flash 2"
                  width={92}
                  height={100}
                  className="select-none pointer-events-none block"
                  style={{
                    imageRendering: "pixelated",
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
