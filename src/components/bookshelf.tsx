"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";

export type BookData = {
  _id?: string;
  title: string;
  author: string;
  authorInitials?: string;
  spineColor?: string;
  spineTextColor?: string;
  coverImage?: string;
  link?: string;
  order?: number;
};

export type BookshelfProps = {
  books: BookData[];
};

export function Bookshelf({ books }: BookshelfProps) {
  const [selectedBook, setSelectedBook] = useState<BookData | null>(books[0] || null);
  const [hoveredBook, setHoveredBook] = useState<BookData | null>(null);
  const reduce = useReducedMotion();

  const activeBook = hoveredBook || selectedBook || books[0];

  return (
    <section className="flex flex-col gap-6 w-full py-6 select-none font-sans">
      {/* Section Header Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-300">
          <span>04</span>
          <span className="ms-1 text-zinc-400">//</span>
        </div>
        <h2 className="font-mono text-sm font-semibold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
          BOOKS I LOVE
        </h2>
      </div>

      {/* Bookshelf Display Area */}
      <div className="relative flex flex-col items-center justify-end w-full min-h-[380px] p-6 sm:p-8 rounded-[28px] bg-[#111113] border border-zinc-800 text-white overflow-hidden shadow-2xl">
        {/* Subtle background ambient spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/40 via-transparent to-transparent pointer-events-none" />

        {/* Selected Book Showcase Preview (When Expanded/Selected) */}
        <div className="relative z-10 w-full max-w-[680px] flex flex-col md:flex-row items-center justify-between gap-6 mb-8 min-h-[160px]">
          <AnimatePresence mode="wait">
            {activeBook && (
              <motion.div
                key={activeBook._id || activeBook.title}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
                transition={
                  reduce
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 320, damping: 28, mass: 0.8 }
                }
                className="flex items-center gap-5 w-full bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md shadow-xl"
              >
                {/* Book Mini Cover Graphic */}
                <div
                  style={{ backgroundColor: activeBook.spineColor || "#ff4500" }}
                  className="relative shrink-0 w-24 h-32 rounded-lg shadow-md border border-white/20 p-3 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle Grid overlay for design books */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:12px_12px]" />
                  <p
                    style={{ color: activeBook.spineTextColor || "#ffffff" }}
                    className="relative z-10 font-display font-bold text-xs leading-tight line-clamp-3"
                  >
                    {activeBook.title}
                  </p>
                  <p
                    style={{ color: activeBook.spineTextColor || "#ffffff" }}
                    className="relative z-10 font-mono text-[9px] opacity-80"
                  >
                    {activeBook.authorInitials || activeBook.author}
                  </p>
                </div>

                {/* Book Details Summary */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                      Reading List
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white tracking-tight truncate">
                    {activeBook.title}
                  </h3>
                  <p className="font-sans text-xs text-zinc-400 truncate">
                    by {activeBook.author}
                  </p>

                  {activeBook.link && activeBook.link !== "#" && (
                    <a
                      href={activeBook.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-xs font-mono font-medium text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Explore Book</span>
                      <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Vertical Spines Standing on Shelf */}
        <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-2.5 w-full overflow-x-auto pb-1 pt-6 px-2 scrollbar-none">
          {books.map((b, idx) => {
            const isSelected = selectedBook?._id === b._id || selectedBook?.title === b.title;
            const isHovered = hoveredBook?._id === b._id || hoveredBook?.title === b.title;

            // Generate deterministic spine height/width variations per book index
            const spineHeight = 220 + (idx % 5) * 12;
            const spineWidth = 28 + (idx % 4) * 4;

            return (
              <motion.button
                key={b._id || b.title || idx}
                onClick={() => setSelectedBook(b)}
                onMouseEnter={() => setHoveredBook(b)}
                onMouseLeave={() => setHoveredBook(null)}
                animate={{
                  y: isHovered ? -16 : isSelected ? -8 : 0,
                  rotateZ: isHovered ? (idx % 2 === 0 ? -1.5 : 1.5) : 0,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                style={{
                  height: `${spineHeight}px`,
                  width: `${spineWidth}px`,
                  backgroundColor: b.spineColor || "#ff4500",
                }}
                className="relative shrink-0 rounded-t-md rounded-b-[2px] shadow-md border-x border-t border-white/20 cursor-pointer flex flex-col items-center justify-between py-3.5 px-1 group focus:outline-none transition-shadow hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)]"
              >
                {/* 3D Spine Lighting Highlight */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-black/30 pointer-events-none rounded-t-md" />

                {/* Vertical Book Title Text */}
                <div className="flex-1 flex items-center justify-center overflow-hidden w-full">
                  <span
                    style={{
                      color: b.spineTextColor || "#ffffff",
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                    className="font-display font-medium text-xs tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-h-[170px]"
                  >
                    {b.title}
                  </span>
                </div>

                {/* Author Initials at Spine Base */}
                <span
                  style={{ color: b.spineTextColor || "#ffffff" }}
                  className="font-mono text-[9px] font-semibold uppercase tracking-wider opacity-85 shrink-0 pt-1"
                >
                  {b.authorInitials || b.author.substring(0, 3)}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 3D Wooden Shelf Ledge */}
        <div className="relative z-20 w-full h-5 rounded-sm bg-gradient-to-b from-[#6e4321] via-[#4d2d14] to-[#2e1909] border-t border-amber-500/30 shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />

        {/* Bottom Selected Title Highlight Link */}
        <div className="relative z-10 pt-4 flex items-center justify-center">
          {activeBook && (
            <a
              href={activeBook.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-display text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <span>{activeBook.title}</span>
              <ExternalLink className="size-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
