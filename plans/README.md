# Motion Engineering Audit & Implementation Roadmap

This directory contains prioritized, self-contained implementation plans for animation and motion craft in this codebase, grounded in Emil Kowalski's design engineering philosophy.

## Prioritized Audit & Execution Roadmap

| # | Plan File | Severity | Category | Target Component | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | `001-consolidate-press-feedback.md` | HIGH | Physicality | `globals.css` / UI | Standardizes press feedback (`scale(0.97)`) across interactive buttons & anchors | DONE |
| 004 | `004-hardware-accelerate-header-chat-motion.md` | HIGH | Performance | `header.tsx` | Replaces main-thread `x`/`scale` props with hardware-accelerated `transform` strings | DONE |
| 005 | `005-project-card-hover-and-reduced-motion.md` | MEDIUM | Accessibility | `project-card.tsx` | Resolves `translateY(-4px)` CSS conflict, adds pointer fine gating & reduced-motion rules | DONE |
| 007 | `007-project-card-staggered-reveal.md` | MEDIUM | Physicality | `project-card.tsx` | Implements 250ms CSS stagger grid reveal (`translateY(12px)` -> `0`) with `--ease-out` token | DONE |
| 008 | `008-seamless-tab-color-clip.md` | MEDIUM | Cohesion | `NavigationTabs.tsx` | Dual-layer `clip-path` for seamless pixel-perfect text color transition across sliding nav pill | DONE |
| 003 | `003-nav-pill-extract-transition.md` | LOW | Cohesion | `NavigationTabs.tsx` | Centralizes floating nav pill transition duration and easing into CSS tokens | DONE |
| 002 | `002-align-page-transition.md` | LOW | Cohesion | `PageTransition.tsx` | Aligns page enter/exit curves to motion tokens and reduced-motion settings | DONE |
| 006 | `006-live-clock-status-pulse.md` | LOW | Missed Opportunity | `live-clock.tsx` | Adds a quiet breathing pulse ring to the live Minneapolis timezone status dot | DONE |

## Recommended Execution Order

1. **`007-project-card-staggered-reveal.md`** — **MEDIUM**: Connects `animationDelay` props to CSS `@keyframes` stagger reveal.
2. **`008-seamless-tab-color-clip.md`** — **MEDIUM**: Eliminates abrupt text color jump on sliding tab navigation pill.
3. **`004-hardware-accelerate-header-chat-motion.md`** — **HIGH**: (Completed) Header hover acceleration.
4. **`001-consolidate-press-feedback.md`** — **HIGH**: (Completed) Consolidated button press physics.

## How to Execute a Plan

To implement any plan, run:
```bash
improve-animations execute plans/<plan-filename>.md
```
or delegate the self-contained plan file to any agent or model.
