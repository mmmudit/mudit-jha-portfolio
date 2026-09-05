# 014 — Voxel Globe Reduced-Motion Accessibility

- **Status**: DONE
- **Commit**: 65137949
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`src/components/hero/VoxelGlobeHero.tsx`, `src/app/prototypes/voxel-globe/page.tsx`)

## Problem

`VoxelGlobeHero.tsx` and `UploadedCloudVoxelCanvas` run continuous 3D rotation, sliding cloud parallax, and perspective camera tracking without querying `prefers-reduced-motion`. Users with vestibular motion sensitivities have no way to pause the continuous movement:

```typescript
/* src/components/hero/VoxelGlobeHero.tsx:300 — current */
const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  // Continuous auto-rotation and parallax drift run unconditionally
  globeGroup.rotation.y += velocity.y;
  fgCloudGroup.position.x = Math.sin(elapsedTime * 0.3) * 0.6 * pFactor;
};
```

## Target

Detect `window.matchMedia("(prefers-reduced-motion: reduce)")`. When reduced motion is preferred:

1. Disable automatic globe spin (`autoRotate = false`).
2. Lock cloud groups to static zero offset (`fgCloudGroup.position.set(0, 0, 0)`).
3. Freeze camera position to default `(22, 18, 22)` without mouse perspective tracking.
4. Render the scene once (or on user drag only) to conserve energy and respect user motion preferences.

```typescript
/* target */
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const prefersReduced = mediaQuery.matches;

if (prefersReduced) {
  globeGroup.rotation.y = 0.4; // Fixed initial aesthetic angle
  fgCloudGroup.position.set(0, 0, 0);
  bgSkyGroup.position.set(0, 0, 0);
  renderer.render(scene, camera);
  return; // Skip continuous rAF loop
}
```

## Repo Conventions to Follow

- `useReducedMotion()` from `framer-motion` in React UI components (`src/components/intro.tsx`).
- `window.matchMedia("(prefers-reduced-motion: reduce)")` for standalone WebGL / Three.js canvas contexts.

## Steps

1. In `src/components/hero/VoxelGlobeHero.tsx`:
   - Query `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
   - If `prefersReduced` is true, render static initial frame and bypass continuous `rAF` loop unless actively dragged by user.
   - Listen to `change` event on media query to reactively start/stop motion if OS preference changes.
2. In `src/app/prototypes/voxel-globe/page.tsx`:
   - Add identical `prefers-reduced-motion` check in `UploadedCloudVoxelCanvas`.

## Boundaries

- Do NOT remove user manual drag rotation capabilities.
- Do NOT alter standard motion when `prefers-reduced-motion` is disabled (`no-preference`).

## Verification

- **Mechanical**: Run `npx tsc --noEmit` and verify 0 errors.
- **Accessibility check**:
  - Open Chrome DevTools -> Rendering panel.
  - Enable `Emulate CSS media feature prefers-reduced-motion: reduce`.
  - Confirm globe auto-spin stops immediately.
  - Confirm cloud parallax drift stops.
  - Disable emulation and verify smooth animation resumes.
- **Done when**: `VoxelGlobeHero` renders static aesthetic scene when `prefers-reduced-motion` is active.
