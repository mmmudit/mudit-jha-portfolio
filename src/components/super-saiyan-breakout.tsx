"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Zap, RotateCcw, Flame } from "lucide-react";

export function SuperSaiyanBreakout() {
  const [isBreakout, setIsBreakout] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleBreakout = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.breakout === true) {
        setIsBreakout(true);
      } else if (customEvent.detail?.active === false) {
        setIsBreakout(false);
      }
    };

    window.addEventListener("super-saiyan-breakout", handleBreakout);
    return () => window.removeEventListener("super-saiyan-breakout", handleBreakout);
  }, []);

  useEffect(() => {
    if (isBreakout && !shouldReduceMotion) {
      document.body.classList.add("super-saiyan-active");
    } else {
      document.body.classList.remove("super-saiyan-active");
    }
  }, [isBreakout, shouldReduceMotion]);

  const handleReassemble = () => {
    setIsBreakout(false);
    window.dispatchEvent(
      new CustomEvent("super-saiyan-breakout", { detail: { active: false, breakout: false } })
    );
  };

  const ROCKS = [
    { size: 48, left: "8%", delay: 0 },
    { size: 32, left: "22%", delay: 0.7 },
    { size: 56, left: "38%", delay: 0.3 },
    { size: 40, left: "55%", delay: 1.1 },
    { size: 50, left: "72%", delay: 0.5 },
    { size: 34, left: "86%", delay: 0.9 },
    { size: 28, left: "16%", delay: 1.4 },
    { size: 42, left: "64%", delay: 1.6 },
  ];

  return (
    <AnimatePresence>
      {isBreakout && (
        <>
          {/* Energy Flash Explosion Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.2] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-gradient-to-br from-amber-400/40 via-yellow-300/30 to-amber-600/40 z-[99990] pointer-events-none mix-blend-color-dodge backdrop-blur-[2px]"
          />

          {/* Hardware-Accelerated Levitating Anime Rock Debris Layer */}
          <div className="fixed inset-0 pointer-events-none z-[99991] overflow-hidden">
            {ROCKS.map((rock, idx) => (
              <motion.div
                key={idx}
                initial={{
                  transform: "translate3d(0, 115vh, 0) rotate(0deg)",
                  opacity: 0,
                }}
                animate={{
                  transform: shouldReduceMotion
                    ? "translate3d(0, 50vh, 0) rotate(0deg)"
                    : [
                        "translate3d(0, 115vh, 0) rotate(0deg)",
                        `translate3d(0, -25vh, 0) rotate(${idx % 2 === 0 ? 360 : -360}deg)`,
                      ],
                  opacity: shouldReduceMotion ? [0, 0.6, 0] : [0, 0.95, 0.95, 0],
                }}
                transition={{
                  duration: 4.5 + (idx % 3),
                  repeat: Infinity,
                  delay: rock.delay,
                  ease: "linear",
                }}
                style={{ left: rock.left, width: rock.size, height: rock.size }}
                className="absolute filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.18)]"
              >
                <svg viewBox="0 0 40 40" fill="none" className="size-full">
                  <polygon
                    points="8,4 32,2 38,18 28,38 6,32 2,14"
                    fill="#e5e0d4"
                    stroke="#1e1e22"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Rock inner pencil sketch lines */}
                  <path
                    d="M 8 4 L 20 22 L 6 32"
                    stroke="#1e1e22"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                  <path
                    d="M 32 2 L 20 22 L 28 38"
                    stroke="#1e1e22"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                </svg>
              </motion.div>
            ))}
          </div>

          {/* Hardware-Accelerated Floating Energy Sparks & Lightning Flares */}
          <div className="fixed inset-0 pointer-events-none z-[99992] overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
                  y: (typeof window !== "undefined" ? window.innerHeight : 1000) + 100,
                  opacity: 0,
                }}
                animate={{
                  transform: shouldReduceMotion
                    ? "scale(1) rotate(0deg)"
                    : [
                        "translate3d(0, 0, 0) scale(0.5) rotate(0deg)",
                        `translate3d(0, -100px, 0) scale(1.5) rotate(${Math.random() * 360}deg)`,
                      ],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 1.5,
                  ease: "easeOut",
                }}
                className="absolute size-6 text-amber-500 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]"
              >
                <Zap className="size-full fill-amber-400" />
              </motion.div>
            ))}
          </div>

          {/* Reassemble Layout Floating Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[99995] flex items-center gap-3 px-5 py-2.5 rounded-full border-2 border-amber-500 bg-[#fbfaf5]/95 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.6)]"
          >
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm tracking-wide">
              <Flame className="size-4 animate-bounce text-amber-500" />
              <span>POWER OVER 9000! (BREAKOUT MODE)</span>
            </div>

            <div className="w-px h-4 bg-amber-300" />

            <button
              onClick={handleReassemble}
              className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-zinc-900 bg-amber-400 hover:bg-amber-300 rounded-full transition-colors cursor-pointer shadow-sm"
            >
              <RotateCcw className="size-3.5" />
              <span>Reassemble Layout</span>
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
