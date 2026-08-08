# 007 — Hardware-Accelerate Breakout Particle Motion

- **Status**: DONE
- **Commit**: 2ea52a0
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/super-saiyan-breakout.tsx`)

## Problem

In `src/components/super-saiyan-breakout.tsx`, Framer Motion shorthand props (`y`, `scale`, `rotate`) are used to animate multiple floating rock debris items and energy spark icons:

```tsx
/* src/components/super-saiyan-breakout.tsx:57 — current */
<motion.div
  animate={{
    y: ["115vh", "-25vh"],
    rotate: [0, idx % 2 === 0 ? 360 : -360],
    opacity: [0, 0.95, 0.95, 0],
  }}
  ...
/>
```

As specified in AUDIT.md Rule 5, Framer Motion `y`, `scale`, and `rotate` shorthands update inline styles on the main thread every frame, causing dropped frames during high-particle scenes.

## Target

Replace shorthand `y`, `scale`, and `rotate` props with hardware-accelerated `transform` strings (`transform: "translate3d(0, -115vh, 0) rotate(360deg)"`) so animation runs on GPU compositor threads.

```tsx
/* target */
<motion.div
  animate={{
    transform: [
      "translate3d(0, 115vh, 0) rotate(0deg)",
      "translate3d(0, -25vh, 0) rotate(360deg)",
    ],
    opacity: [0, 0.95, 0.95, 0],
  }}
  ...
/>
```

## Repo conventions to follow

- Hardware-accelerated transform strings in Framer Motion (`transform: "translate3d(...)"`).
- Exemplar: `src/components/header.tsx` Plan 004 implementation.

## Steps

1. In `src/components/super-saiyan-breakout.tsx`, update the rock debris `<motion.div>` `animate` prop to use explicit `transform` strings with `translate3d` and `rotate`.
2. Update the energy spark `<motion.div>` `animate` prop to use explicit `transform` strings with `translate3d`, `scale`, and `rotate`.

## Boundaries

- Do NOT change component layout or rock/spark SVG graphics.
- Do NOT remove particle count or delay timing.

## Verification

- **Mechanical**: Run `npm run build` to confirm zero TypeScript compilation errors.
- **Feel check**: Trigger 3-second hold breakout mode, verify GPU framerate in Chrome Performance tab remains locked at 60/120fps with zero layout thrashing.
- **Done when**: All particle animations in `super-saiyan-breakout.tsx` use hardware-accelerated `transform` strings.
