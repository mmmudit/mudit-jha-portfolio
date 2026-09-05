# Animation Improvement Plans

| Plan | Title | Severity | Status | Dependencies |
|---|---|---|---|---|
| [001](001-audio-visualizer-improvements.md) | Audio Visualizer Physics, Interruptibility & Performance | HIGH | DONE | None |
| [013](013-voxel-globe-gc-and-frame-budget.md) | Eliminate Voxel Globe GC Thrashing & Frame-Budget Allocations | HIGH | DONE | None |
| [014](014-voxel-globe-reduced-motion-accessibility.md) | Voxel Globe Reduced-Motion Accessibility | MEDIUM | DONE | None |
| [015](015-voxel-globe-organic-cloud-breathe-and-hover-easing.md) | Voxel Globe Organic Cloud Breathing & Hover Easing | LOW | DONE | 013 |

## Recommended Execution Order

1. **013-voxel-globe-gc-and-frame-budget.md** — Pre-allocate Vector3 & Material arrays to eliminate 15,000+ objects/sec GC thrashing in render loop.
2. **014-voxel-globe-reduced-motion-accessibility.md** — Add `prefers-reduced-motion` detection to pause auto-rotation & parallax drift for vestibular accessibility.
3. **015-voxel-globe-organic-cloud-breathe-and-hover-easing.md** — Add `cubic-bezier(0.23, 1, 0.32, 1)` hover easing and per-cloud organic sine breathing.

