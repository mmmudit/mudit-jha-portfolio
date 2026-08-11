"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Simulation constants ──────────────────────────────────────────────────────
const W = 256;
const H = 200;
const DU = 0.2097;
const DV = 0.1050;
const BASE_F = 0.054;
const BASE_K = 0.062;
const THRESHOLD = 0.22;
const STEPS = 12;           // faster: more steps per frame
const FRAMES_TO_READY = 50; // faster: ~0.85s at 60fps before dismiss enabled

// 1-bit palette — Uint32 little-endian RGBA (0xAA_BB_GG_RR)
const PX_CREAM = ((0xff << 24) | (245 << 16) | (250 << 8) | 251) >>> 0; // #fbfaf5
const PX_INK   = ((0xff << 24) | ( 42 << 16) | ( 39 << 8) |  39) >>> 0; // #27272a

// ── Helpers ───────────────────────────────────────────────────────────────────
function makeGrid(fill: number) {
  return new Float32Array(W * H).fill(fill);
}

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
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const overlayRef    = useRef<HTMLDivElement>(null);
  const simRafRef     = useRef<number>(0);
  const dismissRafRef = useRef<number>(0);
  const simRef = useRef({
    u:       makeGrid(1),
    v:       makeGrid(0),
    nu:      makeGrid(0),
    nv:      makeGrid(0),
    frame:   0,
    startMs: 0,
  });
  const [canDismiss, setCanDismiss] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  // ── Circle iris reveal on dismiss ─────────────────────────────────────────
  // Uses radial-gradient mask: transparent circle (page shows) grows from 0 → full
  // mask-image: radial-gradient(circle at 50% 50%, transparent R, black R)
  // As R grows, the transparent hole expands from center, revealing the page below.
  const triggerDismiss = useCallback(() => {
    if (!canDismiss || dismissing) return;
    setDismissing(true);

    // Stop simulation so the frozen frame stays while the iris opens
    cancelAnimationFrame(simRafRef.current);

    const el = overlayRef.current;
    if (!el) { onDismiss(); return; }
    const elSafe = el; // capture non-null for closure

    const DURATION = 750; // ms
    // Max radius to cover the full viewport diagonal
    const maxR = Math.hypot(window.innerWidth, window.innerHeight) * 0.6;
    const start = performance.now();

    function animateIris(ts: number) {
      const t = Math.min((ts - start) / DURATION, 1);
      // Ease-in-out cubic for smooth iris open feel
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const r = maxR * eased;

      const mask = `radial-gradient(circle at 50% 50%, transparent ${r}px, black ${r}px)`;
      elSafe.style.webkitMaskImage = mask;
      elSafe.style.maskImage = mask;

      if (t < 1) {
        dismissRafRef.current = requestAnimationFrame(animateIris);
      } else {
        onDismiss();
      }
    }

    dismissRafRef.current = requestAnimationFrame(animateIris);
  }, [canDismiss, dismissing, onDismiss]);

  // ── Gray-Scott simulation loop ────────────────────────────────────────────
  useEffect(() => {
    seedGrid(simRef.current.u, simRef.current.v);
    simRef.current.startMs = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const ctxSafe = ctx;
    ctxSafe.imageSmoothingEnabled = false;

    const imgData = ctxSafe.createImageData(W, H);
    const px = new Uint32Array(imgData.data.buffer);

    function loop(ts: number) {
      const sim = simRef.current;
      const elapsed = (ts - sim.startMs) / 1000;

      // Feed rate perturbed on 20-second sine cycle
      const perturb = Math.sin((elapsed / 20) * Math.PI * 2) * 0.006;
      const f = BASE_F + perturb;

      for (let s = 0; s < STEPS; s++) {
        gsStep(sim.u, sim.v, sim.nu, sim.nv, f);
        sim.u.set(sim.nu);
        sim.v.set(sim.nv);
      }
      sim.frame++;

      // 1-bit threshold — hard boundary, no antialiasing
      const { v } = sim;
      for (let i = 0; i < W * H; i++) {
        px[i] = v[i] > THRESHOLD ? PX_INK : PX_CREAM;
      }
      ctxSafe.putImageData(imgData, 0, 0);

      if (sim.frame === FRAMES_TO_READY) setCanDismiss(true);

      simRafRef.current = requestAnimationFrame(loop);
    }

    simRafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(simRafRef.current);
  }, []);

  // Cleanup dismiss RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(dismissRafRef.current);
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
      ref={overlayRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[60] cursor-pointer overflow-hidden bg-[#fbfaf5]"
      onClick={triggerDismiss}
      aria-label="Loading — click to enter"
      role="dialog"
      aria-modal="true"
    >
      {/* Full-screen Gray-Scott canvas — pixelated 1-bit */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Click-to-enter cue — centered, appears after pattern forms */}
      <AnimatePresence>
        {canDismiss && !dismissing && (
          <motion.p
            key="cue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.2em] uppercase text-zinc-500 select-none pointer-events-none mix-blend-multiply"
          >
            click to enter
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
