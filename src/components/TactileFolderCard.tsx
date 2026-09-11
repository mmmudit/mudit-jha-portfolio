"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Layers, ArrowRight } from "lucide-react";

export interface TactileFolderCardProps {
  /** Title of the folder project or collection */
  title?: string;
  /** Category or discipline tag */
  category?: string;
  /** Date or release period */
  date?: string;
  /** Number of items / assets inside the folder */
  itemCount?: number | string;
  /** High-resolution preview image inside the emerging card */
  previewImage?: string;
  /** Secondary subtitle or short brief */
  description?: string;
  /** Optional badge or tag list */
  tags?: string[];
  /** Optional click handler or link */
  onClick?: () => void;
  /** External href if used as a navigation link */
  href?: string;
  /** Additional CSS class names */
  className?: string;
  /** Accent color token (defaults to Willow Grey #c8d5bb or Status Green #31b564) */
  accentColor?: string;
}

export function TactileFolderCard({
  title = "Spatial Interface Systems",
  category = "Interaction Design",
  date = "2026.04",
  itemCount = "12 Assets",
  previewImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  description = "Experimental 3D spatial UI patterns, physical spring kinetics & tactile folder depth shaders.",
  onClick,
  href,
  className = "",
  accentColor = "#31b564",
}: TactileFolderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Normalized cursor coordinates (-0.5 to 0.5 from center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics Spring configuration matching portfolio motion scale
  const tiltSpringConfig = { stiffness: 260, damping: 20, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, tiltSpringConfig);
  const smoothMouseY = useSpring(mouseY, tiltSpringConfig);

  // Map normalized cursor offsets to rotation angles (-14deg to 14deg)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const normX = clientX / rect.width - 0.5;
      const normY = clientY / rect.height - 0.5;

      mouseX.set(normX);
      mouseY.set(normY);
    },
    [mouseX, mouseY, prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const CardWrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { onClick };

  const effectiveAccent = accentColor === "#c8d5bb" ? "#31b564" : accentColor;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      <CardWrapper
        {...(wrapperProps as any)}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="group block relative w-[320px] sm:w-[340px] h-[380px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbfaf5] rounded-[26px] active:scale-[0.98] transition-transform duration-150"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Paper Contact Shadow */}
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[90%] h-12 rounded-[100%] pointer-events-none transition-opacity duration-300"
          animate={{
            opacity: isHovered ? 0.8 : 0.45,
            scale: isHovered ? 1.12 : 0.96,
            y: isHovered ? 14 : 0,
            filter: isHovered ? "blur(22px)" : "blur(12px)",
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(71,88,92,0.24) 0%, rgba(39,39,42,0.1) 50%, transparent 80%)",
          }}
        />

        {/* 3D Tilted Body Stage */}
        <motion.div
          className="relative w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
          }}
        >
          {/* LAYER 1: FRAMELESS BACK BASE SHELL */}
          <div
            className="absolute inset-0 rounded-[26px] bg-[#f4f2ea] dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between p-4"
            style={{ transform: "translateZ(0px)" }}
          >
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full shadow-xs"
                  style={{ backgroundColor: effectiveAccent }}
                />
                {category}
              </span>
              <span>{date}</span>
            </div>
          </div>

          {/* LAYER 2: EMERGING MEDIA CARD */}
          <motion.div
            className="absolute left-4 right-4 top-9 h-[215px] rounded-[18px] overflow-hidden bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 shadow-md"
            animate={{
              translateZ: isHovered ? 30 : 5,
              y: isHovered ? -75 : 0,
              rotateZ: isHovered ? -2.5 : 0,
              scale: isHovered ? 1.03 : 1.0,
            }}
            transition={{ type: "spring", stiffness: 240, damping: 18, mass: 0.7 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={previewImage}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* LAYER 3: FRAMELESS FROSTED FRONT POCKET */}
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-[205px] rounded-b-[26px] rounded-t-[18px] bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-white/70 dark:border-zinc-800 p-5 flex flex-col justify-between shadow-lg"
            animate={{
              translateZ: isHovered ? 60 : 15,
              rotateX: isHovered ? -26 : 0,
              y: isHovered ? 2 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.8 }}
            style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
          >
            {/* Top Specular Rim */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white dark:via-zinc-700 to-transparent opacity-90" />

            <div>
              <h3 className="font-hand text-2xl font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-black dark:group-hover:text-white transition-colors leading-tight">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans mt-1">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-200/60 dark:border-zinc-800 pt-2.5">
              <span className="font-mono text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <Layers className="size-3 text-zinc-400" />
                {itemCount}
              </span>

              <motion.div
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  backgroundColor: isHovered ? effectiveAccent : "#18181b",
                  color: isHovered && effectiveAccent === "#c8d5bb" ? "#18181b" : "#ffffff",
                }}
                transition={{ duration: 0.2 }}
                className="px-3 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>OPEN</span>
                <ArrowRight className="size-3" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </CardWrapper>
    </div>
  );
}
