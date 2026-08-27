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
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10 mt-14 sm:mt-24 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[650px] order-2 md:order-1">
        <motion.h1
          {...fadeUp(0)}
          className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 text-balance"
        >
          mudit jha
        </motion.h1>

        <motion.p
          {...fadeUp(0.04)}
          className="shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500 font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-button-secondary text-pretty"
        >
          Design engineer &amp; creative generalist. Building thoughtful things at the
          intersection of tech and{" "}
          <span className="font-hand italic font-bold text-[30px] leading-none text-willow-grey">
            human
          </span>{" "}
          behavior.
        </motion.p>
      </div>

      {/* Pure Aura Hero Celestial Anchor */}
      <motion.div {...fadeUp(0.06)} className="self-start md:self-auto order-1 md:order-2">
        <LiveClock variant="header" />
      </motion.div>
    </section>
  );
}
