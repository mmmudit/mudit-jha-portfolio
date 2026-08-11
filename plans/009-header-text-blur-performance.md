# Plan 009: Hardware Accelerate Header Chat Text Motion

**Target**: [`src/components/header.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/header.tsx)  
**Severity**: HIGH  
**Category**: Performance  
**Commit Stamp**: `cdafdfef`

---

## 1. Problem Statement
The "let's chat" header button text previously animated CPU backdrop/text blur filter (`filter: hover ? "blur(0px)" : "blur(2px)"`) during expanding width spring transitions. Animating CPU blur filters forces repaints on the main browser rendering thread.

---

## 2. Proposed Changes

### [`src/components/header.tsx`](file:///Users/muditjha/Projects/mudit-jha-portfolio/src/components/header.tsx)
- Remove `filter: hover ? "blur(0px)" : "blur(2px)"` from `motion.span`.
- Retain GPU-accelerated `transform` (`translateX` & `scale`) and `opacity`.

```tsx
<motion.span
  className="whitespace-nowrap text-sm font-bold tracking-[0.01em] text-zinc-800"
  initial={false}
  animate={
    reduce
      ? {}
      : {
        transform: hover
          ? "translateX(0px) scale(1)"
          : "translateX(8px) scale(0.96)",
        opacity: hover ? 1 : 0,
      }
  }
  transition={
    reduce ? {} : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
  }
>
  let’s chat
</motion.span>
```

---

## 3. Verification & Feel Check
- Hover over the "let's chat" header email button on desktop.
- Open Chrome DevTools -> Rendering -> Paint Flashing to verify zero CPU paint rects fire on the text span during width spring expansion.
