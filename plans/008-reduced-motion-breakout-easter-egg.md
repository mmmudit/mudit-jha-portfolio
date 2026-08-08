# 008 — Add Reduced-Motion Accessibility to Breakout & Logo

- **Status**: DONE
- **Commit**: 2ea52a0
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`src/components/super-saiyan-breakout.tsx`, `src/components/tsu-logo.tsx`)

## Problem

In `src/components/super-saiyan-breakout.tsx` and `src/components/tsu-logo.tsx`, floating rock debris, earthquake vibration, and particle sparks do not query `useReducedMotion()` from `framer-motion`. When a user has `prefers-reduced-motion: reduce` enabled in system preferences, rapid shaking and full-screen motion still fire.

```tsx
/* src/components/super-saiyan-breakout.tsx:21 — current */
useEffect(() => {
  if (isBreakout) {
    document.body.classList.add("super-saiyan-active");
  }
}, [isBreakout]);
```

## Target

Import `useReducedMotion()` from `framer-motion` in `super-saiyan-breakout.tsx` and `tsu-logo.tsx`. When reduced motion is preferred:
- Disable body earthquake shake class.
- Replace particle position travel (`y: ["115vh", "-25vh"]`) with subtle opacity fades (`opacity: [0, 0.8, 0]`).
- Disable micro-vibration on logo container.

```tsx
/* target */
const shouldReduceMotion = useReducedMotion();
```

## Repo conventions to follow

- `useReducedMotion()` hook from `framer-motion`.
- Exemplar: `src/components/header.tsx:11` and `src/components/PageTransition.tsx:8`.

## Steps

1. In `src/components/super-saiyan-breakout.tsx`, import `useReducedMotion` and skip adding `super-saiyan-active` class to `document.body` if reduced motion is enabled.
2. In `src/components/tsu-logo.tsx`, import `useReducedMotion` and disable vibration shake transforms when reduced motion is enabled.

## Boundaries

- Do NOT remove the breakout easter egg functional logic.
- Do NOT disable static visual feedback (gold aura color change, text rotation).

## Verification

- **Mechanical**: Run `npm run build` to verify clean compilation.
- **Feel check**: Enable `prefers-reduced-motion` in DevTools Rendering panel, trigger breakout mode, verify screen does not shake violently and particle travel is replaced with gentle fading feedback.
- **Done when**: `useReducedMotion()` gates motion intensity across breakout and logo components.
