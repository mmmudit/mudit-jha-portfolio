# 006 — Live Clock Status Breathing Pulse Animation

- **Status**: DONE
- **Commit**: 638e560
- **Severity**: LOW
- **Category**: Missed Opportunities & Cohesion
- **Estimated scope**: 2 files (`src/components/live-clock.tsx`, `src/app/globals.css`)

## Problem

In `src/components/live-clock.tsx:26-28`, the status indicator dot representing live time in Minneapolis is static green:

```tsx
/* src/components/live-clock.tsx:26-28 — current */
<span className="mr-2 inline-flex size-3 items-center justify-center">
  <span className="size-1.5 rounded-full bg-status-green" />
</span>
```

Per AUDIT.md Category 8 (Missed Opportunities), a static green dot alongside a live running digital clock feels static. A subtle CSS breathing pulse ring (`green-pulse-ring`) visually communicates active real-time status without distracting from content.

## Target

1. Add a hardware-accelerated keyframe animation `@keyframes statusPulse` and `.green-pulse-ring` utility class in `src/app/globals.css`:

```css
/* target — src/app/globals.css */
@keyframes statusPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.8);
    opacity: 0;
  }
  100% {
    transform: scale(0.95);
    opacity: 0;
  }
}

.green-pulse-ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background-color: var(--status-green);
  animation: statusPulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .green-pulse-ring {
    animation: none !important;
    display: none !important;
  }
}
```

2. Update `src/components/live-clock.tsx` to include the relative container and pulse ring element:

```tsx
/* target — src/components/live-clock.tsx */
<span className="relative mr-2 inline-flex size-3 items-center justify-center">
  <span className="green-pulse-ring" aria-hidden="true" />
  <span className="relative size-1.5 rounded-full bg-status-green" />
</span>
```

## Repo Conventions to Follow

- Keyframes in `src/app/globals.css` use cubic-bezier curves matching `--ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1)`.
- Status green uses `var(--status-green)` (`#31b564`).

## Steps

1. Open `src/app/globals.css`.
2. Append `@keyframes statusPulse` and `.green-pulse-ring` to the bottom of `globals.css`.
3. Open `src/components/live-clock.tsx`.
4. Update lines 26–28 to add `<span className="green-pulse-ring" aria-hidden="true" />`.
5. Save both files.

## Boundaries

- Do NOT alter clock formatting logic or time update intervals in `live-clock.tsx`.
- Do NOT change text styling or font classes.

## Verification

- **Mechanical**: Run `npm run build` and ensure zero build warnings or errors.
- **Feel check**:
  - View footer live clock — observe smooth, gentle breathing pulse around the green dot.
  - Enable `prefers-reduced-motion: reduce` in DevTools — verify pulse ring is hidden and solid green dot remains static.
- **Done when**: Live clock green dot has a subtle pulse ring and `npm run build` succeeds.
