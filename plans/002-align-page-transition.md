Title: Align `PageTransition` to motion tokens and reduced-motion
Plan-Id: 002
Status: DONE
Created-At: 2026-08-07
Git-Commit: 76c706e

## Summary

Ensure the route/page transition uses the repo's motion tokens (`--page-slide-dur`, `--page-slide-distance`, `--page-slide-ease`) and respects reduced-motion preferences. Replace magic numbers with token-driven values and keep a short fade for reduced-motion.

## Files to change (exact)

- `src/components/PageTransition.tsx`

## Current code excerpt (evidence)

Current `motion.div` props (commit 76c706e):

<motion.div
key={pathname}
initial={{ opacity: 0, y: reduce ? 0 : 8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: reduce ? 0 : -8 }}
transition={
reduce
? { duration: 0.12 }
: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
}

>

## Objective

Replace literal numbers with the exact token values and explicit cubic-bezier from tokens, and ensure the reduced-motion fallback is an explicit short fade (duration `--duration-quick` = `150ms`).

## Target replacement (exact snippet)

Replace the `transition` and `initial`/`exit` y-values with the following (exact code to insert):

const pageDistance = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--page-slide-distance')) || 8;
const pageDur = getComputedStyle(document.documentElement).getPropertyValue('--page-slide-dur') || '250ms';
const pageEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

<motion.div
key={pathname}
initial={{ opacity: 0, y: reduce ? 0 : pageDistance }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: reduce ? 0 : -pageDistance }}
transition={
reduce
? { duration: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-quick'))/1000 || 0.15 }
: { duration: parseFloat(pageDur)/1000 || 0.25, ease: [0.22, 1, 0.36, 1] }
}

>

## Implementation notes

- Use plain JS expressions to read CSS token values where necessary; fallback to numeric literals if reading fails.
- Keep `useReducedMotion()` check to switch to the short fade.
- Ensure the `ease` value is the token `--page-slide-ease` if provided; otherwise inline `cubic-bezier(0.22, 1, 0.36, 1)` exactly.

## Verification

1. Navigate between top-level routes; transition duration should feel ~250ms and move ~8px.
2. Toggle `prefers-reduced-motion` — transitions should become a short 150ms fade with no y-translation.

## Time estimate

~15–30 minutes to implement and verify.
