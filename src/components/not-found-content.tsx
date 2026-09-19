"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { play } from "@/lib/sound";

export function NotFoundContent() {
  useEffect(() => {
    play("error", { volume: 0.45 });
  }, []);

  return (
    <main id="main-content" className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center" tabIndex={-1}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-w-md flex-col items-center"
      >
        <span className="mb-4 rounded-full border border-zinc-300/80 bg-dough px-3 py-1 font-mono text-xs font-medium uppercase tracking-[0.08em] text-rust-grey">
          Error 404
        </span>
        <h1 className="mb-3 text-balance font-hand text-5xl font-medium tracking-[-2px] text-zinc-800 sm:text-6xl">
          Page not found
        </h1>
        <p className="mb-6 max-w-[42ch] text-pretty font-display text-base text-button-secondary sm:text-lg">
          That page may have moved, or the link may be out of date. Head back to the work index to keep exploring.
        </p>
        <Link
          href="/"
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="pressable inline-flex min-h-11 items-center gap-2 rounded-full bg-button-primary px-5 py-2.5 font-sans text-sm font-medium text-dough shadow-sm transition-[transform,background-color] [@media(hover:hover)]:hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-800"
        >
          View selected work
        </Link>
      </motion.div>
    </main>
  );
}
