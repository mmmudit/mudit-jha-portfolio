# Plan 010: Convert Modal Minimap Lines to GPU scaleX

**Target**: [`src/components/project-modal.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/project-modal.tsx)  
**Severity**: MEDIUM  
**Category**: Performance / Physicality  
**Commit Stamp**: `cdafdfef`

---

## 1. Problem Statement
The minimap section navigation lines inside `ProjectModal` previously animated layout properties `width` (14px -> 28px -> 44px) and `height` (1.5px -> 2px) on spring hover/focus, triggering layout recalculations and DOM reflow.

---

## 2. Proposed Changes

### [`src/components/project-modal.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/project-modal.tsx)
- Set container width to fixed `w-11 h-[2px]` with `style={{ transformOrigin: "left center" }}`.
- Replace layout `width` / `height` properties with GPU `scaleX` (0.32 -> 0.64 -> 1.0) and `opacity`.

```tsx
<div className="relative flex items-center h-4 w-12 shrink-0">
  <motion.div
    style={{ transformOrigin: "left center" }}
    animate={{
      scaleX: isActive ? 1 : isHovered ? 0.64 : 0.32,
      backgroundColor: isActive ? "#18181b" : isHovered ? "#52525b" : "#d4d4d8",
      opacity: isActive ? 1 : isHovered ? 0.85 : 0.6,
    }}
    transition={{ type: "spring", stiffness: 360, damping: 26 }}
    className="w-11 h-[2px] rounded-full"
  />
</div>
```

---

## 3. Verification & Feel Check
- Open any project modal card.
- Scroll or hover over minimap section links on the left sidebar.
- Verify section lines smoothly expand from left-to-right using GPU `scaleX` with zero layout reflow.
