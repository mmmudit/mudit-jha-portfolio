"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, ExternalLink, Play, Disc } from "lucide-react";

export type TuneData = {
  _id?: string;
  title: string;
  artist: string;
  album?: string;
  coverImage?: string;
  gradient?: string;
  link?: string;
  audioPreviewUrl?: string;
  order?: number;
};

export type TunesSectionProps = {
  tunes: TuneData[];
};

export function TunesSection({ tunes }: TunesSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const activeIndex = hoveredIndex !== null ? hoveredIndex : selectedIndex;
  const activeTune = tunes[activeIndex] || tunes[0];

  return (
    <section className="flex flex-col gap-6 w-full py-6 select-none font-sans">
      {/* Section Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300">
            <Headphones className="size-4" />
          </div>
          <h2 className="font-mono text-sm font-semibold tracking-widest uppercase text-zinc-700 dark:text-zinc-300">
            TUNES I'M LOVIN'
          </h2>
        </div>

        <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
          {tunes.length} tracks in heavy rotation
        </span>
      </div>

      {/* Main Tunes Container Card */}
      <div className="relative flex flex-col items-center justify-between w-full min-h-[420px] p-6 sm:p-8 rounded-[28px] bg-[#111113] border border-zinc-800 text-white overflow-hidden shadow-2xl">
        {/* Subtle background ambient gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800/30 via-transparent to-transparent pointer-events-none" />

        {/* Selected Track Top Header Summary */}
        <div className="relative z-10 w-full max-w-[640px] flex items-center justify-between gap-4 mb-6">
          <AnimatePresence mode="wait">
            {activeTune && (
              <motion.div
                key={activeTune._id || activeTune.title}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between w-full bg-zinc-900/80 border border-zinc-800 p-3.5 px-4 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0 size-10 rounded-full overflow-hidden border border-white/10 bg-zinc-800 flex items-center justify-center">
                    <Disc className="size-5 text-amber-400 animate-spin-slow" />
                  </div>

                  <div className="flex flex-col text-left min-w-0">
                    <p className="font-display font-semibold text-sm text-white tracking-tight truncate">
                      {activeTune.title}
                    </p>
                    <p className="font-sans text-xs text-zinc-400 truncate">
                      {activeTune.artist} {activeTune.album ? `• ${activeTune.album}` : ""}
                    </p>
                  </div>
                </div>

                {activeTune.link && activeTune.link !== "#" && (
                  <a
                    href={activeTune.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-medium transition-colors"
                  >
                    <span>Spotify</span>
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interactive Overlapping Accordion Album Stack (Tommy Smith Style) */}
        <div className="relative z-10 flex items-center justify-center w-full min-h-[260px] py-4 overflow-x-auto scrollbar-none px-4">
          <div className="flex items-center justify-center -space-x-12 sm:-space-x-16 hover:-space-x-6 transition-[space] duration-300 ease-out">
            {tunes.map((t, idx) => {
              const isHovered = hoveredIndex === idx;
              const isSelected = selectedIndex === idx;
              const isActive = activeIndex === idx;

              return (
                <motion.button
                  key={t._id || t.title || idx}
                  onClick={() => setSelectedIndex(idx)}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{
                    y: isHovered ? -24 : isSelected ? -12 : 0,
                    scale: isHovered ? 1.08 : isSelected ? 1.02 : 0.96,
                    rotateZ: isHovered ? (idx % 2 === 0 ? -3 : 3) : 0,
                  }}
                  transition={{ type: "spring", stiffness: 360, damping: 24 }}
                  style={{
                    zIndex: isHovered ? 40 : isSelected ? 30 : idx + 10,
                  }}
                  className="relative shrink-0 aspect-[2/3] w-[140px] sm:w-[170px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 cursor-pointer focus:outline-none transition-shadow hover:shadow-[0_16px_36px_rgba(0,0,0,0.7)] group"
                >
                  {/* Album Cover Media */}
                  {t.coverImage ? (
                    <Image
                      src={t.coverImage}
                      alt={t.title}
                      fill
                      className="object-cover size-full group-hover:scale-105 transition-transform duration-300 ease-out"
                      sizes="(max-width: 768px) 140px, 170px"
                    />
                  ) : (
                    <div
                      className={`size-full bg-gradient-to-br ${
                        t.gradient || "from-purple-900 via-zinc-900 to-black"
                      } flex flex-col justify-between p-4 text-left border border-white/10`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                          0{idx + 1}
                        </span>
                        <Play className="size-4 text-white/70" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-sm text-white leading-tight line-clamp-2">
                          {t.title}
                        </p>
                        <p className="font-sans text-xs text-white/70 truncate mt-0.5">
                          {t.artist}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Gradient Bottom Overlay for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                  {/* Bottom Song Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3 text-left">
                    <p className="font-display font-semibold text-xs text-white truncate">
                      {t.title}
                    </p>
                    <p className="font-sans text-[10px] text-zinc-300 truncate">
                      {t.artist}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom Track Title Link Bar */}
        <div className="relative z-10 pt-4 flex items-center justify-center min-h-[28px]">
          <AnimatePresence mode="wait" initial={false}>
            {activeTune && (
              <motion.a
                key={activeTune._id || activeTune.title}
                href={activeTune.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="group inline-flex items-center gap-2 font-display text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <span>Playing: {activeTune.title} — {activeTune.artist}</span>
                <ExternalLink className="size-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              </motion.a>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
