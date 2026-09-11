# 016 — Center the Play mode badge at the canvas hero

- **Status**: TODO
- **Commit**: `63ba0edf`
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files (`src/app/play/play-client.tsx`, `src/components/DragCanvas.tsx`)

## Problem

The Play mode badge is fixed above the canvas in `src/app/play/play-client.tsx:79-135`, rather than occupying the existing badge position directly above the canvas header text. Its surface also scales from the left and non-uniformly along the x-axis:

```tsx
/* src/app/play/play-client.tsx:96-104 — current */
animate={{
  backgroundColor: isModeControlExpanded ? "var(--willow-grey)" : "rgba(251, 250, 245, 0.9)",
  borderColor: isModeControlExpanded ? "rgba(71, 88, 92, 0.28)" : "rgba(212, 212, 216, 0.9)",
  scaleX: isModeControlExpanded ? 1 : 44 / 196,
}}
transition={{ type: "spring", duration: 0.25, bounce: 0 }}
className="absolute inset-0 z-0 w-[196px] origin-left rounded-full border ..."
```

That origin makes the pill open to the right. Non-uniformly scaling the 196px rounded pill also prevents its 44px resting shape from retaining a true circular perimeter. The existing 44px verified icon directly above the canvas heading is rendered in `src/components/DragCanvas.tsx:490-504`, but `DragCanvas` has no slot for the mode badge.

## Target

Replace only the existing verified icon above `Mudit's Playground` in the canvas hero with the interactive mode badge. Do not show a duplicate fixed badge above the canvas.

At rest, the badge must be a visible 44px × 44px circle with its own continuous circular 1px border and the `MousePointer2` icon centered inside it. On hover or keyboard focus, it must expand symmetrically from that center into a 196px pill, then center the icon-and-label group within the expanded pill. It must not animate `width`, `height`, `top`, `left`, margin, or padding.

Use these exact motion values:

```tsx
/* expanded surface */
animate={{
  opacity: isExpanded ? 1 : 0,
  transform: isExpanded ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0.88)",
}}
transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}

/* compact circle */
animate={{ opacity: isExpanded ? 0 : 1, transform: "scale(1)" }}
transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}

/* contextual icon swap */
initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
transition={{ type: "spring", duration: 0.3, bounce: 0 }}
```

Use the project tokens already applied by the current badge: Dough `rgba(251, 250, 245, 0.9)` at rest, Willow Grey (`var(--willow-grey)`) when expanded, Zinc/Rust-derived text, the existing floating-pill shadow, and `rounded-full`. Keep the current accessible name and gallery-switch behavior.

## Repo conventions to follow

- `src/components/DragCanvas.tsx:479-524` owns the centered canvas hero and its icon slot; it already uses a pointer-events-none hero wrapper with a pointer-events-auto badge child.
- `src/components/DragCanvas.tsx:245` uses Framer Motion's `useReducedMotion`; pass the result to the new badge so reduced motion keeps opacity/color/icon changes but does not scale or translate the pill.
- `src/components/dynamic-island-nav.tsx:41-65` uses `AnimatePresence initial={false}` with Framer Motion for a stateful pill, matching the project dependency and preventing a mount animation.
- `DESIGN.md` limits UI micro-interactions to 300ms and prohibits layout-property animation.

## Steps

1. In `src/components/DragCanvas.tsx`, add an optional `centerHeroBadge?: React.ReactNode` prop to `DragCanvasProps`, destructure it in `DragCanvas`, and retain the existing verified icon as the fallback when that prop is absent.
2. At `src/components/DragCanvas.tsx:490-504`, replace the hard-coded verified icon wrapper with `{centerHeroBadge ?? <ExistingVerifiedBadgeMarkup />}`. Preserve the current wrapper's position, `mb-3`, and `pointer-events-auto` behavior so the supplied control occupies exactly the icon-above-heading location. Do not change the hero title or subtitle.
3. In `src/app/play/play-client.tsx`, extract the current mode switcher into a local `CanvasModeBadge` component and pass it as `centerHeroBadge` to `DragCanvas`. Remove the fixed wrapper at `src/app/play/play-client.tsx:79-135` so only the hero-positioned control remains.
4. Make `CanvasModeBadge` a `relative size-11` button. Render two independent visual surfaces centered on the same point:
   - A 44px `rounded-full` compact circle with the border, Dough surface, and shadow. It must remain visible while collapsed; do not obtain the circle by compressing a 196px pill.
   - A 196px `rounded-full` expanded surface positioned with `left-1/2 -translate-x-1/2 origin-center`. Fade and transform this surface from its center only. Keep the border and shadow on this expanded surface.
5. Put the icon-and-label group in a 196px centered flex layer. With the label absent, `MousePointer2` is centered over the compact circle. When expanded, the group remains centered as `Grid3X3` crossfades in and the existing `Switch to Gallery View` label appears. Use `AnimatePresence initial={false}` and the exact contextual icon transition above.
6. Set the button's press feedback to `active:scale-[0.96] transition-transform duration-150 ease-out`. Keep `focus-visible` styling, `data-cuelume-*` hooks, sound hook, click behavior, and `aria-label` unchanged.
7. Branch animated transforms using the `useReducedMotion()` result supplied by `DragCanvas`: under reduced motion, use `transform: "translateX(-50%)"` for the expanded surface and preserve only the 150–200ms opacity/color response. Do not remove the icon or label state cue.

## Boundaries

- Do NOT change the gallery grid header badge at `src/app/play/play-client.tsx:154-179`.
- Do NOT change the canvas cards, drag physics, canvas HUD flag, title, subtitle, route behavior, or data loading.
- Do NOT add dependencies or create a shared primitive.
- Do NOT animate layout properties, use `transition: all`, or leave a second fixed mode badge on screen.
- If the exact hero-icon owner has moved since commit `63ba0edf`, stop and report the drift instead of guessing.

## Verification

- **Mechanical**: run `npx tsc --noEmit` and `git diff --check`; both must exit successfully.
- **Feel check**:
  - Open `/play` in canvas mode. Confirm the mode badge appears only where the verified icon previously sat, directly above `Mudit's Playground`.
  - At rest, inspect the outline at 10% speed in DevTools Animations: it must remain a continuous 44px circle, not a compressed rounded rectangle.
  - Hover or focus the badge: the pill must reveal evenly left and right from the icon center; the icon-and-label group must end visually centered in the 196px pill.
  - Move the pointer in and out repeatedly: each transition should retarget cleanly without a restart or a duplicate surface.
  - Enable `prefers-reduced-motion`: confirm the gallery state is still conveyed through Willow Grey, the icon swap, and label, while spatial scale/translation is absent.
- **Done when**: the one canvas-hero badge has a circular compact border, expands symmetrically from its center, and retains the existing gallery action.
