# 005 — Project Card Hover Conflict and Reduced Motion

- **Status**: DONE
- **Commit**: 638e560
- **Severity**: MEDIUM
- **Category**: Accessibility & Physicality
- **Estimated scope**: 2 files (`src/components/project-card.tsx`, `src/app/globals.css`)

## Problem

1. In `src/app/globals.css:80-83`, `.project-card:hover` applies `transform: translateY(-4px)`:

```css
/* src/app/globals.css:80-83 — current */
@media (hover: hover) and (pointer: fine) {
  .project-card:hover {
    transform: translateY(-4px);
  }
}
```

This CSS rule conflicts with the inline Tailwind scale transitions on `ProjectCard` in `src/components/project-card.tsx:38` (`group-hover:scale-[0.99]`), resulting in double transformation artifacts.

2. In `src/components/project-card.tsx:38, 53`, card hover transitions do not include `motion-reduce:transition-none motion-reduce:transform-none` or pointer fine gating:

```tsx
/* src/components/project-card.tsx:38 — current */
className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-300 ease-out group-hover:scale-[0.99] active:scale-[0.97]"
```

On touch devices, `group-hover:scale-[0.99]` gets stuck on tap. Users with `prefers-reduced-motion: reduce` still experience scaling animations.

## Target

1. Remove the conflicting `.project-card:hover { transform: translateY(-4px); }` from `src/app/globals.css`.
2. Add `@media (hover: hover) and (pointer: fine)` hover gating and `motion-reduce:transition-none motion-reduce:transform-none` utility classes to `src/components/project-card.tsx`:

```tsx
/* src/components/project-card.tsx — target */
className="content-stretch flex flex-col items-start justify-end overflow-hidden relative rounded-[26px] shrink-0 w-full transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[0.99] active:scale-[0.97] motion-reduce:transition-none motion-reduce:transform-none"
```

## Repo Conventions to Follow

- Reduced motion is handled via `motion-reduce:*` utility classes in Tailwind or `@media (prefers-reduced-motion: reduce)` in `src/app/globals.css`.
- Fine pointer hover Gating uses `[@media(hover:hover)]:...` in Tailwind or `@media (hover: hover) and (pointer: fine)` in CSS.

## Steps

1. Open `src/app/globals.css`.
2. Delete the `.project-card:hover` rule (lines 79–83). Keep `.project-card:active` and `@media (prefers-reduced-motion: reduce)` rules intact.
3. Open `src/components/project-card.tsx`.
4. Update line 38 media container `className` to include `[@media(hover:hover)]:group-hover:scale-[0.99]` and `motion-reduce:transition-none motion-reduce:transform-none`.
5. Update line 53 image `className` to include `[@media(hover:hover)]:group-hover:scale-[1.02]` and `motion-reduce:transition-none motion-reduce:transform-none`.
6. Save both files.

## Boundaries

- Do NOT change the rounded corner radius (`rounded-[26px]`) or aspect ratio (`aspect-[678/367.625]`).
- Do NOT alter card typography or mobile layout structure.

## Verification

- **Mechanical**: Run `npm run build` to confirm zero build errors.
- **Feel check**:
  - Hover over a project card on desktop — verify smooth `scale(0.99)` transition without vertical jump.
  - In DevTools, switch to iPhone touch emulation — tap a card and verify no sticky hover state remains after tapping.
  - Turn on `prefers-reduced-motion: reduce` in DevTools Rendering panel — confirm hover scaling is disabled while press feedback remains subtle.
- **Done when**: Touch devices do not retain hover state, reduced-motion disables scale shifts, and `npm run build` succeeds.
