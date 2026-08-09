---
name: Mudit Jha Portfolio
description: Personal portfolio & interactive spatial software showcase
colors:
  dough: "#fbfaf5"
  willow-grey: "#c8d5bb"
  rust-grey: "#47585c"
  button-primary: "#52525b"
  button-secondary: "#7f7f80"
  zinc-800: "#27272a"
  zinc-300: "#d4d4d8"
  status-green: "#31b564"
typography:
  display:
    fontFamily: "var(--font-figtree), system-ui, sans-serif"
    fontWeight: 600
    letterSpacing: "-3px"
    lineHeight: "1"
  body:
    fontFamily: "var(--font-geist-sans), system-ui, sans-serif"
    fontWeight: 400
    lineHeight: "1.5"
  mono:
    fontFamily: "var(--font-geist-mono), monospace"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "16px"
  card: "26px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "24px"
  xl: "32px"
components:
  button-pressable:
    backgroundColor: "transparent"
    rounded: "{rounded.full}"
  nav-pill:
    backgroundColor: "{colors.willow-grey}"
    rounded: "{rounded.full}"
    padding: "6px 15px"
  card-project:
    backgroundColor: "{colors.dough}"
    rounded: "{rounded.card}"
    padding: "12px"
---

# Design System: Mudit Jha Portfolio

## Overview

**Creative North Star: "The Tactile Paper Sanctuary"**

This visual system treats digital software as a warm, tactile material surface. Rather than stark dark modes or cold flat interfaces, the aesthetic is anchored in a soft paper finish (`#fbfaf5` dough background with a 16px radial dot grid), muted organic Willow grey (`#c8d5bb`) accents, and precise Rust grey typography.

The interface balances spatial elegance with physical responsiveness. Every interactive element—from the floating navigation bar to project cards—behaves like physical paper: reacting instantly on pointer-down (`scale(0.97)`), settling with spring physics, and displaying soft ambient shadows layered with subtle 1px stroke borders.

**Key Characteristics:**
- **Tactile Material Surface**: Soft warm paper finishes (`#fbfaf5`) paired with ambient multi-layered paper card shadows.
- **Restrained Earth Palette**: Willow grey (`#c8d5bb`) as the single primary accent, Rust grey (`#47585c`) for secondary hierarchy, and Status green (`#31b564`) for live indicators.
- **Dual-Layer Seamless Clipping**: Active navigation pill overlays feature dual-layer `clip-path: inset(...)` text transitions to eliminate color jumps.
- **Physical Motion Token Scale**: Shared motion tokens (`--duration-quick: 150ms`, `--duration-fast: 250ms`, `--ease-smooth-out: cubic-bezier(0.22, 1, 0.36, 1)`).

## Colors

The color palette is grounded in warm, organic neutrals inspired by raw paper, graphite, and natural stone.

### Primary
- **Willow Grey** (`#c8d5bb`): Used exclusively for active navigation pills, selection highlights, and key brand callouts.

### Secondary
- **Rust Grey** (`#47585c`): Used for timestamps, live clock text, secondary metadata, and quote callouts.
- **Button Secondary** (`#7f7f80`): Used for subtitle descriptions and changelog text.

### Neutral
- **Dough** (`#fbfaf5`): The primary background color across the entire application, featuring a 16px radial dot grid finish.
- **Zinc 800** (`#27272a`): Primary text color for high-contrast display headlines and body titles.
- **Zinc 300** (`#d4d4d8`): Border strokes for interactive buttons and container outlines.
- **Status Green** (`#31b564`): Used exclusively for real-time status indicators (e.g. Minneapolis live clock dot).

### Named Rules
**The One Voice Rule.** The primary Willow grey accent (`#c8d5bb`) is reserved for active state highlights and interactive focus. Its rarity gives it visual authority.

## Typography

**Display Font:** Figtree (`var(--font-figtree)`, system-ui, sans-serif)  
**Body Font:** Geist Sans (`var(--font-geist-sans)`, system-ui, sans-serif)  
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`, monospace)  
**Quote Accent:** Custom Handwriting Font (`var(--font-myfont)`)

### Hierarchy
- **Display Hero** (Font-weight 600, `text-[36px]`, `tracking-[-3px]`, `line-height: 1`): Used for name hero title ("mudit jha") and section headings.
- **Display Title** (Font-weight 500, `text-[18px]`, `tracking-[-0.1px]`, `line-height: 1.33`): Used for introductory bio copy and project card titles.
- **Body Text** (Font-weight 400, `text-base`, `tracking-[0.005em]`, `line-height: 1.375`): Used for project descriptions and explanatory body copy.
- **Mono / HUD Label** (Font-weight 400, `text-xs` / `text-[16px]`, `uppercase`, `tracking-tight`): Used for live clock stats, canvas coordinates, and changelog dates.
- **Handwriting Accent** (Font-weight 400, `text-[20px]`, `font-hand`): Used for informal quotes ("cool quotes that tickle my mind") and directional directional cues ("say hi ↓").

## Layout

The spatial model relies on a responsive single-column container (`max-w-[688px]` or `max-w-[960px]`) centered within the viewport.

- **Grid System**: 2-column responsive grid on desktop (`grid-cols-1 md:grid-cols-2`, `gap-8`), collapsing cleanly to a single column on mobile screens.
- **Header Dock**: Fixed top overlay with 16px progressive backdrop blur gradient mask, housing the centered floating navigation bar.
- **Spatial Rhythm**: 12px vertical spacing between sections, 8px grid gap between cards, and 24px internal card padding.

## Elevation & Depth

Depth is achieved through multi-layered ambient paper shadows paired with semi-transparent 1px border strokes rather than heavy drop shadows.

### Shadow Vocabulary
- **Paper Card Shadow** (`box-shadow: 0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)`): Tactile paper depth for static cards.
- **Floating Pill Shadow** (`box-shadow: 0 4px 20px rgba(0,0,0,0.06)`): Soft ambient lift for header navigation and floating HUD controls.
- **Card Hover Shadow** (`box-shadow: 0 4px 14px rgba(0,0,0,0.08)`): Subtle elevation response on project card hover.

### Named Rules
**The Pressable Feedback Rule.** All interactive surfaces scale down to `scale(0.97)` on `:active` with a 150ms `cubic-bezier(0.22, 1, 0.36, 1)` transition, giving immediate physical feedback on tap/press.

## Shapes

Form language is characterized by generous, continuous organic curves.

- **Project Card Radius** (`rounded-[26px]`): Soft 26px squircle corners on media containers and image overlays.
- **Navigation Pill Radius** (`rounded-full` / `9999px`): Fully rounded pill silhouettes for navigation tabs, contact buttons, and HUD controls.
- **Inner Stroke Overlay**: Absolute inset `border border-zinc-200/70` strokes on image containers to catch light and define crisp edges.

## Components

### Navigation Tabs
- **Shape:** Fully rounded pill (`rounded-full`)
- **Active Pill:** Willow grey background (`#c8d5bb`) with dual-layer `clip-path: inset(...)` text color transition (`text-zinc-900 font-normal`).
- **Inactive State:** Muted text (`text-zinc-500`), transitioning to `text-zinc-900` on fine-pointer hover.

### Project Cards
- **Shape:** `rounded-[26px]` media container
- **Image Reveal:** 250ms CSS stagger reveal (`translateY(var(--distance-medium))` $\rightarrow$ `0`) with eager loading for above-the-fold cards.
- **Hover Feedback:** Image scale `scale(1.02)` over 250ms (`cubic-bezier(0.22, 1, 0.36, 1)`), container scale `scale(0.99)`, press feedback `scale(0.97)`.
- **Badge:** Bottom-left floating white glass pill (`bg-white/90 backdrop-blur-sm`).

### Toon Eye Logo (`InteractiveTsuLogo`)
- **Style:** Hand-drawn rough graphite filter (`feTurbulence` + `feDisplacementMap`).
- **Behavior:** Smooth spring pupil tracking (`stiffness: 280, damping: 22`) following pointer moves, auto-blink cycle (15s), and manual hover blink trigger (80ms).

### Live Clock (`LiveClock`)
- **Style:** Mono uppercase Minneapolis timestamp with breathing green pulse ring (`.green-pulse-ring`).

## Do's and Don'ts

### Do:
- **Do** use `var(--dough)` (`#fbfaf5`) for page backgrounds to maintain the warm paper sanctuary feel.
- **Do** gate all hover transitions behind `[@media(hover:hover)]` media queries to protect mobile touchscreen users.
- **Do** use `var(--ease-smooth-out)` (`cubic-bezier(0.22, 1, 0.36, 1)`) for all surface transitions.
- **Do** ensure all image loading for above-the-fold cards includes `priority={true}`.

### Don't:
- **Don't** use pure dark `#000000` or stark white `#ffffff` page backgrounds.
- **Don't** animate non-GPU layout properties like `width`, `top`, or `margin` during state transitions.
- **Don't** exceed 300ms duration for UI micro-interactions.
- **Don't** use `transition: all`; always specify exact properties (e.g. `transition-[transform,opacity]`).
