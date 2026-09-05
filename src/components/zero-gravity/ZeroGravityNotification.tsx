"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useZeroGravity } from "@/context/zero-gravity-context";

export function ZeroGravityNotification() {
  const { isZeroGravity, isRestoring, restoreGravity } = useZeroGravity();
  const reduce = useReducedMotion();

  const isVisible = isZeroGravity && !isRestoring;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          role="status"
          aria-live="polite"
          initial={{
            y: reduce ? 0 : 48,
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            y: reduce ? 0 : 36,
            opacity: 0,
            scale: 0.96,
          }}
          transition={{
            duration: reduce ? 0.2 : 0.45,
            ease: [0.23, 1, 0.32, 1],
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[92vw] sm:max-w-md w-full px-3 pointer-events-auto"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-zinc-950/85 text-white border border-white/15 backdrop-blur-2xl shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
            {/* Status indicator & message */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>

              <div className="flex flex-col min-w-0">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-amber-300">
                  Zero-G Override Active
                </span>
                <span className="text-[13px] font-normal text-zinc-300 tracking-tight truncate">
                  Local gravity collapsed. Elements in orbit.
                </span>
              </div>
            </div>

            {/* Revert Button */}
            <button
              type="button"
              onClick={restoreGravity}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-zinc-950 font-medium text-[13px] tracking-tight hover:bg-zinc-100 active:scale-[0.96] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] shrink-0 w-full sm:w-auto shadow-sm cursor-pointer select-none"
            >
              <RotateCcw size={14} className="stroke-[2.2]" />
              <span>Restore Gravity</span>
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
