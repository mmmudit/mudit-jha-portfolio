import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { MuxHoverVideo } from "./mux-hover-video";

export type ProjectCardProps = {
  title: string;
  slug?: string;
  year?: string;
  description: string;
  image?: string;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  href?: string;
  actionText?: string;
  cursorLabel?: string;
  actionHref?: string;
  gradient?: string;
  animationDelay?: number;
  priority?: boolean;
  index?: number;
  isDimmed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onPointerEnter?: (
    event: React.PointerEvent<HTMLAnchorElement>,
    cursorLabel?: string
  ) => void;
  onPointerMove?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerDown?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerUp?: React.PointerEventHandler<HTMLAnchorElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLAnchorElement>;
};

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard({
  title,
  slug,
  year = "2025",
  description,
  image,
  muxPlaybackId,
  muxThumbTime = 0,
  href = "#",
  actionText,
  cursorLabel,
  gradient = "from-zinc-200 to-zinc-300",
  animationDelay = 0,
  priority = false,
  index = 0,
  isDimmed = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
}: ProjectCardProps, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();

  const isOdd = index % 2 !== 0;
  const initialTilt = isOdd ? 2.5 : -2.5;

  // Realtime scroll progress tracking per card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "end 0.05"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.95, 1, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [32, 0, 0, -20]);
  const rotate = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [initialTilt, 0, 0, -initialTilt * 0.65]);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onMouseEnter?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onMouseLeave?.();
  };

  const handleFocus = () => {
    setIsHovered(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsHovered(false);
    onBlur?.();
  };

  return (
    <div
      ref={(node) => {
        containerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className="w-full"
    >
      <motion.div
        style={
          reduce
            ? {}
            : {
              scale,
              opacity,
              y,
              rotate,
            }
        }
        className="w-full transform-gpu will-change-transform"
      >
        <Link
          href={href || "#"}
          aria-label={`${title} (${year}) — ${description}${actionText ? `. ${actionText}` : ""}`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onPointerEnter={(event) => onPointerEnter?.(event, cursorLabel)}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={`project-card pressable group relative flex flex-col gap-3 items-start w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:ring-offset-1 rounded-[28px] transition-opacity duration-200 ease-out ${isDimmed ? "opacity-40" : "opacity-100"
            }`}
        >
          {/* Aspect Ratio Media Container with Hover Scale */}
          <div
            className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="aspect-[16/9] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#f4f3ed]">
              {/* Dynamic Mux Hover Video & Static Thumbnail Crossfade */}
              <MuxHoverVideo
                playbackId={muxPlaybackId}
                thumbTime={muxThumbTime}
                posterImage={image}
                alt={title}
                isHovered={isHovered}
                priority={priority}
                gradient={gradient}
              />
            </div>

            {/* Inner border stroke overlay */}
            <div
              aria-hidden="true"
              className="absolute border border-black/10 dark:border-white/10 inset-0 pointer-events-none rounded-[26px] z-20"
            />

            {/* Floating pill badge on bottom left of image (Desktop) */}
            <div className="absolute bottom-0 left-0 p-3 hidden md:block z-30 pointer-events-none">
              <div className="relative overflow-hidden flex items-center justify-center px-3.5 pt-[5px] pb-[4.8px] rounded-full backdrop-blur-md backdrop-saturate-200 bg-white/70 dark:bg-zinc-900/70 border border-white/50 dark:border-white/15 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.75)] [@media(hover:hover)]:group-hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] [@media(hover:hover)]:group-hover:bg-white/85 dark:[@media(hover:hover)]:group-hover:bg-zinc-900/85 transition-[background-color,box-shadow] duration-200 ease-out">
                {/* Reactive Blend-Mode Light Bleed Layers */}
                <div aria-hidden="true" className="absolute inset-0 bg-white/30 dark:bg-white/5 mix-blend-overlay pointer-events-none rounded-full" />
                <div aria-hidden="true" className="absolute inset-0 bg-white/20 dark:bg-transparent mix-blend-plus-lighter pointer-events-none rounded-full" />

                <p className={`relative z-10 font-sans font-medium tracking-[0.005em] leading-snug text-base transition-colors duration-200 ease-out ${isDimmed
                  ? "text-zinc-400 dark:text-zinc-500"
                  : "text-[#18181b] dark:text-zinc-100 [@media(hover:hover)]:group-hover:text-black dark:[@media(hover:hover)]:group-hover:text-white"
                  }`}>
                  <span>{title}</span>
                  <span className={`font-normal transition-colors duration-200 ease-out ${isDimmed
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-[#71717a] dark:text-zinc-400 [@media(hover:hover)]:group-hover:text-zinc-700 dark:[@media(hover:hover)]:group-hover:text-zinc-300"
                    }`}> • {year}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Subtitle / Description text below card (Desktop) */}
          <div className="hidden md:flex content-stretch items-start px-[13px] py-0 -mt-1.5 -mb-0.5 relative shrink-0 w-full">
            <p className={`font-sans font-normal leading-snug transition-colors duration-200 ease-out text-base tracking-[0.005em] text-left text-pretty ${isDimmed
              ? "text-zinc-400 dark:text-zinc-600"
              : "text-zinc-500 dark:text-zinc-400 [@media(hover:hover)]:group-hover:text-black dark:[@media(hover:hover)]:group-hover:text-zinc-600 font-medium"
              }`}>
              <span
                className="inline-block transition-transform duration-200 motion-reduce:transform-none [@media(hover:hover)]:group-hover:translate-x-0.5"
                style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              >
                {description}
              </span>
              {actionText && (
                <span
                  className="inline-flex items-center ms-1.5 font-medium text-blue-500 dark:text-blue-400 [@media(hover:hover)]:group-hover:text-blue-600 dark:[@media(hover:hover)]:group-hover:text-blue-300 opacity-0 -translate-x-2 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-x-0 transition-[opacity,transform,color] duration-200 motion-reduce:transition-none motion-reduce:transform-none pointer-events-none"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                >
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 motion-reduce:transform-none [@media(hover:hover)]:group-hover:rotate-12 mr-1 shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                  </svg>
                  <span>{actionText}</span>
                </span>
              )}
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden content-stretch flex flex-col font-sans font-normal items-start leading-snug px-[13px] py-0 relative shrink-0 text-base tracking-[0.01em] gap-1 text-left w-full">
            <div className="flex items-center w-full">
              <p className={`relative shrink-0 text-left font-medium transition-colors duration-200 ${isDimmed
                ? "text-zinc-400 dark:text-zinc-500"
                : "text-[#18181b] dark:text-zinc-500 [@media(hover:hover)]:group-hover:text-black dark:[@media(hover:hover)]:group-hover:text-zinc-600"
                }`}>
                <span>{title}</span>
                <span className={`font-normal tabular-nums transition-colors duration-200 ${isDimmed ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
                  }`}> • {year}</span>
              </p>
            </div>
            <p className={`relative shrink-0 w-full text-left font-normal leading-tight text-pretty transition-colors duration-200 ${isDimmed
              ? "text-zinc-400 dark:text-zinc-600"
              : "text-zinc-500 dark:text-zinc-400 [@media(hover:hover)]:group-hover:text-black dark:[@media(hover:hover)]:group-hover:text-white"
              }`}>
              {description}
              {actionText && (
                <span className="inline-flex items-center ms-1.5 font-medium text-blue-500 dark:text-blue-400">
                  <svg
                    className="w-3.5 h-3.5 mr-1 shrink-0 inline-block"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                  </svg>
                  <span>{actionText}</span>
                </span>
              )}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
});
