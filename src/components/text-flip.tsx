"use client";

import { Children, useEffect, useState, useRef } from "react";
import type { Transition, Variants } from "framer-motion";
import { AnimatePresence, motion } from "framer-motion";

const defaultVariants: Variants = {
  initial: { y: "-20%", opacity: 0, filter: "blur(1px)" },
  animate: {
    y: "0%",
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    y: "40%",
    opacity: 0,
    filter: "blur(1px)",
    transition: { ease: "easeOut" },
  },
};

type MotionElement = typeof motion.p | typeof motion.span | typeof motion.code;

export type TextFlipProps = {
  /**
   * Motion element to render.
   * @defaultValue motion.span
   * */
  as?: MotionElement;
  className?: string;
  /** Array of children to cycle through. */
  children: React.ReactNode[];

  /**
   * Time in seconds between each flip.
   * @defaultValue 2.5
   * */
  interval?: number;
  /**
   * Motion transition configuration.
   * @defaultValue { duration: 0.3 }
   * */
  transition?: Transition;
  /** Motion variants for enter/exit animations. */
  variants?: Variants;

  /** Controls whether the flip animation runs. */
  play?: boolean;

  /** Automatically pause flipping when cursor is far from the element. */
  pauseWhenFar?: boolean;

  /** Distance in pixels to consider cursor 'near' enough to play. @defaultValue 280 */
  proximityDistance?: number;

  /** Called with the new index after each flip. */
  onIndexChange?: (index: number) => void;
};

export function TextFlip({
  as: Component = motion.span,
  className,
  children,

  interval = 2.5,
  transition = { duration: 0.3 },
  variants = defaultVariants,
  play = true,
  pauseWhenFar = true,
  proximityDistance = 500,

  onIndexChange,
}: TextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNear, setIsNear] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  const items = Children.toArray(children);

  // Proximity tracking: pause when user cursor is far from section heading
  useEffect(() => {
    if (!pauseWhenFar) {
      setIsNear(true);
      return;
    }

    let rafId: number;
    const handlePointerMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.sqrt(dx * dx + dy * dy);
        setIsNear(dist <= proximityDistance);
      });
    };

    const handleMouseLeave = () => {
      setIsNear(false);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [pauseWhenFar, proximityDistance]);

  const shouldPlay = play && (!pauseWhenFar || isNear);

  useEffect(() => {
    if (!shouldPlay || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [shouldPlay, interval, items.length, onIndexChange]);

  return (
    <span
      ref={containerRef}
      className={`inline-grid grid-cols-1 grid-rows-1 items-baseline relative overflow-hidden align-baseline ${className || ""}`}
    >
      {/* Invisible items stack to lock width to the widest word */}
      {items.map((item, idx) => (
        <span
          key={`ghost-${idx}`}
          className="col-start-1 row-start-1 invisible select-none pointer-events-none whitespace-nowrap opacity-0"
          aria-hidden="true"
        >
          {item}
        </span>
      ))}

      {/* Active animated flipping text in the same grid cell */}
      <span className="col-start-1 row-start-1 flex items-baseline">
        <AnimatePresence mode="wait" initial={false}>
          <Component
            key={currentIndex}
            className="inline-block whitespace-nowrap text-inherit"
            initial="initial"
            animate="animate"
            exit="exit"
            transition={transition}
            variants={variants}
          >
            {items[currentIndex]}
          </Component>
        </AnimatePresence>
      </span>
    </span>
  );
}
