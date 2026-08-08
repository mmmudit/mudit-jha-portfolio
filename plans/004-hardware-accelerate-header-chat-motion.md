# 004 — Hardware Accelerate Header Chat Button Motion

- **Status**: DONE
- **Commit**: 638e560
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/header.tsx`)

## Problem

In `src/components/header.tsx:67-75`, Framer Motion uses main-thread shorthand props (`x` and `scale`):

```tsx
/* src/components/header.tsx:67-75 — current */
animate={
  reduce
    ? {}
    : {
      x: hover ? 0 : 8,
      filter: hover ? "blur(0px)" : "blur(16px)",
      opacity: hover ? 1 : 0,
      scale: hover ? 1 : 0.96,
    }
}
```

Framer Motion's `x` and `scale` shorthand props execute on the main thread via `requestAnimationFrame` instead of hardware-accelerated GPU compositor layers. When the main thread is busy during page transitions or rendering, these animations drop frames. Per AUDIT.md Category 5, transform animations should use full CSS `transform` strings (`transform: "translateX(...) scale(...)"`).

## Target

Replace shorthand `x` and `scale` props with hardware-accelerated `transform` strings in `src/components/header.tsx`:

```tsx
/* target */
animate={
  reduce
    ? {}
    : {
      transform: hover
        ? "translateX(0px) scale(1)"
        : "translateX(8px) scale(0.96)",
      filter: hover ? "blur(0px)" : "blur(16px)",
      opacity: hover ? 1 : 0,
    }
}
```

## Repo Conventions to Follow

- `src/components/header.tsx` uses `useReducedMotion()` from `framer-motion` to disable transforms when `prefers-reduced-motion: reduce` is active.
- Curves and durations use cubic-bezier `[0.22, 1, 0.36, 1]` with duration `0.24s`.

## Steps

1. Open `src/components/header.tsx`.
2. Locate lines 67–75 inside the `motion.span` text element:
   - Replace `x: hover ? 0 : 8` and `scale: hover ? 1 : 0.96` with `transform: hover ? "translateX(0px) scale(1)" : "translateX(8px) scale(0.96)"`.
3. Save `src/components/header.tsx`.

## Boundaries

- Do NOT touch the width, background color, or icon rotation animations.
- Do NOT change the layout structure or sticky header positioning.
- Do NOT add new npm dependencies.

## Verification

- **Mechanical**: Run `npm run build` and ensure TypeScript and Next.js build pass without errors.
- **Feel check**:
  - Hover over the "let's chat" button in the header.
  - In Chrome DevTools, open the Animations panel, set speed to 10%, and confirm smooth GPU rendering without main-thread jank.
  - Toggle `prefers-reduced-motion: reduce` in DevTools Rendering panel and confirm transform motion is skipped.
- **Done when**: `npm run build` succeeds and the text entrance uses hardware-accelerated `transform` strings.
