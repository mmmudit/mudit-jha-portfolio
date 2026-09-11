"use client";

import React, { useState, useRef } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { play } from "@/lib/sound";
import { Magnetic } from "./magnetic";

export function UmnHoverPreview() {
  const [isOpen, setIsOpen] = useState(false);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      play("tick", { volume: 0.18 });
    } else {
      setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || reduce) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * 8;
    const rotateY = (mouseX / (rect.width / 2)) * 8;
    const x = (mouseX / (rect.width / 2)) * 4;
    const y = (mouseY / (rect.height / 2)) * 4;

    setTransform({ x, y, rotateX, rotateY });
  };

  const handleMouseLeaveCard = () => {
    setTransform({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  return (
    <HoverCard.Root openDelay={80} closeDelay={120} onOpenChange={handleOpenChange}>
      <HoverCard.Trigger asChild>
        <span className="inline-block align-baseline">
          <Magnetic intensity={0.4} range={100}>
            <a
              href="https://twin-cities.umn.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-1.5 py-0.5 rounded-md font-mono text-[0.88em] font-semibold text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-400/10 hover:bg-amber-500/20 dark:hover:bg-amber-400/20 hover:scale-[1.04] active:scale-[0.98] transition-all duration-150 cursor-pointer select-none"
            >
              <span>@UMN</span>
            </a>
          </Magnetic>
        </span>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="top"
          sideOffset={8}
          align="center"
          avoidCollisions
          asChild
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeaveCard}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        rotate: -2,
                        y: 8,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 1.5,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 420,
                    damping: 22,
                    mass: 0.8,
                  },
                }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.9,
                        rotate: -1,
                        y: 8,
                        transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                      }
                }
                style={{
                  transformOrigin: "var(--radix-hover-card-content-transform-origin)",
                  perspective: 800,
                }}
                className="z-[999999] w-[240px] sm:w-[260px] rounded-[20px] border-[1.5px] border-zinc-950 dark:border-white/20 bg-[#fffdfa] dark:bg-zinc-900 p-2 shadow-[5px_5px_0px_#18181b] dark:shadow-[5px_5px_0px_rgba(255,255,255,0.18)] overflow-hidden select-none will-change-transform flex flex-col cursor-pointer"
              >
                {/* Photo container with 3D tilt interaction */}
                <motion.div
                  animate={{
                    rotateX: transform.rotateX,
                    rotateY: transform.rotateY,
                    x: transform.x,
                    y: transform.y,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-full h-[175px] sm:h-[190px] rounded-[14px] overflow-hidden border border-zinc-950/20 bg-zinc-950 shadow-xs shrink-0 group/img"
                >
                  {/* Sunset Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/umn.jpg"
                    alt="University of Minnesota Twin Cities Campus Sunset"
                    className="size-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  />

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Pill Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-950/75 backdrop-blur-md border border-white/20 text-white font-mono text-[10.5px] font-semibold tracking-wide shadow-sm">
                    <span className="inline-block size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>UMN Twin Cities</span>
                  </div>

                  {/* Bottom Location Tag */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white/90 font-sans text-xs">
                    <div className="flex items-center gap-1 font-medium text-[11.5px] text-white drop-shadow-sm">
                      <MapPin className="size-3.5 text-amber-400 stroke-[2.2]" />
                      <span>Minneapolis, MN</span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-300/80 bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                      Golden Hour 🌅
                    </span>
                  </div>
                </motion.div>

                {/* Radix HoverCard Arrow */}
                <HoverCard.Arrow className="fill-[#fffdfa] dark:fill-zinc-900 stroke-zinc-950 dark:stroke-white/20 stroke-[1.5px]" width={12} height={6} />
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
