# Case studies

Sources: closed unions live in `src/types/project.ts`; rendering precedence lives in `src/components/case-study/CaseStudyRenderer.tsx`; authoring options live in `studio-portfolio/schemaTypes/caseStudyBlocks.ts`.

## CaseStudyRenderer

Use once for a project story. Pages pass a `Project`; authors select content blocks in Sanity. Do not compose block components directly in a route unless building a prototype.

Rendering modes: `project.content`, legacy `project.caseStudy`, legacy summary fields. The first non-empty mode wins; this order is fixed.

- `project.content` — current 11-block system. This is the default for new work.
- `project.caseStudy` — legacy seven-block system; use only to maintain existing content.
- `overview` / `challenge` / `solution` / `impact` — last-resort fallback.

```tsx
// Correct — src/components/case-study/ExpandedProjectView.tsx
<CaseStudyRenderer project={project} />

// Incorrect — bypasses renderer precedence and spacing
<MediaBlock block={project.content[0]} />
```

```text
Which project content renders?
├── project.content has items → current block renderer
├── Else project.caseStudy has items → legacy block renderer
└── Else → summary-field fallback
```

## Current content blocks

The `_type` union is closed to these values. Nothing else exists.

| `_type` | Use | Alternative |
| --- | --- | --- |
| `narrative` | Explanatory prose, optional callout | `statement` for one thesis |
| `statement` | A focused thesis with support | `narrative` for a longer section |
| `designDecision` | Context, decision, why, trade-off | `process` for chronological steps |
| `media` | One visual artifact | `gallery` for multiple artifacts |
| `feature` | One feature with text/media layout | `highlightFeature` for a dominant feature |
| `highlightFeature` | High-emphasis feature panel | `feature` for ordinary hierarchy |
| `gallery` | Multiple related images | `media` for one artifact |
| `process` | Ordered steps | `designDecision` for rationale |
| `comparison` | Before/after evidence | `gallery` for unrelated images |
| `results` | Outcome metrics or labeled results | `reflection` for qualitative learning |
| `reflection` | Learnings and takeaways | `results` for measurable outcomes |

```ts
// Correct — current source union shape
{ _key: "research", _type: "narrative", heading: "What we learned" }

// Incorrect — richText is not a registered block
{ _key: "research", _type: "richText", heading: "What we learned" }
```

## Media

Layout variants: `contained`, `wide`, `fullBleed`; `wide` is the Sanity default. They map to `MediaBlock` sizes `normal`, `wide`, `full`. Media types: `image`, `video`, `mux`; legacy `MediaBlockItem` also accepts `figma`. Nothing else exists.

```text
How should one artifact be sized?
├── Supporting evidence inside the reading column → contained
├── Primary product evidence → wide
└── Scene-setting or immersive evidence → fullBleed
```

Use Mux for hosted motion, `video` for a direct video URL, and `image` for still evidence. Supply alt text for meaningful visuals. Autoplay motion is muted, loops, and stops animating under reduced motion.

## Feature

Layout variants: `mediaLeft`, `mediaRight`, `mediaTop`, `fullWidth`, `sticky`; `mediaRight` is the runtime default. Nothing else exists.

```text
Where does the evidence belong?
├── Before the prose → mediaTop
├── After full-width prose → fullWidth
├── Beside prose and should remain visible → sticky
├── Beside prose on the left → mediaLeft
└── Default beside prose → mediaRight
```

## Gallery and comparison

Gallery variants: `grid`, `wide`; `grid` is the Sanity/runtime default. Comparison declares `sideBySide` and `slider`, but `ComparisonBlock` currently starts in `sideBySide` and owns a user toggle; the authored `variant` is not read. Do not rely on it until the renderer implements it.

## Legacy blocks

The legacy `_type` set is `textSection`, `mediaBlock`, `figmaEmbed`, `decisionBlock`, `featureBlock`, `comparisonBlock`, `reflectionBlock`. Maintain existing content only; new Sanity content uses the current names above.
