"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutHero() {
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
    <section className="flex flex-col gap-6 pt-4">
      <motion.h1
        {...fadeUp(0)}
        className="font-display text-[36px] font-semibold tracking-[-3px] text-zinc-800 text-balance"
      >
        about
      </motion.h1>

      <motion.p
        {...fadeUp(0.05)}
        className="max-w-[688px] font-display text-[18px] font-medium leading-6 tracking-[-0.1px] text-button-secondary text-pretty"
      >
        Design engineer &amp; creative generalist. Building thoughtful things at the
        intersection of tech and human behavior.
      </motion.p>

      <motion.p
        {...fadeUp(0.1)}
        className="max-w-[688px] font-sans text-base leading-relaxed text-zinc-600 text-pretty"
      >
        I craft digital software with an obsessive focus on tactile materials, spatial flow, and fluid motion physics.
        Currently exploring spatial computing, interactive Web Audio shaders, and high-craft design systems.
      </motion.p>

      <motion.div {...fadeUp(0.13)} className="pt-2">
        <Link
          href="/"
          className="pressable inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800 [@media(hover:hover)]:hover:text-zinc-600"
        >
          ← Back to work
        </Link>
      </motion.div>
    </section>
  );
}
