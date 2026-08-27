"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { play } from "@/lib/sound";

import { PulsingGlobe } from "./pulsing-globe";

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

interface LiveClockProps {
  variant?: "header" | "footer";
}

export function LiveClock({ variant = "footer" }: LiveClockProps) {
  const [time, setTime] = useState<string>("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "America/Chicago",
    });

    const update = () => setTime(formatter.format(new Date()));
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
        onClick={() => play("pulse", { volume: 0.35 })}
        className="group relative flex flex-col items-start md:items-center gap-2.5 md:gap-3 shrink-0 self-start md:self-auto py-1 md:py-3 px-0 md:px-6 select-none cursor-pointer"
      >
        {/* Soft Radial Ambient Halo */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
          aria-hidden="true"
        />

        {/* Free-Floating 3D Globe */}
        <div className="scale-[0.8] origin-left md:scale-100 md:origin-center transition-transform duration-300">
          <PulsingGlobe size={120} className="group-hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Telemetry Stack (No pills, no borders) */}
        <div className="flex flex-col items-start md:items-center gap-0.5 pt-0.5 md:pt-1 text-left md:text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight tabular-nums">
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
            <span className="font-sans font-normal text-[#7f7f80] text-[12px] uppercase">GMT −05:00</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Minneapolis, MN
          </span>
        </div>
      </time>
    );
  }

  return (
    <time
      dateTime={time}
      aria-label={`Mudit Standard Time: ${time || "Loading"}`}
      className="font-sans font-light text-[13px] sm:text-[15px] md:text-[16px] uppercase tracking-[-0.5px] leading-none text-[#7f7f80] inline-flex items-center gap-2 select-none"
    >
      <span aria-hidden="true" className="text-[#7f7f80] font-sans">Mudit Standard Time:</span>
      <span aria-hidden="true" className="inline-flex items-center tabular-nums">
        {timeChars.length > 0 ? (
          timeChars.map((char, i) => (
            <TickingCharacter key={i} char={char} index={i} />
          ))
        ) : (
          <span>--:--:-- --</span>
        )}
      </span>
    </time>
  );
}
