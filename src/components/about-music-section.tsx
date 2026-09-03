"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Disc, Music2 } from "lucide-react";
import { AboutSectionHeader } from "./about-section-header";
import Typewriter from "@/components/fancy/text/typewriter";
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
  const reduce = useReducedMotion();
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [centerActiveId, setCenterActiveId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [trackColorsMap, setTrackColorsMap] = useState<Record<string, AudioColorPalette>>({});

  const { containerRef, handleLinkClick, canScrollLeft, canScrollRight } = useDragToScroll();

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const availableYears = Array.from(
    new Set([...Object.keys(YEARLY_SPOTIFY_PLAYLISTS), "All"])
  );

  // Active track is determined by center item on mobile, and hover on desktop
  const activeId = isMobile ? (centerActiveId || (tracks[0]?.id ?? null)) : hoveredId;
  const activeTrack = tracks.find((t) => t.id === activeId);
  const currentColors =
    (activeTrack && trackColorsMap[activeTrack.id]) ||
    (activeTrack ? getHarmoniousPaletteFromSeed(activeTrack.id || activeTrack.title) : DEFAULT_COLORS);

  // Track centered card on mobile scroll
  useEffect(() => {
    if (!isMobile) return;
    const el = containerRef.current;
    if (!el) return;

    const updateCenterCard = () => {
      const containerRect = el.getBoundingClientRect();
      const containerCenterX = containerRect.left + containerRect.width / 2;

      const cardElements = el.querySelectorAll<HTMLElement>("[data-music-card]");
      let closestId: string | null = null;
      let minDistance = Infinity;

      cardElements.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(containerCenterX - cardCenterX);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = card.getAttribute("data-music-card");
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
  }, [isMobile, tracks, centerActiveId]);

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
        sectionId="music"
        title={
          <span className="inline-flex items-baseline gap-[0.2em] whitespace-nowrap text-zinc-800">
            <span>sounds that keep me</span>
            <Typewriter
              text={["focused.", "calm.", "fueled.", "energized."]}
              className="font-hand font-bold text-[22px] xs:text-[25px] sm:text-[36px] text-rust-grey"
              speed={65}
              deleteSpeed={35}
              waitTime={2200}
              cursorClassName="text-[#8a7c64] font-light ml-0.5"
            />
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
          className="relative w-full overflow-x-auto no-scrollbar pt-6 pb-2 cursor-grab active:cursor-grabbing select-none snap-x snap-mandatory sm:snap-none"
        >
          {isLoading ? (
            <div className="grid grid-rows-1 sm:grid-rows-2 grid-flow-col gap-x-4 sm:gap-x-6 gap-y-10 auto-cols-max py-4 px-[calc(50vw-71px)] sm:px-0 sm:ps-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="w-[142px] sm:w-[152px] h-[180px] sm:h-[190px] rounded-[16px] t-skeleton border border-zinc-300/40"
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
              className={`grid grid-rows-1 ${isTwoRows ? "sm:grid-rows-2" : "sm:grid-rows-1"
                } grid-flow-col gap-x-4 sm:gap-x-6 gap-y-6 auto-cols-max pb-3 px-[calc(50vw-71px)] sm:px-0 sm:ps-3 pt-6 t-skeleton-reveal`}
            >
              <AnimatePresence mode="popLayout">
                {tracks.map((album, index) => {
                  const isCardActive = isMobile ? activeId === album.id : hoveredId === album.id;
                  const cardColors =
                    trackColorsMap[album.id] ||
                    getHarmoniousPaletteFromSeed(album.id || album.title);

                  return (
                    <motion.div
                      key={album.id || `track-${index}`}
                      data-magnetic-card
                      data-music-card={album.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{
                        opacity: isMobile ? (isCardActive ? 1 : 0.4) : 1,
                        filter: isMobile ? (isCardActive ? "blur(0px)" : "blur(1.5px)") : "blur(0px)",
                        scale: isMobile ? (isCardActive ? 1.02 : 0.94) : 1,
                        y: 0,
                      }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        filter: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        layout: { duration: 0.25 },
                      }}
                      onMouseEnter={() => !isMobile && setHoveredId(album.id)}
                      onMouseLeave={() => !isMobile && setHoveredId(null)}
                      onFocus={() => setHoveredId(album.id)}
                      onBlur={() => setHoveredId(null)}
                      className="flex flex-col items-center w-[142px] sm:w-[152px] snap-center"
                    >
                      {/* Card + Rising Vinyl Disc Container */}
                      <div className="relative w-[142px] sm:w-[152px] h-[180px] sm:h-[190px] flex items-end justify-center">
                        {/* Realistic Rotating Vinyl Record - Slides upward on active/hover */}
                        <motion.div
                          initial={reduce ? { opacity: 0 } : { y: 0, opacity: 0, scale: 0.94 }}
                          animate={{
                            y: isCardActive && !reduce ? -30 : 0,
                            opacity: isCardActive ? 1 : 0,
                            scale: isCardActive ? 0.97 : 0.94,
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
                            boxShadow: isCardActive
                              ? `0 0 0 1px rgba(255,255,255,0.1), 0 0 20px ${cardColors.primary}33, inset 0 0 0 10px #0c0c0e, inset 0 0 0 16px #18181b, inset 0 0 0 24px #09090b, inset 0 0 0 34px #18181b`
                              : "0 0 0 1px rgba(255,255,255,0.08), inset 0 0 0 10px #0c0c0e, inset 0 0 0 16px #18181b, inset 0 0 0 24px #09090b, inset 0 0 0 34px #18181b",
                          }}
                        >
                          {/* Spinning Disc Group with continuous forward momentum */}
                          <div
                            className={`relative size-full flex items-center justify-center ${isCardActive && !reduce ? "animate-[spin_3.6s_linear_infinite]" : ""
                              }`}
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
                          </div>
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
                                className={`object-cover size-full transition-[transform,filter] duration-300 ease-out pointer-events-none select-none ${isCardActive ? "saturate-100 scale-100" : "saturate-40"
                                  }`}
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
            triggerKey={activeTrack?.id || "idle"}
            active={!!activeTrack}
          />
        </div>

        {/* Dynamic Caption Text with Crossfade */}
        <div className="h-6 flex items-center justify-center mt-1.5">
          <AnimatePresence mode="wait">
            {activeTrack && (
              <motion.p
                key={activeTrack.id}
                initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="font-mono text-xs sm:text-[13px] text-[#7f7f80] tracking-wide"
              >
                <span className="text-zinc-900 font-medium">{activeTrack.title}</span>
                {activeTrack.artist && <span className="text-zinc-500"> — {activeTrack.artist}</span>}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
