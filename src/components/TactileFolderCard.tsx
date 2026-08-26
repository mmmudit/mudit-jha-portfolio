"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Folder, ArrowUpRight, FileText, Image as ImageIcon, Layers } from "lucide-react";

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
  tags = ["Framer Motion", "3D Canvas", "WebGPU"],
  onClick,
  href,
  className = "",
  accentColor = "#c8d5bb",
}: TactileFolderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Normalized cursor coordinates (-0.5 to 0.5 from center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics Spring configuration matching the portfolio motion scale
  const tiltSpringConfig = { stiffness: 260, damping: 20, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, tiltSpringConfig);
  const smoothMouseY = useSpring(mouseY, tiltSpringConfig);

  // Map normalized cursor offsets to rotation angles (-14deg to 14deg)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-14, 14]);

  // Subtle dynamic ambient glare across paper surface
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
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Smoothly spring-reset rotations back to 0 without snaps
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const CardWrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { onClick };

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
        {/* Dynamic Paper Contact Shadow (expands & softens when card opens) */}
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
          {/* ========================================================================= */}
          {/* LAYER 1: BACK FOLDER BASE (translateZ: 0px)                                */}
          {/* Heavyweight Archival Paper Backing in Stone/Dough Tones                   */}
          {/* ========================================================================= */}
          <div
            className="absolute inset-0 rounded-[26px] bg-[#eeebe2] dark:bg-zinc-900 border border-zinc-300/80 dark:border-zinc-800 flex flex-col justify-between overflow-hidden"
            style={{
              transform: "translateZ(0px)",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.03), 0 12px 28px rgba(71,88,92,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            {/* Top Folder Tab Notch Geometry */}
            <div className="relative w-full h-13 bg-[#e4dfd2] dark:bg-zinc-950 border-b border-zinc-300/80 dark:border-zinc-800/80 px-4 flex items-center justify-between">
              {/* Tab Shape Silhouette */}
              <div className="absolute top-0 left-0 h-full w-38 bg-[#eeebe2] dark:bg-zinc-900 border-r border-zinc-300/80 dark:border-zinc-800 rounded-tr-xl flex items-center px-3.5 gap-2">
                <div
                  className="w-2 h-2 rounded-full shadow-xs"
                  style={{ backgroundColor: accentColor === "#c8d5bb" ? "#31b564" : accentColor }}
                />
                <span className="font-mono text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 tracking-wider uppercase truncate">
                  {category}
                </span>
              </div>

              {/* Right metadata badges */}
              <div className="ml-auto flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-zinc-500 bg-white/70 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full border border-zinc-300/60 dark:border-zinc-700/60">
                  {date}
                </span>
                <span className="font-mono text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/90 px-2 py-0.5 rounded-full border border-zinc-300/70 dark:border-zinc-700/70 flex items-center gap-1">
                  <Layers className="size-2.5 text-zinc-500" />
                  {itemCount}
                </span>
              </div>
            </div>

            {/* Back Plate Interior Watermark & Subtle Dot Texture */}
            <div
              className="flex-1 p-5 flex flex-col justify-between text-zinc-400"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(200, 213, 187, 0.45) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            >
              <div className="space-y-1.5 pt-2 opacity-70">
                <div className="h-1.5 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
                <div className="h-1.5 w-32 bg-zinc-300/70 dark:bg-zinc-700/60 rounded-full" />
              </div>

              {/* Background File Stamp & Icon */}
              <div className="flex items-center justify-between border-t border-zinc-300/60 dark:border-zinc-800 pt-3">
                <div className="flex items-center gap-1.5 text-[#47585c] dark:text-zinc-400 font-mono text-[10px]">
                  <FileText className="size-3.5 text-[#47585c]" />
                  <span>DOSSIER // {title.toUpperCase().slice(0, 14)}</span>
                </div>
                <span className="font-mono text-[9px] text-[#47585c]/70 dark:text-zinc-500 uppercase tracking-widest font-semibold">
                  ARCHIVAL SPEC
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* LAYER 2: INNER EMERGING ASSET/MEDIA CARD (translateZ: 5px -> 30px)         */}
          {/* Crisp White Paper Media Container with Smooth Elevation & Subtle Tilt     */}
          {/* ========================================================================= */}
          <motion.div
            className="absolute left-4 right-4 top-10 h-[215px] rounded-[18px] overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-[0_4px_16px_rgba(0,0,0,0.06)] origin-center"
            initial={false}
            animate={{
              translateZ: isHovered ? 30 : 5,
              y: isHovered ? -75 : 0,
              rotateZ: isHovered ? -2.5 : 0,
              scale: isHovered ? 1.03 : 1.0,
            }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 18,
              mass: 0.7,
            }}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: isHovered
                ? "0 20px 36px -8px rgba(71,88,92,0.18), 0 4px 12px rgba(0,0,0,0.06)"
                : "0 4px 16px rgba(0,0,0,0.06)",
            }}
          >
            {/* Visual Media with 1px Crisp Inner Stroke */}
            <div className="relative w-full h-full group/media">
              <img
                src={previewImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/media:scale-105"
                loading="lazy"
              />

              {/* Minimalist Bottom Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Media Tag Pill in Top-Right */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 text-zinc-800 dark:text-zinc-100 font-mono text-[10px] shadow-xs">
                <ImageIcon className="size-3 text-[#47585c] dark:text-zinc-300" />
                <span>PREVIEW</span>
              </div>

              {/* Card Title & Category Overlay on Image */}
              <div className="absolute bottom-3 left-3.5 right-3.5 flex flex-col gap-0.5 text-white">
                <span className="font-mono text-[10px] text-[#c8d5bb] font-semibold tracking-wide uppercase">
                  {category}
                </span>
                <h4 className="font-display font-semibold text-sm tracking-tight leading-snug line-clamp-1 text-white">
                  {title}
                </h4>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* LAYER 3: FRONT FOLDER FLAP/POCKET (translateZ: 15px -> 60px)              */}
          {/* Tactile Warm Paper Pocket Hinged Outward at -32deg                        */}
          {/* ========================================================================= */}
          <motion.div
            className="absolute left-0 right-0 bottom-0 h-[210px] rounded-b-[26px] rounded-t-[18px] bg-[#fbfaf5] dark:bg-zinc-900 border-t border-zinc-300/90 border-x border-b border-zinc-300/80 dark:border-zinc-800 flex flex-col justify-between p-5 origin-bottom"
            initial={false}
            animate={{
              translateZ: isHovered ? 60 : 15,
              rotateX: isHovered ? -32 : 0,
              y: isHovered ? 2 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 18,
              mass: 0.8,
            }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "bottom center",
              boxShadow:
                "0 -4px 16px rgba(0,0,0,0.03), 0 8px 24px rgba(71,88,92,0.08), inset 0 1px 0 rgba(255,255,255,0.95)",
            }}
          >
            {/* Top Pocket Notch & Indent Tab */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#fbfaf5] dark:bg-zinc-900 border-t border-x border-zinc-300/90 dark:border-zinc-800 rounded-t-lg flex items-center justify-center">
              <div className="w-6 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
            </div>

            {/* Folder Pocket Header Content */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <Folder className="size-3.5 text-[#47585c] dark:text-zinc-400" />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#47585c] dark:text-zinc-400">
                    INDEX // {date}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-[17px] text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  {title}
                </h3>
              </div>

              {/* Action Indicator Pill Icon */}
              <div className="size-7 rounded-full bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 group-hover:bg-[#c8d5bb] group-hover:border-zinc-400 group-hover:text-zinc-900 transition-all duration-200 shrink-0 shadow-xs">
                <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

            {/* Brief Description */}
            <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed font-sans">
              {description}
            </p>

            {/* Bottom Tag Bar with Tactile Paper Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-200/80 dark:border-zinc-800">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-zinc-800 border border-zinc-300/70 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10px] shadow-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Subtle Light Reflection Glare */}
            <motion.div
              className="absolute inset-0 rounded-b-[26px] rounded-t-[18px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([gx, gy]) =>
                    `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.4) 0%, transparent 65%)`
                ),
              }}
            />
          </motion.div>
        </motion.div>
      </CardWrapper>
    </div>
  );
}
