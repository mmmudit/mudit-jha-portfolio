"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        initial={{
          opacity: 0,
          y: reduce ? 0 : 8,
          filter: reduce ? "blur(0px)" : "blur(3px)",
        }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{
          opacity: 0,
          y: reduce ? 0 : -8,
          filter: reduce ? "blur(0px)" : "blur(3px)",
        }}
        transition={{
          duration: reduce ? 0.12 : 0.25,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full transform-gpu"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
