"use client";

import React, { useRef, useState, useCallback, KeyboardEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { MapPin, Camera } from "lucide-react";
import { play } from "@/lib/sound";

export interface TactilePhotoCardProps {
  /** Name displayed on the bottom polaroid margin */
  name?: string;
  /** Primary discipline or role */
  role?: string;
  /** Year or archival date */
  year?: string;
  /** Coordinates or location */
  location?: string;
  /** Avatar or photo source */
  imageSrc?: string;
  /** Alt text for accessibility */
  imageAlt?: string;
  /** Status indicator pill text */
  statusText?: string;
  /** Accent color token (default: willow / status green) */
  accentColor?: string;
  /** Initial resting angle in degrees (default: -5) */
  initialRotateZ?: number;
  /** Optional click handler or sound effect */
  onClick?: () => void;
  /** Additional CSS class names */
  className?: string;
}

export function TactilePhotoCard({
  name = "mudit jha",
  role = "Design Engineer",
  year = "2026",
  location = "Minneapolis, MN",
  imageSrc = "/assets/avatar.png",
  imageAlt = "Mudit Jha",
  statusText = "Available for work",
  accentColor = "#31b564",
  initialRotateZ = -5,
  onClick,
  className = "",
}: TactilePhotoCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Combined elevation state (active on mouse hover or keyboard focus)
  const isElevated = isHovered || isFocused;

  // Normalized cursor coordinates (-0.5 to 0.5 from center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics Spring configuration matching the portfolio tactile motion scale
  const tiltSpringConfig = { stiffness: 260, damping: 20, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, tiltSpringConfig);
  const smoothMouseY = useSpring(mouseY, tiltSpringConfig);

  // Map normalized cursor offsets to rotation angles (-14deg to 14deg)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14]);

  // Subtle dynamic ambient glare across the glossy photo surface
  const glareX = useTransform(smoothMouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(smoothMouseY, [-0.5, 0.5], ["0%", "100%"]);

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
    play("sparkle");
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly spring-reset rotations back to 0 without snapping
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    play("sparkle");
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleClick = useCallback(() => {
    play("press");
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={`relative select-none ${className}`}
      style={{ perspective: 1200 }}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-label="Mudit Jha portrait photograph (interactive 3D card)"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group block relative w-[280px] sm:w-[320px] aspect-[4/5] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-4 focus-visible:ring-offset-[#fbfaf5] rounded-[26px] active:scale-[0.98] transition-transform duration-150"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Dynamic Paper Contact Shadow (expands & softens when elevated) */}
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[92%] h-12 rounded-[100%] pointer-events-none transition-opacity duration-300"
          animate={{
            opacity: isElevated ? 0.8 : 0.45,
            scale: isElevated ? 1.12 : 0.96,
            y: isElevated ? 16 : 0,
            filter: isElevated ? "blur(22px)" : "blur(12px)",
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(71,88,92,0.26) 0%, rgba(39,39,42,0.1) 50%, transparent 80%)",
          }}
        />

        {/* 3D Tilted Body Stage */}
        <motion.div
          className="relative w-full h-full"
          initial={{ opacity: 0, rotate: initialRotateZ - 3, scale: 0.95 }}
          animate={{
            opacity: 1,
            rotate: isElevated ? -1.5 : initialRotateZ,
            scale: isElevated ? 1.03 : 1.0,
            y: isElevated ? -6 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            mass: 0.7,
          }}
          style={{
            transformStyle: "preserve-3d",
            rotateX: prefersReducedMotion ? 0 : rotateX,
            rotateY: prefersReducedMotion ? 0 : rotateY,
          }}
        >
          {/* ========================================================================= */}
          {/* LAYER 1: BASE POLAROID ARCHIVAL PAPER BODY (translateZ: 0px)              */}
          {/* Heavyweight Matte Archival Paper Backing with Double Tactile Border       */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 rounded-[26px] bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-3 flex flex-col justify-between overflow-hidden"
            style={{
              transform: "translateZ(0px)",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.03), 0 16px 36px rgba(71,88,92,0.1), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            {/* Archival Micro-dot Grid Background Accent */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(200, 213, 187, 0.4) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* ======================================================================= */}
            {/* LAYER 2: ELEVATED PHOTO MEDIA STAGE (translateZ: 14px -> 30px)           */}
            {/* High-Resolution Portrait with Concentric Radius & Pure Outline Ring     */}
            {/* Outer radius 26px - padding 12px = 14px concentric inner radius         */}
            {/* ======================================================================= */}
            <motion.div
              className="relative w-full h-[83%] rounded-[14px] overflow-hidden bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-50 ring-1 ring-black/10 dark:ring-white/10 ring-inset shadow-inner group/photo"
              initial={false}
              animate={{
                translateZ: isElevated ? 30 : 14,
                scale: isElevated ? 1.01 : 1.0,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
                mass: 0.6,
              }}
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Avatar Image */}
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                className="object-cover object-top transition-transform duration-500 ease-out group-hover/photo:scale-[1.04]"
                sizes="(max-width: 768px) 280px, 320px"
              />

              {/* Soft Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

              {/* Top-Right Floating Status Pill */}
              <motion.div
                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-100 font-mono text-[10px] shadow-xs select-none pointer-events-none"
                animate={{
                  translateZ: isElevated ? 45 : 20,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className="size-1.5 rounded-full shadow-xs animate-pulse"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="font-semibold uppercase tracking-wider text-[9px] text-zinc-700 dark:text-zinc-300">
                  {statusText}
                </span>
              </motion.div>

              {/* Top-Left Camera / Archive Pill */}
              <motion.div
                className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 font-mono text-[9px] shadow-xs pointer-events-none"
                animate={{
                  translateZ: isElevated ? 40 : 18,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Camera className="size-2.5 text-zinc-300" />
                <span className="tracking-widest uppercase">REC</span>
              </motion.div>



              {/* Location Badge on Photo Bottom */}
              <motion.div
                className="absolute bottom-2 left-2.5 flex items-center gap-1 text-white/90 font-mono text-[10px] drop-shadow-sm pointer-events-none"
                animate={{
                  translateZ: isElevated ? 38 : 16,
                }}
                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <MapPin className="size-3 text-zinc-300" />
                <span className="tracking-tight font-medium">{location}</span>
              </motion.div>
            </motion.div>

            {/* ======================================================================= */}
            {/* LAYER 4: BOTTOM POLAROID CAPTION STRIP (translateZ: 18px -> 36px)        */}
            {/* Handwritten Signature, Role & Archival Timestamp                       */}
            {/* ======================================================================= */}
            <motion.div
              className="h-[17%] flex items-center justify-between px-2 pt-1 text-zinc-700 dark:text-zinc-300"
              animate={{
                translateZ: isElevated ? 36 : 18,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 20,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex flex-col -space-y-1">
                <span className="font-hand font-bold text-[23px] sm:text-[25px] text-zinc-800 dark:text-zinc-100 tracking-wide">
                  {name}
                </span>
                <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  {role}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="tabular-nums text-[13px] sm:text-[14px] font-mono font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-200/80 dark:border-zinc-700/80">
                  {year}
                </span>
              </div>
            </motion.div>

            {/* ======================================================================= */}
            {/* LAYER 5: SPECULAR GLARE & GLOSS SHEEN (translateZ: 50px)                */}
            {/* Dynamic Light Sheen Following Cursor on Gloss Photo Paper               */}
            {/* ======================================================================= */}
            <motion.div
              className="absolute inset-0 rounded-[26px] pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
              style={{
                transform: "translateZ(50px)",
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.08) 40%, transparent 65%)`
                ),
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
