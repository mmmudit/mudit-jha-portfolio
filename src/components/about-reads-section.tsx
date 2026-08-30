"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen } from "lucide-react";
import { AboutSectionHeader } from "./about-section-header";
import Typewriter from "@/components/fancy/text/typewriter";
import type { LibraryEntry } from "@/lib/notion-library";
import { FALLBACK_BOOKS } from "@/lib/notion";
import { useDragToScroll } from "@/hooks/use-drag-to-scroll";

export function AboutReadsSection() {
  const [books, setBooks] = useState<LibraryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [centerActiveId, setCenterActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const { containerRef, handleLinkClick, canScrollLeft, canScrollRight } = useDragToScroll();

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    async function loadBooks() {
      try {
        const res = await fetch("/api/library");
        if (res.ok && !isCancelled) {
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
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();
    return () => { isCancelled = true; };
  }, []);

  const categoryOptions = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    books.forEach((b) => {
      if (b.category) {
        b.category.split(",").forEach((c) => cats.add(c.trim()));
      }
    });
    return Array.from(cats);
  }, [books]);

  const yearOptions = ["2026", "2025", "2024", "All"];

  const getBookStatusInfo = (b: LibraryEntry) => {
    const status = (b.status || "").toLowerCase();
    const isCurrentlyReading = status.includes("reading") || status.includes("in progress");
    const isFinished = status.includes("done") || status.includes("finished") || status.includes("read");
    const finishYear = b.finishedDate
      ? b.finishedDate.trim().slice(0, 4)
      : b.year || "2026";

    return { isCurrentlyReading, isFinished, finishYear };
  };

  const filteredBooks = books
    .filter((b) => {
      const { isFinished, isCurrentlyReading, finishYear } = getBookStatusInfo(b);
      const matchesYear = selectedYear === "All" || (selectedYear === "2026" ? (finishYear === "2026" || isCurrentlyReading) : (isFinished && finishYear === selectedYear));
      const matchesCategory = selectedCategory === "All" || (b.category && b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
      return matchesYear && matchesCategory;
    })
    .sort((a, b) => {
      const statusA = getBookStatusInfo(a);
      const statusB = getBookStatusInfo(b);
      if (statusA.isCurrentlyReading && !statusB.isCurrentlyReading) return -1;
      if (!statusA.isCurrentlyReading && statusB.isCurrentlyReading) return 1;
      const dateA = a.finishedDate || a.year || "";
      const dateB = b.finishedDate || b.year || "";
      return dateB.localeCompare(dateA);
    });

  useEffect(() => {
    if (!isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const updateCenterCard = () => {
      const containerRect = el.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;
      const cardElements = el.querySelectorAll<HTMLElement>("[data-book-card]");
      let closestId: string | null = null;
      let minDistance = Infinity;

      cardElements.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenterX - cardCenterX);
        if (distance < minDistance) {
          minDistance = distance;
          closestId = card.getAttribute("data-book-card");
        }
      });

      if (closestId && closestId !== centerActiveId) {
        setCenterActiveId(closestId);
      }
    };

    updateCenterCard();
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateCenterCard);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isMobile, filteredBooks, centerActiveId]);

  const activeId = isMobile ? (centerActiveId || (filteredBooks[0]?.id || filteredBooks[0]?.title || null)) : hoveredId;
  const activeBook = filteredBooks.find(
    (b, index) => (b.id || b.title || `book-${index}`) === activeId
  );
  const activeQuote = activeBook?.notes?.trim() || (activeBook ? `${activeBook.title} by ${activeBook.author || "Selected Read"}` : null);

  const isTwoRows = filteredBooks.length > 5;

  return (
    <section className="relative w-full py-4 flex flex-col gap-6">
      <AboutSectionHeader
        sectionId="reads"
        title={
          <span className="inline-flex items-baseline gap-[0.25em] flex-wrap text-zinc-800">
            <span>reads that keep me</span>
            <Typewriter
              text={["creative.", "curious.", "focused.", "inspired."]}
              className="font-hand font-bold text-[36px] text-rust-grey"
              speed={65}
              deleteSpeed={35}
              waitTime={2200}
              cursorClassName="text-[#8a7c64] font-light ml-0.5"
            />
          </span>
        }
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        years={yearOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categoryOptions.length > 1 ? categoryOptions : undefined}
      />

      <div className="relative w-full overflow-hidden -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-r from-[#fbfaf5] via-[#fbfaf5]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_right,black_20%,transparent_100%)] transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />
        <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-30 bg-gradient-to-l from-[#fbfaf5] via-[#fbfaf5]/80 to-transparent backdrop-blur-[2px] [mask-image:linear-gradient(to_left,black_20%,transparent_100%)] transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

        <div
          ref={containerRef}
          className="relative w-full overflow-x-auto no-scrollbar py-2 cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory sm:snap-none"
        >
          {isLoading ? (
            <div className="grid grid-rows-1 sm:grid-rows-2 grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max py-4 px-[calc(50vw-71px)] sm:px-0 sm:pl-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-[142px] sm:w-[152px] h-[220px] sm:h-[233px] rounded-[16px] t-skeleton border border-zinc-300/40" />
              ))}
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <BookOpen className="size-6 text-zinc-300" />
              <p className="text-sm font-display text-center text-pretty max-w-[320px]">No books found for this filter.</p>
            </div>
          ) : (
            <motion.div
              layout
              className={`grid grid-rows-1 ${isTwoRows ? "sm:grid-rows-2" : "sm:grid-rows-1"} grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max pb-3 px-[calc(50vw-71px)] sm:px-0 sm:pl-3 pt-2 t-skeleton-reveal`}
            >
              <AnimatePresence mode="popLayout">
                {filteredBooks.map((book, index) => {
                  const bookKey = book.id || book.title || `book-${index}`;
                  const isCardActive = isMobile ? activeId === bookKey : hoveredId === bookKey;
                  const { isCurrentlyReading } = getBookStatusInfo(book);

                  return (
                    <motion.div
                      key={bookKey}
                      data-magnetic-card
                      data-book-card={bookKey}
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{
                        opacity: isMobile ? (isCardActive ? 1 : 0.4) : 1,
                        filter: isMobile ? (isCardActive ? "blur(0px)" : "blur(1.5px)") : "blur(0px)",
                        scale: isMobile ? (isCardActive ? 1.02 : 0.94) : 1,
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        filter: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        layout: { duration: 0.25 },
                      }}
                      onMouseEnter={() => !isMobile && setHoveredId(bookKey)}
                      onMouseLeave={() => !isMobile && setHoveredId(null)}
                      onFocus={() => setHoveredId(bookKey)}
                      onBlur={() => setHoveredId(null)}
                      className="flex flex-col items-center w-[142px] sm:w-[152px] group snap-center"
                    >
                      <motion.a
                        href={book.link || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleLinkClick}
                        whileHover={{ y: -5, scale: 1.02, transition: { type: "spring", stiffness: 350, damping: 22 } }}
                        whileTap={{ scale: 0.96 }}
                        className="relative w-[142px] sm:w-[152px] h-[220px] sm:h-[233px] rounded-[16px] bg-[#fbfaf5] border border-zinc-200 flex flex-col overflow-hidden shadow-md z-10 cursor-pointer"
                      >
                        {book.imageUrl ? (
                          <div className="relative size-full">
                            <Image
                              src={book.imageUrl}
                              alt={book.title}
                              fill
                              unoptimized
                              draggable={false}
                              className={`object-cover size-full transition-[transform,filter] duration-300 ease-out ${isCardActive ? "saturate-100 scale-100" : "saturate-40"}`}
                              sizes="(max-width: 768px) 142px, 152px"
                            />
                          </div>
                        ) : (
                          <div className="size-full bg-zinc-800 flex flex-col items-center justify-center p-4 text-center">
                            <span className="font-bold text-white text-[15px]">{book.title}</span>
                          </div>
                        )}
                        {isCurrentlyReading && (
                          <div className="absolute top-2.5 left-2.5 z-20">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-medium text-emerald-300">
                              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Reading
                            </span>
                          </div>
                        )}
                        <div className={`absolute inset-x-0 bottom-0 h-[80%] rounded-b-[16px] bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-3 transition-opacity duration-200 z-20 ${isCardActive ? "opacity-100" : "opacity-0"}`}>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: book.rating || 5 }).map((_, i) => (
                              <Star key={i} fill="currentColor" className="size-4 text-amber-400" />
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

      <div className="relative w-full h-[48px] flex items-center justify-center overflow-hidden py-1 px-4">
        <div className="w-full overflow-hidden whitespace-nowrap flex items-center" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
          <AnimatePresence mode="wait">
            {activeBook && activeQuote && (
              <motion.div
                key={`quote-${activeBook.id || activeBook.title}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full flex items-center"
              >
                <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }} className="flex items-center gap-6 min-w-max text-[15px]">
                  {[...Array(4)].map((_, idx) => (
                    <span key={idx} className="flex items-center gap-6">
                      <span className="text-zinc-900 font-medium">{activeBook.title}:</span>
                      <span className="italic text-zinc-600">“{activeQuote}”</span>
                      <span className="text-zinc-300">|</span>
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
