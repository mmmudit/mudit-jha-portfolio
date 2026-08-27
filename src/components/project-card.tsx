import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export type ProjectCardProps = {
  title: string;
  slug?: string;
  year?: string;
  description: string;
  image?: string;
  href?: string;
  actionText?: string;
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
};

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard({
  title,
  slug,
  year = "2025",
  description,
  image,
  href = "#",
  actionText,
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
}: ProjectCardProps, ref) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
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
          href={href}
          onClick={handleClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onFocus={onFocus}
          onBlur={onBlur}
          data-cuelume-hover="ready"
          data-cuelume-press
          data-cuelume-release
          className={`project-card pressable group relative flex flex-col gap-3 items-start w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black/10 dark:focus-visible:ring-white/10 focus-visible:ring-offset-1 rounded-[28px] transition-opacity duration-200 ease-out ${isDimmed ? "opacity-40" : "opacity-100"
            }`}
        >
          {/* Aspect Ratio Media Container with Hover Scale */}
          <div
            className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none"
            style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
          >
            <div className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]">
              {/* Fallback gradient / shimmer */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} ${imageLoaded ? "opacity-0" : "opacity-100"
                  } transition-opacity duration-200 ease-out`}
              />

              {image && (
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => setImageLoaded(true)}
                  className="absolute max-w-none object-cover size-full rounded-[26px] transition-transform duration-200 [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none pointer-events-none z-10"
                  style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                />
              )}
            </div>

            {/* Inner border stroke overlay */}
            <div
              aria-hidden="true"
              className="absolute border border-black/10 dark:border-white/10 inset-0 pointer-events-none rounded-[26px] z-20"
            />

            {/* Floating pill badge on bottom left of image (Desktop) */}
            <div className="absolute bottom-0 left-0 p-3 hidden md:block z-30 pointer-events-none">
              <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-[#f4f4f5] dark:border-zinc-800 border-solid flex items-center justify-center px-3.5 pt-[5px] pb-[4.8px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] [@media(hover:hover)]:group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] [@media(hover:hover)]:group-hover:bg-white dark:[@media(hover:hover)]:group-hover:bg-zinc-900 transition-[background-color,border-color,box-shadow] duration-200 ease-out">
                <p className={`font-sans font-medium tracking-[0.005em] leading-snug text-base transition-colors duration-200 ease-out ${isDimmed
                  ? "text-zinc-400 dark:text-zinc-500"
                  : "text-[#18181b] dark:text-zinc-100 [@media(hover:hover)]:group-hover:text-black dark:[@media(hover:hover)]:group-hover:text-white"
                  }`}>
                  <span>{title}</span>
                  <span className={`font-normal transition-colors duration-200 ease-out ${isDimmed
                    ? "text-zinc-300 dark:text-zinc-600"
                    : "text-[#a1a1aa] dark:text-zinc-400 [@media(hover:hover)]:group-hover:text-zinc-600 dark:[@media(hover:hover)]:group-hover:text-zinc-300"
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
                  <span className="me-1 font-normal opacity-60">•</span>
                  <span>{actionText}</span>
                  <svg
                    className="w-3.5 h-3.5 ms-1 transition-transform duration-200 motion-reduce:transform-none [@media(hover:hover)]:group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
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
                  • {actionText}
                </span>
              )}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
});
