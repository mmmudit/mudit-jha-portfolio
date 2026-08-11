"use client";

import { useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";
import { LiveClock } from "./live-clock";

const ease = [0.22, 1, 0.36, 1] as const;

export function Intro() {
  const reduce = useReducedMotion();

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.1 : 0.25,
      delay: reduce ? 0 : delay,
      ease,
    },
  });

  return (
    <section className="flex flex-col gap-4 mt-50">
      <motion.div {...fadeUp(0)}>
        <LiveClock />
      </motion.div>

      <motion.h1
        {...fadeUp(0.05)}
        className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800 text-balance"
      >
        mudit jha
      </motion.h1>

      <motion.p
        {...fadeUp(0.1)}
        className="shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500 max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary text-pretty"
      >
        Design engineer &amp; creative generalist. Building thoughtful things at the
        intersection of tech and{" "}
        <span className="font-hand text-[20px] leading-6 text-button-secondary">
          human
        </span>{" "}
        behavior.
      </motion.p>
    </section>
  );
}
