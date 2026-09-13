# Mudit Jha Portfolio Design System

The portfolio is a warm, tactile paper environment with graphite typography, muted botanical accents, precise mono metadata, and physical-feeling motion. It should feel authored and playful without turning experiments into the default language of the public site.

## Non-negotiable rules

1. Production components use the named colors and fonts exposed by `src/app/globals.css`. Never add a raw brand or neutral color when a named token exists; if a role is missing, add it to `globals.css` and `src/components/system/tokens.ts` in the same change.
2. A TypeScript union is a closed set. Nothing outside a documented component variant, block type, media type, or size union exists—an unlisted value is a bug, not an option.
3. `/`, `/about`, `/play`, and `/projects/[slug]` are product evidence. Files under `src/app/prototypes` and tokens tagged `experiment` are exploration evidence only; never promote them without an explicit product decision.
4. Every interaction must work with a keyboard and with `prefers-reduced-motion: reduce`. Hover-only feedback is gated behind `(hover: hover)` and never carries required information.
5. Use shared components before recreating their appearance. Extend a shared component only when the new behavior belongs at every existing call site.
6. Do not copy legacy raw values or `transition-all` from existing code. They are migration debt, not precedent.

## Source priority

When sources disagree, use this order. Fix the lower-priority source when it is in scope; otherwise flag the drift in the relevant topic document:

1. Component prop unions and rendered implementation in `src/components`.
2. Runtime tokens and utilities in `src/app/globals.css`.
3. Catalog metadata in `src/components/system/tokens.ts`.
4. These documents.

The live `/design-system` route is a visual audit surface. It demonstrates components, but demo-only styling is not product API.

## Choose the layer

```text
What are you changing?
├── Brand color, type, spacing, radius, surface, or motion → read the three foundation topics
├── Global navigation, clock, header, or divider → read Navigation & shell
├── Work or play cards, grids, or canvases → read Cards & spatial content
├── External link or email preview → read Link previews
├── Project story content → read Case studies
└── Unsure whether a component is canonical → read Component inventory
```

## Topic index

- [Colors](docs/design-system/colors.md) — allowed palette, light/dark mappings, and token selection.
- [Typography and layout](docs/design-system/typography-layout.md) — type roles, measures, gutters, and spacing.
- [Surfaces and motion](docs/design-system/surfaces-motion.md) — radii, shadows, effects, durations, and accessibility.
- [Navigation and shell](docs/design-system/components-navigation.md) — `Header`, `DynamicIslandNav`, `NavigationTabs`, `LiveClock`, and `Divider`.
- [Cards and spatial content](docs/design-system/components-content.md) — `ProjectGrid`, `ProjectCard`, `DragCanvas`, and tactile cards.
- [Link previews](docs/design-system/components-links.md) — `SmartLinkPreview`, `EmailPreviewBadge`, and `LinkPreview`.
- [Case studies](docs/design-system/case-studies.md) — renderer precedence and every closed content-block variant set.
- [Component inventory](docs/design-system/component-inventory.md) — canonical, composed, supporting, and experimental exports.

## Before merging UI work

- Use only variants present in the component or content type union.
- Search two existing product call sites before changing a shared component.
- Check light mode, `.dark`, keyboard focus, touch behavior, and reduced motion.
- Write product hover styles as `[@media(hover:hover)]:hover:*`; a bare `hover:*` is a review failure.
- Keep product styles out of `src/app/prototypes`; keep prototype styles out of product routes.
- Update these docs when a token, union, default, or component-selection rule changes.
