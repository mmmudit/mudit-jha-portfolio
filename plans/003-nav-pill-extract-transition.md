Title: Extract nav pill transition into CSS class and apply consistently
Plan-Id: 003
Status: DONE
Created-At: 2026-08-07
Git-Commit: 76c706e

## Summary

Move the floating nav pill's inline `transition` style into the `.nav-pill-transition` CSS helper (already added to `src/app/globals.css`) and apply the helper class to the pill element. This centralizes token usage and simplifies future token swaps.

## Files to change (exact)

- `src/components/NavigationTabs.tsx`

## Current code excerpt (evidence)

The pill is rendered as:

{indicator && (
<div
aria-hidden
className={clsx("absolute rounded-full backdrop-blur-sm shadow-md", TRANSITION_CLASS)}
style={{
        width: indicator.width,
        height: indicator.height,
        transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
        opacity: indicator.opacity,
        backgroundColor: WILLOW_HEX,
        border: `1px solid ${hexToRgba(WILLOW_HEX, 0.9)}`,
        pointerEvents: "none",
        transition: `transform var(--tabs-dur,250ms) var(--tabs-ease, cubic-bezier(0.22,1,0.36,1)), width var(--tabs-dur,250ms) var(--tabs-ease, cubic-bezier(0.22,1,0.36,1)), opacity var(--tabs-dur,250ms) var(--tabs-ease, cubic-bezier(0.22,1,0.36,1))`,
      }}
/>
)}

## Objective

Remove the inline `transition` style and instead apply the `.nav-pill-transition` class (which is token-backed) so the pill's transitions are controlled by CSS tokens and central tokens only.

## Target replacement (exact)

Replace the pill element with the following exact fragment (changes highlighted):

{indicator && (
<div
aria-hidden
className={clsx("absolute rounded-full backdrop-blur-sm shadow-md nav-pill-transition", TRANSITION_CLASS)}
style={{
        width: indicator.width,
        height: indicator.height,
        transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
        opacity: indicator.opacity,
        backgroundColor: WILLOW_HEX,
        border: `1px solid ${hexToRgba(WILLOW_HEX, 0.9)}`,
        pointerEvents: "none",
      }}
/>
)}

## Implementation notes

- `.nav-pill-transition` already exists in `src/app/globals.css` and uses `--tabs-dur`/`--tabs-ease` tokens.
- This change centralizes transition tuning. No runtime behavior change expected.

## Verification

1. Tab switches should animate identically as before (transform/width/opacity transition ~250ms).
2. Changing `--tabs-dur` in `:root` should immediately affect the pill animation.

## Time estimate

~10 minutes.
