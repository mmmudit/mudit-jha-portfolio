"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import { AboutSectionHeader } from "./about-section-header";
import { TextFlip } from "./text-flip";
import type { LibraryEntry } from "@/lib/notion-library";
import { FALLBACK_BOOKS } from "@/lib/notion";
import { useDragToScroll } from "@/hooks/use-drag-to-scroll";

export function AboutReadsSection() {
  const [books, setBooks] = useState<LibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { containerRef, handleLinkClick, canScrollLeft, canScrollRight } = useDragToScroll();

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch("/api/library");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setBooks(data);
          } else {
            setBooks(FALLBACK_BOOKS as unknown as LibraryEntry[]);
          }
        } else {
          setBooks(FALLBACK_BOOKS as unknown as LibraryEntry[]);
        }
      } catch (err) {
        console.warn("Failed to load Notion library, using fallback:", err);
        setBooks(FALLBACK_BOOKS as unknown as LibraryEntry[]);
      } finally {
        setIsLoading(false);
      }
    }
    loadBooks();
  }, []);

  // Dynamically extract all unique categories present in Notion books
  const availableCategories = Array.from(
    new Set(
      books
        .map((b) => b.category?.trim())
        .filter((c): c is string => Boolean(c && c.length > 0))
    )
  ).sort();
  const categoryOptions = ["All", ...availableCategories];

  // Helper to determine if a book is finished vs currently reading
  const getBookStatusInfo = (book: LibraryEntry) => {
    const hasFinishDate = Boolean(book.finishedDate && book.finishedDate.trim().length >= 4);
    const statusLower = book.status?.toLowerCase() || "";
    const isExplicitlyFinished = ["read", "done", "finished", "completed"].some((s) =>
      statusLower.includes(s)
    );
    const isExplicitlyReading = ["reading", "in progress", "current", "unread", "to read"].some(
      (s) => statusLower.includes(s)
    );

    const isFinished = hasFinishDate || (isExplicitlyFinished && !isExplicitlyReading);
    const isCurrentlyReading = !isFinished || isExplicitlyReading;
    const finishYear = hasFinishDate
      ? book.finishedDate!.trim().slice(0, 4)
      : book.year?.trim() || "2026";

    return { isFinished, isCurrentlyReading, finishYear };
  };

  // Dynamically extract all unique finish years from finished books
  const availableYears = Array.from(
    new Set(
      books
        .map((b) => {
          const { isFinished, finishYear } = getBookStatusInfo(b);
          return isFinished ? finishYear : null;
        })
        .filter((y): y is string => Boolean(y && y.length === 4))
    )
  ).sort((a, b) => b.localeCompare(a));

  const yearOptions = ["2026", ...availableYears.filter((y) => y !== "2026"), "All"];

  // Filter and sort books: "reading" books appear first, followed by newest finished books
  const filteredBooks = books
    .filter((b) => {
      const { isFinished, isCurrentlyReading, finishYear } = getBookStatusInfo(b);

      const matchesYear =
        selectedYear === "All" ||
        (selectedYear === "2026" ? (finishYear === "2026" || isCurrentlyReading) : (isFinished && finishYear === selectedYear));

      const matchesCategory =
        selectedCategory === "All" ||
        (b.category && b.category.toLowerCase().includes(selectedCategory.toLowerCase()));

      return matchesYear && matchesCategory;
    })
    .sort((a, b) => {
      const statusA = getBookStatusInfo(a);
      const statusB = getBookStatusInfo(b);

      // 1. Books currently being read are listed first
      if (statusA.isCurrentlyReading && !statusB.isCurrentlyReading) return -1;
      if (!statusA.isCurrentlyReading && statusB.isCurrentlyReading) return 1;

      // 2. Finished books sorted by finish date / year descending
      const dateA = a.finishedDate || a.year || "";
      const dateB = b.finishedDate || b.year || "";
      return dateB.localeCompare(dateA);
    });

  const hoveredBook = filteredBooks.find(
    (b, index) => (b.id || b.title || `book-${index}`) === hoveredId
  );
  const activeQuote =
    hoveredBook?.notes?.trim() ||
    (hoveredBook ? `${hoveredBook.title} by ${hoveredBook.author || "Selected Read"}` : null);

  const isTwoRows = filteredBooks.length > 5;

  return (
    <section className="relative w-full py-4 flex flex-col gap-6">
      {/* Header with Year and Category Filter Dropdowns */}
      <AboutSectionHeader
        title={
          <span className="inline-flex items-baseline gap-[0.25em] flex-wrap">
            <span>reads that keep me</span>
            <TextFlip className="font-hand font-bold text-[36px]">
              <span>creative.</span>
              <span>curious.</span>
              <span>focused.</span>
              <span>inspired.</span>
            </TextFlip>
          </span>
        }
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        years={yearOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categoryOptions.length > 1 ? categoryOptions : undefined}
      />

      {/* Drag-to-Scroll Books Carousel Container with Blurred Edge Gradients */}
      <div className="relative w-full overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        {/* Left Blurred Gradient Edge */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-r from-[#fbfaf5] via-[#fbfaf5]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black_20%,transparent_100%)] transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Right Blurred Gradient Edge */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-l from-[#fbfaf5] via-[#fbfaf5]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_20%,transparent_100%)] transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"
            }`}
        />

        <div
          ref={containerRef}
          className="relative w-full overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing select-none"
        >
          {isLoading ? (
            <div className="grid grid-rows-2 grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max py-4 pl-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-[142px] sm:w-[152px] h-[220px] sm:h-[233px] rounded-[16px] t-skeleton border border-zinc-300/40"
                />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <BookOpen className="size-6 text-zinc-300" />
              <p className="text-sm font-display text-center text-pretty max-w-[320px]">
                No books found for this filter. Try selecting &ldquo;All&rdquo; or a different category.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className={`grid ${isTwoRows ? "grid-rows-2" : "grid-rows-1"
                } grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max pb-3 pl-3 pt-2 t-skeleton-reveal`}
            >
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, index) => {
                  const bookKey = book.id || book.title || `book-${index}`;
                  const isHovered = hoveredId === bookKey;
                  const { isCurrentlyReading } = getBookStatusInfo(book);

                  return (
                    <motion.div
                      key={bookKey}
                      data-magnetic-card
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={() => setHoveredId(bookKey)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(bookKey)}
                      onBlur={() => setHoveredId(null)}
                      className="flex flex-col items-center w-[142px] sm:w-[152px] group"
                    >
                      {/* Book Card Visual Container - Clean Cover Art Only */}
                      <motion.a
                        href={book.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        data-cuelume-hover="tick"
                        data-cuelume-press
                        data-cuelume-release
                        whileHover={{
                          y: -5,
                          scale: 1.02,
                          transition: { type: "spring", stiffness: 350, damping: 22 },
                        }}
                        whileTap={{ scale: 0.96 }}
                        className="relative w-full  h-[220px] sm:h-[233px] rounded-[16px] bg-[#121214] group-hover:saturate-100 text-white overflow-hidden shadow-[0px_4px_16px_rgba(0,0,0,0.18)] border border-zinc-200/80 ring-1 ring-black/10 cursor-pointer transition-[filter] duration-300"
                      >
                        {/* Currently Reading Floating Pill Tag */}
                        {isCurrentlyReading && (
                          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[9px] sm:text-[10px] font-sans font-medium text-emerald-300 shadow-md">
                              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="whitespace-nowrap">reading</span>
                            </span>
                          </div>
                        )}

                        {/* Cover Art Image */}
                        {book.imageUrl ? (
                          <div className="relative size-full">
                            <Image
                              src={book.imageUrl}
                              alt={book.title}
                              fill
                              unoptimized
                              draggable={false}
                              className="object-cover size-full group-hover:scale-105 transition-transform duration-300 ease-out pointer-events-none select-none"
                              sizes="(max-width: 768px) 142px, 152px"
                            />
                          </div>
                        ) : (
                          <div className="size-full bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 flex flex-col justify-end">
                            <span className="font-serif font-bold text-[17px] text-white/90 leading-snug">
                              {book.title}
                            </span>
                          </div>
                        )}

                        {/* Hover Frosted Rating Overlay */}
                        <div
                          className={`absolute inset-x-0 bottom-0 h-[80%] rounded-b-[16px] backdrop-blur-[1px] bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end justify-center pb-3 transition-[opacity,transform] duration-200 ease-out z-20 ${isHovered
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-2 pointer-events-none"
                            }`}
                        >
                          <div className="flex items-center gap-0.5">
                            {[...Array(book.rating || 5)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={false}
                                animate={
                                  isHovered
                                    ? { scale: 1, opacity: 1, y: 0 }
                                    : { scale: 0.7, opacity: 0, y: 4 }
                                }
                                transition={{
                                  duration: 0.16,
                                  delay: isHovered ? i * 0.035 : 0,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                              >
                                <Star
                                  fill="amber"
                                  strokeWidth={0}
                                  className="size-4 sm:size-4.5 fill-amber-400 text-amber-400 drop-shadow-xs"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.a>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Notes/Quotes Marquee Banner (Strictly visible only when hovering over a book card) */}
      <div className="relative w-full h-[48px] flex items-center justify-center overflow-hidden py-1 px-4">
        <div
          className="w-full overflow-hidden whitespace-nowrap flex items-center"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <AnimatePresence mode="wait">
            {hoveredBook && activeQuote && (
              <motion.div
                key={`quote-${hoveredBook.id || hoveredBook.title}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex items-center"
              >
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    duration: 22,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  className="flex items-center gap-6 min-w-max text-[#636366] font-display text-[15px] sm:text-[17px]"
                >
                  {[...Array(4)].map((_, idx) => (
                    <span key={idx} className="flex items-center gap-6">
                      <span className="text-zinc-900 font-medium">{hoveredBook.title}{hoveredBook.author ? ` by ${hoveredBook.author}` : ""}:</span>
                      <span className="italic text-zinc-700">“{activeQuote}”</span>
                      <span className="text-willow-grey font-normal not-italic">|</span>
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
