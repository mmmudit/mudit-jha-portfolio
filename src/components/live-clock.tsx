"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export function LiveClock() {
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

  return (
    <div className="font-mono text-[13px] sm:text-[14px] uppercase tracking-tight leading-none text-rust-grey inline-flex items-center gap-2 select-none">
      <span className="relative inline-flex size-2.5 items-center justify-center shrink-0">
        <span className="green-pulse-ring" aria-hidden="true" />
        <span className="relative size-1.5 rounded-full bg-status-green" />
      </span>
      <span className="inline-flex items-center tabular-nums">
        {timeChars.length > 0 ? (
          timeChars.map((char, i) => (
            <TickingCharacter key={i} char={char} index={i} />
          ))
        ) : (
          <span>--:--:-- --</span>
        )}
      </span>
      <span className="text-zinc-400 font-sans mx-0.5">•</span>
      <span className="text-zinc-600 font-mono">Minneapolis, MN</span>
    </div>
  );
}
