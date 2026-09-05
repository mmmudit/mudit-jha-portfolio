# 015 — Voxel Globe Organic Cloud Breathing & Hover Easing

- **Status**: DONE
- **Commit**: 65137949
- **Severity**: LOW
- **Category**: Physicality & Cohesion
- **Estimated scope**: 2 files (`src/components/live-clock.tsx`, `src/components/hero/VoxelGlobeHero.tsx`)

## Problem

1. In `src/components/live-clock.tsx:128`, the hover container uses un-tokenized default transition timing:

```tsx
/* src/components/live-clock.tsx:128 — current */
<div className="scale-[0.85] origin-left md:scale-100 md:origin-center transition-transform duration-300">
  <VoxelGlobeHero size={300} className="group-hover:scale-[1.03] transition-transform duration-300" />
</div>
```

`transition-transform duration-300` uses default browser linear-ish `ease` instead of the project's signature `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`), making hover scale feel slightly sluggish.

2. In `VoxelGlobeHero.tsx`, the 12 cloud sprites translate as rigid parent groups (`fgCloudGroup`, `bgSkyGroup`). Individual clouds lack per-sprite organic float offset, making the sky feel slightly stiff.

## Target

1. Apply tokenized `cubic-bezier(0.23, 1, 0.32, 1)` easing and `200ms` duration to `LiveClock.tsx` hover transition:

```tsx
/* target */
<div className="scale-[0.85] origin-center md:scale-100 origin-center transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform">
  <VoxelGlobeHero size={300} className="group-hover:scale-[1.025] transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]" />
</div>
```

2. Add per-sprite subtle vertical sine-wave breathing in `VoxelGlobeHero.tsx`:

```typescript
/* target */
fgSprites.forEach((sprite, idx) => {
  sprite.position.y = baseFgPositions[idx].y + Math.sin(elapsedTime * 0.6 + idx * 1.2) * 0.25;
});
```

## Repo Conventions to Follow

- Signature UI easing token: `cubic-bezier(0.23, 1, 0.32, 1)` used across navigation pills, dropdowns, and cards.
- Fast response duration: `200ms` for hover feedback.

## Steps

1. In `src/components/live-clock.tsx`:
   - Update `LiveClock` header variant container class to `transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform`.
   - Ensure `origin-center` is used for both mobile and desktop scale containers.
2. In `src/components/hero/VoxelGlobeHero.tsx`:
   - Store initial sprite base positions.
   - In `animate()`, apply subtle individual sine offset `Math.sin(elapsedTime * 0.6 + idx * 1.2) * 0.25` to each sprite for fluid organic breathing.

## Boundaries

- Do NOT increase cloud movement distance beyond 0.3 units.
- Do NOT alter mouse drag velocity or solar orientation controls.

## Verification

- **Mechanical**: Run `npx tsc --noEmit` and confirm 0 errors.
- **Feel check**:
  - Hover mouse over the header live clock globe. Confirm globe scales up instantly with snappy 200ms `cubic-bezier(0.23, 1, 0.32, 1)` feedback.
  - Observe the clouds surrounding the globe: confirm individual clouds gently breathe vertically with subtle phase offsets.
- **Done when**: Live clock hover uses `cubic-bezier(0.23, 1, 0.32, 1)` easing and cloud sprites exhibit organic per-cloud breathing physics.
