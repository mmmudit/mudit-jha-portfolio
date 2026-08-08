# Plans README

This folder contains prioritized, self-contained implementation plans for animation and motion improvements in this codebase.

## Prioritized Audit & Execution Roadmap

| # | Plan File | Severity | Category | Target Component | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | `001-consolidate-press-feedback.md` | HIGH | Physicality | `globals.css` / UI | Standardizes press feedback (`scale(0.97)`) across interactive buttons & anchors | DONE |
| 004 | `004-hardware-accelerate-header-chat-motion.md` | HIGH | Performance | `header.tsx` | Replaces main-thread `x`/`scale` props with hardware-accelerated `transform` strings | DONE |
| 007 | `007-hardware-accelerate-breakout-particles.md` | HIGH | Performance | `super-saiyan-breakout.tsx` | Hardware-accelerates rock debris and energy spark particle motion | DONE |
| 005 | `005-project-card-hover-and-reduced-motion.md` | MEDIUM | Accessibility | `project-card.tsx` | Resolves `translateY(-4px)` CSS conflict, adds pointer fine gating & reduced-motion rules | DONE |
| 008 | `008-reduced-motion-breakout-easter-egg.md` | MEDIUM | Accessibility | `super-saiyan-breakout.tsx` | Adds `useReducedMotion` support to breakout particles and logo shake | DONE |
| 003 | `003-nav-pill-extract-transition.md` | MEDIUM | Cohesion | `NavigationTabs.tsx` | Centralizes floating nav pill transition duration and easing into CSS tokens | DONE |
| 002 | `002-align-page-transition.md` | LOW | Cohesion | `PageTransition.tsx` | Aligns page enter/exit curves to motion tokens and reduced-motion settings | DONE |
| 006 | `006-live-clock-status-pulse.md` | LOW | Missed Opportunity | `live-clock.tsx` | Adds a quiet breathing pulse ring to the live Minneapolis timezone status dot | DONE |

## All Plans Completed (8/8 DONE)

All implementation plans (001 through 008) have been fully executed and verified against production build checks.
