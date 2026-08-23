"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { play } from "@/lib/sound";

export default function NotFound() {
  useEffect(() => {
    // Play error sound when hitting a missing route
    play("error", { volume: 0.45 });
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center max-w-md"
      >
        <span className="px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide uppercase bg-zinc-200/70 text-zinc-700 mb-4">
          404 Error
        </span>
        <h1 className="font-hand text-5xl sm:text-6xl font-medium tracking-[-2px] text-zinc-900 mb-3">
          Page not found
        </h1>
        <p className="font-display text-base sm:text-lg text-zinc-600 mb-6">
          The page you are looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="pressable inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 text-white font-sans text-sm font-medium hover:bg-zinc-800 shadow-sm transition-all"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}
