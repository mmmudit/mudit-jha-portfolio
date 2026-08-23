"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsUpDown, Check } from "lucide-react";

interface AboutSectionHeaderProps {
  title: React.ReactNode;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  years?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  categories?: string[];
}

export function AboutSectionHeader({
  title,
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

  const handleSelectYear = (year: string) => {
    setCurrentYear(year);
    onYearChange?.(year);
    setIsYearOpen(false);
  };

  const handleSelectCategory = (cat: string) => {
    setCurrentCategory(cat);
    onCategoryChange?.(cat);
    setIsCategoryOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 select-none w-full">
      {/* Title */}
      <h2 className="font-display text-[26px] sm:text-[34px] md:text-[36px] font-medium leading-tight text-[#d1c5ad] tracking-tight text-balance">
        {title}
      </h2>

      {/* Filters Group (Right-Aligned) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
        {/* Year Pill Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsYearOpen(!isYearOpen)}
            className="pressable inline-flex items-center gap-2 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/60 px-3.5 py-1 text-sm sm:text-base font-medium text-[#c4b598] hover:border-[#b8a786] hover:text-[#9e8b67] hover:bg-[#f3eedf]/50 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d0bb]"
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
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 4 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
                          initial={{ scale: 0.5, opacity: 0 }}
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
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="pressable inline-flex items-center gap-2 rounded-full border border-[#d9d0bb] bg-[#fbfaf5]/60 px-3.5 py-1 text-sm sm:text-base font-medium text-[#c4b598] hover:border-[#b8a786] hover:text-[#9e8b67] hover:bg-[#f3eedf]/50 active:scale-[0.96] transition-[transform,color,background-color,border-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9d0bb]"
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
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 4 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
                            initial={{ scale: 0.5, opacity: 0 }}
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
