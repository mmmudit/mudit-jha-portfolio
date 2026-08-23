"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AboutSectionHeader } from "./about-section-header";
import { play } from "@/lib/sound";

export interface MomentItem {
  id: string;
  name: string;
  year: string;
  quote: string;
  location?: string;
  image: string;
}

const momentsData: MomentItem[] = [
  {
    id: "moment-1",
    name: "Night Train Reverie",
    year: "2026",
    quote: "The best interfaces feel like tangible wooden instruments, not plastic displays.",
    location: "Studio Ghibli",
    image: "https://media.giphy.com/media/10t502766lf6gg/giphy.gif",
  },
  {
    id: "moment-2",
    name: "Howl's Valley Flight",
    year: "2026",
    quote: "Physics in software is just trust made visible through motion.",
    location: "Ingary Alps",
    image: "https://media.giphy.com/media/B2l0NnxK9KiVa/giphy.gif",
  },
  {
    id: "moment-3",
    name: "Totoro Rain Sanctuary",
    year: "2026",
    quote: "Great craft isn’t about perfection; it’s about intention in every millisecond.",
    location: "Matsugo Forest",
    image: "https://media.giphy.com/media/11KzOet1ElBDz2/giphy.gif",
  },
  {
    id: "moment-4",
    name: "Cozy Lofi Study",
    year: "2026",
    quote: "Quiet environments create dense, high-resolution thinking.",
    location: "Tokyo Studio",
    image: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif",
  },
  {
    id: "moment-5",
    name: "Neo-Tokyo Night Cruise",
    year: "2026",
    quote: "When sound, haptics, and shaders click together, code stops feeling like math.",
    location: "Neo-Tokyo",
    image: "https://media.giphy.com/media/JqBcYunETBib6/giphy.gif",
  },
  {
    id: "moment-6",
    name: "Comet Twilight Sky",
    year: "2026",
    quote: "Design is remembering what the future was supposed to feel like.",
    location: "Itomori Lake",
    image: "https://media.giphy.com/media/ErZ8hv5eO92JW/giphy.gif",
  },
  {
    id: "moment-7",
    name: "Wind Rises Flight Dreams",
    year: "2026",
    quote: "Air and aerodynamics in code: frictionless, responsive, and alive.",
    location: "Karuizawa Valley",
    image: "https://media.giphy.com/media/3og0IPxMM0erATueVW/giphy.gif",
  },
];

export function AboutMomentsSection() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [isHovered, setIsHovered] = useState(false);

  const filteredMoments = useMemo(() => {
    return selectedYear === "All"
      ? momentsData
      : momentsData.filter((m) => m.year === selectedYear || selectedYear === "2026");
  }, [selectedYear]);

  // Center card as default
  const defaultCenterIndex = Math.floor(filteredMoments.length / 2);
  const [currentIndex, setCurrentIndex] = useState(defaultCenterIndex);

  const total = filteredMoments.length;
  const activeMoment = filteredMoments[currentIndex] || filteredMoments[defaultCenterIndex] || momentsData[0];

  const handlePrev = useCallback(() => {
    play("page", { volume: 0.35 });
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    play("page", { volume: 0.35 });
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <section
      className="relative w-full py-4 flex flex-col gap-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Moments carousel"
    >
      {/* Section Header with year dropdown */}
      <AboutSectionHeader
        title="moments that stuck"
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      {/* 3D Coverflow Carousel Draggable Container */}
      <div className="relative w-full py-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Coverflow Viewport with 3D Perspective & Drag Gesture */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={(_, info) => {
            const swipeThreshold = 35;
            const velocityThreshold = 250;
            if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
              handlePrev();
            } else if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
              handleNext();
            }
          }}
          className="relative w-full max-w-[1050px] h-[220px] sm:h-[280px] md:h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ perspective: 1200 }}
        >
          {filteredMoments.map((moment, index) => {
            const offset = index - currentIndex;
            const isCenter = offset === 0;

            // 16:9 Coverflow 3D Geometry
            let x = 0;
            let rotateY = 0;
            let scale = 1;

            if (offset === 0) {
              x = 0;
              rotateY = 0;
              scale = 1;
            } else if (offset < 0) {
              // Left cards angled inward
              x = offset * 140 - 50;
              rotateY = 48;
              scale = Math.max(0.72, 0.88 - Math.abs(offset) * 0.07);
            } else {
              // Right cards angled inward
              x = offset * 140 + 50;
              rotateY = -48;
              scale = Math.max(0.72, 0.88 - Math.abs(offset) * 0.07);
            }

            const zIndex = 100 - Math.abs(offset);

            return (
              <motion.div
                key={moment.id}
                data-magnetic-card
                onClick={() => {
                  if (currentIndex !== index) {
                    play("page", { volume: 0.35 });
                    setCurrentIndex(index);
                  }
                }}
                initial={false}
                animate={{
                  x,
                  rotateY,
                  scale,
                  zIndex,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 26,
                  mass: 0.8,
                }}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex,
                }}
                className="absolute w-[280px] sm:w-[380px] md:w-[460px] aspect-video origin-center focus:outline-none"
              >
                {/* Solid 16:9 Card (Opaque, zero translucency, crisp shadow) */}
                <div
                  className={`relative size-full rounded-[18px] sm:rounded-[22px] overflow-hidden bg-zinc-950 transition-all duration-300 ${
                    isCenter
                      ? "shadow-[0_24px_50px_-10px_rgba(0,0,0,0.45),0_0_0_1px_rgba(200,213,187,0.85)] brightness-100"
                      : "shadow-[0_12px_32px_rgba(0,0,0,0.35)] border border-black/40 brightness-[0.82]"
                  }`}
                >
                  <img
                    src={moment.image}
                    alt={moment.name}
                    className="size-full object-cover select-none pointer-events-none block"
                    loading="lazy"
                    draggable={false}
                  />

                  {/* Specular sheen reflection overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/25 via-transparent to-white/10 pointer-events-none" />

                  {/* On-Hover In-Card Bottom Caption */}
                  <AnimatePresence>
                    {isHovered && isCenter && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end justify-between pointer-events-none z-20"
                      >
                        <div className="flex flex-col">
                          <span className="font-display text-[13px] sm:text-[15px] font-semibold text-white tracking-tight">
                            {moment.name}
                          </span>
                          {moment.location && (
                            <span className="font-sans text-[11px] sm:text-[12px] text-zinc-300">
                              {moment.location}
                            </span>
                          )}
                        </div>
                        <span className="tabular-nums text-[11px] font-mono font-medium text-[#c8d5bb] bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                          {moment.year}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Hover Caption Text below carousel */}
        <div className="h-[28px] flex items-center justify-center mt-3">
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.p
                key={activeMoment.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-medium text-[13px] sm:text-[14px] text-[#7f7f80] text-center tracking-[0.08px]"
              >
                {activeMoment.name} — {activeMoment.location || activeMoment.year}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controls & Indicator Dots */}
        <div className="flex items-center gap-6 mt-3 z-20">
          <button
            type="button"
            onClick={handlePrev}
            data-cuelume-hover="tick"
            data-cuelume-press
            data-cuelume-release
            aria-label="Previous moment"
            className="pressable size-8 rounded-full border border-[#d9d0bb] bg-[#fbfaf5] flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-[#eae3d2]/40 shadow-xs"
          >
            <ChevronLeft className="size-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {filteredMoments.map((_, i) => (
              <button
                key={i}
                type="button"
                data-cuelume-press
                onClick={() => {
                  if (currentIndex !== i) {
                    play("toggle", { volume: 0.35 });
                    setCurrentIndex(i);
                  }
                }}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === i
                    ? "w-6 h-2 bg-[#8c9c7e]"
                    : "size-2 bg-zinc-300 hover:bg-zinc-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            data-cuelume-hover="tick"
            data-cuelume-press
            data-cuelume-release
            aria-label="Next moment"
            className="pressable size-8 rounded-full border border-[#d9d0bb] bg-[#fbfaf5] flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:bg-[#eae3d2]/40 shadow-xs"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* On-Hover Infinite Marquee Text Area */}
      <div className="relative w-full min-h-[56px] flex items-center justify-center overflow-hidden py-2 px-4 border-t border-b border-[#c8d5bb]/30 bg-[#f7f5ed]/40">
        <AnimatePresence mode="wait">
          {isHovered ? (
            /* Infinite Continuous Marquee Banner on Hover */
            <motion.div
              key="marquee-banner"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="w-full overflow-hidden whitespace-nowrap flex items-center"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              }}
            >
              <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 22,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="flex items-center gap-6 min-w-max text-[#636366] font-display italic text-[15px] sm:text-[17px]"
              >
                {/* Looping marquee content (repeated for seamless loop) */}
                {[...Array(4)].map((_, idx) => (
                  <span key={idx} className="flex items-center gap-6">
                    <span>“{activeMoment.quote}”</span>
                    <span className="text-[#a8b899] font-normal not-italic">•</span>
                    <span>{activeMoment.name} ({activeMoment.location})</span>
                    <span className="text-[#a8b899] font-normal not-italic">•</span>
                  </span>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Static Centered Takeaway when not hovered */
            <motion.p
              key={`quote-${activeMoment.id}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-display italic text-[15px] sm:text-[17px] text-[#7f7f80] font-normal text-center max-w-[850px] truncate"
            >
              “{activeMoment.quote}”
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
