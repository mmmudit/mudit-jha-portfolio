# Colors

Sources: `src/app/globals.css` defines runtime values and Tailwind aliases; `src/components/system/tokens.ts` supplies catalog metadata.

## Allowed runtime palette

| Role | Tailwind / CSS | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| Page background | `bg-background` / `--background` | `var(--dough)` | `#090b10` | The page canvas |
| Foreground | `text-foreground` / `--foreground` | `var(--zinc-800)` | `#f4f4f5` | Default readable text |
| Dough | `bg-dough` / `--dough` | `oklch(0.985 0.007 95.8)` | `#0d0f14` | Paper surfaces |
| Willow grey | `*-willow-grey` / `--willow-grey` | `oklch(0.852 0.035 127.5)` | `oklch(0.75 0.05 130)` | Active state or selected highlight |
| Rust grey | `*-rust-grey` / `--rust-grey` | `oklch(0.435 0.024 205.2)` | `oklch(0.7 0.02 205)` | Secondary metadata and captions |
| Primary action | `*-button-primary` / `--button-primary` | `oklch(0.428 0.010 286)` | `oklch(0.92 0.01 286)` | Solid primary action fill |
| Secondary copy | `*-button-secondary` / `--button-secondary` | `oklch(0.579 0.003 286)` | `oklch(0.75 0.01 286)` | Muted descriptions and guidance |
| Graphite | `*-zinc-800` / `--zinc-800` | `oklch(0.248 0.007 286)` | `oklch(0.94 0.01 286)` | High-emphasis headings |
| Stroke | `*-zinc-300` / `--zinc-300` | `oklch(0.869 0.005 286)` | `oklch(0.35 0.01 286)` | Borders and dividers |
| Live status | `*-status-green` / `--status-green` | `oklch(0.686 0.17 148.5)` | `oklch(0.75 0.17 148.5)` | Live status only |

Components use the named Tailwind alias or `var(...)`, never the backing value. Raw values already present in product files are migration debt; do not duplicate them.

## Background choice

```text
What surface is this?
├── Page canvas → bg-background
├── Paper card or modal → bg-dough or .paper-card
├── Selected navigation/state → bg-willow-grey
└── Missing semantic role → add one token; do not choose a raw value
```

## Text choice

```text
What is the text doing?
├── Default body copy → text-foreground
├── Heading/high emphasis → text-zinc-800
├── Metadata/caption → text-rust-grey
├── Muted guidance → text-button-secondary
└── Status → text-status-green, only when the state is live
```

Willow grey is the single selection accent. One control group has one willow-selected item; repeating it decoratively removes the state signal. Status green never means “positive decoration”—it means a live system state.

```tsx
// Correct — production token alias used by an existing component
<span className="text-willow-grey">email</span>

// Incorrect — legacy raw Dough usage from Header; do not copy it
<div className="bg-[#fbfaf5]/50" />
```

Selection colors in `globals.css` (`#e5ecd9` and `#659752`) and raw colors inside prototype routes are current one-offs, not reusable tokens.
