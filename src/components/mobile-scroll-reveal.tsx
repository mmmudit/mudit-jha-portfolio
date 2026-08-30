"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect, type ReactNode } from "react";

interface MobileScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function MobileScrollReveal({
  children,
  className = "",
  delay = 0,
  threshold = 0.12,
}: MobileScrollRevealProps) {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  if (reduce || !isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        transform: "translateY(16px) scale(0.985)",
        filter: "blur(2.5px)",
      }}
      whileInView={{
        opacity: 1,
        transform: "translateY(0px) scale(1)",
        filter: "blur(0px)",
      }}
      viewport={{
        once: true,
        amount: threshold,
        margin: "0px 0px -36px 0px",
      }}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.22, 1, 0.36, 1], // transitions-dev standard smooth deceleration
      }}
      className={`will-change-[transform,opacity,filter] ${className}`}
    >
      {children}
    </motion.div>
  );
}
