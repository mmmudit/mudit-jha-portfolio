"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export function InteractiveTsuLogo() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [manualBlink, setManualBlink] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Smooth springs for pupil tracking (X, Y)
  const pupilX = useSpring(0, { stiffness: 280, damping: 22 });
  const pupilY = useSpring(0, { stiffness: 280, damping: 22 });

  // Mouse / Pointer tracking
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

  const handleManualBlink = () => {
    setManualBlink(true);
    setTimeout(() => setManualBlink(false), 200);
  };

  return (
    <motion.div
      ref={containerRef}
      onHoverStart={handleManualBlink}
      whileHover={{ scale: shouldReduceMotion ? 1 : 1.08 }}
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className="size-[64px] sm:size-[72px] shrink-0 flex items-center justify-center relative select-none cursor-pointer group"
      aria-label="Mudit Jha Logo - Interactive Blinking Toon Eyes"
    >
      {/* SVG Toon Eyes */}
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

        {/* Eye Pair Group */}
        <motion.g
          animate={{
            scaleY: manualBlink ? 0.1 : 1,
            scaleX: manualBlink ? 1.3 : 1,
          }}
          transition={{ duration: 0.12, ease: "easeInOut" }}
          className="animate-toon-blink"
          style={{ originX: "32px", originY: "32px" }}
          filter="url(#pencil-rough)"
        >
          {/* Rounded Toon Eye Whites */}
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

          {/* Pupils Group - Subtly tracks mouse movement */}
          <motion.g style={{ x: pupilX, y: pupilY }}>
            {/* Left Pupil */}
            <circle cx={22} cy={32} r={4.5} fill="#1e1e22" />

            {/* Right Pupil */}
            <circle cx={38} cy={32} r={4.5} fill="#1e1e22" />
          </motion.g>
        </motion.g>
      </svg>
    </motion.div>
  );
}
