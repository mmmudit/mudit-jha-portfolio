"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Disc, Music2 } from "lucide-react";
import { AboutSectionHeader } from "./about-section-header";
import { TextFlip } from "./text-flip";
import { PixelAudioVisualizer } from "./PixelAudioVisualizer";
import {
  extractColorsFromImage,
  getHarmoniousPaletteFromSeed,
  type AudioColorPalette,
} from "@/lib/color-extract";
import { YEARLY_SPOTIFY_PLAYLISTS, type SpotifyTrack } from "@/lib/spotify";
import { useDragToScroll } from "@/hooks/use-drag-to-scroll";
import { play } from "@/lib/sound";

const DEFAULT_COLORS: AudioColorPalette = {
  primary: "#18181b",
  secondary: "#ff2a85",
  accent: "#ff9e54",
  highlight: "#fff5cc",
};

export function AboutMusicSection() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [trackColorsMap, setTrackColorsMap] = useState<Record<string, AudioColorPalette>>({});

  const { containerRef, handleLinkClick, canScrollLeft, canScrollRight } = useDragToScroll();

  const availableYears = Array.from(
    new Set([...Object.keys(YEARLY_SPOTIFY_PLAYLISTS), "All"])
  );

  const hoveredTrack = tracks.find((t) => t.id === hoveredId);
  const currentColors =
    (hoveredTrack && trackColorsMap[hoveredTrack.id]) ||
    (hoveredTrack ? getHarmoniousPaletteFromSeed(hoveredTrack.id || hoveredTrack.title) : DEFAULT_COLORS);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    async function loadSpotifyTracks() {
      try {
        const queryParam =
          selectedYear === "All"
            ? `year=2026`
            : `year=${encodeURIComponent(selectedYear)}`;
        const res = await fetch(`/api/spotify?${queryParam}`);
        if (res.ok && !isCancelled) {
          const data: SpotifyTrack[] = await res.json();
          if (Array.isArray(data)) {
            setTracks(data);

            // Extract unique colors for each track's cover art
            data.forEach((track) => {
              if (track.coverImage) {
                extractColorsFromImage(
                  track.coverImage,
                  track.id || track.title,
                  (colors) => {
                    if (!isCancelled) {
                      setTrackColorsMap((prev) => ({ ...prev, [track.id]: colors }));
                    }
                  }
                );
              } else {
                setTrackColorsMap((prev) => ({
                  ...prev,
                  [track.id]: getHarmoniousPaletteFromSeed(track.id || track.title),
                }));
              }
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load Spotify tracks:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
          play("ready", { volume: 0.25 });
        }
      }
    }

    loadSpotifyTracks();

    return () => {
      isCancelled = true;
    };
  }, [selectedYear]);

  const isTwoRows = tracks.length > 6;

  return (
    <section className="relative w-full py-4 flex flex-col gap-6">
      {/* Header with dynamic Year dropdown */}
      <AboutSectionHeader
        title={
          <span className="inline-flex items-baseline gap-[0.25em] flex-wrap">
            <span>sounds that keep me</span>
            <TextFlip className="font-hand font-bold text-[36px]">
              <span>focused.</span>
              <span>calm.</span>
              <span>fueled.</span>
              <span>energized.</span>
            </TextFlip>
          </span>
        }
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        years={availableYears}
      />

      {/* Drag-to-Scroll Album Covers Carousel Container with Blurred Edge Gradients */}
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
          className="relative w-full overflow-x-auto no-scrollbar pt-6 pb-2 cursor-grab active:cursor-grabbing select-none"
        >
          {isLoading ? (
            <div className="grid grid-rows-2 grid-flow-col gap-x-4 sm:gap-x-6 gap-y-10 auto-cols-max py-4 pl-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="w-[142px] sm:w-[152px] h-[180px] sm:h-[190px] rounded-[16px] bg-zinc-200/50 animate-pulse"
                />
              ))}
            </div>
          ) : tracks.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Music2 className="size-6 text-zinc-300" />
              <p className="text-sm font-display text-center text-pretty max-w-[320px]">
                No tracks found for {selectedYear}. Select another year to browse tunes.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className={`grid ${isTwoRows ? "grid-rows-2" : "grid-rows-1"
                } grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max pb-3 pl-3 pt-6`}
            >
              <AnimatePresence mode="popLayout">
                {tracks.map((album, index) => {
                  const isHovered = hoveredId === album.id;
                  const cardColors =
                    trackColorsMap[album.id] ||
                    getHarmoniousPaletteFromSeed(album.id || album.title);

                  return (
                    <motion.div
                      key={album.id || `track-${index}`}
                      data-magnetic-card
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(index * 0.04, 0.24),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      onMouseEnter={() => setHoveredId(album.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setHoveredId(album.id)}
                      onBlur={() => setHoveredId(null)}
                      className="flex flex-col items-center w-[142px] sm:w-[152px]"
                    >
                      {/* Card + Rising Vinyl Disc Container */}
                      <div className="relative w-[142px] sm:w-[152px] h-[180px] sm:h-[190px] flex items-end justify-center">
                        {/* Realistic Rotating Vinyl Record - Slides upward on hover */}
                        <motion.div
                          initial={{ y: 0, opacity: 0 }}
                          animate={{
                            y: isHovered ? -30 : 0,
                            opacity: isHovered ? 1 : 0,
                            scale: isHovered ? 0.95 : 0.85,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 24,
                            mass: 0.8,
                          }}
                          className="absolute top-2 size-[134px] sm:size-[144px] rounded-full z-0 flex items-center justify-center pointer-events-none shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                          style={{
                            background:
                              "radial-gradient(circle, #27272a 0%, #18181b 30%, #09090b 70%, #000000 100%)",
                            boxShadow: isHovered
                              ? `0 0 0 1px rgba(255,255,255,0.1), 0 0 20px ${cardColors.primary}33, inset 0 0 0 10px #0c0c0e, inset 0 0 0 16px #18181b, inset 0 0 0 24px #09090b, inset 0 0 0 34px #18181b`
                              : "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 10px #0c0c0e, inset 0 0 0 16px #18181b, inset 0 0 0 24px #09090b, inset 0 0 0 34px #18181b",
                          }}
                        >
                          {/* Spinning Disc Group with rotational deceleration */}
                          <motion.div
                            animate={{ rotate: isHovered ? 360 : 0 }}
                            transition={{
                              repeat: isHovered ? Infinity : 0,
                              duration: 3.2,
                              ease: isHovered ? "linear" : "easeOut",
                            }}
                            className="relative size-full flex items-center justify-center"
                          >
                            {/* Conic grooved light shimmer */}
                            <div
                              className="absolute inset-0 rounded-full opacity-35 pointer-events-none"
                              style={{
                                background:
                                  "conic-gradient(from 45deg, transparent 0deg, rgba(255,255,255,0.2) 60deg, transparent 120deg, rgba(255,255,255,0.2) 240deg, transparent 300deg)",
                              }}
                            />

                            {/* Center Record Label Styled with Card's Unique Colors */}
                            <div
                              className="relative size-12 sm:size-14 rounded-full border-2 border-black/80 flex items-center justify-center shadow-inner overflow-hidden"
                              style={{
                                background: `radial-gradient(circle at 35% 35%, ${cardColors.highlight} 0%, ${cardColors.primary} 50%, ${cardColors.secondary} 100%)`,
                                boxShadow: `0 0 12px ${cardColors.primary}66, inset 0 0 4px rgba(0,0,0,0.6)`,
                              }}
                            >
                              <Disc className="size-4 text-black/70 opacity-80 drop-shadow-xs" />
                              {/* Center Spindle Hole */}
                              <div className="absolute size-2.5 rounded-full bg-black border border-white/30" />
                            </div>
                          </motion.div>
                        </motion.div>

                        {/* Main Album Jacket Card */}
                        <motion.a
                          href={album.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          data-cuelume-hover="bloom"
                          data-cuelume-press
                          data-cuelume-release
                          whileHover={{
                            y: -5,
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 350, damping: 22 },
                          }}
                          whileTap={{ scale: 0.96 }}
                          className="group relative size-[142px] sm:size-[152px] rounded-[16px] bg-white border border-willow-grey/60 flex flex-col items-center justify-center overflow-hidden shadow-[0px_2px_8px_rgba(0,0,0,0.25)] block z-10 cursor-pointer"
                        >
                          {/* Album Cover Art from Spotify */}
                          {album.coverImage ? (
                            <div className="relative size-full">
                              <Image
                                src={album.coverImage}
                                alt={album.title}
                                fill
                                unoptimized
                                draggable={false}
                                className="object-cover size-full group-hover:scale-105 saturate-50 group-hover:saturate-100 transition-[transform,filter] duration-300 ease-out pointer-events-none select-none"
                                sizes="(max-width: 768px) 142px, 152px"
                              />
                            </div>
                          ) : (
                            <div className="size-full bg-gradient-to-br from-zinc-900 to-black flex items-center justify-center p-3 text-center">
                              <span className="font-serif font-bold text-[17px] text-white">
                                {album.title}
                              </span>
                            </div>
                          )}

                          {/* Subtle paper finish overlay */}
                          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/10 pointer-events-none" />

                        </motion.a>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Center Pixel Matrix Audio Visualizer & Caption */}
      <div className="min-h-[72px] flex flex-col items-center justify-center w-full text-center px-4 relative">
        <div className="relative flex items-center justify-center transition-opacity duration-200">
          <PixelAudioVisualizer
            color="#27272a"
            secondaryColor={currentColors.primary}
            columns={44}
            maxBlocks={10}
            blockSize={4}
            gap={2}
            speed={0.065}
            triggerKey={hoveredTrack?.id || "idle"}
            active={!!hoveredTrack}
          />
        </div>

        {/* Dynamic Caption Text with Crossfade */}
        <div className="h-6 flex items-center justify-center mt-1.5">
          <AnimatePresence mode="wait">
            {hoveredTrack && (
              <motion.p
                key={hoveredTrack.id}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-normal text-[13px] sm:text-[14px] text-[#7f7f80] tracking-[0.08px]"
              >
                <span className="text-zinc-900 font-medium">{hoveredTrack.title}</span>
                {hoveredTrack.artist && ` — ${hoveredTrack.artist}`}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
