"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { X } from "lucide-react";
import { play } from "@/lib/sound";

export interface FlipCardProps {
  /** The content displayed on the front face */
  frontContent: ReactNode;
  /** The content displayed on the back face */
  backContent: ReactNode;
  /** Controlled flip state */
  isFlipped?: boolean;
  /** Uncontrolled initial flip state */
  defaultFlipped?: boolean;
  /** Callback fired when flip state changes */
  onFlipChange?: (flipped: boolean) => void;
  /** 3D Perspective in pixels (default: 1200) */
  perspective?: number;
  /** Flip animation duration in seconds (default: 0.6) */
  duration?: number;
  /** Flip axis: horizontal (rotateY) or vertical (rotateX) (default: 'horizontal') */
  axis?: "horizontal" | "vertical";
  /** If true, entire card acts as a flip trigger button */
  triggerOnCardClick?: boolean;
  /** Whether to defer mounting/rendering back face rich content until >50% rotated */
  deferBackMount?: boolean;
  /** Whether outer card expands in size when flipped */
  expandOnFlip?: boolean;
  /** Initial width when unflipped */
  width?: number | string;
  /** Expanded width when flipped */
  expandedWidth?: number | string;
  /** Initial height when unflipped */
  height?: number | string;
  /** Expanded height when flipped */
  expandedHeight?: number | string;
  /** Dark backdrop overlay when flipped / expanded */
  withBackdrop?: boolean;
  /** Built-in close button on the back face */
  showCloseButton?: boolean;
  /** Custom class names */
  className?: string;
  flipperClassName?: string;
  frontClassName?: string;
  backClassName?: string;
  /** Accessible label */
  ariaLabel?: string;
  /** Sound effects enabled */
  enableSound?: boolean;
}

/**
 * FlipCard — 3D Flip Card Component tailored to the Mudit Jha Portfolio design system.
 */
export function FlipCard({
  frontContent,
  backContent,
  isFlipped: controlledFlipped,
  defaultFlipped = false,
  onFlipChange,
  perspective = 1200,
  duration = 0.6,
  axis = "horizontal",
  triggerOnCardClick = true,
  deferBackMount = true,
  expandOnFlip = false,
  width,
  expandedWidth,
  height,
  expandedHeight,
  withBackdrop = false,
  showCloseButton = false,
  className = "",
  flipperClassName = "",
  frontClassName = "",
  backClassName = "",
  ariaLabel = "Interactive 3D Flip Card",
  enableSound = true,
}: FlipCardProps) {
  const isControlled = controlledFlipped !== undefined;
  const [internalFlipped, setInternalFlipped] = useState(defaultFlipped);
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  // Mid-animation content phase: true when flip is past halfway point
  const [isPastHalfway, setIsPastHalfway] = useState(isFlipped);
  const halfwayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const prefersReducedMotion = useReducedMotion();

  const handleFlipToggle = useCallback(
    (nextState?: boolean) => {
      const targetState = nextState !== undefined ? nextState : !isFlipped;
      if (enableSound) {
        if (targetState) {
          play("bloom", { volume: 0.4 });
        } else {
          play("droplet", { volume: 0.4 });
        }
      }
      if (!isControlled) {
        setInternalFlipped(targetState);
      }
      onFlipChange?.(targetState);
    },
    [isControlled, isFlipped, onFlipChange, enableSound]
  );

  // Sync halfway threshold with flip state transition
  useEffect(() => {
    if (halfwayTimerRef.current) {
      clearTimeout(halfwayTimerRef.current);
    }

    if (prefersReducedMotion) {
      setIsPastHalfway(isFlipped);
      return;
    }

    halfwayTimerRef.current = setTimeout(() => {
      setIsPastHalfway(isFlipped);
    }, (duration * 1000) * 0.48);

    return () => {
      if (halfwayTimerRef.current) clearTimeout(halfwayTimerRef.current);
    };
  }, [isFlipped, duration, prefersReducedMotion]);

  // Handle keyboard events (Enter / Space to toggle, Escape to close)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      if (e.key === " ") e.preventDefault();
      if (triggerOnCardClick || !isFlipped) {
        handleFlipToggle();
      }
    } else if (e.key === "Escape" && isFlipped) {
      e.preventDefault();
      handleFlipToggle(false);
    }
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest(
      "button, a, input, textarea, select, [data-prevent-flip]"
    );

    if (isInteractive && !target.closest("[data-flip-trigger]")) {
      return;
    }

    if (triggerOnCardClick || target.closest("[data-flip-trigger]")) {
      handleFlipToggle();
    }
  };

  const isHorizontal = axis === "horizontal";
  const rotationAngle = isFlipped ? 180 : 0;

  const transitionConfig = {
    duration: prefersReducedMotion ? 0.25 : duration,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  };

  return (
    <>
      {/* Backdrop overlay if enabled */}
      <AnimatePresence>
        {withBackdrop && isFlipped && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => handleFlipToggle(false)}
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Outer Wrapper with CSS Perspective */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-expanded={isFlipped}
        onKeyDown={handleKeyDown}
        onClick={handleCardClick}
        animate={{
          width: expandOnFlip && isFlipped ? expandedWidth || "100%" : width || "100%",
          height: expandOnFlip && isFlipped ? expandedHeight || "100%" : height || "100%",
        }}
        transition={transitionConfig}
        style={{
          perspective: prefersReducedMotion ? "none" : `${perspective}px`,
        }}
        className={`relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${
          withBackdrop && isFlipped ? "z-50" : "z-10"
        } ${triggerOnCardClick ? "cursor-pointer" : ""} ${className}`}
      >
        {/* Inner Flipper motion.div */}
        <motion.div
          animate={
            prefersReducedMotion
              ? {}
              : isHorizontal
              ? { rotateY: rotationAngle }
              : { rotateX: rotationAngle }
          }
          transition={transitionConfig}
          style={{
            transformStyle: prefersReducedMotion ? "flat" : "preserve-3d",
            willChange: "transform",
          }}
          className={`relative w-full h-full ${flipperClassName}`}
        >
          {/* FRONT FACE (Motion blur during flip) */}
          <motion.div
            animate={
              prefersReducedMotion
                ? { opacity: isFlipped ? 0 : 1 }
                : {
                    opacity: isFlipped ? 0 : 1,
                    filter: isFlipped ? "blur(4px)" : "blur(0px)",
                  }
            }
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.3,
              delay: prefersReducedMotion ? 0 : isFlipped ? 0.05 : 0.15,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: isFlipped ? "none" : "auto",
            }}
            aria-hidden={isFlipped}
            className={`absolute inset-0 w-full h-full overflow-hidden ${frontClassName}`}
          >
            {frontContent}
          </motion.div>

          {/* BACK FACE (100% Crisp & Visible) */}
          <motion.div
            animate={{
              opacity: isFlipped ? 1 : 0,
            }}
            transition={{
              duration: prefersReducedMotion ? 0.2 : 0.32,
              delay: prefersReducedMotion ? 0 : isFlipped ? 0.15 : 0,
              ease: [0.23, 1, 0.32, 1],
            }}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: prefersReducedMotion
                ? "none"
                : isHorizontal
                ? "rotateY(180deg)"
                : "rotateX(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
            }}
            aria-hidden={!isFlipped}
            className={`absolute inset-0 w-full h-full overflow-hidden ${backClassName}`}
          >
            {/* Optional built-in close button */}
            {showCloseButton && isFlipped && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlipToggle(false);
                }}
                className="absolute top-4 right-4 z-30 p-2 text-zinc-500 hover:text-zinc-900 rounded-full hover:bg-black/5 active:scale-[0.96] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 cursor-pointer"
                aria-label="Close modal"
                data-prevent-flip
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Render back content: if deferBackMount is true, only render rich content when past 50% */}
            {deferBackMount ? (
              isPastHalfway || isFlipped ? (
                backContent
              ) : (
                <div className="w-full h-full bg-[#fbfaf5]" aria-hidden="true" />
              )
            ) : (
              backContent
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default FlipCard;
