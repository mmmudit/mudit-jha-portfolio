# Plan 008: Seamless Tab Text Color Clipping

## Commit Baseline
`HEAD`

## Target Files
- `src/components/NavigationTabs.tsx`

## Problem & Finding
In `src/components/NavigationTabs.tsx`, as the active pill background slides between navigation tabs ("work", "play", "about"), the text color switches abruptly between zinc-500 and zinc-900. There is a visual seam where text half-covered by the sliding pill is half grey and half dark.

## Objective
Implement Emil Kowalski's dual-layer `clip-path: inset()` tab technique: overlay a duplicate active-styled text layer clipped precisely to the active pill's position and dimensions, producing a seamless pixel-perfect color transition across tab boundaries.

## Proposed Changes

### `src/components/NavigationTabs.tsx`

Render two text layers inside `NavigationTabs`:
1. Inactive text layer: styled in muted `text-zinc-500 hover:text-zinc-800`.
2. Active text layer: absolute full-width overlay styled in `text-zinc-900 font-medium`, wrapped in a container clipped via `clipPath: inset(...)` using current `indicator` bounds:

```tsx
{/* Clipped Active Text Layer */}
{indicator && (
  <div
    className="absolute inset-0 flex items-center justify-between pointer-events-none z-20 transition-[clip-path] duration-250 ease-out"
    style={{
      clipPath: `inset(${indicator.top}px ${
        containerRef.current ? containerRef.current.clientWidth - (indicator.left + indicator.width) : 0
      }px ${
        containerRef.current ? containerRef.current.clientHeight - (indicator.top + indicator.height) : 0
      }px ${indicator.left}px rounded-full)`,
    }}
  >
    {/* Duplicate active styled tab labels */}
  </div>
)}
```

## Verification Plan

### Manual & Feel Check
1. Hover and click between `/`, `/play`, `/about` tabs in header navigation.
2. Slow motion check: verify that text color transitions continuously as the floating pill slides across letter boundaries.
3. Test on mobile viewports to ensure clipped bounds adapt dynamically to tab resize observer.
