"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, AnimatePresence, useReducedMotion } from "framer-motion";

export function InteractiveTsuLogo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [manualBlink, setManualBlink] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [isBreakoutActive, setIsBreakoutActive] = useState(false);
  const [proximityRage, setProximityRage] = useState(0); // 0.0 to 1.0

  const shouldReduceMotion = useReducedMotion();
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth springs for pupil tracking (X, Y)
  const pupilX = useSpring(0, { stiffness: 280, damping: 22 });
  const pupilY = useSpring(0, { stiffness: 280, damping: 22 });

  // Listen for breakout active state
  useEffect(() => {
    const handleBreakoutEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsBreakoutActive(customEvent.detail?.active ?? false);
    };

    window.addEventListener("super-saiyan-breakout", handleBreakoutEvent);
    return () => window.removeEventListener("super-saiyan-breakout", handleBreakoutEvent);
  }, []);

  // Mouse / Pointer tracking & Proximity Rage calculation
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      const dist = Math.hypot(dx, dy);

      // Proximity Rage: 0 at 160px distance, gradually scaling to 1.0 near logo
      const prox = Math.max(0, Math.min(1, (160 - dist) / 130));
      setProximityRage(prox);

      const maxOffset = 4.5; // Max pupil shift in px
      if (dist === 0) {
        pupilX.set(0);
        pupilY.set(0);
      } else {
        const factor = Math.min(dist / 350, 1);
        pupilX.set((dx / dist) * maxOffset * factor);
        pupilY.set((dy / dist) * maxOffset * factor);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pupilX, pupilY]);

  // Combined Rage Intensity Value (0.0 to 1.0)
  const rageValue = isHolding || isBreakoutActive ? 1.0 : proximityRage;
  const isAngry = rageValue > 0.45;

  const handleHoldStart = () => {
    setIsHolding(true);

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = setTimeout(() => {
      // Dispatch 3-Second Breakout Easter Egg! (ONLY after holding for full duration)
      window.dispatchEvent(
        new CustomEvent("super-saiyan-breakout", {
          detail: { active: true, breakout: true },
        })
      );
    }, 1500);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleManualBlink = () => {
    if (!isAngry) {
      setManualBlink(true);
      setTimeout(() => setManualBlink(false), 200);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      onHoverStart={handleManualBlink}
      onPointerDown={handleHoldStart}
      onPointerUp={handleHoldEnd}
      onPointerLeave={handleHoldEnd}
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.08 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
      animate={
        isAngry && !shouldReduceMotion
          ? {
              x: [-1.5, 1.5, -1.5, 1.5, 0],
              y: [-1.5, 1.5, -1.5, 1.5, 0],
            }
          : { x: 0, y: 0 }
      }
      transition={
        isAngry && !shouldReduceMotion
          ? { repeat: Infinity, duration: 0.08 }
          : { type: "spring", stiffness: 450, damping: 25 }
      }
      className="size-[64px] sm:size-[72px] shrink-0 flex items-center justify-center relative select-none cursor-pointer group"
      aria-label="Mudit Jha Logo - Interactive Super Saiyan Blinking Toon Eyes"
    >
      {/* Super Saiyan Gold Aura Pulse Effect gradually scaling with proximity */}
      {isAngry && (
        <motion.div
          animate={{
            opacity: [0.4, 0.85, 0.4],
            scale: [1, 1.3, 1],
          }}
          transition={{ repeat: Infinity, duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 bg-amber-400/35 blur-md rounded-full pointer-events-none"
        />
      )}

      {/* SVG Toon & Super Saiyan Eyes */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full p-2 z-10"
      >
        <defs>
          {/* SVG Filter creating hand-drawn rough graphite pencil edge distortion */}
          <filter id="pencil-rough" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.14"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        {/* Super Saiyan Eyebrow Group - Fades and slides down smoothly with proximity */}
        <motion.g
          animate={{
            opacity: isAngry ? 1 : 0,
            y: isAngry ? 0 : -12,
            scale: isAngry ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          filter="url(#pencil-rough)"
          style={{ originX: "32px", originY: "24px" }}
        >
          {/* Left Angled Super Saiyan Eyebrow */}
          <path
            d="M 8 15 L 29 28"
            stroke="#1e1e22"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Right Angled Super Saiyan Eyebrow */}
          <path
            d="M 56 15 L 35 28"
            stroke="#1e1e22"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Center Inner Frown Crease Lines */}
          <path
            d="M 30 26 L 30 32"
            stroke="#1e1e22"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 34 26 L 34 32"
            stroke="#1e1e22"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Super Saiyan Cheek Lines Group - Fades and slides up smoothly with proximity */}
        <motion.g
          animate={{
            opacity: isAngry ? 1 : 0,
            y: isAngry ? 0 : 8,
            scale: isAngry ? 1 : 0.9,
          }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          filter="url(#pencil-rough)"
          style={{ originX: "32px", originY: "44px" }}
        >
          {/* Left Cheek Lines */}
          <path
            d="M 11 44 L 28 41"
            stroke="#1e1e22"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 14 47 L 26 44"
            stroke="#1e1e22"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Right Cheek Lines */}
          <path
            d="M 53 44 L 36 41"
            stroke="#1e1e22"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M 50 47 L 38 44"
            stroke="#1e1e22"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Eye Pair Group - AnimatePresence mode="wait" guarantees ZERO OVERLAP in any frame */}
        <motion.g
          animate={
            isAngry
              ? { scaleY: 0.82, scaleX: 1.05 }
              : { scaleY: manualBlink ? 0.1 : 1, scaleX: manualBlink ? 1.3 : 1 }
          }
          transition={{ duration: 0.12, ease: "easeInOut" }}
          className={isAngry ? "" : "animate-toon-blink"}
          style={{ originX: "32px", originY: "32px" }}
          filter="url(#pencil-rough)"
        >
          <AnimatePresence mode="wait">
            {isAngry ? (
              /* Sharp Angular Super Saiyan Eye Outlines - Never overlaps with normal eyes */
              <motion.g
                key="angry-eyes"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <path
                  d="M 9 17 L 29 28 L 26 41 L 11 36 Z"
                  fill="#ffffff"
                  stroke="#1e1e22"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
                <path
                  d="M 55 17 L 35 28 L 38 41 L 53 36 Z"
                  fill="#ffffff"
                  stroke="#1e1e22"
                  strokeWidth="2.2"
                  strokeLinejoin="round"
                />
              </motion.g>
            ) : (
              /* Rounded Toon Eye Whites - Completely unmounts before angry eyes mount */
              <motion.g
                key="normal-eyes"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                <ellipse
                  cx="22"
                  cy="32"
                  rx="9.5"
                  ry="12"
                  fill="#ffffff"
                  stroke="#1e1e22"
                  strokeWidth="2.2"
                />
                <ellipse
                  cx="38"
                  cy="32"
                  rx="9.5"
                  ry="12"
                  fill="#ffffff"
                  stroke="#1e1e22"
                  strokeWidth="2.2"
                />
              </motion.g>
            )}
          </AnimatePresence>

          {/* Pupils Group - Subtly tracks mouse movement */}
          <motion.g style={{ x: pupilX, y: pupilY }}>
            {/* Left Pupil */}
            <circle
              cx={isAngry ? 20 : 22}
              cy={isAngry ? 33 : 32}
              r={isAngry ? 4 : 4.5}
              fill="#1e1e22"
            />

            {/* Right Pupil */}
            <circle
              cx={isAngry ? 40 : 38}
              cy={isAngry ? 33 : 32}
              r={isAngry ? 4 : 4.5}
              fill="#1e1e22"
            />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
