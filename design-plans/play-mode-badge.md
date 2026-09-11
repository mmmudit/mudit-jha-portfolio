# Play mode badge refinement

**Status:** selected for implementation  
**Audited commit:** `63ba0edfae00a5786c827c0bbcf1c8eba6ea2503`  
**Surface:** `/play` interactive canvas mode  
**Owner:** `src/app/play/play-client.tsx` — the portaled canvas branch renders the floating gallery-mode badge.

## Intent

Make the icon-first control feel native to the portfolio's tactile-paper system: compact at rest, clearly actionable on hover or keyboard focus, with stronger label hierarchy and one deliberate accent state. Keep its existing action, location, and icon-first interaction model unchanged.

## Evidence

- `DESIGN.md` defines the Play surface's governing visual language: warm Dough material, Zinc 300 borders, a floating-pill shadow, and the Geist Mono HUD-label style (uppercase, weight 400, tight tracking).
- `DESIGN.md` reserves Willow Grey for active-state highlights and interactive focus, and explicitly prohibits animating non-GPU layout properties such as `width`.
- The rendered owner in `src/app/play/play-client.tsx` currently animates `width` from `44` to `196`; its visible label is `font-mono text-xs font-medium` in sentence case and neutral Zinc, so it does not use either documented treatment.

## Required implementation

Edit only `src/app/play/play-client.tsx`, inside the `viewMode === "canvas"` portal branch.

1. Preserve the outer 44px button as the stable hit target and remove `animate={{ width: ... }}` from the `motion.button`.
2. Keep the existing hover/focus state (`isModeControlExpanded`) and `AnimatePresence` behavior, but make the expanding visual panel a separately positioned child. Animate only composited properties:
   - panel: `opacity`, `transform: scaleX(...)`, and optionally `filter`;
   - label and icon: `opacity`, `transform`, and `filter`.
   Use a left transform origin so the surface grows outward from the icon rather than reflowing the page.
3. At rest, retain the Dough translucent material (`bg-[#fbfaf5]/90`), Zinc 300 stroke, current floating-pill shadow, and pointer icon. On hover/focus, apply Willow Grey as the panel's active/focus background, retain a subtle Zinc/Dough-compatible border, and swap to the existing `Grid3X3` icon. Do not introduce another accent color.
4. Change only the visible label styling to the documented HUD treatment: `font-mono`, `text-[11px]`, `font-normal`, `uppercase`, and `tracking-tight`. Keep the existing copy, “Switch to Gallery View,” and the existing accessible name unchanged.
5. Retain the existing `active:scale-95`, focus-visible ring, sound hook, click behavior, and 300ms-or-less spring timing. Do not alter the gallery-mode switcher or the canvas content.

## Acceptance checks

- Hover and keyboard focus reveal a Willow Grey visual panel and the gallery label without layout-width animation.
- The compact state remains a 44px icon-only control.
- The expanded label reads as a compact mono HUD label, is uppercase, and uses the existing copy.
- Clicking still switches to gallery view; the gallery-to-canvas control is unchanged.
- `npx tsc --noEmit` and `git diff --check` pass.
