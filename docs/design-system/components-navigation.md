# Navigation and shell

## Header

Use once in the global app shell for the logo, dynamic island, and email action. Page-local headers use semantic `header`/`nav` markup or `AboutSectionHeader`, never another `Header`.

Variants: none. `Header` owns route, scroll, notification, mobile, and zero-gravity states internally.

```tsx
// Correct — src/app/layout.tsx
<Header />

// Incorrect — duplicates global chrome inside a page
<main><Header /><PageContent /></main>
```

Source: `src/components/header.tsx`; product call site: `src/app/layout.tsx`.

## DynamicIslandNav

Use inside `Header` to switch between global navigation and the current notification. Standalone page alerts use page content; they do not mount a second island.

Variants: none. Navigation is the default state; `NotificationProvider` supplies the alert state.

```tsx
// Correct — src/components/header.tsx
<DynamicIslandNav />

// Incorrect — notification state is not a public variant
<DynamicIslandNav variant="alert" />
```

Source: `src/components/dynamic-island-nav.tsx`.

## NavigationTabs

Use for the primary `work`, `play`, and `about` destinations. Ordinary navigation uses `next/link`; filters use `AboutSectionHeader` controls.

Appearance variants: none. The default tab set is `work`, `play`, `about`; `tabs` replaces the entire set. `initialActiveId` only seeds selection before pathname resolution. The declared `layoutId` prop is currently unused and must not be treated as an appearance API.

```tsx
// Correct — src/components/dynamic-island-nav.tsx
<NavigationTabs />

// Incorrect — ghost is not implemented
<NavigationTabs variant="ghost" />
```

Source: `src/components/NavigationTabs.tsx`; demo call site: `src/components/system/sections/ComponentSection.tsx`.

## LiveClock

Use `header` for the interactive globe/time hero. Use `footer` for the compact text timestamp; this is the default. Static dates use mono text, not `LiveClock`.

Variants: `header`, `footer`. Nothing else exists—an unlisted variant is a bug, not an option.

- `header` — globe, location telemetry, and zero-gravity trigger.
- `footer` — compact “Mudit Standard Time” row. This is the default.

```tsx
// Correct — src/components/intro.tsx and src/components/footer.tsx
<LiveClock variant="header" />
<LiveClock />

// Incorrect — compact does not exist
<LiveClock variant="compact" />
```

Source: `src/components/live-clock.tsx`.

## Divider

Use between major page sections. Use a component border for internal separation; do not insert `Divider` inside cards.

Variants: none. `className` may control spacing or width; it must not replace `.gradient-divider`.

```tsx
// Correct — src/app/page.tsx
<Divider />

// Incorrect — a raw rule forks the shared treatment
<div className="h-px bg-zinc-300" />
```

Source: `src/components/divider.tsx`; product call sites: `src/app/page.tsx`, `src/app/about/page.tsx`, and `src/app/projects/[slug]/page.tsx`.
