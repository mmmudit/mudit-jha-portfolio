"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type MagneticVariant =
  | "spring-float" // Option 4A: Discrete word spring lift
  | "proximity-lens" // Option 4B: Word-level continuous parabolic lens (Active on Home)
  | "char-liquid-lens" // Option 4B-1: Character-level ultra-smooth Gaussian wave
  | "velocity-wind" // Option 4B-2: Inertial vector displacement along cursor trajectory
  | "3d-focal-tilt" // Option 4B-3: 3D perspective orientation aimed at cursor light point
  | "weight-morph" // Option 4B-4: Continuous variable font-weight & tracking morph
  | "chromatic-focus" // Option 4B-5: Depth of field focus with subtle chromatic bloom
  | "ripple-strum" // Option 4C: Elastic character guitar strum
  | "rubberband-stretch" // Option 4D: Rubberband stretch
  | "3d-gyro-tilt"; // Option 4E: 3D card tilt

interface MagneticTextProps {
  text: string;
  variant?: MagneticVariant;
  className?: string;
  wordClassName?: string;
}

export function MagneticText({
  text,
  variant = "proximity-lens",
  className = "",
  wordClassName = "",
}: MagneticTextProps) {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [mouseVelocity, setMouseVelocity] = useState<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    const now = performance.now();

    if (lastPosRef.current) {
      const dt = Math.max(now - lastPosRef.current.time, 16);
      const dx = currentX - lastPosRef.current.x;
      const dy = currentY - lastPosRef.current.y;
      setMouseVelocity({
        vx: (dx / dt) * 16,
        vy: (dy / dt) * 16,
      });
    }

    lastPosRef.current = { x: currentX, y: currentY, time: now };
    setMousePos({ x: currentX, y: currentY });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setMouseVelocity({ vx: 0, vy: 0 });
    lastPosRef.current = null;
  };

  // --------------------------------------------------------------------------
  // VARIANT 4B-1: CHARACTER-LEVEL ULTRA-SMOOTH GAUSSIAN LIQUID LENS
  // --------------------------------------------------------------------------
  if (variant === "char-liquid-lens") {
    const chars = text.split("");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap items-baseline select-none py-1 ${className}`}
      >
        {chars.map((char, i) => (
          <CharLiquidLensItem
            key={`${char}-${i}`}
            char={char}
            mousePos={mousePos}
            containerRef={containerRef}
            reduce={reduce}
          />
        ))}
      </span>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 4B-2: KINETIC VELOCITY WIND DISPLACE
  // --------------------------------------------------------------------------
  if (variant === "velocity-wind") {
    const words = text.split(" ");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap gap-x-[0.28em] select-none py-1 ${className}`}
      >
        {words.map((word, i) => (
          <VelocityWindItem
            key={`${word}-${i}`}
            word={word}
            mousePos={mousePos}
            mouseVelocity={mouseVelocity}
            containerRef={containerRef}
            reduce={reduce}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 4B-3: 3D FOCAL LIGHT TILT
  // --------------------------------------------------------------------------
  if (variant === "3d-focal-tilt") {
    const words = text.split(" ");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap gap-x-[0.28em] select-none py-1 [perspective:900px] ${className}`}
      >
        {words.map((word, i) => (
          <FocalTiltItem
            key={`${word}-${i}`}
            word={word}
            mousePos={mousePos}
            containerRef={containerRef}
            reduce={reduce}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 4B-4: PARABOLIC FONT-WEIGHT MORPH
  // --------------------------------------------------------------------------
  if (variant === "weight-morph") {
    const words = text.split(" ");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap gap-x-[0.28em] select-none py-1 ${className}`}
      >
        {words.map((word, i) => (
          <WeightMorphItem
            key={`${word}-${i}`}
            word={word}
            mousePos={mousePos}
            containerRef={containerRef}
            reduce={reduce}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 4B-5: CHROMATIC DEPTH FOCUS
  // --------------------------------------------------------------------------
  if (variant === "chromatic-focus") {
    const words = text.split(" ");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap gap-x-[0.28em] select-none py-1 ${className}`}
      >
        {words.map((word, i) => (
          <ChromaticFocusItem
            key={`${word}-${i}`}
            word={word}
            mousePos={mousePos}
            containerRef={containerRef}
            reduce={reduce}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    );
  }

  // --------------------------------------------------------------------------
  // VARIANT 4B: WORD-LEVEL PROXIMITY LENS (Default/Home active)
  // --------------------------------------------------------------------------
  if (variant === "proximity-lens") {
    const words = text.split(" ");
    return (
      <span
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex flex-wrap gap-x-[0.28em] select-none py-1 ${className}`}
      >
        {words.map((word, i) => (
          <WordProximityItem
            key={`${word}-${i}`}
            word={word}
            mousePos={mousePos}
            containerRef={containerRef}
            reduce={reduce}
            wordClassName={wordClassName}
          />
        ))}
      </span>
    );
  }

  // Fallback: Discrete Spring Float (4A)
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] select-none ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          whileHover={
            reduce
              ? {}
              : {
                  y: -3.5,
                  scale: 1.04,
                  color: "#18181b",
                }
          }
          transition={{
            type: "spring",
            stiffness: 450,
            damping: 25,
          }}
          className={`inline-block cursor-default select-none transition-colors duration-150 motion-reduce:transition-none ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

// ============================================================================
// SUB-COMPONENTS FOR HIGH-PRECISION REACTION
// ============================================================================

// 1. Word-level Proximity Item
function WordProximityItem({
  word,
  mousePos,
  containerRef,
  reduce,
  wordClassName,
}: {
  word: string;
  mousePos: { x: number; y: number } | null;
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
  wordClassName?: string;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const [isEpicenter, setIsEpicenter] = useState(false);

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce) {
      setOffsetY(0);
      setScale(1);
      setIsEpicenter(false);
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 135;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      setOffsetY(-6.5 * factor);
      setScale(1 + 0.08 * factor);
      setIsEpicenter(factor > 0.45);
    } else {
      setOffsetY(0);
      setScale(1);
      setIsEpicenter(false);
    }
  }, [mousePos, containerRef, reduce]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        y: offsetY,
        scale: scale,
        color: isEpicenter ? "#09090b" : undefined,
      }}
      transition={{
        type: "spring",
        stiffness: 440,
        damping: 25,
      }}
      className={`inline-block cursor-default transition-colors duration-150 motion-reduce:transition-none ${wordClassName}`}
    >
      {word}
    </motion.span>
  );
}

// 2. Character-level Liquid Lens Item
function CharLiquidLensItem({
  char,
  mousePos,
  containerRef,
  reduce,
}: {
  char: string;
  mousePos: { x: number; y: number } | null;
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);
  const isSpace = char === " ";

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce || isSpace) {
      setOffsetY(0);
      setScale(1);
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 90;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      setOffsetY(-8 * factor);
      setScale(1 + 0.18 * factor);
    } else {
      setOffsetY(0);
      setScale(1);
    }
  }, [mousePos, containerRef, reduce, isSpace]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        y: offsetY,
        scale: scale,
      }}
      transition={{
        type: "spring",
        stiffness: 460,
        damping: 22,
        mass: 0.5,
      }}
      className={`inline-block font-semibold text-zinc-900 cursor-default ${
        isSpace ? "w-[0.28em]" : ""
      }`}
    >
      {isSpace ? "\u00A0" : char}
    </motion.span>
  );
}

// 3. Velocity Wind Displace Item
function VelocityWindItem({
  word,
  mousePos,
  mouseVelocity,
  containerRef,
  reduce,
  wordClassName,
}: {
  word: string;
  mousePos: { x: number; y: number } | null;
  mouseVelocity: { vx: number; vy: number };
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
  wordClassName?: string;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [displace, setDisplace] = useState({ x: 0, y: 0, rotate: 0 });

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce) {
      setDisplace({ x: 0, y: 0, rotate: 0 });
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 120;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      const clampVx = Math.max(Math.min(mouseVelocity.vx * 0.8, 14), -14);
      setDisplace({
        x: clampVx * factor,
        y: -5 * factor,
        rotate: clampVx * 0.6 * factor,
      });
    } else {
      setDisplace({ x: 0, y: 0, rotate: 0 });
    }
  }, [mousePos, mouseVelocity, containerRef, reduce]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        x: displace.x,
        y: displace.y,
        rotate: displace.rotate,
      }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 20,
      }}
      className={`inline-block cursor-default transform-gpu will-change-transform ${wordClassName}`}
    >
      {word}
    </motion.span>
  );
}

// 4. 3D Focal Tilt Item
function FocalTiltItem({
  word,
  mousePos,
  containerRef,
  reduce,
  wordClassName,
}: {
  word: string;
  mousePos: { x: number; y: number } | null;
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
  wordClassName?: string;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, z: 0, y: 0 });

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce) {
      setTilt({ rx: 0, ry: 0, z: 0, y: 0 });
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 150;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      setTilt({
        rx: (dy / maxRadius) * 22 * factor,
        ry: -(dx / maxRadius) * 22 * factor,
        z: 20 * factor,
        y: -4 * factor,
      });
    } else {
      setTilt({ rx: 0, ry: 0, z: 0, y: 0 });
    }
  }, [mousePos, containerRef, reduce]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        rotateX: tilt.rx,
        rotateY: tilt.ry,
        z: tilt.z,
        y: tilt.y,
      }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 24,
      }}
      className={`inline-block cursor-default transform-gpu will-change-transform ${wordClassName}`}
    >
      {word}
    </motion.span>
  );
}

// 5. Weight Morph Item
function WeightMorphItem({
  word,
  mousePos,
  containerRef,
  reduce,
  wordClassName,
}: {
  word: string;
  mousePos: { x: number; y: number } | null;
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
  wordClassName?: string;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [tracking, setTracking] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce) {
      setTracking(0);
      setScale(1);
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 120;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      setTracking(0.04 * factor);
      setScale(1 + 0.06 * factor);
    } else {
      setTracking(0);
      setScale(1);
    }
  }, [mousePos, containerRef, reduce]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        letterSpacing: `${tracking}em`,
        scale: scale,
        y: scale > 1 ? -3 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 22,
      }}
      className={`inline-block cursor-default transition-colors duration-150 ${wordClassName}`}
    >
      {word}
    </motion.span>
  );
}

// 6. Chromatic Focus Item
function ChromaticFocusItem({
  word,
  mousePos,
  containerRef,
  reduce,
  wordClassName,
}: {
  word: string;
  mousePos: { x: number; y: number } | null;
  containerRef: React.RefObject<HTMLSpanElement | null>;
  reduce: boolean | null;
  wordClassName?: string;
}) {
  const itemRef = useRef<HTMLSpanElement>(null);
  const [shadow, setShadow] = useState("none");
  const [y, setY] = useState(0);

  useEffect(() => {
    if (!mousePos || !itemRef.current || !containerRef.current || reduce) {
      setShadow("none");
      setY(0);
      return;
    }

    const itemRect = itemRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const itemCenterX = itemRect.left - containerRect.left + itemRect.width / 2;
    const itemCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

    const dx = mousePos.x - itemCenterX;
    const dy = mousePos.y - itemCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 130;

    if (dist < maxRadius) {
      const factor = Math.cos((dist / maxRadius) * (Math.PI / 2));
      const rX = (dx / maxRadius) * 2.5 * factor;
      setShadow(`${rX}px 0px 0px rgba(200, 213, 187, 0.9), ${-rX}px 0px 0px rgba(61, 76, 63, 0.3)`);
      setY(-4 * factor);
    } else {
      setShadow("none");
      setY(0);
    }
  }, [mousePos, containerRef, reduce]);

  return (
    <motion.span
      ref={itemRef}
      animate={{
        textShadow: shadow,
        y: y,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 24,
      }}
      className={`inline-block cursor-default select-none ${wordClassName}`}
    >
      {word}
    </motion.span>
  );
}
