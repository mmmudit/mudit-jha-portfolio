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
  category: "brand" | "neutral" | "functional";
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
// 1. COLOR TOKENS (Strictly audited from DESIGN.md and active main site)
// ─────────────────────────────────────────────────────────────────────────────
export const COLOR_TOKENS: ColorToken[] = [
  {
    id: "color-dough",
    name: "Dough",
    value: "oklch(0.985 0.007 95.8)",
    hex: "#fbfaf5",
    oklch: "oklch(0.985 0.007 95.8)",
    variable: "--dough",
    className: "bg-dough text-dough",
    usage: "Primary tactile paper background across the entire site, cards, & modals",
    tag: "canonical",
    category: "brand",
    description: "Warm raw paper tone grounding the visual sanctuary.",
  },
  {
    id: "color-willow-grey",
    name: "Willow Grey",
    value: "oklch(0.852 0.035 127.5)",
    hex: "#c8d5bb",
    oklch: "oklch(0.852 0.035 127.5)",
    variable: "--willow-grey",
    className: "bg-willow-grey text-willow-grey",
    usage: "Active navigation pill, 'human' accent word highlight, shimmer accent",
    tag: "canonical",
    category: "brand",
    description: "The primary voice accent. Used exclusively for active highlights.",
  },
  {
    id: "color-rust-grey",
    name: "Rust Grey",
    value: "oklch(0.435 0.024 205.2)",
    hex: "#47585c",
    oklch: "oklch(0.435 0.024 205.2)",
    variable: "--rust-grey",
    className: "bg-rust-grey text-rust-grey",
    usage: "Timestamps, live clock text, secondary metadata, and quote accents",
    tag: "canonical",
    category: "brand",
    description: "Deep muted slate-teal for secondary hierarchy.",
  },
  {
    id: "color-zinc-800",
    name: "Zinc 800",
    value: "oklch(0.248 0.007 286.0)",
    hex: "#27272a",
    oklch: "oklch(0.248 0.007 286.0)",
    variable: "--zinc-800",
    className: "text-zinc-800 bg-zinc-800",
    usage: "Display headings ('mudit jha', 'about'), primary readable text",
    tag: "canonical",
    category: "neutral",
    description: "High-contrast graphite charcoal instead of stark black.",
  },
  {
    id: "color-button-secondary",
    name: "Button Secondary",
    value: "oklch(0.579 0.003 286.0)",
    hex: "#7f7f80",
    oklch: "oklch(0.579 0.003 286.0)",
    variable: "--button-secondary",
    className: "text-button-secondary",
    usage: "Hero bio subtitle descriptions, live clock HUD metadata",
    tag: "canonical",
    category: "neutral",
    description: "Balanced neutral grey for metadata and guidance copy.",
  },
  {
    id: "color-zinc-300",
    name: "Zinc 300",
    value: "oklch(0.869 0.005 286.0)",
    hex: "#d4d4d8",
    oklch: "oklch(0.869 0.005 286.0)",
    variable: "--zinc-300",
    className: "border-zinc-300 text-zinc-300",
    usage: "Interactive pill borders and subtle stroke outlines",
    tag: "canonical",
    category: "neutral",
    description: "Tactile crisp stroke definition for interactive boundaries.",
  },
  {
    id: "color-status-green",
    name: "Status Green",
    value: "oklch(0.686 0.170 148.5)",
    hex: "#31b564",
    oklch: "oklch(0.686 0.170 148.5)",
    variable: "--status-green",
    className: "bg-status-green text-status-green",
    usage: "Minneapolis live clock real-time pulsing beacon dot",
    tag: "canonical",
    category: "functional",
    description: "Emerald beacon indicating active live status.",
  },
  {
    id: "color-button-primary",
    name: "Button Primary",
    value: "oklch(0.428 0.010 286.0)",
    hex: "#52525b",
    oklch: "oklch(0.428 0.010 286.0)",
    variable: "--button-primary",
    className: "bg-button-primary text-button-primary",
    usage: "Primary dark graphite action button background",
    tag: "canonical",
    category: "brand",
    description: "Primary dark graphite tone for solid interactive fills.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY TOKENS (Audited from DESIGN.md and main site typography scale)
// ─────────────────────────────────────────────────────────────────────────────
export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  {
    id: "type-hero-display",
    name: "Display Hero (mudit jha)",
    value: "Delight 600 • 48px • tracking -3px • line-height 1",
    fontFamily: "var(--font-figtree)",
    fontSize: "48px",
    fontWeight: 600,
    letterSpacing: "-3px",
    lineHeight: "1",
    className: "font-display text-[48px] font-semibold tracking-[-3px]",
    usage: "Main portfolio name hero title ('mudit jha')",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-section-title",
    name: "Section Display Title",
    value: "Delight 600 • 36px • tracking -3px",
    fontFamily: "var(--font-figtree)",
    fontSize: "36px",
    fontWeight: 600,
    letterSpacing: "-3px",
    className: "font-display text-[36px] font-semibold tracking-[-3px]",
    usage: "Main page section headings ('about', etc.)",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-subheading-shimmer",
    name: "Shimmer Subtitle Lead",
    value: "Delight 500 • 26px • tracking -0.1px • line-height 1.3",
    fontFamily: "var(--font-figtree)",
    fontSize: "26px",
    fontWeight: 500,
    letterSpacing: "-0.1px",
    lineHeight: "1.3",
    className: "font-display text-[26px] font-medium leading-[1.3] tracking-[-0.1px]",
    usage: "Introductory bio copy with subtle light sweep",
    tag: "canonical",
    fontCategory: "display",
  },
  {
    id: "type-nav-pill-label",
    name: "Navigation Pill Label",
    value: "Geist Sans 400 • 18px • tracking -1px",
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
    value: "Geist Sans 400 • 16px • tracking 0.005em • line-height 1.625",
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
    value: "Geist Sans 600 • 26px–46px • tracking -1px",
    fontFamily: "var(--font-geist-sans)",
    fontSize: "46px",
    fontWeight: 600,
    letterSpacing: "-1px",
    className: "font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px]",
    usage: "Footer interactive social links (instagram, linkedin, github, x, substack)",
    tag: "canonical",
    fontCategory: "body",
  },
  {
    id: "type-mono-clock-digits",
    name: "HUD Tabular Numbers (Live Clock)",
    value: "Geist Pixel Square • 15px • tabular-nums",
    fontFamily: "var(--font-geist-pixel-square)",
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
    description: "Custom handwriting font injecting authorial warmth.",
  },
  {
    id: "type-handwriting-say-hi",
    name: "Handwriting Footer Header ('say hi!')",
    value: "MyFont Regular • 36px–48px • tracking -1px",
    fontFamily: "var(--font-myfont)",
    fontSize: "48px",
    fontWeight: 400,
    letterSpacing: "-1px",
    className: "font-hand text-[36px] sm:text-[44px] md:text-[48px] leading-tight tracking-[-1px]",
    usage: "Footer call to action ('say hi!') above directional chevron",
    tag: "canonical",
    fontCategory: "handwriting",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHADOW & ELEVATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
export const SHADOW_TOKENS: ShadowToken[] = [
  {
    id: "shadow-paper-card",
    name: "Paper Card Shadow",
    value: "0 1px 2px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
    className: "paper-card",
    usage: "Tactile paper depth on static cards and modal containers",
    tag: "canonical",
    elevation: "surface",
    description: "Simulates physical paper lying on a tactile desk.",
  },
  {
    id: "shadow-nav-pill-active",
    name: "Active Nav Pill Shadow",
    value: "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.06)",
    boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 1px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.06)",
    className: "nav-pill-active",
    usage: "Active navigation pill tactile highlight fill",
    tag: "canonical",
    elevation: "raised",
  },
  {
    id: "shadow-floating-dock",
    name: "Floating Dock Shadow",
    value: "0 4px 20px rgba(0, 0, 0, 0.06)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    className: "shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
    usage: "Header navigation floating pill dock container",
    tag: "canonical",
    elevation: "floating",
  },
  {
    id: "shadow-card-badge",
    name: "Project Card Badge Shadow",
    value: "0 2px 8px rgba(0, 0, 0, 0.04)",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    className: "shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
    usage: "Project title & year floating glass badge",
    tag: "canonical",
    elevation: "raised",
  },
  {
    id: "shadow-card-hover",
    name: "Card Hover Elevation",
    value: "0 4px 14px rgba(0, 0, 0, 0.08)",
    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.08)",
    className: "hover:shadow-[0_4px_14px_rgba(0,0,0,0.08)]",
    usage: "Elevated feedback state when hovering over a project card",
    tag: "canonical",
    elevation: "raised",
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
    usage: "Navigation tabs, floating dock, contact button, project badges, live status pulse",
    tag: "canonical",
    description: "Primary geometric shape for interactive pills and buttons.",
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
    usage: "ProjectCard media aspect container & inner image fill",
    tag: "canonical",
    description: "Continuous curve squircle radius for smooth image clipping.",
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
    name: "Max Bio Content Measure",
    value: "800px",
    pixelValue: "800px",
    className: "max-w-[800px]",
    usage: "Intro bio copy paragraph constraint",
    tag: "canonical",
    dimensionType: "layout-max-width",
  },
  {
    id: "space-max-about",
    name: "Max Editorial Column Measure",
    value: "688px",
    pixelValue: "688px",
    className: "max-w-[688px]",
    usage: "About section editorial paragraph measure",
    tag: "canonical",
    dimensionType: "layout-max-width",
  },
  {
    id: "space-gutter",
    name: "Viewport Gutter Padding",
    value: "24px to 56px (px-6 sm:px-14)",
    pixelValue: "24px / 56px",
    className: "px-6 sm:px-14",
    usage: "Standard horizontal margin for header, page content, and footer",
    tag: "canonical",
    dimensionType: "gutter-padding",
  },
  {
    id: "space-section-gap",
    name: "Section Vertical Gap",
    value: "48px (gap-12)",
    pixelValue: "48px",
    remValue: "3rem",
    className: "gap-12",
    usage: "Vertical spacing rhythm between major page sections",
    tag: "canonical",
    dimensionType: "component-gap",
  },
  {
    id: "space-project-grid-gap",
    name: "Project Grid Gap",
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
    description: "Subtle 1.5% opacity radial dot grid creating material depth.",
  },
  {
    id: "effect-header-gradient-blur",
    name: "Progressive Header Blur Mask",
    value: "linear-gradient(to bottom, #fbfaf5...) + backdrop-filter: blur(16px)",
    className: "backdrop-blur-[16px]",
    usage: "Fixed top overlay spanning header area with gradual blur fade",
    tag: "canonical",
    effectType: "backdrop-blur",
    description: "Progressive blur blending smoothly into scrolled page content.",
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
    description: "Micro tier for ultra-fast physical responses.",
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
    usage: "Card reveals, page transition slides, nav pill layout animation",
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
    usage: "Hero entrance reveals and orchestrated transitions",
    tag: "canonical",
    motionType: "duration",
  },
  {
    id: "motion-ease-smooth-out",
    name: "--ease-smooth-out",
    value: "cubic-bezier(0.22, 1, 0.36, 1)",
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    usage: "Primary natural deceleration curve used across all UI surface transitions",
    tag: "canonical",
    motionType: "easing",
    description: "Rapid onset with gentle, frictionless organic settling.",
  },
  {
    id: "motion-spring-nav-pill",
    name: "Active Nav Pill Spring",
    value: "stiffness: 400, damping: 32, mass: 0.8",
    springConfig: { stiffness: 400, damping: 32, mass: 0.8 },
    usage: "NavigationTabs active pill layout animation",
    tag: "canonical",
    motionType: "spring",
  },
  {
    id: "motion-spring-pupil",
    name: "Pupil Tracking Spring",
    value: "stiffness: 280, damping: 22",
    springConfig: { stiffness: 280, damping: 22 },
    usage: "InteractiveTsuLogo pupil pointer follow physics",
    tag: "canonical",
    motionType: "spring",
  },
  {
    id: "motion-pressable-feedback",
    name: "Pressable Feedback (:active)",
    value: "scale(0.97) • 150ms cubic-bezier(0.22, 1, 0.36, 1)",
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
];
