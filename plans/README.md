# Plans README

This folder contains prioritized, self-contained implementation plans for animation and motion improvements in this codebase.

## Prioritized Audit & Execution Roadmap

| # | Plan File | Severity | Category | Target Component | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | `001-consolidate-press-feedback.md` | HIGH | Physicality | `globals.css` / UI | Standardizes press feedback (`scale(0.97)`) across interactive buttons & anchors | DONE |
| 004 | `004-hardware-accelerate-header-chat-motion.md` | HIGH | Performance | `header.tsx` | Replaces main-thread `x`/`scale` props with hardware-accelerated `transform` strings | DONE |
| 005 | `005-project-card-hover-and-reduced-motion.md` | MEDIUM | Accessibility | `project-card.tsx` | Resolves `translateY(-4px)` CSS conflict, adds pointer fine gating & reduced-motion rules | DONE |
| 003 | `003-nav-pill-extract-transition.md` | MEDIUM | Cohesion | `NavigationTabs.tsx` | Centralizes floating nav pill transition duration and easing into CSS tokens | DONE |
| 002 | `002-align-page-transition.md` | LOW | Cohesion | `PageTransition.tsx` | Aligns page enter/exit curves to motion tokens and reduced-motion settings | DONE |
| 006 | `006-live-clock-status-pulse.md` | LOW | Missed Opportunity | `live-clock.tsx` | Adds a quiet breathing pulse ring to the live Minneapolis timezone status dot | DONE |

## Recommended Execution Order

1. **`004-hardware-accelerate-header-chat-motion.md`** — **HIGH**: Eliminates main-thread frame drops in header hover interactions.
2. **`001-consolidate-press-feedback.md`** — **HIGH**: Consolidates button press physics across interactive elements.
3. **`005-project-card-hover-and-reduced-motion.md`** — **MEDIUM**: Fixes card hover CSS conflict and touch device hover sticking.
4. **`003-nav-pill-extract-transition.md`** — **MEDIUM**: Cleans up inline style fallback strings in NavigationTabs.
5. **`002-align-page-transition.md`** — **LOW**: Ensures page transitions match token curves.
6. **`006-live-clock-status-pulse.md`** — **LOW**: Adds real-time status visual pulse.

## How to Execute a Plan

To implement any plan, run:
```bash
improve-animations execute plans/<plan-filename>.md
```
or delegate the self-contained plan file to any agent or model.
