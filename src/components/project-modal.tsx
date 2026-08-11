"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

export type ProjectData = {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  year?: string;
  description: string;
  image?: string;
  gradient?: string;
  href?: string;
  actionText?: string;
  role?: string;
  timeline?: string;
  category?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
};

export type ProjectModalProps = {
  project: ProjectData | null;
  onClose: () => void;
};

const SECTIONS = [
  { id: "sec-media", label: "Media Preview" },
  { id: "sec-overview", label: "Tagline & Intro" },
  { id: "sec-details", label: "Project Details" },
  { id: "sec-vision", label: "01. Vision" },
  { id: "sec-challenge", label: "02. Challenge" },
  { id: "sec-execution", label: "03. Execution" },
];

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = useState("sec-media");
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);

  // Listen for Escape key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  // Track active section on scroll inside modal
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const containerTop = scrollContainerRef.current.getBoundingClientRect().top;

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const relativeTop = rect.top - containerTop;
        if (relativeTop <= 120 && relativeTop + rect.height > 20) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(id);
    }
  };

  if (!project) return null;

  const gradientPreset = project.gradient || "from-zinc-200 to-zinc-300";

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />

          {/* Card Outer Gradient Wrapper - Slide in / out */}
          <motion.div
            initial={{ opacity: 0, y: 70, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.96 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 26,
              mass: 0.8,
            }}
            onClick={(e) => e.stopPropagation()}
            className={`relative z-10 w-full max-w-[940px] max-h-[88vh] rounded-[28px] p-[1.5px] bg-gradient-to-br ${gradientPreset} shadow-[0_20px_50px_rgba(0,0,0,0.14)] flex flex-col overflow-hidden`}
          >
            {/* Inner Modal Container (#fbfaf5 dough paper finish) */}
            <div className="relative flex flex-col size-full overflow-hidden rounded-[26.5px] bg-[#fbfaf5] text-zinc-800 text-left">
              {/* Modal Top Header (Mobile & Desktop) */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08, ease: "easeOut" }}
                className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-black/5 shrink-0 bg-[#fbfaf5]/95 backdrop-blur-sm z-20"
              >
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">
                    {project.title}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 rounded-full">
                    {project.year || "2025"}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="pressable p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="size-5" />
                </button>
              </motion.div>

              {/* Main Body Grid Layout: Left Vertical Navigation Minimap & Right Scroll Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left Side Vertical Navigation Minimap Sidebar (Desktop) */}
                <motion.aside
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
                  className="hidden md:flex flex-col w-[210px] shrink-0 border-r border-black/5 p-6 justify-between bg-black/[0.015]"
                >
                  <div className="space-y-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                      Navigation
                    </p>

                    {/* Vertical Line Marker Navigation List */}
                    <nav className="flex flex-col gap-1.5" aria-label="Modal section minimap navigation">
                      {SECTIONS.map((sec) => {
                        const isActive = activeSectionId === sec.id;
                        const isHovered = hoveredSectionId === sec.id;

                        return (
                          <button
                            key={sec.id}
                            onClick={() => scrollToSection(sec.id)}
                            onMouseEnter={() => setHoveredSectionId(sec.id)}
                            onMouseLeave={() => setHoveredSectionId(null)}
                            className="group flex items-center gap-3 py-1 cursor-pointer text-left focus:outline-none"
                          >
                            {/* Line Marker with spring expansion */}
                            <div className="relative flex items-center h-4 w-12 shrink-0">
                              <motion.div
                                style={{ transformOrigin: "left center" }}
                                animate={{
                                  scaleX: isActive ? 1 : isHovered ? 0.64 : 0.32,
                                  backgroundColor: isActive ? "#18181b" : isHovered ? "#52525b" : "#d4d4d8",
                                  opacity: isActive ? 1 : isHovered ? 0.85 : 0.6,
                                }}
                                transition={{ type: "spring", stiffness: 360, damping: 26 }}
                                className="w-11 h-[2px] rounded-full"
                              />
                            </div>

                            {/* Section Label */}
                            <motion.span
                              animate={{
                                x: isActive ? 3 : isHovered ? 2 : 0,
                                color: isActive ? "#18181b" : isHovered ? "#3f3f46" : "#a1a1aa",
                                fontWeight: isActive ? 600 : 400,
                              }}
                              transition={{ duration: 0.15 }}
                              className="text-xs font-mono tracking-tight whitespace-nowrap"
                            >
                              {sec.label}
                            </motion.span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Sidebar Footer Link */}
                  {project.href && project.href !== "#" && (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-black/5"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </motion.aside>

                {/* Right Side Scrollable Modal Content */}
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 scroll-smooth"
                >
                  {/* Section 0: Media Preview */}
                  <motion.div
                    id="sec-media"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.12, ease: "easeOut" }}
                    className="relative aspect-[16/9] w-full rounded-[22px] overflow-hidden bg-zinc-100 border border-black/5 shadow-sm scroll-mt-6"
                  >
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover size-full"
                        sizes="(max-width: 768px) 100vw, 760px"
                      />
                    ) : (
                      <div className={`size-full bg-gradient-to-br ${gradientPreset}`} />
                    )}
                  </motion.div>

                  {/* Section 1: Tagline / Subtitle */}
                  <motion.div
                    id="sec-overview"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.18, ease: "easeOut" }}
                    className="scroll-mt-6"
                  >
                    <p className="font-display text-lg sm:text-xl font-medium leading-relaxed text-zinc-800 text-pretty">
                      {project.description}
                    </p>
                  </motion.div>

                  {/* Section 2: Metadata Grid */}
                  <motion.div
                    id="sec-details"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.24, ease: "easeOut" }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-black/5 scroll-mt-6"
                  >
                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                        Role
                      </p>
                      <p className="text-sm font-sans font-medium text-zinc-800">
                        {project.role || "Design Engineer"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                        Timeline
                      </p>
                      <p className="text-sm font-sans font-medium text-zinc-800">
                        {project.timeline || project.year || "2025"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                        Category
                      </p>
                      <p className="text-sm font-sans font-medium text-zinc-800">
                        {project.category || "Interface & System"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                        Live Link
                      </p>
                      {project.href && project.href !== "#" ? (
                        <a
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-sans font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <span>Visit Site</span>
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <p className="text-sm font-sans text-zinc-400">Prototype</p>
                      )}
                    </div>
                  </motion.div>

                  {/* Full Case Study Sections */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.3, ease: "easeOut" }}
                    className="space-y-8 pt-4 font-sans border-t border-black/5"
                  >
                    {/* Section 3: Vision */}
                    <div id="sec-vision" className="space-y-2.5 scroll-mt-6">
                      <h4 className="text-base font-semibold text-zinc-900 font-display">
                        01. Overview & Vision
                      </h4>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                        {project.overview ||
                          `${project.title} was built to explore tactile digital surfaces and fluid spatial physics. By combining physical material feedback with modern web animation standards, it turns routine interactions into memorable moments of delight.`}
                      </p>
                    </div>

                    {/* Section 4: Challenge */}
                    <div id="sec-challenge" className="space-y-2.5 scroll-mt-6">
                      <h4 className="text-base font-semibold text-zinc-900 font-display">
                        02. The Design Challenge
                      </h4>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                        {project.challenge ||
                          "Traditional web interfaces often suffer from rigid layout transitions and generic hover states. The challenge was creating a responsive design system that feels physical, alive, and effortless across both desktop pointer devices and mobile touch viewports."}
                      </p>
                    </div>

                    {/* Section 5: Execution */}
                    <div id="sec-execution" className="space-y-2.5 scroll-mt-6">
                      <h4 className="text-base font-semibold text-zinc-900 font-display">
                        03. Craft & Execution
                      </h4>
                      <p className="text-sm sm:text-base leading-relaxed text-zinc-600 text-pretty">
                        {project.solution ||
                          "Implemented custom Framer Motion spring physics, OKLCH color token palettes, and subpixel optic typography scaling. Micro-interactions were tuned for zero latency and natural interruptibility."}
                      </p>
                    </div>
                  </motion.div>

                  {/* Modal Footer Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.36, ease: "easeOut" }}
                    className="flex items-center justify-between gap-3 pt-6 border-t border-black/5"
                  >
                    {project.href && project.href !== "#" ? (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pressable inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-sans text-sm font-medium hover:bg-zinc-800 shadow-sm transition-all"
                      >
                        <span>Visit Live Site</span>
                        <ExternalLink className="size-4" />
                      </a>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={onClose}
                      className="pressable px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-800 font-sans text-sm font-medium hover:bg-black/5 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
