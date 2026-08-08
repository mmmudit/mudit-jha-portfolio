"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Intro() {
  const [isSaiyan, setIsSaiyan] = useState(false);

  useEffect(() => {
    const handleBreakout = (e: Event) => {
      const customEvent = e as CustomEvent;
      // Only change text to "saiyan" when hold breakout is active
      setIsSaiyan(customEvent.detail?.active && customEvent.detail?.breakout);
    };

    window.addEventListener("super-saiyan-breakout", handleBreakout);
    return () => window.removeEventListener("super-saiyan-breakout", handleBreakout);
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800">
        mudit jha
      </h1>

      <p className="shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500 max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary">
        Design engineer & creative generalist. Building thoughtful things at the
        intersection of tech and{" "}
        <span className="inline-flex overflow-hidden align-baseline relative px-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={isSaiyan ? "saiyan" : "human"}
              initial={{ y: 22, opacity: 0, filter: "blur(6px)", rotateX: 90 }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)", rotateX: 0 }}
              exit={{ y: -22, opacity: 0, filter: "blur(6px)", rotateX: -90 }}
              transition={{ type: "spring", stiffness: 420, damping: 24 }}
              className={
                isSaiyan
                  ? "font-hand text-[22px] font-bold text-amber-600 tracking-wide drop-shadow-[0_0_10px_rgba(245,158,11,0.7)] inline-block"
                  : "font-hand text-[20px] font-bold leading-6 text-button-secondary inline-block"
              }
            >
              {isSaiyan ? "saiyan" : "human"}
            </motion.span>
          </AnimatePresence>
        </span>{" "}
        behavior.
      </p>
    </section>
  );
}
