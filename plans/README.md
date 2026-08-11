# Motion Engineering Audit & Implementation Roadmap

This directory contains prioritized, self-contained implementation plans for animation and motion craft in this codebase, grounded in Emil Kowalski's design engineering philosophy.

## Prioritized Audit & Execution Roadmap

| # | Plan File | Severity | Category | Target Component | Summary | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | `001-consolidate-press-feedback.md` | HIGH | Physicality | `globals.css` / UI | Standardizes press feedback (`scale(0.97)`) across interactive buttons & anchors | DONE |
| 004 | `004-hardware-accelerate-header-chat-motion.md` | HIGH | Performance | `header.tsx` | Replaces main-thread `x`/`scale` props with hardware-accelerated `transform` strings | DONE |
| 009 | `009-header-text-blur-performance.md` | HIGH | Performance | `header.tsx` | Removes CPU blur filter from expanding email button text for GPU hardware acceleration | DONE |
| 005 | `005-project-card-hover-and-reduced-motion.md` | MEDIUM | Accessibility | `project-card.tsx` | Resolves `translateY(-4px)` CSS conflict, adds pointer fine gating & reduced-motion rules | DONE |
| 007 | `007-project-card-staggered-reveal.md` | MEDIUM | Physicality | `project-card.tsx` | Implements 250ms CSS stagger grid reveal (`translateY(12px)` -> `0`) with `--ease-out` token | DONE |
| 008 | `008-seamless-tab-color-clip.md` | MEDIUM | Cohesion | `NavigationTabs.tsx` | Dual-layer `clip-path` for seamless pixel-perfect text color transition across sliding nav pill | DONE |
| 010 | `010-modal-minimap-gpu-scale.md` | MEDIUM | Performance | `project-modal.tsx` | Converts minimap navigation line expansion from layout `width`/`height` to GPU `scaleX` | DONE |
| 011 | `011-navigation-tabs-reduced-motion.md` | MEDIUM | Accessibility | `NavigationTabs.tsx` | Disables sliding layout animation on active nav pill when `prefers-reduced-motion` is active | DONE |
| 012 | `012-bookshelf-preview-spring-physics.md` | LOW | Physicality | `bookshelf.tsx` | Upgrades book showcase preview entrance to physical spring physics (`stiffness: 320, damping: 28`) | DONE |
| 003 | `003-nav-pill-extract-transition.md` | LOW | Cohesion | `NavigationTabs.tsx` | Centralizes floating nav pill transition duration and easing into CSS tokens | DONE |
| 002 | `002-align-page-transition.md` | LOW | Cohesion | `PageTransition.tsx` | Aligns page enter/exit curves to motion tokens and reduced-motion settings | DONE |
| 006 | `006-live-clock-status-pulse.md` | LOW | Missed Opportunity | `live-clock.tsx` | Adds a quiet breathing pulse ring to the live Minneapolis timezone status dot | DONE |

## How to Execute a Plan

To implement any plan, run:
```bash
improve-animations execute plans/<plan-filename>.md
```
or delegate the self-contained plan file to any agent or model.
