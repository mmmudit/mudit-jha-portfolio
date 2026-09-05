# 013 — Eliminate Voxel Globe GC Thrashing & Frame-Budget Allocations

- **Status**: DONE
- **Commit**: 65137949
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 2 files (`src/components/hero/VoxelGlobeHero.tsx`, `src/app/prototypes/voxel-globe/page.tsx`)

## Problem

Inside `VoxelGlobeHero.tsx:324` and `page.tsx:392`, the `animate()` render loop runs at 60–120fps. On every single frame, `voxelNodes.forEach()` iterates over 250+ voxel nodes and creates new heap allocations:

```typescript
/* src/components/hero/VoxelGlobeHero.tsx:324 — current */
voxelNodes.forEach((node) => {
  const normalWorld = new THREE.Vector3(node.data.normalX, node.data.normalY, node.data.normalZ)
    .applyEuler(globeGroup.rotation)
    .normalize();

  const dot = normalWorld.dot(sunDir);
  if (dot > 0.0) {
    node.mesh.material = node.originalMat;
  } else {
    node.mesh.material = [nightSideMat, nightSideMat, nightTopMat, nightTopMat, nightSideMat, nightSideMat];
  }
});
```

This creates over 15,000 `THREE.Vector3` objects and 9,000 Array instances per second. Garbage collection (GC) pauses occur regularly, dropping frame rates from 60fps to 40fps during user mouse drag and scroll interactions.

## Target

Pre-allocate a single reusable `THREE.Vector3` vector (`tempNormal`) and a frozen constant array reference (`NIGHT_MAT_LIST`) outside the `animate()` loop:

```typescript
/* target */
const NIGHT_MAT_LIST = [nightSideMat, nightSideMat, nightTopMat, nightTopMat, nightSideMat, nightSideMat];
const tempNormal = new THREE.Vector3();

// Inside animate():
voxelNodes.forEach((node) => {
  tempNormal.set(node.data.normalX, node.data.normalY, node.data.normalZ)
    .applyEuler(globeGroup.rotation)
    .normalize();

  const dot = tempNormal.dot(sunDir);
  node.mesh.material = dot > 0.0 ? node.originalMat : NIGHT_MAT_LIST;
});
```

Zero object allocations per frame.

## Repo Conventions to Follow

- Three.js vector reuse pattern across canvas components (`tempVector = new THREE.Vector3()`).
- Shared material array constants declared at module/component initialization scope.

## Steps

1. In `src/components/hero/VoxelGlobeHero.tsx`:
   - Declare `const tempNormal = new THREE.Vector3();` and `const NIGHT_MAT_LIST = [nightSideMat, nightSideMat, nightTopMat, nightTopMat, nightSideMat, nightSideMat];` before `animate()`.
   - Update `voxelNodes.forEach()` to reuse `tempNormal` and `NIGHT_MAT_LIST`.
2. In `src/app/prototypes/voxel-globe/page.tsx`:
   - Declare `tempNormal` and `NIGHT_MAT_LIST` in `UploadedCloudVoxelCanvas`.
   - Update `voxelNodes.forEach()` to reuse `tempNormal` and `NIGHT_MAT_LIST`.

## Boundaries

- Do NOT change voxel grid generation logic or cube geometry.
- Do NOT alter solar lighting angle calculations.

## Verification

- **Mechanical**: Run `npx tsc --noEmit` and confirm code 0.
- **Feel check**:
  - Open Chrome DevTools -> Performance tab.
  - Record 5 seconds of continuous globe rotation and mouse dragging.
  - Inspect JS Heap timeline: confirm zero saw-tooth GC allocation spikes from `Vector3` or `Array` creation.
  - Confirm steady 60fps / 120fps frame rendering time under 8ms.
- **Done when**: `VoxelGlobeHero` and `UploadedCloudVoxelCanvas` render zero heap allocations per frame in `animate()`.
