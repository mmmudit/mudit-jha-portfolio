# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Design & engineering recruiters, founders, product leaders, and creative directors looking to hire, partner with, or collaborate with a high-craft design engineer. Visitors evaluate technical depth, visual craft, interactive polish, and creative vision within 30–60 seconds of arriving.

## Product Purpose

A personal portfolio and interactive showcase that demonstrates world-class design engineering expertise—combining production-grade Next.js development, fluid spring animations, custom interactive shaders, and tactile visual polish. Success means inspiring trust and delight, leading to high-leverage job, contract, or creative partnership inquiries.

## Positioning

Design engineer & creative generalist building high-craft, fluid software at the intersection of technology and human behavior. Blends deep frontend engineering (Next.js 16, React 19, TypeScript) with Apple-grade motion physics, spatial computing experiments, and tactile design systems.

## Operating Context

- **Desktop & Mobile Web Browsing**: Viewed on high-DPI displays (MacBooks, iPhones, monitors) where responsiveness, typography tracking, and frame-smooth 60fps animations are immediately noticeable.
- **Surface Modes**:
  - Home (`/`): *Persuade & Experience* — curated case studies grid and interactive toon logo header.
  - Play (`/play`): *Experience & Operate* — full-screen spatial canvas with physics-based nodes, web audio visualizer, and HUD controls.
  - About (`/about`): *Read & Persuade* — direct personal bio and navigation.

## Capabilities and Constraints

- **Confirmed Stack**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide React icons.
- **Interactive Surfaces**:
  - Interactive SVG Toon Eye Logo (`src/components/tsu-logo.tsx`) with pointer tracking and manual/auto blink.
  - Floating pill navigation (`src/components/NavigationTabs.tsx`) with dual-layer `clip-path` text color transitions.
  - Project Cards grid (`src/components/project-card.tsx`) with LCP image eager loading, press feedback (`scale(0.97)`), and 250ms CSS stagger reveal.
  - Infinite Canvas (`src/components/infinite-canvas.tsx`) with pan/zoom HUD and interactive node categories.
  - Live Minneapolis clock status (`src/components/live-clock.tsx`).
- **Motion Constraints**: All animations must follow strict sub-300ms UI budgets, GPU-only properties (`transform`, `opacity`), and `prefers-reduced-motion` fallbacks.

## Brand Commitments

- **Visual Theme**: Warm paper finish (`#fbfaf5` dough background with soft radial dot grid texture), Willow grey (`#c8d5bb`) pill accents, and Rust grey (`#47585c`) text details.
- **Typography**: Figtree font for display headlines, Geist Sans for UI body copy, Geist Mono for code/HUD stats, and custom handwriting font for quote accents.
- **Voice**: Authentic, thoughtful, restrained, and craft-obsessed ("cool quotes that tickle my mind", "say hi ↓", "let's chat").

## Evidence on Hand

- Case study assets in `public/assets/projects/`:
  - `apple_vision.png` (Apple Vision spatial interaction)
  - `canvas_os.png` (Canvas OS spatial workspace)
  - `polaroid_studio.png` (Polaroid digital camera app)
  - `screentime_receipt.png` (Thermal receipt visualizer)
- Live project code and motion tokens in `src/app/globals.css`.

## Product Principles

1. **Craft Is the Leverage**: Every detail—from spring physics to 1px glass borders and text clip-path transitions—compounds into software that feels right.
2. **Instant Response & Zero Latency**: Touch and pointer input must receive immediate feedback on press (`scale(0.97)`), never delaying the user.
3. **Show, Don't Just Tell**: Prioritize working, touchable interactive prototypes (`InfiniteCanvas`, `InteractiveTsuLogo`) over static screenshots.
4. **Restraint & Purpose**: Motion serves spatial continuity, state indication, and feedback. High-frequency actions remain snappy and uncluttered.

## Accessibility & Inclusion

- Full `prefers-reduced-motion: reduce` support across all CSS keyframes and Framer Motion components.
- Fine-pointer `@media (hover: hover) and (pointer: fine)` gating on all hover states to prevent sticky hovers on touch devices.
- High-contrast text legibility over translucent backdrop-blur surfaces.
