# Plan 007: Project Card Staggered Grid Reveal

## Commit Baseline
`HEAD`

## Target Files
- `src/components/project-card.tsx`
- `src/app/globals.css`

## Problem & Finding
In `src/components/project-card.tsx`, each `ProjectCard` receives an `animationDelay` prop (e.g. `0ms`, `60ms`, `120ms`), but no entry `@keyframes` or CSS animation rules are attached. As a result, project cards load abruptly on initial render without cascading stagger entry.

## Objective
Add a hardware-accelerated CSS stagger reveal (`translateY(12px)` + `opacity: 0` -> `translateY(0)` + `opacity: 1`) using the `--ease-out` token `cubic-bezier(0.23, 1, 0.32, 1)` over 250ms with `animationDelay` stagger.

## Proposed Changes

### `src/app/globals.css`
Add `@keyframes cardReveal` and `.project-card-reveal` utility class:

```css
@keyframes cardReveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-card-reveal {
  animation: cardReveal 250ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .project-card-reveal {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### `src/components/project-card.tsx`
Attach `project-card-reveal` to the outer link element and apply `animationDelay` via style:

```tsx
<Link
  href={href}
  className="project-card project-card-reveal pressable group relative flex flex-col gap-3 items-start w-full cursor-pointer text-left focus-visible:outline-none"
  style={{ animationDelay: `${animationDelay}ms` }}
>
```

## Verification Plan

### Manual & Feel Check
1. Open the homepage `/` in browser.
2. Refresh page to verify cards enter smoothly in cascading pairs (0ms, 60ms, 120ms delays).
3. Slow motion check: verify cards move upwards by 12px over 250ms with `ease-out` curve.
4. Reduced motion check: verify no vertical translation occurs when `prefers-reduced-motion: reduce` is active.
