"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { play } from "@/lib/sound";
import { useZeroGravity } from "@/context/zero-gravity-context";

interface BlockItem {
  id: string;
  char: string;
  rotation: number;
  hoverRotation: number;
  zeroGRotation: number;
  xOffsetEm: number;
  yOffsetEm: number;
  widthEm?: number;
  heightEm?: number;
  isApostrophe?: boolean;
  zIndex: number;
}

const BLOCKS: BlockItem[] = [
  {
    id: "m",
    char: "M",
    rotation: -8.5,
    hoverRotation: -12,
    zeroGRotation: -16,
    xOffsetEm: 0,
    yOffsetEm: 0.02,
    widthEm: 0.96,
    heightEm: 0.92,
    zIndex: 1,
  },
  {
    id: "u",
    char: "U",
    rotation: 4.5,
    hoverRotation: 8,
    zeroGRotation: 10,
    xOffsetEm: 0.07,
    yOffsetEm: -0.04,
    widthEm: 0.86,
    heightEm: 0.92,
    zIndex: 2,
  },
  {
    id: "d",
    char: "D",
    rotation: -5,
    hoverRotation: -9,
    zeroGRotation: -12,
    xOffsetEm: 0.07,
    yOffsetEm: 0.02,
    widthEm: 0.86,
    heightEm: 0.92,
    zIndex: 3,
  },
  {
    id: "i",
    char: "I",
    rotation: 6.5,
    hoverRotation: 11,
    zeroGRotation: 14,
    xOffsetEm: 0.07,
    yOffsetEm: -0.03,
    widthEm: 0.62,
    heightEm: 0.92,
    zIndex: 4,
  },
  {
    id: "t",
    char: "T",
    rotation: -2.5,
    hoverRotation: -6,
    zeroGRotation: -8,
    xOffsetEm: 0.07,
    yOffsetEm: -0.01,
    widthEm: 0.84,
    heightEm: 0.92,
    zIndex: 5,
  },
  {
    id: "quote",
    char: "'",
    rotation: 4.5,
    hoverRotation: 10,
    zeroGRotation: 18,
    xOffsetEm: 0.04,
    yOffsetEm: -0.34,
    widthEm: 0.36,
    heightEm: 0.36,
    isApostrophe: true,
    zIndex: 7,
  },
  {
    id: "s",
    char: "S",
    rotation: -16.5,
    hoverRotation: -22,
    zeroGRotation: -26,
    xOffsetEm: 0.04,
    yOffsetEm: 0.06,
    widthEm: 0.86,
    heightEm: 0.92,
    zIndex: 6,
  },
];

interface MuditsBlockTextProps {
  className?: string;
  showPlayground?: boolean;
}

export function MuditsBlockText({
  className = "",
  showPlayground = true,
}: MuditsBlockTextProps) {
  const reduce = useReducedMotion();
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const isZeroG = isZeroGravity && !isRestoring;

  const handleTileHover = () => {
    try {
      play("tick", { volume: 0.22 });
    } catch {
      // Ignore sound errors
    }
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Block Text Row: "MUDIT'S" */}
      <div
        role="img"
        aria-label="MUDIT'S"
        className="inline-flex items-center justify-center text-[30px] sm:text-[40px] md:text-[50px] lg:text-[58px] leading-none pt-5 sm:pt-7 md:pt-8 pb-1 sm:pb-2"
      >
        <div className="flex items-center">
          {BLOCKS.map((block, idx) => {
            const isApos = block.isApostrophe;

            return (
              <motion.div
                key={block.id}
                data-cuelume-hover="tick"
                onMouseEnter={handleTileHover}
                initial={
                  reduce
                    ? false
                    : {
                        opacity: 0,
                        y: 10,
                        scale: 0.9,
                        rotate: block.rotation * 1.3,
                      }
                }
                animate={
                  isZeroG
                    ? {
                        opacity: 1,
                        y: reduce ? 0 : [0, (idx % 2 === 0 ? -1 : 1) * 8, 0],
                        rotate: block.zeroGRotation,
                        scale: 1,
                      }
                    : {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        rotate: block.rotation,
                      }
                }
                whileHover={
                  reduce
                    ? undefined
                    : {
                        scale: 1.12,
                        rotate: block.hoverRotation,
                        zIndex: 20,
                        transition: {
                          type: "spring",
                          stiffness: 450,
                          damping: 18,
                        },
                      }
                }
                whileTap={
                  reduce
                    ? undefined
                    : {
                        scale: 0.94,
                        transition: { duration: 0.1 },
                      }
                }
                transition={{
                  duration: 0.35,
                  ease: [0.22, 1, 0.36, 1],
                  delay: idx * 0.035,
                }}
                style={{
                  position: "relative",
                  top: `${block.yOffsetEm}em`,
                  zIndex: block.zIndex,
                  marginLeft: idx === 0 ? 0 : `${block.xOffsetEm}em`,
                  width: `${block.widthEm}em`,
                  height: `${block.heightEm}em`,
                }}
                className={`flex items-center justify-center bg-black text-white dark:bg-[#07080c] dark:text-white dark:border dark:border-white/20 rounded-[2px] sm:rounded-[3px] shadow-[0_4px_16px_rgba(0,0,0,0.18)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.7)] cursor-default transition-shadow duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.28)] ${
                  isApos ? "aspect-square" : ""
                }`}
              >
                {isApos ? (
                  <svg
                    viewBox="0 0 16 16"
                    className="w-[60%] h-[60%] fill-current overflow-visible"
                    aria-hidden="true"
                  >
                    <path d="M5.2 2.5 H10.8 L9.8 8.6 C9.4 10.4 8.4 12.1 6.8 13.5 L5.4 12.2 C6.4 11.2 7.0 10.1 7.2 8.8 L7.0 8.6 H5.2 V2.5 Z" />
                  </svg>
                ) : (
                  <span className="font-display font-black tracking-tight select-none flex items-center justify-center text-[0.70em] leading-none">
                    {block.char}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Optional "Playground" Subtitle in font-hand */}
      {showPlayground && (
        <motion.span
          aria-hidden="true"
          className="font-hand text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-2px] text-zinc-900 dark:text-zinc-100 -mt-1 sm:-mt-2"
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.12,
          }}
        >
          Playground
        </motion.span>
      )}
    </div>
  );
}
