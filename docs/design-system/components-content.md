# Cards and spatial content

## ProjectGrid

Use for the work index. It owns the two-column layout, cursor pill, keyboard navigation, modal state, URL synchronization, and zero-gravity drift. A generic list or editorial group must not use it.

Variants: none. Pass `projects`; card behavior is not configurable at the page layer.

```tsx
// Correct — src/app/page.tsx
<ProjectGrid projects={projects} />

// Incorrect — ProjectGrid does not accept layout variants
<ProjectGrid projects={projects} variant="masonry" />
```

Source: `src/components/project-grid.tsx`.

## ProjectCard

Use only for a work project inside `ProjectGrid` or the project modal. Play artifacts use `DragCanvas`; collections use `TactileFolderCard`.

Appearance variants: none. Defaults are `year="2025"`, `href="#"`, `muxThumbTime={0}`, `priority={false}`, `index={0}`, and `gradient="from-zinc-200 to-zinc-300"`. Event props support the owning grid; they are not visual variants.

```tsx
// Correct — src/components/project-grid.tsx
<ProjectCard
  index={index}
  title={project.title}
  description={project.description}
  href={project.href}
  onClick={() => handleCardClick(index)}
/>

// Incorrect — compact is not implemented
<ProjectCard title="Clarity" description="..." variant="compact" />
```

Source: `src/components/project-card.tsx`; live catalog call site: `src/components/system/sections/ComponentSection.tsx`.

## DragCanvas

Use for the `/play` spatial collection. Standard work content uses `ProjectGrid`; a single 3D collection uses `TactileFolderCard` directly.

Axis variants: `both`, `x`, `y`; `both` is the default. Item types: `image`, `video`, `note`, `folder`. Item sizes: `sm` (180px), `md` (260px), `lg` (340px); `md` is the generator default. Nothing else exists.

```tsx
// Correct — src/app/play/play-client.tsx
<DragCanvas items={items} dragAxis="both" />

// Incorrect — masonry is not an axis or layout variant
<DragCanvas items={items} dragAxis="masonry" />
```

```text
What is the play artifact?
├── Image → type="image"
├── Video → type="video"
├── Textual scrap → type="note"
└── Collection → type="folder"
```

Sources: `src/components/DragCanvas.tsx`, `src/lib/generateScatterLayout.ts`, and `src/app/play/play-client.tsx`.

## TactileFolderCard

Use for a collection/folder in the play canvas. Use `ProjectCard` for a case-study destination and `TactilePhotoCard` for the authored portrait.

Variants: none. `href` makes an external anchor; without `href`, `onClick` handles the action. `accentColor` defaults to status green and must receive a named token value, not a new arbitrary color.

```tsx
// Correct — src/components/DragCanvas.tsx
<TactileFolderCard title={item.title} href={item.href} accentColor={item.accentColor} />

// Incorrect — card is not a work-project variant
<TactileFolderCard variant="project" />
```

Source: `src/components/TactileFolderCard.tsx`; call sites: `src/components/DragCanvas.tsx` and `src/app/prototypes/folder-card/page.tsx`.

## TactilePhotoCard

Use for the about-page portrait and its dither-to-photo reveal. Other images use `next/image`, `MediaBlock`, or a play-canvas image item.

Variants: none. `revealProgress` may connect story scroll; `initialRotateZ` defaults to `-5`; `accentColor` is token-bound.

```tsx
// Correct — src/components/about-hero-section.tsx
<TactilePhotoCard revealProgress={photoRevealProgress} />

// Incorrect — plain editorial media does not use the portrait interaction
<TactilePhotoCard imageSrc={project.image} variant="media" />
```

Source: `src/components/TactilePhotoCard.tsx`.
