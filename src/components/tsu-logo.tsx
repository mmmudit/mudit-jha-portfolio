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

      const maxOffset = 7; // Max pupil shift in px
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
      whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className="size-[48px] sm:size-[56px] shrink-0 flex items-center justify-center relative select-none cursor-pointer group"
      aria-label="Mudit Jha Logo - Interactive Blinking Toon Eyes"
    >
      {/*
        Figma "Full eye" — node 168:916 (updated design).
        Lids SVG viewBox: 142 × 109.
        Both eye whites are now symmetrical (same vertical position).
        Pupils face inward (cross-eyed), both using the D-notch shape.
        Pupil group is positioned to sit within the eye whites using
        translate derived from the Figma inset percentages.
      */}
      <svg
        viewBox="0 0 142 109"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-full overflow-visible"
        aria-hidden="true"
      >
        {/* ── Blink group: eye whites + pupils squeeze together ── */}
        <motion.g
          animate={{
            scaleY: manualBlink ? 0.08 : 1,
            scaleX: manualBlink ? 1.25 : 1,
          }}
          transition={{ duration: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="animate-toon-blink"
          style={{ originX: "71px", originY: "54.5px" }}
        >
          {/* Left eye white — Figma "Ellipse 2" */}
          <path
            d="M38.5 4.5C60.0604 4.5 75.5 25.753 75.5 54V54.0977L75.4961 54.1953C74.7279 71.8637 70.9875 84.473 64.4453 92.7314C57.7193 101.222 48.5333 104.5 38.5 104.5C28.5727 104.5 19.6077 101.531 13.3789 92.958C7.40216 84.7319 4.5 72.0556 4.5 54C4.5 38.2889 7.45771 25.9972 13.3154 17.5068C19.3348 8.78247 28.1328 4.5 38.5 4.5Z"
            fill="white"
            stroke="black"
            strokeWidth="9"
          />
          {/* Right eye white — Figma "Ellipse 3" */}
          <path
            d="M100.5 4.5C122.06 4.5 137.5 25.753 137.5 54V54.0977L137.496 54.1953C136.728 71.8637 132.988 84.473 126.445 92.7314C119.719 101.222 110.533 104.5 100.5 104.5C90.5727 104.5 81.6077 101.531 75.3789 92.958C69.4022 84.7319 66.5 72.0556 66.5 54C66.5 38.2889 69.4577 25.9972 75.3154 17.5068C81.3348 8.78247 90.1328 4.5 100.5 4.5Z"
            fill="white"
            stroke="black"
            strokeWidth="9"
          />

          {/*
            ── Pupils — Figma "pupil" group (96.4 × 52 viewBox) ──
            NOTE: framer-motion x/y (CSS transforms) override SVG transform attributes,
            so centering and spring-offset must live on separate nested elements.
            Centering: eye-white center (40, 54.5) − pupil shape center (17.2, 26) = (22.8, 28.5)
          */}
          {/* Static centering — plain <g> so framer-motion doesn't touch it */}
          <g transform="translate(22.8, 28.5)">
            {/* Dynamic spring offset — motion.g with NO transform attribute */}
            <motion.g style={{ x: pupilX, y: pupilY }}>
              {/* Left pupil — Figma "Subtract_2" (notch faces right / inward) */}
              <path
                d="M16.6533 0C25.0592 5.30063e-05 32.1437 7.05477 34.3145 18.2881L22.0264 24.4004L34.4082 32.3223C32.3222 46.9264 25.5563 52 16.6533 52C6.52068 52 0 45.9996 0 25.7139C0.000104278 8.28558 6.52076 0 16.6533 0Z"
                fill="black"
              />
              {/* Right pupil — Figma "Subtract" (notch faces left / inward) */}
              <path
                d="M78.6533 0C87.0592 5.30063e-05 94.1437 7.05477 96.3145 18.2881L84.0264 24.4004L96.4082 32.3223C94.3222 46.9264 87.5563 52 78.6533 52C68.5207 52 62 45.9996 62 25.7139C62.0001 8.28558 68.5208 0 78.6533 0Z"
                fill="black"
              />
            </motion.g>
          </g>

        </motion.g>
      </svg>
    </motion.div>
  );
}
