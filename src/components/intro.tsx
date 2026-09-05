"use client";

import { useEffect, useState } from "react";
import { useReducedMotion, motion } from "framer-motion";
import { LiveClock } from "./live-clock";
import { AppleDockText } from "./apple-dock-text";
import { useZeroGravity } from "@/context/zero-gravity-context";

export function Intro() {
  const reduce = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const isZeroG = isZeroGravity && !isRestoring;

  useEffect(() => {
    // Small delay to ensure intro loader fade-out has commenced so drop is 100% visible
    const timer = setTimeout(() => setHasMounted(true), 120);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-10 mt-14 sm:mt-24 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[650px] order-2 md:order-1">
        {/* Title dropped down from top with zero-g unmooring */}
        <motion.div
          animate={
            isZeroG
              ? { y: reduce ? -6 : -14, x: reduce ? 0 : -8, rotate: reduce ? 0 : -1.5 }
              : { y: 0, x: 0, rotate: 0 }
          }
          transition={
            isZeroG
              ? { type: "spring", stiffness: 36, damping: 11, mass: 1.1, delay: 0.04 }
              : { duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: 0.12 }
          }
          className="overflow-visible py-3 -my-3 will-change-transform"
        >
          <motion.h1
            initial={{ y: reduce ? 0 : -42, opacity: 0, filter: reduce ? "none" : "blur(6px)" }}
            animate={
              hasMounted
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : { y: reduce ? 0 : -42, opacity: 0, filter: reduce ? "none" : "blur(6px)" }
            }
            transition={{
              duration: reduce ? 0.2 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-0.035em] text-zinc-900 dark:text-zinc-50 text-balance will-change-transform"
          >
            mudit jha
          </motion.h1>
        </motion.div>

        {/* Intro Paragraph: Two-tier color and typographic hierarchy with zero-g unmooring */}
        <motion.p
          animate={
            isZeroG
              ? { y: reduce ? -8 : -18, x: reduce ? 0 : 10, rotate: reduce ? 0 : 1.4 }
              : { y: 0, x: 0, rotate: 0 }
          }
          transition={
            isZeroG
              ? { type: "spring", stiffness: 36, damping: 11, mass: 1.1, delay: 0.1 }
              : { duration: 0.65, ease: [0.23, 1, 0.32, 1], delay: 0.08 }
          }
          className="font-display text-[23px] sm:text-[25px] font-normal leading-[1.4] tracking-[-0.015em] text-zinc-600 dark:text-zinc-300 text-pretty overflow-visible will-change-transform"
        >
          {/* First Sentence: Primary Focal Statement in rich charcoal with willow hover bloom */}
          <motion.span
            initial={{
              y: reduce ? 0 : -36,
              opacity: 0,
              filter: reduce ? "none" : "blur(4px)",
            }}
            animate={
              hasMounted
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : {
                  y: reduce ? 0 : -36,
                  opacity: 0,
                  filter: reduce ? "none" : "blur(4px)",
                }
            }
            transition={{
              duration: reduce ? 0.15 : 0.5,
              delay: reduce ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block font-semibold text-zinc-900 dark:text-zinc-100 will-change-transform overflow-visible mr-[0.22em]"
          >
            <AppleDockText
              text="Design engineer & creative generalist."
              radius={190}
              maxScale={0.28}
              maxLift={9}
              baseColor={isZeroG ? "#f4f4f5" : "#18181b"}
              willowColor={isZeroG ? "#c8d3bb" : "#37522d"}
            />
          </motion.span>
          {/* Second Sentence: Clean normal static text */}
          <motion.span
            initial={{
              y: reduce ? 0 : -32,
              opacity: 0,
              filter: reduce ? "none" : "blur(4px)",
            }}
            animate={
              hasMounted
                ? { y: 0, opacity: 1, filter: "blur(0px)" }
                : {
                  y: reduce ? 0 : -32,
                  opacity: 0,
                  filter: reduce ? "none" : "blur(4px)",
                }
            }
            transition={{
              duration: reduce ? 0.15 : 0.5,
              delay: reduce ? 0 : 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline text-zinc-600 dark:text-zinc-300 font-normal"
          >
            Building thoughtful things at the intersection of tech and human behavior.
          </motion.span>
        </motion.p>
      </div>

      {/* Pure Aura Hero Celestial Anchor */}
      <motion.div
        initial={{ y: reduce ? 0 : -32, opacity: 0 }}
        animate={hasMounted ? { y: 0, opacity: 1 } : { y: reduce ? 0 : -32, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="self-start md:self-auto order-1 md:order-2 will-change-transform"
      >
        <LiveClock variant="header" />
      </motion.div>
    </section>
  );
}
