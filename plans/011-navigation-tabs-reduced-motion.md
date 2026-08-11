# Plan 011: Navigation Tabs Reduced Motion Accessibility

**Target**: [`src/components/NavigationTabs.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/NavigationTabs.tsx)  
**Severity**: MEDIUM  
**Category**: Accessibility  
**Commit Stamp**: `cdafdfef`

---

## 1. Problem Statement
`NavigationTabs` uses Framer Motion `layoutId="active-nav-pill"` for active tab sliding animation, but previously lacked `useReducedMotion()` handling, allowing sliding motion even when users configured operating system reduced motion preferences.

---

## 2. Proposed Changes

### [`src/components/NavigationTabs.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/NavigationTabs.tsx)
- Import `useReducedMotion` from `framer-motion`.
- Disable `layoutId` sliding and set duration to `0` when `reduce` is `true`.

```tsx
const reduce = useReducedMotion();

<motion.div
  layoutId={reduce ? undefined : "active-nav-pill"}
  className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.06)] pointer-events-none"
  style={{
    backgroundColor: WILLOW_HEX,
    border: `1px solid rgba(200, 213, 187, 0.9)`,
  }}
  transition={
    reduce
      ? { duration: 0 }
      : {
        type: "spring",
        stiffness: 400,
        damping: 32,
        mass: 0.8,
      }
  }
/>
```

---

## 3. Verification & Feel Check
- Toggle macOS / System settings -> Accessibility -> Reduce Motion.
- Click between `work`, `play`, and `about` navigation tabs.
- Verify the active pill switches instantly without sliding across screen when reduced motion is enabled.
