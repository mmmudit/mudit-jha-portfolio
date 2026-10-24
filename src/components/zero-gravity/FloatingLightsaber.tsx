"use client";

import React, { useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useZeroGravity } from "@/context/zero-gravity-context";

export function FloatingLightsaber() {
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  // Scroll parallax gives the floating saber real 3D depth against the stars and content
  const scrollParallaxY = useTransform(scrollY, [0, 2400], [0, -110]);

  // Interactive Easter egg: clicking spins the saber, hover intensifies kyber plasma
  const [spinDegree, setSpinDegree] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const isVisible = isZeroGravity && !isRestoring;

  const handleSaberClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpinDegree((prev) => prev + 360);
    setPulseKey((k) => k + 1);
  };

  if (!isVisible) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Scroll parallax layer */}
      <motion.div
        style={{ y: reduce ? 0 : scrollParallaxY }}
        className="absolute inset-0 will-change-transform transform-gpu"
      >
        {/* Macro Orbital Drift Trajectory across the cosmic background */}
        <motion.div
          initial={
            reduce
              ? { x: "65vw", y: "22vh", rotate: 18, opacity: 0 }
              : { x: "-20vw", y: "16vh", rotate: -24, opacity: 0 }
          }
          animate={
            reduce
              ? { x: "65vw", y: "22vh", rotate: 18, opacity: 0.95 }
              : {
                  // Majestic orbital voyage across the entire viewport background
                  x: [
                    "-20vw", // Waypoint 0: drifts in from top-left offscreen
                    "24vw",  // Waypoint 1: floating past upper-left content
                    "60vw",  // Waypoint 2: drifting across mid-screen
                    "88vw",  // Waypoint 3: gliding past upper-right
                    "118vw", // Waypoint 4: exits smoothly past right edge
                    "118vw", // Waypoint 5: curves behind deep space
                    "82vw",  // Waypoint 6: returns across lower viewport
                    "42vw",  // Waypoint 7: floats across lower midground
                    "12vw",  // Waypoint 8: cruises past lower-left
                    "-25vw", // Waypoint 9: exits left
                    "-20vw", // Loops seamlessly back to start
                  ],
                  y: [
                    "16vh",
                    "24vh",
                    "34vh",
                    "22vh",
                    "46vh",
                    "74vh",
                    "68vh",
                    "78vh",
                    "62vh",
                    "38vh",
                    "16vh",
                  ],
                  rotate: [
                    -24,
                    -8,
                    16,
                    38,
                    65,
                    145,
                    185,
                    215,
                    245,
                    310,
                    336, // ~-24 deg modulo 360 for seamless continuous loop
                  ],
                  opacity: [0, 0.95, 1, 1, 0.9, 0.6, 0.95, 1, 0.95, 0.7, 0],
                }
          }
          transition={
            reduce
              ? { duration: 0.8, ease: "easeOut" }
              : {
                  duration: 44,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute will-change-transform transform-gpu"
        >
          {/* Microgravity tumbling & floating oscillation layer */}
          <motion.div
            animate={
              reduce
                ? { y: 0, rotate: 0 }
                : {
                    y: [-9, 9, -9],
                    x: [-4, 4, -4],
                    rotate: [-3.5, 3.5, -3.5],
                  }
            }
            transition={
              reduce
                ? { duration: 0.3 }
                : {
                    duration: 5.4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }
            }
            className="relative will-change-transform transform-gpu"
          >
            {/* Interactive rotation container (spins when clicked) */}
            <motion.div
              animate={{ rotate: spinDegree }}
              transition={{
                type: "spring",
                stiffness: 75,
                damping: 14,
                mass: 0.85,
              }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              onClick={handleSaberClick}
              className="pointer-events-auto cursor-pointer group relative flex items-center justify-center -m-8 p-8"
              title="Kyber Lightsaber — Click to deflect"
            >
              {/* Volumetric ambient kyber light cast on surrounding space */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.45 : [0.22, 0.32, 0.22],
                  scale: isHovered ? 1.15 : [0.96, 1.04, 0.96],
                }}
                transition={{
                  duration: isHovered ? 0.3 : 2.8,
                  repeat: isHovered ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 pointer-events-none rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse 320px 140px at 60% 50%, rgba(14, 165, 233, 0.45), rgba(37, 99, 235, 0.25) 50%, transparent 75%)",
                }}
              />

              {/* Interactive Click Kyber Shockwave Burst */}
              {pulseKey > 0 && (
                <motion.div
                  key={pulseKey}
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute pointer-events-none rounded-full border-2 border-cyan-400"
                  style={{
                    width: 180,
                    height: 180,
                    boxShadow: "0 0 25px rgba(56, 189, 248, 0.8)",
                  }}
                />
              )}

              {/* The Lightsaber Vector Craft */}
              <div
                className="relative will-change-transform transform-gpu transition-transform duration-300 group-hover:scale-[1.04]"
                style={{
                  filter: isHovered
                    ? "drop-shadow(0 0 4px #ffffff) drop-shadow(0 0 12px #38bdf8) drop-shadow(0 0 26px #0284c7) drop-shadow(0 0 48px #2563eb)"
                    : "drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 8px #38bdf8) drop-shadow(0 0 18px #0284c7) drop-shadow(0 0 35px rgba(37, 99, 235, 0.7))",
                }}
              >
                <svg
                  width="330"
                  height="44"
                  viewBox="0 0 330 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="overflow-visible block"
                >
                  <defs>
                    {/* Metallic Chrome Gradients */}
                    <linearGradient
                      id="saber-chrome-cyl"
                      x1="0"
                      y1="14"
                      x2="0"
                      y2="30"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="25%" stopColor="#cbd5e1" />
                      <stop offset="48%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>

                    <linearGradient
                      id="saber-dark-grip"
                      x1="0"
                      y1="13"
                      x2="0"
                      y2="31"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#090d16" />
                      <stop offset="50%" stopColor="#1f2937" />
                      <stop offset="100%" stopColor="#030712" />
                    </linearGradient>

                    {/* Gold Activation Switch */}
                    <linearGradient
                      id="saber-gold-switch"
                      x1="0"
                      y1="14"
                      x2="0"
                      y2="21"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="45%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#854d0e" />
                    </linearGradient>

                    {/* Bronze Choke Accents */}
                    <linearGradient
                      id="saber-bronze"
                      x1="0"
                      y1="16"
                      x2="0"
                      y2="28"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#fdba74" />
                      <stop offset="50%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>

                    {/* Blue Plasma Blade Gradients */}
                    <linearGradient
                      id="plasma-core-glow"
                      x1="88"
                      y1="22"
                      x2="318"
                      y2="22"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="90%" stopColor="#f0f9ff" />
                      <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>

                    <linearGradient
                      id="plasma-outer-blue"
                      x1="88"
                      y1="22"
                      x2="318"
                      y2="22"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                      <stop offset="70%" stopColor="#0284c7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.6" />
                    </linearGradient>

                    {/* Emitter Aperture Kyber Bloom */}
                    <radialGradient
                      id="kyber-aperture"
                      cx="87"
                      cy="22"
                      r="10"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="40%" stopColor="#67e8f9" />
                      <stop offset="80%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* ========================================================
                      1. BLUE KYBER PLASMA BLADE
                      ======================================================== */}
                  <g className="blade-group">
                    {/* Outer soft blue aura */}
                    <rect
                      x="86"
                      y="14.5"
                      width="230"
                      height="15"
                      rx="7.5"
                      fill="url(#plasma-outer-blue)"
                    />

                    {/* Electric cyan mid-glow */}
                    <rect
                      x="87"
                      y="17"
                      width="228"
                      height="10"
                      rx="5"
                      fill="#38bdf8"
                      opacity="0.9"
                    />

                    {/* Searing white plasma core */}
                    <rect
                      x="88"
                      y="19.5"
                      width="226"
                      height="5"
                      rx="2.5"
                      fill="url(#plasma-core-glow)"
                    />

                    {/* Emitter energy corona flash */}
                    <circle cx="88" cy="22" r="8" fill="url(#kyber-aperture)" />
                    <ellipse cx="88" cy="22" rx="3.5" ry="6.5" fill="#ffffff" />
                  </g>

                  {/* ========================================================
                      2. HILT (PRECISION MACHINED JEDI LIGHTSABER)
                      ======================================================== */}
                  <g className="hilt-group">
                    {/* Pommel Base */}
                    <rect
                      x="8"
                      y="16"
                      width="6"
                      height="12"
                      rx="1.5"
                      fill="url(#saber-chrome-cyl)"
                      stroke="#0f172a"
                      strokeWidth="0.75"
                    />
                    {/* D-Ring Belt Clip */}
                    <path
                      d="M 8 19.5 C 4.5 19.5 4.5 24.5 8 24.5"
                      stroke="#94a3b8"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Pommel Stepped Collar */}
                    <rect
                      x="14"
                      y="15"
                      width="5"
                      height="14"
                      rx="1"
                      fill="url(#saber-chrome-cyl)"
                      stroke="#0f172a"
                      strokeWidth="0.75"
                    />
                    {/* Pommel Vents */}
                    <line x1="16" y1="16.5" x2="16" y2="27.5" stroke="#1e293b" strokeWidth="1" />
                    <line x1="17.5" y1="16.5" x2="17.5" y2="27.5" stroke="#1e293b" strokeWidth="1" />

                    {/* Lower Grip Chassis */}
                    <rect
                      x="19"
                      y="15.5"
                      width="35"
                      height="13"
                      rx="1"
                      fill="url(#saber-chrome-cyl)"
                    />

                    {/* Textured Black Grip Ribs */}
                    {[22, 27, 32, 37, 42, 47].map((xPos) => (
                      <g key={xPos}>
                        <rect
                          x={xPos}
                          y="14"
                          width="3.2"
                          height="16"
                          rx="0.8"
                          fill="url(#saber-dark-grip)"
                          stroke="#090d16"
                          strokeWidth="0.5"
                        />
                        {/* Chrome rib highlight */}
                        <line
                          x1={xPos + 0.6}
                          y1="14.8"
                          x2={xPos + 2.6}
                          y2="14.8"
                          stroke="#cbd5e1"
                          strokeWidth="0.6"
                          strokeLinecap="round"
                        />
                      </g>
                    ))}

                    {/* Control Clamp Box */}
                    <rect
                      x="54"
                      y="13"
                      width="13"
                      height="18"
                      rx="1.5"
                      fill="url(#saber-chrome-cyl)"
                      stroke="#0f172a"
                      strokeWidth="0.75"
                    />
                    {/* Gold Ignition Switch Plate */}
                    <rect
                      x="56"
                      y="14.5"
                      width="9"
                      height="5.5"
                      rx="1"
                      fill="url(#saber-gold-switch)"
                    />
                    <line
                      x1="57"
                      y1="17.2"
                      x2="64"
                      y2="17.2"
                      stroke="#78350f"
                      strokeWidth="0.6"
                    />

                    {/* Status Indicator Micro-LEDs */}
                    <circle cx="58" cy="26" r="1.1" fill="#22c55e" />
                    <circle cx="63" cy="26" r="1.1" fill="#ef4444" />

                    {/* Neck / Choke Section */}
                    <rect
                      x="67"
                      y="16.5"
                      width="9"
                      height="11"
                      rx="0.5"
                      fill="#1e293b"
                    />
                    {/* Bronze Thermal Dissipation Rings */}
                    <line x1="69.5" y1="16.5" x2="69.5" y2="27.5" stroke="url(#saber-bronze)" strokeWidth="1.2" />
                    <line x1="73" y1="16.5" x2="73" y2="27.5" stroke="url(#saber-bronze)" strokeWidth="1.2" />

                    {/* Emitter Crown / Flared Shroud */}
                    <path
                      d="M 76 15 L 87 14.5 L 89 17 L 89 27 L 87 29.5 L 76 29 Z"
                      fill="url(#saber-chrome-cyl)"
                      stroke="#0f172a"
                      strokeWidth="0.75"
                    />
                    {/* Angled Emitter Cutout */}
                    <path
                      d="M 85 14.8 L 88.5 17 L 88.5 27 L 85 29.2"
                      stroke="#38bdf8"
                      strokeWidth="0.8"
                      fill="none"
                      opacity="0.85"
                    />
                    {/* Kyber Magnetic Aperture Prongs */}
                    <rect x="80" y="13.5" width="2" height="3" rx="0.5" fill="#0f172a" />
                    <rect x="80" y="27.5" width="2" height="3" rx="0.5" fill="#0f172a" />
                  </g>
                </svg>

                {/* Subtle Kyber Energy Plasma Particles trailing in microgravity */}
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { left: "45%", top: "40%", delay: 0 },
                    { left: "70%", top: "55%", delay: 1.1 },
                    { left: "90%", top: "35%", delay: 2.2 },
                  ].map((pt, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute w-1 h-1 rounded-full bg-cyan-300"
                      style={{
                        left: pt.left,
                        top: pt.top,
                        boxShadow: "0 0 6px #38bdf8",
                      }}
                      animate={{
                        x: [-5, -28],
                        y: [-2, 8],
                        opacity: [0, 0.85, 0],
                        scale: [0.6, 1.2, 0.4],
                      }}
                      transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        delay: pt.delay,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
