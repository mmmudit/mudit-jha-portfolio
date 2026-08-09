"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
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
  onClick?: (e: React.MouseEvent) => void;
};

export function ProjectCard({
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
  onClick,
}: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const reduce = useReducedMotion();

  const isOdd = index % 2 !== 0;
  const initialTilt = isOdd ? 2.5 : -2.5;

  // Realtime scroll progress tracking per card (Adam Argyle wBMvNaN scroll-driven animation)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.95", "end 0.05"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.9, 1, 1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [48, 0, 0, -28]);
  const rotate = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [initialTilt, 0, 0, -initialTilt * 0.65]);
  const filter = useTransform(scrollYProgress, [0, 0.2], ["blur(4px)", "blur(0px)"]);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        style={
          reduce
            ? {}
            : {
                scale,
                opacity,
                y,
                rotate,
                filter,
              }
        }
        className="w-full"
      >
        <Link
          href={href}
          onClick={handleClick}
          className="project-card pressable group relative flex flex-col gap-3 items-start w-full cursor-pointer text-left focus-visible:outline-none"
        >
          {/* Aspect Ratio Media Container with Hover Scale */}
          <div className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-250 ease-out [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none">
            <div className="aspect-[678/367.625] relative isolate rounded-[26px] shrink-0 w-full overflow-hidden bg-[#e4e4e7]">
              {/* Fallback gradient / shimmer */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} ${
                  imageLoaded ? "opacity-0" : "opacity-100"
                } transition-opacity duration-150 ease-out`}
              />

              {image && (
                <Image
                  src={image}
                  alt={title}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={() => setImageLoaded(true)}
                  className="absolute max-w-none object-cover size-full rounded-[26px] transition-transform duration-250 ease-out [@media(hover:hover)]:group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:transform-none pointer-events-none z-10"
                  style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
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
              <div className="bg-white/90 backdrop-blur-sm border border-[#f4f4f5] border-solid flex items-center justify-center px-3.5 pt-[5px] pb-[4.8px] rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] [@media(hover:hover)]:group-hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)] [@media(hover:hover)]:group-hover:bg-white transition-[background-color,box-shadow] duration-150 ease-out">
                <p className="font-sans font-medium tracking-[0.005em] leading-snug text-[#18181b] text-base">
                  <span>{title}</span>
                  <span className="text-[#a1a1aa] font-normal"> • {year}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Subtitle / Description text below card (Desktop) */}
          <div className="hidden md:flex content-stretch items-start px-[13px] py-0 -mt-1.5 -mb-0.5 relative shrink-0 w-full">
            <p className="font-sans font-normal leading-snug text-zinc-500 group-hover:text-zinc-700 transition-colors duration-150 ease-out text-base tracking-[0.005em] text-left text-pretty">
              {description}
              {actionText && (
                <span className="inline-flex items-center ms-1.5 font-medium text-blue-500 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out">
                  • {actionText}
                </span>
              )}
            </p>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden content-stretch flex flex-col font-sans font-normal items-start leading-snug px-[13px] py-0 relative shrink-0 text-base tracking-[0.01em] gap-1 text-left w-full">
            <div className="flex items-center w-full">
              <p className="relative shrink-0 text-[#18181b] text-left font-medium">
                <span>{title}</span>
                <span className="text-zinc-500 font-normal tabular-nums"> • {year}</span>
              </p>
            </div>
            <p className="relative shrink-0 text-zinc-500 w-full text-left font-normal leading-tight text-pretty">
              {description}
            </p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
