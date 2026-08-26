"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { play } from "@/lib/sound";

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
        className="font-sans font-light text-[13px] sm:text-[15px] md:text-[16px] uppercase tracking-[-0.5px] leading-none text-[#7f7f80] inline-flex items-center gap-2 select-none cursor-pointer group"
      >
        <span className="relative inline-flex size-2.5 items-center justify-center shrink-0">
          <span className="green-pulse-ring" aria-hidden="true" />
          <span className="relative size-1.5 rounded-full bg-status-green group-hover:scale-125 transition-transform" />
        </span>
        <span aria-hidden="true" className="inline-flex items-center tabular-nums">
          {timeChars.length > 0 ? (
            timeChars.map((char, i) => (
              <TickingCharacter key={i} char={char} index={i} />
            ))
          ) : (
            <span>--:--:-- --</span>
          )}
        </span>
        <span aria-hidden="true" className="text-[#7f7f80]/60 font-sans mx-0.5">•</span>
        <span aria-hidden="true" className="text-[#7f7f80] font-sans">Minneapolis • GMT -05:00</span>
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
