# 001 — Audio Visualizer Physics, Interruptibility & Performance

- **Status**: DONE
- **Commit**: af0642c5
- **Severity**: HIGH
- **Category**: Interruptibility / Easing / Performance / Accessibility
- **Estimated scope**: 2 files (`src/components/PixelAudioVisualizer.tsx`, `src/components/about-music-section.tsx`)

## Problem

1. **Interruptibility Hitch**: In `src/components/about-music-section.tsx:264`, `AnimatePresence mode="wait"` unmounts the canvas when switching between cards, causing a ~200ms delay and canvas re-instantiation instead of seamless color and frequency retargeting.
2. **Robotic Linear Surge**: In `src/components/PixelAudioVisualizer.tsx:78`, the bottom-to-top surge advances linearly (`transitionProgress += transitionSpeed`), lacking deceleration at the apex.
3. **Missing Reduced Motion**: Rapid rAF spectrum movement ignores `prefers-reduced-motion: reduce`.
4. **Unthrottled Background Loop**: The canvas animation loop runs indefinitely even when the music section is scrolled completely off-screen.
5. **Linear Peak Decay**: Peak block indicators fall linearly without authentic audio gravity drop-off physics.

```tsx
/* src/components/about-music-section.tsx:264 — current */
<AnimatePresence mode="wait">
  {hoveredTrack ? (
    <motion.div key={hoveredTrack.id} ...>
      <PixelAudioVisualizer ... />
    </motion.div>
  ) : ...}
</AnimatePresence>
```

## Target

1. **Continuous Uninterrupted Canvas**: Keep a single persistent mounted `PixelAudioVisualizer` instance. When switching tracks, smoothly retarget colors and trigger the bottom-to-top surge without unmounting the canvas.
2. **Cubic Ease-Out Surge**: Apply `1 - Math.pow(1 - progress, 3)` easing to the vertical matrix reveal for responsive, punchy pop-ins.
3. **Reduced Motion Accessibility**: Check `window.matchMedia('(prefers-reduced-motion: reduce)')`; when enabled, render a calm, low-speed baseline spectrum with static heights.
4. **Viewport Performance**: Use an `IntersectionObserver` to pause the `requestAnimationFrame` loop when the visualizer is scrolled off-screen.
5. **Authentic Peak Drop Physics**: Peak indicators hold at the apex for 180ms before accelerating downward with exponential gravitational drop.
6. **Inertia Deceleration on Vinyl**: Vinyl disc rotation decelerates smoothly on unhover with rotational momentum instead of snapping to a halt.

## Steps

1. Update `src/components/PixelAudioVisualizer.tsx`:
   - Add `IntersectionObserver` to pause rAF loop when off-screen.
   - Implement `prefers-reduced-motion` detection.
   - Implement cubic ease-out calculation for the bottom-to-top matrix reveal: `easeOutProgress = 1 - Math.pow(1 - transitionProgress, 3)`.
   - Implement peak gravity hold & exponential drop.
   - Support dynamic color transitions.
2. Update `src/components/about-music-section.tsx`:
   - Keep the visualizer permanently mounted and update `active={!!hoveredTrack}` and target colors without `mode="wait"` canvas unmounting.
   - Add rotational momentum decay on vinyl unhover.

## Boundaries

- Do NOT alter other sections of the about page.
- Do NOT add external dependencies.
- Retain all current props and Spotify sync functionality.

## Verification

- **Mechanical**: `tsc --noEmit` and `npm run build` must pass with 0 errors.
- **Feel Check**:
  - Rapidly scrub mouse over adjacent album cards: visualizer colors and peaks must morph instantly with zero canvas flash or unmount stutter.
  - Hover on a card: pixel blocks surge upward with a snappy ease-out apex pop.
  - Enable `prefers-reduced-motion` in browser DevTools: animations settle into a calm, gentle baseline.
  - Scroll the page down: canvas rAF loop pauses when off-screen.
