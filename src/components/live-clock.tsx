"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { play } from "@/lib/sound";
import { useZeroGravity } from "@/context/zero-gravity-context";

import { VoxelGlobeHero } from "./hero/VoxelGlobeHero";

function TickingCharacter({ char, index }: { char: string; index: number }) {
  // Only animate numeric digits
  if (!/\d/.test(char)) {
    return <span className="inline-block whitespace-pre">{char}</span>;
  }

  return (
    <span className="relative inline-flex overflow-hidden h-[1.25em] w-[0.62em] items-center justify-center align-middle">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${index}-${char}`}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center font-mono tabular-nums"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function DayNightIcon({ isDay, size = 13 }: { isDay: boolean; size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center shrink-0 select-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDay ? (
          <motion.span
            key="sun"
            initial={{ scale: 0.6, rotate: -60, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: 60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center text-[#7a926d]"
            title="Daytime (Minneapolis)"
          >
            <Sun size={size} fill="currentColor" className="fill-[#7a926d] text-[#7a926d] stroke-[1.8]" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ scale: 0.6, rotate: 60, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: -60, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center text-[#7a926d]"
            title="Nighttime (Minneapolis)"
          >
            <Moon size={size} fill="currentColor" className="fill-[#7a926d] text-[#7a926d] stroke-[1.5]" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

interface LiveClockProps {
  variant?: "header" | "footer";
}

export function LiveClock({ variant = "footer" }: LiveClockProps) {
  const [time, setTime] = useState<string>("");
  const [isDay, setIsDay] = useState<boolean>(true);
  const { isZeroGravity, isRestoring, tapCount, registerGlobeTap } = useZeroGravity();
  const reduce = useReducedMotion();

  const isZeroG = isZeroGravity && !isRestoring;

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    });

    const hourFormatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: "America/Chicago",
    });

    const update = () => {
      const now = new Date();
      setTime(formatter.format(now));
      const hour = parseInt(hourFormatter.format(now), 10);
      setIsDay(hour >= 6 && hour < 18);
    };
    update();

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const timeChars = time ? time.split("") : [];

  if (variant === "header") {
    return (
      <time
        dateTime={time}
        aria-label={`Current time in Minneapolis: ${time || "Loading"}`}
        data-cuelume-hover="pulse"
        className="group relative flex flex-col items-start md:items-center gap-2.5 md:gap-3 shrink-0 self-start md:self-auto py-1 md:py-3 px-0 md:px-6 select-none"
      >
        {/* Soft Radial Ambient Halo (Expands into celestial corona in zero-g) */}
        <motion.div
          animate={
            isZeroG
              ? { scale: 1.8, opacity: 0.95 }
              : { scale: 1, opacity: 0.8 }
          }
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none transition-opacity duration-300"
          style={{
            background: isZeroG
              ? "radial-gradient(circle, rgba(140, 180, 255, 0.75) 0%, rgba(100, 140, 240, 0.25) 45%, rgba(0, 0, 0, 0) 75%)"
              : "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* Free-Floating 3D Voxel Globe with Clouds and Parallax */}
        <motion.div
          onClick={(e) => {
            e.stopPropagation();
            registerGlobeTap();
          }}
          animate={
            isZeroG
              ? {
                  scale: reduce ? 1.25 : 1.75,
                  y: -24,
                  x: 0,
                }
              : tapCount === 4
              ? { x: [-4, 4, -4, 4, -2, 2, 0], scale: 1.05 }
              : tapCount === 3
              ? { x: [-2, 2, -2, 2, 0], scale: 1.02 }
              : { scale: 1, y: 0, x: 0 }
          }
          transition={
            isZeroG
              ? { duration: reduce ? 0.3 : 0.8, ease: [0.23, 1, 0.32, 1] }
              : tapCount >= 3
              ? { duration: 0.35, ease: "easeInOut" }
              : { duration: 0.5, ease: [0.23, 1, 0.32, 1] }
          }
          className="scale-[0.85] origin-center md:scale-100 md:origin-center will-change-transform z-20 cursor-pointer"
        >
          <VoxelGlobeHero
            size={300}
            onTap={registerGlobeTap}
            isZeroG={isZeroG}
            className="group-hover:scale-[1.025] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
          />
        </motion.div>

        {/* Telemetry Stack (No pills, no borders) */}
        <motion.div
          animate={isZeroG ? { y: 16 } : { y: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col items-start md:items-center gap-0.5 pt-0.5 md:pt-1 text-left md:text-center"
        >
          <div className="flex items-center gap-1.5 font-mono text-[12px] sm:text-[13px] font-medium text-zinc-800 tracking-tight tabular-nums">
            <DayNightIcon isDay={isDay} size={13} />
            <span aria-hidden="true" className="inline-flex items-center">
              {timeChars.length > 0 ? (
                timeChars.map((char, i) => (
                  <TickingCharacter key={i} char={char} index={i} />
                ))
              ) : (
                <span>--:--:-- --</span>
              )}
            </span>
            <span className="text-zinc-300 font-sans mx-0.5">•</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#7f7f80]">
              {isZeroG ? "ORBITAL ZERO-G" : "GMT −05:00"}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#7f7f80]/80">
            {isZeroG ? "COSMIC DRIFT • LOCAL TIME" : "Minneapolis, MN, USA"}
          </span>
        </motion.div>
      </time>
    );
  }

  return (
    <time
      dateTime={time}
      aria-label={`Mudit Standard Time: ${time || "Loading"}`}
      className="font-mono text-xs sm:text-[13px] uppercase tracking-wide leading-none text-[#7f7f80] inline-flex items-center gap-2 select-none"
    >
      <span aria-hidden="true" className="text-[#7f7f80]">Mudit Standard Time:</span>
      <span className="inline-flex items-center gap-1.5 tabular-nums">
        <DayNightIcon isDay={isDay} size={13} />
        <span aria-hidden="true" className="inline-flex items-center">
          {timeChars.length > 0 ? (
            timeChars.map((char, i) => (
              <TickingCharacter key={i} char={char} index={i} />
            ))
          ) : (
            <span>--:--:-- --</span>
          )}
        </span>
      </span>
    </time>
  );
}
