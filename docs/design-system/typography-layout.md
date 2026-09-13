# Typography and layout

Sources: fonts are loaded in `src/app/layout.tsx`; aliases live in `src/app/globals.css`; named examples live in `src/components/system/tokens.ts`.

## Type roles

| Role | Exact implementation | Use |
| --- | --- | --- |
| Hero display | `font-display text-[48px] sm:text-[56px] font-semibold tracking-[-0.035em]` | The home-page name only |
| About section display | `font-display text-[20px] xs:text-[23px] sm:text-[34px] md:text-[36px] font-medium tracking-tight` | `AboutSectionHeader` titles |
| Intro lead | `font-display text-[23px] sm:text-[25px] leading-[1.4] tracking-[-0.015em]` | Home introduction only |
| Nav label | `font-sans text-[18px] tracking-[-1px]` | Main navigation tabs only |
| Body | `font-sans text-base leading-relaxed tracking-[0.005em]` | General prose and descriptions |
| Case-study body | `font-sans text-sm sm:text-[15px] leading-[1.65]` | Project narratives |
| HUD | `font-mono tabular-nums uppercase` at `11–16px` | Time, dates, coordinates, and compact metadata |
| Handwriting | `font-hand` at `15–48px` by component | Authorial annotations and “say hi,” never body copy |
| Footer links | `font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px]` | Footer social destinations only |

Figtree is display, Geist Sans is body, Geist Pixel Square is mono/HUD, and MyFont is handwriting. Never substitute a system font for a named role or use handwriting for controls.

```tsx
// Correct — home hero source pattern
<h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-0.035em]">
  mudit jha
</h1>

// Incorrect — the 13.5px LinkPreview title is a component one-off, not a new body size
<p className="font-sans text-[13.5px]">General page copy</p>
```

## Layout rules

| Role | Class | Rule |
| --- | --- | --- |
| App frame | `max-w-[1334px] px-6 sm:px-14` | Use once in `layout.tsx`; pages do not nest another app frame |
| Home intro measure | `max-w-[650px]` | Home hero copy |
| About story measure | `max-w-[700px]` | About hero narrative |
| About contact measure | `max-w-[620px]` | About links and contact rows |
| Case-study frame | `max-w-4xl` | Renderer-owned project content |
| Major vertical rhythm | `gap-12` or `space-y-12 sm:space-y-16` | Between sections/blocks |
| Work grid | `grid-cols-1 md:grid-cols-2`, `gap-8 md:gap-y-10` | Project cards only |
| Nav control padding | `px-[15px] py-[6px]` | `NavigationTabs` owns it |

Body copy stays within its named measure because wide prose loses editorial rhythm. Page components inherit the app-frame gutters; do not add a second `px-6 sm:px-14` wrapper.

```text
What width should this content use?
├── App chrome/page frame → 1334px frame from layout.tsx
├── About hero prose → 700px
├── Case study → max-w-4xl renderer frame
├── Home hero → 650px
└── New arbitrary measure → reuse the nearest role or add a catalog token
```

The catalog still lists 800px “bio” and 688px “editorial” measures, but no current product call site uses them. They are catalog drift, not approved layout choices.
