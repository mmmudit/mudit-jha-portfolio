# Plan 012: Upgrade Bookshelf Showcase Preview Spring Physics

**Target**: [`src/components/bookshelf.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/bookshelf.tsx)  
**Severity**: LOW  
**Category**: Physicality / Polish  
**Commit Stamp**: `cdafdfef`

---

## 1. Problem Statement
The bookshelf section showcase preview card (`AnimatePresence`) previously used a generic linear/easeOut duration transition (`duration: 0.2, ease: "easeOut"`), creating a mechanical feel when switching selected books.

---

## 2. Proposed Changes

### [`src/components/bookshelf.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/bookshelf.tsx)
- Import `useReducedMotion` from `framer-motion`.
- Upgrade showcase preview entrance/exit to physical spring physics (`type: "spring", stiffness: 320, damping: 28, mass: 0.8`).

```tsx
const reduce = useReducedMotion();

<motion.div
  key={activeBook._id || activeBook.title}
  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
  transition={
    reduce
      ? { duration: 0.15 }
      : { type: "spring", stiffness: 320, damping: 28, mass: 0.8 }
  }
  className="flex items-center gap-5 w-full bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl backdrop-blur-md shadow-xl"
>
```

---

## 3. Verification & Feel Check
- Navigate to `/play` or home page Bookshelf section.
- Click or hover between book spines on the shelf.
- Verify the active book showcase card transitions in with fluid physical spring physics and crisp subpixel scaling.
