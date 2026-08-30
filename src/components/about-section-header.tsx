"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Check } from "lucide-react";
import { play } from "@/lib/sound";
import { useAboutEye } from "@/context/about-eye-context";
import { InteractiveTsuLogo } from "./tsu-logo";

interface AboutSectionHeaderProps {
  title: React.ReactNode;
  sectionId?: string;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  years?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

export function AboutSectionHeader({
  title,
  sectionId,
  selectedYear = "2026",
  onYearChange,
  years = ["2026", "2025", "2024", "All"],
  selectedCategory = "All",
  onCategoryChange,
  categories,
}: AboutSectionHeaderProps) {
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(selectedCategory);
  const { activeSection } = useAboutEye();

  const handleSelectYear = (year: string) => {
    if (year !== currentYear) {
      play("loading", { volume: 0.35 });
    } else {
      play("toggle", { volume: 0.35 });
    }
    setCurrentYear(year);
    onYearChange?.(year);
    setIsYearOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    if (cat !== currentCategory) {
      play("loading", { volume: 0.35 });
    } else {
      play("toggle", { volume: 0.35 });
    }
    setCurrentCategory(cat);
    onCategoryChange?.(cat);
    setIsCategoryOpen(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none w-full">
      {/* Title */}
      <div className="relative min-w-0" data-about-heading={sectionId}>
        {sectionId && (
          <div className="hidden md:flex absolute -left-[64px] top-1/2 -translate-y-1/2 size-[56px] pointer-events-auto z-30 items-center justify-center">
            {activeSection === sectionId && (
              <motion.div
                layoutId="about-tsu-eye"
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 22,
                  mass: 0.85,
                }}
                className="size-full"
              >
                <InteractiveTsuLogo />
              </motion.div>
            )}
          </div>
        )}
        <h2 className="font-display text-[20px] xs:text-[23px] sm:text-[34px] md:text-[36px] font-medium leading-tight text-zinc-800 tracking-tight whitespace-nowrap">
          {title}
        </h2>
      </div>

      {/* Filters Group (Left-aligned on stacked mobile, Right-aligned on desktop) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto sm:ml-auto">
        {/* Year Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            data-cuelume-toggle
            onClick={() => {
              play("toggle", { volume: 0.3 });
              setIsYearOpen(!isYearOpen);
            }}
            className="pressable inline-flex items-center gap-2 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/60 px-3.5 py-1 text-sm sm:text-base font-medium text-[#8a7c64] hover:border-[#b8a786] hover:text-zinc-900 hover:bg-[#f3eedf]/50 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d0bb]"
            aria-expanded={isYearOpen}
            aria-haspopup="listbox"
          >
            <span className="tabular-nums">{currentYear}</span>
            <ChevronsUpDown className="size-3.5 opacity-70" />
          </button>

          <AnimatePresence>
            {isYearOpen && (
              <>
                {/* Backdrop closer */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsYearOpen(false)}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.97, y: -4 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 4,
                    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.99,
                    y: -4,
                    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                  }}
                  className="absolute right-0 top-full z-50 mt-1 min-w-[110px] overflow-hidden rounded-xl border border-[#d9d0bb] bg-[#fbfaf5] p-1 shadow-lg shadow-black/5 backdrop-blur-md"
                >
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => handleSelectYear(year)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-[#eae3d2]/60 hover:text-zinc-900 transition-colors"
                    >
                      <span className="tabular-nums">{year}</span>
                      {currentYear === year && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <Check className="size-3.5 text-zinc-800" />
                        </motion.span>
                      )}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Category Pill Dropdown (Rendered when categories are provided) */}
        {categories && categories.length > 0 && (
          <div className="relative">
            <button
              type="button"
              data-cuelume-toggle
              onClick={() => {
                play("toggle", { volume: 0.3 });
                setIsCategoryOpen(!isCategoryOpen);
              }}
              className="pressable inline-flex items-center gap-2 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/60 px-3.5 py-1 text-sm sm:text-base font-medium text-[#8a7c64] hover:border-[#b8a786] hover:text-zinc-900 hover:bg-[#f3eedf]/50 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d0bb]"
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
            >
              <span>{currentCategory}</span>
              <ChevronsUpDown className="size-3.5 opacity-70" />
            </button>

            <AnimatePresence>
              {isCategoryOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCategoryOpen(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: -4 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      y: 4,
                      transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.99,
                      y: -4,
                      transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="absolute right-0 top-full z-50 mt-1 min-w-[140px] max-w-[220px] max-h-[260px] overflow-y-auto rounded-xl border border-[#d9d0bb] bg-[#fbfaf5] p-1 shadow-lg shadow-black/5 backdrop-blur-md"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleSelectCategory(cat)}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-zinc-700 hover:bg-[#eae3d2]/60 hover:text-zinc-900 transition-colors"
                      >
                        <span className="truncate">{cat}</span>
                        {currentCategory === cat && (
                          <motion.span
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                            className="shrink-0"
                          >
                            <Check className="size-3.5 text-zinc-800" />
                          </motion.span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
