export type TokenTag = "canonical" | "one-off" | "experiment";

export interface BaseToken {
  id: string;
  name: string;
  value: string;
  className?: string;
  usage: string;
  tag: TokenTag;
  description?: string;
}

export interface ColorToken extends BaseToken {
  hex: string;
  oklch?: string;
  variable?: string;
  category: "brand" | "neutral" | "functional" | "spine" | "gradient";
}

export interface TypographyToken extends BaseToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  letterSpacing?: string;
  lineHeight?: string;
  fontCategory: "display" | "body" | "mono" | "handwriting";
}

export interface ShadowToken extends BaseToken {
  boxShadow: string;
  elevation: "surface" | "raised" | "floating" | "overlay";
}

export interface RadiusToken extends BaseToken {
  radiusValue: string;
}

export interface SpacingToken extends BaseToken {
  pixelValue: string;
  remValue?: string;
  dimensionType: "layout-max-width" | "gutter-padding" | "component-gap" | "component-padding";
}

export interface EffectToken extends BaseToken {
  effectType: "backdrop-blur" | "dot-grid" | "noise" | "shimmer" | "gradient-mask";
}

export interface MotionToken extends BaseToken {
  duration?: string;
  easing?: string;
  motionType: "duration" | "easing" | "spring" | "interaction" | "keyframe";
  springConfig?: {
    stiffness: number;
    damping: number;
    mass?: number;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. COLOR TOKENS (Audited from DESIGN.md, globals.css, and component files)
// ─────────────────────────────────────────────────────────────────────────────
export const COLOR_TOKENS: ColorToken[] = [
  // Canonical Brand & Neutrals
  {
    id: "color-dough",
    name: "Dough",
    value: "oklch(0.985 0.007 95.8)",
    hex: "#fbfaf5",
    oklch: "oklch(0.985 0.007 95.8)",
    variable: "--dough",
    className: "bg-dough text-dough",
    usage: "Primary tactile paper background across the entire site, base cards & modals",
    tag: "canonical",
    category: "brand",
    description: "Warm raw paper tone that grounds the entire aesthetic sanctuary.",
  },
  {
    id: "color-willow-grey",
    name: "Willow Grey",
    value: "oklch(0.852 0.035 127.5)",
    hex: "#c8d5bb",
    oklch: "oklch(0.852 0.035 127.5)",
    variable: "--willow-grey",
    className: "bg-willow-grey text-willow-grey",
    usage: "Active navigation pill, 'human' accent word, footer headline & social links, shimmer accent",
    tag: "canonical",
    category: "brand",
    description: "The primary voice accent. Rarity gives it high visual authority.",
  },
  {
    id: "color-rust-grey",
    name: "Rust Grey",
    value: "oklch(0.435 0.024 205.2)",
    hex: "#47585c",
    oklch: "oklch(0.435 0.024 205.2)",
    variable: "--rust-grey",
    className: "bg-rust-grey text-rust-grey",
    usage: "Timestamps, quotes, hover state for footer word links, secondary text accents",
    tag: "canonical",
    category: "brand",
    description: "Deep muted slate-teal for secondary hierarchy and quiet emphasis.",
  },
  {
    id: "color-zinc-800",
    name: "Zinc 800",
    value: "oklch(0.248 0.007 286.0)",
    hex: "#27272a",
    oklch: "oklch(0.248 0.007 286.0)",
    variable: "--zinc-800",
    className: "text-zinc-800 bg-zinc-800",
    usage: "Display headings ('mudit jha', 'about'), primary readable typography",
    tag: "canonical",
    category: "neutral",
    description: "High-contrast charcoal graphite instead of harsh #000000 black.",
  },
  {
    id: "color-button-secondary",
    name: "Button Secondary (Muted Grey)",
    value: "oklch(0.579 0.003 286.0)",
    hex: "#7f7f80",
    oklch: "oklch(0.579 0.003 286.0)",
    variable: "--button-secondary",
    className: "text-button-secondary",
    usage: "Hero bio subtitle descriptions, live clock HUD, changelog footer date",
    tag: "canonical",
    category: "neutral",
    description: "Balanced neutral grey for metadata and secondary guidance copy.",
  },
  {
    id: "color-zinc-300",
    name: "Zinc 300",
    value: "oklch(0.869 0.005 286.0)",
    hex: "#d4d4d8",
    oklch: "oklch(0.869 0.005 286.0)",
    variable: "--zinc-300",
    className: "border-zinc-300 text-zinc-300",
    usage: "Header 'let’s chat' pill border, navigation container subtle strokes",
    tag: "canonical",
    category: "neutral",
    description: "Tactile crisp stroke definition for interactive rounded boundaries.",
  },
  {
    id: "color-status-green",
    name: "Status Green",
    value: "oklch(0.686 0.170 148.5)",
    hex: "#31b564",
    oklch: "oklch(0.686 0.170 148.5)",
    variable: "--status-green",
    className: "bg-status-green text-status-green",
    usage: "Minneapolis live clock real-time pulsing dot",
    tag: "canonical",
    category: "functional",
    description: "Crisp emerald beacon indicating active live status.",
  },
  {
    id: "color-button-primary",
    name: "Button Primary (Graphite)",
    value: "oklch(0.428 0.010 286.0)",
    hex: "#52525b",
    oklch: "oklch(0.428 0.010 286.0)",
    variable: "--button-primary",
    className: "bg-button-primary text-button-primary",
    usage: "DESIGN.md token, book spine palette",
    tag: "canonical",
    category: "brand",
  },
  // Real One-offs & Exceptions Found in Components
  {
    id: "color-body-gradient-bottom",
    name: "Sage Paper Mist (Gradient Bottom)",
    value: "oklch(0.908 0.010 137.2)",
    hex: "#E1E5DE",
    oklch: "oklch(0.908 0.010 137.2)",
    className: "bg-[#E1E5DE]",
    usage: "Body background vertical linear gradient endpoint (71.63% → 100%)",
    tag: "one-off",
    category: "gradient",
    description: "Soft atmospheric gradient termination at bottom of page viewport.",
  },
  {
    id: "color-chat-hover-bg",
    name: "Chat Button Hover Slate",
    value: "#e6e6e6",
    hex: "#e6e6e6",
    className: "bg-[#e6e6e6]",
    usage: "Header 'let’s chat' button hover state background",
    tag: "one-off",
    category: "functional",
    description: "Spring-animated hover fill on the contact pill button.",
  },
  {
    id: "color-copied-emerald",
    name: "Copied Toast Emerald",
    value: "#065f46",
    hex: "#065f46",
    className: "text-emerald-800 bg-emerald-100/90 border-emerald-300",
    usage: "Email address click-to-copy confirmation pill feedback",
    tag: "one-off",
    category: "functional",
    description: "Micro-interaction success confirmation toast.",
  },
  {
    id: "color-project-action-blue",
    name: "Project Action Link Blue",
    value: "#3b82f6",
    hex: "#3b82f6",
    className: "text-blue-500 hover:text-blue-600",
    usage: "Project card 'Try It Out!' action link text & chevron",
    tag: "one-off",
    category: "functional",
    description: "Hover reveal callout link on desktop project cards.",
  },
  {
    id: "color-spine-international-orange",
    name: "Spine: International Orange",
    value: "#ff4500",
    hex: "#ff4500",
    className: "bg-[#ff4500]",
    usage: "Bookshelf spine for 'Grid Systems in Graphic Design'",
    tag: "one-off",
    category: "spine",
    description: "High-energy Swiss graphic design reference spine.",
  },
  {
    id: "color-spine-slate-navy",
    name: "Spine: Slate Navy",
    value: "#293845",
    hex: "#293845",
    className: "bg-[#293845]",
    usage: "Bookshelf spine for 'Refactoring UI'",
    tag: "one-off",
    category: "spine",
  },
  {
    id: "color-spine-warm-amber",
    name: "Spine: Amber Gold",
    value: "#eab308",
    hex: "#eab308",
    className: "bg-[#eab308]",
    usage: "Bookshelf spine for 'Show Your Work!'",
    tag: "one-off",
    category: "spine",
  },
  {
    id: "color-dot-grid-tint",
    name: "Dot Grid Willow Tint",
    value: "rgba(200, 213, 187, 0.55)",
    hex: "#c8d5bb8c",
    className: "bg-[#c8d5bb8c]",
    usage: ".dot-grid radial pattern in globals.css and play canvas",
    tag: "one-off",
    category: "gradient",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY TOKENS (Audited from Figtree, Geist Sans, Geist Mono, MyFont)
// ─────────────────────────────────────────────────────────────────────────────
export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  {
    id: "type-hero-display",
    name: "Display Hero (mudit jha)",
    value: "Figtree 600 • 48px • tracking -3px • line-height 1",
    fontFamily: "var(--font-figtree)",
    fontSize: "48px",
    fontWeight: 600,
    letterSpacing: "-3px",
    lineHeight: "1",
    className: "font-display text-[48px] font-semibold tracking-[-3px]",
    usage: "Main portfolio name hero title in Intro",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-section-title",
    name: "Section Display Title",
    value: "Figtree 600 • 36px • tracking -3px",
    fontFamily: "var(--font-figtree)",
    fontSize: "36px",
    fontWeight: 600,
    letterSpacing: "-3px",
    className: "font-display text-[36px] font-semibold tracking-[-3px]",
    usage: "Page section headings ('about', etc.) in AboutHero",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-subheading-shimmer",
    name: "Shimmer Subtitle Lead",
    value: "Figtree 500 • 26px • tracking -0.1px • line-height 1.3",
    fontFamily: "var(--font-figtree)",
    fontSize: "26px",
    fontWeight: 500,
    letterSpacing: "-0.1px",
    lineHeight: "1.3",
    className: "font-display text-[26px] font-medium leading-[1.3] tracking-[-0.1px]",
    usage: "Intro bio copy with animated gradient shimmer overlay",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-nav-pill-label",
    name: "Navigation Pill Label",
    value: "Geist Sans • 18px • tracking -1px",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "18px",
    fontWeight: 400,
    letterSpacing: "-1px",
    className: "font-sans text-[18px] tracking-[-1px]",
    usage: "Header navigation tabs ('work', 'play', 'about')",
    tag: "canonical",
    fontCategory: "body",
  },
  {
    id: "type-body-text",
    name: "Body Text (Standard)",
    value: "Geist Sans 400 • 16px (1rem) • tracking 0.005em • leading-relaxed",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "16px",
    fontWeight: 400,
    letterSpacing: "0.005em",
    lineHeight: "1.625",
    className: "font-sans text-base leading-relaxed tracking-[0.005em]",
    usage: "General paragraph explanations and project descriptions",
    tag: "canonical",
    fontCategory: "body",
  },
  {
    id: "type-footer-wordmark-links",
    name: "Footer Giant Social Links",
    value: "Geist Sans 600 • 26px to 46px responsive • tracking -1px",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "46px",
    fontWeight: 600,
    letterSpacing: "-1px",
    className: "font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px]",
    usage: "Footer interactive social links (instagram, linkedin, github, x, substack, email)",
    tag: "canonical",
    fontCategory: "body",
  },
  {
    id: "type-mono-clock-digits",
    name: "HUD Tabular Numbers (Live Clock)",
    value: "Geist Mono • text-[13px] to 16px • tabular-nums",
    fontFamily: "var(--font-geist-mono)",
    fontSize: "15px",
    fontWeight: 300,
    letterSpacing: "-0.5px",
    className: "font-mono tabular-nums uppercase text-[13px] sm:text-[15px] md:text-[16px] tracking-[-0.5px]",
    usage: "Live ticking clock digits and Minneapolis coordinate HUD",
    tag: "canonical",
    fontCategory: "mono",
  },
  {
    id: "type-handwriting-accent",
    name: "Handwriting Accent ('human')",
    value: "MyFont Regular • 30px • italic font-bold",
    fontFamily: "var(--font-myfont)",
    fontSize: "30px",
    fontWeight: 700,
    className: "font-hand italic font-bold text-[30px] leading-none",
    usage: "Intro bio highlighted word 'human'",
    tag: "canonical",
    fontCategory: "handwriting",
    description: "Custom handwriting font that injects warmth and authorial presence.",
  },
  {
    id: "type-handwriting-say-hi",
    name: "Handwriting Footer Header ('say hi!')",
    value: "MyFont Regular • 36px to 48px • tracking -1px",
    fontFamily: "var(--font-myfont)",
    fontSize: "48px",
    fontWeight: 400,
    letterSpacing: "-1px",
    className: "font-hand text-[36px] sm:text-[44px] md:text-[48px] leading-tight tracking-[-1px]",
    usage: "Footer call to action 'say hi!' above bouncing chevron",
    tag: "canonical",
    fontCategory: "handwriting",
  },
  {
    id: "type-chat-button-label",
    name: "Chat Button Text Reveal",
    value: "Geist Sans 700 • 14px • tracking 0.01em",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.01em",
    className: "font-sans text-sm font-bold tracking-[0.01em]",
    usage: "Header expandable 'let’s chat' pill label on hover",
    tag: "one-off",
    fontCategory: "body",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHADOW & ELEVATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const SHADOW_TOKENS: ShadowToken[] = [
  {
    id: "shadow-paper-card",
    name: "Paper Card Multi-Layer Shadow",
    value: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    className: "paper-card",
    usage: "Tactile paper depth on cards, containers, and modal dialogs",
    tag: "canonical",
    elevation: "surface",
    description: "Simulates physical paper lying on a tactile desk with ambient soft falloff and crisp top bevel.",
  },
  {
    id: "shadow-nav-pill-active",
    name: "Active Nav Pill Dual Inset Shadow",
    value: "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.06)",
    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.06)",
    className: "nav-pill-active",
    usage: "Active navigation pill highlight background",
    tag: "canonical",
    elevation: "raised",
    description: "Pressed tactile deboss effect with top edge illumination and soft drop shadow.",
  },
  {
    id: "shadow-floating-dock",
    name: "Floating Nav Dock Shadow",
    value: "0 4px 20px rgba(0, 0, 0, 0.06)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    className: "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
    usage: "Header centered navigation floating pill container",
    tag: "canonical",
    elevation: "floating",
  },
  {
    id: "shadow-card-badge",
    name: "Project Card Badge Shadow",
    value: "0 2px 8px rgba(0, 0, 0, 0.04)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    className: "shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    usage: "Project title & year floating glass badge on card bottom-left",
    tag: "canonical",
    elevation: "raised",
  },
  {
    id: "shadow-badge-hover",
    name: "Project Badge Hover Elevation",
    value: "0 4px 14px rgba(0, 0, 0, 0.08)",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
    className: "hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]",
    usage: "Elevated feedback state when hovering over a project card",
    tag: "one-off",
    elevation: "raised",
  },
  {
    id: "shadow-wordmark-drop",
    name: "Mudit Wordmark Drop Shadow",
    value: "drop-shadow-sm",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    className: "drop-shadow-sm",
    usage: "Footer giant 'mudit' wordmark asset",
    tag: "one-off",
    elevation: "surface",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. BORDER RADIUS TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const RADIUS_TOKENS: RadiusToken[] = [
  {
    id: "radius-full",
    name: "Pill / Full Round",
    value: "9999px",
    radiusValue: "9999px",
    className: "rounded-full",
    usage: "Navigation tabs, floating dock, contact button, project badges, live indicator pulse ring",
    tag: "canonical",
    description: "The primary geometric shape for all interactive pills, buttons, and HUD controls.",
  },
  {
    id: "radius-project-outer",
    name: "Project Outer Container",
    value: "28px",
    radiusValue: "28px",
    className: "rounded-[28px]",
    usage: "ProjectCard interactive outer focus boundary and link wrapper",
    tag: "canonical",
  },
  {
    id: "radius-card-squircle",
    name: "Media Card Squircle",
    value: "26px",
    radiusValue: "26px",
    className: "rounded-[26px]",
    usage: "ProjectCard media aspect box, inner stroke overlay, image fill",
    tag: "canonical",
    description: "Continuous curve squircle radius for smooth image clipping.",
  },
  {
    id: "radius-card-token",
    name: "DESIGN.md Card Token",
    value: "26px",
    radiusValue: "26px",
    className: "rounded-[26px]",
    usage: "Canonical card specification in DESIGN.md",
    tag: "canonical",
  },
  {
    id: "radius-md",
    name: "Medium Radius",
    value: "16px",
    radiusValue: "16px",
    className: "rounded-2xl",
    usage: "System preview tiles, modal containers, interactive cards",
    tag: "canonical",
  },
  {
    id: "radius-sm",
    name: "Small Radius",
    value: "8px",
    radiusValue: "8px",
    className: "rounded-lg",
    usage: "Inline code chips, small badges, and tooltips",
    tag: "canonical",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. SPACING & LAYOUT TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const SPACING_TOKENS: SpacingToken[] = [
  {
    id: "space-max-layout",
    name: "Max Layout Width",
    value: "1334px",
    pixelValue: "1334px",
    className: "max-w-[1334px]",
    usage: "Main portfolio layout container in layout.tsx",
    tag: "canonical",
    dimensionType: "layout-max-width",
  },
  {
    id: "space-max-bio",
    name: "Max Bio Content Width",
    value: "800px",
    pixelValue: "800px",
    className: "max-w-[800px]",
    usage: "Intro bio copy paragraph constraint",
    tag: "canonical",
    dimensionType: "layout-max-width",
  },
  {
    id: "space-max-about",
    name: "Max About Column Width",
    value: "688px",
    pixelValue: "688px",
    className: "max-w-[688px]",
    usage: "About hero and editorial paragraph measure",
    tag: "canonical",
    dimensionType: "layout-max-width",
  },
  {
    id: "space-gutter",
    name: "Responsive Viewport Gutter",
    value: "24px to 56px (px-6 sm:px-14)",
    pixelValue: "24px / 56px",
    className: "px-6 sm:px-14",
    usage: "Standard horizontal margin for header, page content, and footer",
    tag: "canonical",
    dimensionType: "gutter-padding",
  },
  {
    id: "space-section-gap",
    name: "Page Section Vertical Gap",
    value: "48px (gap-12)",
    pixelValue: "48px",
    remValue: "3rem",
    className: "gap-12",
    usage: "Vertical spacing rhythm between major page sections and dividers",
    tag: "canonical",
    dimensionType: "component-gap",
  },
  {
    id: "space-project-grid-gap",
    name: "Project Grid Card Gap",
    value: "32px (gap-8)",
    pixelValue: "32px",
    remValue: "2rem",
    className: "gap-8",
    usage: "2-column project grid spacing between cards",
    tag: "canonical",
    dimensionType: "component-gap",
  },
  {
    id: "space-nav-pill-padding",
    name: "Navigation Tab Padding",
    value: "6px top/bottom, 15px left/right",
    pixelValue: "6px 15px",
    className: "px-[15px] py-[6px]",
    usage: "Internal hit-box padding for navigation pill links",
    tag: "canonical",
    dimensionType: "component-padding",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. MATERIAL & EFFECT TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const EFFECT_TOKENS: EffectToken[] = [
  {
    id: "effect-paper-dot-grid",
    name: "Tactile Paper Dot Grid (16px)",
    value: "radial-gradient(rgba(0, 0, 0, 0.015) 1px, transparent 1px) 16px 16px",
    className: "bg-[radial-gradient(rgba(0,0,0,0.015)_1px,transparent_1px)] [background-size:16px_16px]",
    usage: "Applied globally to body background to produce paper texture feel",
    tag: "canonical",
    effectType: "dot-grid",
    description: "Extremely subtle 1.5% opacity radial dot grid that creates material depth.",
  },
  {
    id: "effect-canvas-dot-grid",
    name: "Canvas Spatial Grid (20px)",
    value: "radial-gradient(circle, rgba(200, 213, 187, 0.55) 1px, transparent 1px) 20px 20px",
    className: "dot-grid",
    usage: "Applied to InfiniteCanvas and /play route background",
    tag: "canonical",
    effectType: "dot-grid",
    description: "Willow-tinted 20px coordinate grid for infinite panning workspace.",
  },
  {
    id: "effect-header-gradient-blur",
    name: "Progressive Header Blur Mask",
    value: "linear-gradient(to bottom, #fbfaf5 e92...) + backdrop-filter: blur(16px) + mask-image",
    className: "backdrop-blur-[16px]",
    usage: "Fixed top overlay spanning header area with gradual blur fade",
    tag: "canonical",
    effectType: "backdrop-blur",
    description: "Dual WebkitMaskImage + linear gradient progressive blur that blends smoothly into content.",
  },
  {
    id: "effect-footer-willow-blur",
    name: "Willow Frost Footer Blur Mask",
    value: "linear-gradient(to top, rgba(200,213,187,0.75)...) + backdrop-filter: blur(16px)",
    className: "backdrop-blur-[16px]",
    usage: "Full-bleed footer backdrop atmospheric blur",
    tag: "canonical",
    effectType: "backdrop-blur",
  },
  {
    id: "effect-grain-overlay",
    name: "SVG Turbulence Noise Grain",
    value: "feTurbulence(0.8, 4 octaves) • mix-blend-overlay • opacity 4.5%",
    className: "mix-blend-overlay opacity-[0.045]",
    usage: "Fixed full-viewport GrainOverlay component for tactile analog noise",
    tag: "canonical",
    effectType: "noise",
  },
  {
    id: "effect-shimmer-text",
    name: "Willow Text Shimmer",
    value: "shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] duration-7500",
    className: "shimmer shimmer-spread-16 shimmer-angle-45 shimmer-color-[#c8d5bb] shimmer-duration-7500",
    usage: "Intro bio copy paragraph subtle light sweep",
    tag: "canonical",
    effectType: "shimmer",
  },
  {
    id: "effect-gradient-divider",
    name: "Willow Gradient Divider",
    value: "linear-gradient(to right, transparent, rgba(200, 213, 187, 0.8), transparent)",
    className: "gradient-divider / bg-gradient-to-r",
    usage: "Section horizontal separation rules in Home, About, and Footer",
    tag: "canonical",
    effectType: "gradient-mask",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 7. MOTION & ANIMATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const MOTION_TOKENS: MotionToken[] = [
  {
    id: "motion-duration-micro",
    name: "--duration-micro",
    value: "80ms",
    duration: "80ms",
    className: "duration-[80ms]",
    usage: "Eye blink lid squeeze, instant click down feedback",
    tag: "canonical",
    motionType: "duration",
    description: "Transitions.dev micro tier for ultra-fast physical responses.",
  },
  {
    id: "motion-duration-quick",
    name: "--duration-quick",
    value: "150ms",
    duration: "150ms",
    className: "duration-150",
    usage: "Pressable :active scale(0.96), live clock character tick, hover colors",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-duration-fast",
    name: "--duration-fast",
    value: "250ms",
    duration: "250ms",
    className: "duration-250",
    usage: "Card reveals, page transition slides, nav pill layout animation fallback",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-duration-medium",
    name: "--duration-medium",
    value: "350ms",
    duration: "350ms",
    className: "duration-350",
    usage: "Project modal sheet expansion and drawer transitions",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-duration-slow",
    name: "--duration-slow",
    value: "400ms",
    duration: "400ms",
    className: "duration-400",
    usage: "Hero entrance reveals and complex orchestrated transitions",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-duration-stagger",
    name: "--duration-stagger",
    value: "40ms",
    duration: "40ms",
    className: "delay-[40ms]",
    usage: "Stagger offset delay between sequential list and grid items",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-ease-smooth-out",
    name: "--ease-smooth-out / --tabs-ease",
    value: "cubic-bezier(0.22, 1, 0.36, 1)",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    usage: "Primary natural deceleration curve used across all UI elements and Framer animations",
    tag: "canonical",
    motionType: "easing",
    description: "Apple-style rapid onset with gentle, frictionless organic settling.",
  },
  {
    id: "motion-ease-bounce",
    name: "--ease-bounce",
    value: "cubic-bezier(0.34, 1.36, 0.64, 1)",
    easing: "cubic-bezier(0.34, 1.36, 0.64, 1)",
    usage: "Playful micro-overshoot for badges and active triggers",
    tag: "canonical",
    motionType: "easing",
  },
  {
    id: "motion-spring-pupil",
    name: "Pupil Tracking Spring",
    value: "stiffness: 280, damping: 22",
    springConfig: { stiffness: 280, damping: 22 },
    usage: "InteractiveTsuLogo pupil pointer follow physics",
    tag: "canonical",
    motionType: "spring",
    description: "Responsive tracking spring with zero sluggish lag.",
  },
  {
    id: "motion-spring-nav-pill",
    name: "Active Nav Pill Spring",
    value: "stiffness: 400, damping: 32, mass: 0.8",
    springConfig: { stiffness: 400, damping: 32, mass: 0.8 },
    usage: "NavigationTabs shared layoutId active pill morph between tabs",
    tag: "canonical",
    motionType: "spring",
  },
  {
    id: "motion-pressable-feedback",
    name: "Pressable Feedback (:active)",
    value: "scale(0.96) • 150ms cubic-bezier(0.22, 1, 0.36, 1)",
    usage: "Applied to all interactive links, buttons, and cards via .pressable class",
    tag: "canonical",
    motionType: "interaction",
    description: "Immediate tactile spring depression upon pointer down.",
  },
  {
    id: "motion-keyframe-pulse",
    name: "@keyframes statusPulse",
    value: "scale(0.95 -> 1.8) • opacity(0.8 -> 0) • 2.4s infinite",
    className: "green-pulse-ring",
    usage: "LiveClock active status green pulsing ring",
    tag: "canonical",
    motionType: "keyframe",
  },
  {
    id: "motion-keyframe-blink",
    name: "@keyframes toonBlink",
    value: "scaleY(1 -> 0.1) • 15s infinite periodic cycle",
    className: "animate-toon-blink",
    usage: "InteractiveTsuLogo periodic auto-blink cycle",
    tag: "canonical",
    motionType: "keyframe",
  },
];
