"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// ── Simulation constants ──────────────────────────────────────────────────────
const W = 256;       // grid width
const H = 200;       // grid height
const DU = 0.2097;   // diffusion rate U
const DV = 0.1050;   // diffusion rate V
const BASE_F = 0.054; // feed rate (coral growth)
const BASE_K = 0.062; // kill rate
const THRESHOLD = 0.22; // 1-bit cut point on V channel
const STEPS = 6;     // simulation steps per animation frame
const FRAMES_TO_READY = 120; // ~2s at 60fps before dismiss is enabled

// 1-bit pixel palette – Uint32 little-endian RGBA (0xAA_BB_GG_RR)
const PX_CREAM = ((0xff << 24) | (245 << 16) | (250 << 8) | 251) >>> 0; // #fbfaf5
const PX_INK   = ((0xff << 24) | ( 42 << 16) | ( 39 << 8) |  39) >>> 0; // #27272a

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeGrid(fill: number) {
  return new Float32Array(W * H).fill(fill);
}

/** Seed three growth points with a small square of V-chemical */
function seedGrid(u: Float32Array, v: Float32Array) {
  const seeds: [number, number][] = [
    [Math.floor(W * 0.50), Math.floor(H * 0.50)],
    [Math.floor(W * 0.22), Math.floor(H * 0.30)],
    [Math.floor(W * 0.73), Math.floor(H * 0.67)],
  ];
  for (const [cx, cy] of seeds) {
    for (let dy = -5; dy <= 5; dy++) {
      for (let dx = -5; dx <= 5; dx++) {
        const nx = (cx + dx + W) % W;
        const ny = (cy + dy + H) % H;
        const i = ny * W + nx;
        u[i] = 0.50 + (Math.random() - 0.5) * 0.1;
        v[i] = 0.25 + (Math.random() - 0.5) * 0.1;
      }
    }
  }
}

/** One Gray-Scott step with periodic (wrapped) boundary conditions */
function gsStep(
  u: Float32Array, v: Float32Array,
  nu: Float32Array, nv: Float32Array,
  f: number,
) {
  for (let y = 0; y < H; y++) {
    const yn = ((y - 1 + H) % H) * W;
    const yp = ((y + 1) % H) * W;
    const yc = y * W;
    for (let x = 0; x < W; x++) {
      const i  = yc + x;
      const xw = (x - 1 + W) % W;
      const xe = (x + 1) % W;
      const lapU = u[yn+x] + u[yp+x] + u[yc+xw] + u[yc+xe] - 4 * u[i];
      const lapV = v[yn+x] + v[yp+x] + v[yc+xw] + v[yc+xe] - 4 * v[i];
      const uvv  = u[i] * v[i] * v[i];
      nu[i] = Math.max(0, Math.min(1, u[i] + DU * lapU - uvv + f * (1 - u[i])));
      nv[i] = Math.max(0, Math.min(1, v[i] + DV * lapV + uvv - (f + BASE_K) * v[i]));
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
interface HomeLoaderProps {
  onDismiss: () => void;
}

export function HomeLoader({ onDismiss }: HomeLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const simRef    = useRef({
    u:       makeGrid(1),
    v:       makeGrid(0),
    nu:      makeGrid(0),
    nv:      makeGrid(0),
    frame:   0,
    startMs: 0,
  });
  const [canDismiss, setCanDismiss] = useState(false);
  const [exiting, setExiting]       = useState(false);
  const reduce = useReducedMotion();

  const triggerDismiss = useCallback(() => {
    if (!canDismiss || exiting) return;
    setExiting(true);
    // Give exit animation time to run before calling onDismiss
    setTimeout(onDismiss, reduce ? 0 : 600);
  }, [canDismiss, exiting, onDismiss, reduce]);

  // Run the Gray-Scott simulation
  useEffect(() => {
    seedGrid(simRef.current.u, simRef.current.v);
    simRef.current.startMs = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const ctxSafe = ctx; // capture for closure — TS can't narrow inside nested fn
    ctxSafe.imageSmoothingEnabled = false;

    const imgData = ctxSafe.createImageData(W, H);
    const px = new Uint32Array(imgData.data.buffer);

    function loop(ts: number) {
      const sim = simRef.current;
      const elapsed = (ts - sim.startMs) / 1000; // seconds

      // Slowly perturb feed rate on a 20-second sine cycle
      // This causes the stable pattern to occasionally break apart and reform
      const perturb = Math.sin((elapsed / 20) * Math.PI * 2) * 0.006;
      const f = BASE_F + perturb;

      // Multiple steps per frame so pattern grows visibly
      for (let s = 0; s < STEPS; s++) {
        gsStep(sim.u, sim.v, sim.nu, sim.nv, f);
        sim.u.set(sim.nu);
        sim.v.set(sim.nv);
      }
      sim.frame++;

      // 1-bit threshold render — no antialiasing, hard boundary
      const { v } = sim;
      for (let i = 0; i < W * H; i++) {
        px[i] = v[i] > THRESHOLD ? PX_INK : PX_CREAM;
      }
      ctxSafe.putImageData(imgData, 0, 0);

      if (sim.frame === FRAMES_TO_READY) setCanDismiss(true);

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Keyboard dismiss
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") triggerDismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [triggerDismiss]);

  return (
    <motion.div
      key="home-loader"
      initial={{ opacity: 0 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{
        duration: exiting ? 0.6 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-0 z-[60] flex overflow-hidden bg-[#fbfaf5] cursor-pointer"
      onClick={triggerDismiss}
      aria-label="Loading — click to enter"
      role="dialog"
      aria-modal="true"
    >
      {/* ── Left panel: typography ─────────────────────────────────────────── */}
      <div className="relative flex flex-col justify-end w-[44%] shrink-0 p-10 sm:p-12 xl:p-16 select-none pointer-events-none">
        <div className="flex flex-col gap-7 pb-2">

          {/* Section label — small caps tracking */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-300"
          >
            Surface tension
          </motion.span>

          {/* Three-line headline — near-black, display */}
          <div className="flex flex-col leading-none" style={{ gap: "0.06em" }}>
            {["Generative", "form from", "constraint."].map((line, i) => (
              <motion.span
                key={line}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.18 + i * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display font-semibold tracking-[-2.5px] text-zinc-900"
                style={{ fontSize: "clamp(1.9rem, 3.8vw, 3.5rem)" }}
              >
                {line}
              </motion.span>
            ))}
          </div>

          {/* Generative layering secondary line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.42 }}
            className="font-sans text-[13px] leading-relaxed text-zinc-400 max-w-[24ch]"
          >
            Self-organizing structure emergent from chemical reaction.
          </motion.p>

          {/* Caption: 01_ / 02_ underscore letterpressed mono */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
            className="flex flex-col gap-1.5 pt-4 border-t border-zinc-100"
          >
            <span className="font-mono text-[11px] tracking-[0.07em] text-zinc-400">
              01_ reaction-diffusion
            </span>
            <span className="font-mono text-[11px] tracking-[0.07em] text-zinc-400">
              02_ gray-scott / f:k
            </span>
          </motion.div>
        </div>

        {/* Dismiss cue — appears after pattern establishes */}
        <AnimatePresence>
          {canDismiss && (
            <motion.p
              key="cue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute bottom-10 left-10 sm:left-12 xl:left-16 font-mono text-[10px] tracking-[0.18em] uppercase text-zinc-300"
            >
              click to enter →
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Vertical rule: hard edge, no feathering ────────────────────────── */}
      <div className="w-px bg-zinc-200 shrink-0" />

      {/* ── Right panel: Gray-Scott canvas ────────────────────────────────── */}
      {/* Hard-edged rectangle clip: overflow-hidden, no border-radius, no shadow */}
      <div className="flex-1 relative overflow-hidden bg-[#fbfaf5]">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="absolute inset-0 w-full h-full"
          style={{
            imageRendering: "pixelated",
          }}
        />
      </div>
    </motion.div>
  );
}
