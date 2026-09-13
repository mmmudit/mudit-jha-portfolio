# Surfaces and motion

Sources: `src/app/globals.css` contains runtime utilities; `src/components/system/tokens.ts` catalogs canonical radii, shadows, effects, and motion.

## Surfaces

| Role | Exact token/class | Use |
| --- | --- | --- |
| Paper surface | `.paper-card` | Static cards and modal surfaces |
| Active pill | `.nav-pill-active` or `NavigationTabs` | Selected navigation only |
| Full pill | `rounded-full` | Navigation, compact controls, status |
| Work-card focus wrapper | `rounded-[28px]` | `ProjectCard` outer boundary only |
| Media squircle | `rounded-[26px]` | Project and case-study media |
| Medium panel | `rounded-2xl` | Modal/system panels |
| Small control | `rounded-lg` | Tooltips, code chips, small controls |
| Paper texture | body’s 16px radial grid | Global canvas only |
| Willow dot grid | `.dot-grid` | Empty media or special preview fields |
| Section rule | `.gradient-divider` | `Divider` only |

Nested radii decrease inward: a 28px wrapper contains 26px media; a 20px card contains a 16px child. Use borders for crisp containment and shadows for elevation; do not stack heavy borders and heavy shadows on the same surface.

```tsx
// Correct — shared surface utility from the runtime stylesheet
<article className="paper-card rounded-[26px]" />

// Incorrect — TokenCard contains legacy transition-all; specify changed properties
<div className="transition-all" />
```

## Motion tokens

| Role | Value | Use |
| --- | --- | --- |
| `--duration-micro` | `80ms` | Instant visual response |
| `--duration-quick` | `150ms` | Press, color, digit change |
| `--duration-fast` | `250ms` | Navigation and card state |
| `--duration-medium` | `350ms` | Modal/drawer structure |
| `--duration-slow` | `400ms` | Orchestrated reveal |
| `--duration-very-slow` | `500ms` | Rare full-scene transition |
| `--duration-stagger` | `40ms` | Delay between repeated items |
| `--ease-smooth-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Default settling curve |
| `--ease-bounce` | `cubic-bezier(0.34, 1.36, 0.64, 1)` | One deliberate overshoot |
| `.pressable` | `scale(0.97)`, `150ms` | Links, buttons, and cards |

Component-specific springs stay inside the owning component. `NavigationTabs` currently owns three distinct pill springs; the older single “nav spring” entry in `tokens.ts` is not a reusable configuration.

```text
What is changing?
├── Press/color/opacity → 150ms
├── Card/nav transform → 250ms
├── Modal structure → 350ms
├── Page-level reveal → 400ms
└── Continuous physics → component-owned spring, never a new global default
```

Animate `transform`, `opacity`, `filter`, and composited effects. Never use `transition-all`. Width animation is allowed only inside measured, component-owned morphs such as the header island; it is not a general interaction pattern.

Every animation branches on `useReducedMotion()` or has a matching `prefers-reduced-motion` rule. Reduced motion removes spatial movement and infinite decorative animation while preserving visibility and state changes.
