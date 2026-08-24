/**
 * ============================================================================
 * PLAYGROUND MANUAL LAYOUT CONFIGURATION
 * ============================================================================
 *
 * Hand-authored, natural scatter mood-board layout on a 3000 x 2000 canvas.
 * Center anchor point: (1500, 1000).
 *
 * LAYOUT PRINCIPLES APPLIED:
 * ----------------------------------------------------------------------------
 * 1. Asymmetric Center Constellation ("Above the Fold"):
 *    - Hand-placed around (1500, 1000) with organic offsets (not a rigid ring).
 *    - Flagship pieces ('lg') paired with accent cards ('md'/'sm') for tactile rhythm.
 *    - Varied rotations (-5° to +4.5°) for an authentic pinboard mood.
 *
 * 2. Multi-Directional Exploration Corridors:
 *    - North-West, North-East, South-West, and South-East outer zones contain
 *      rewarding experiments when panning the canvas.
 *    - Generous edge margins (>250px) ensure ambient parallax never reveals dead zones.
 */

import { PlaygroundCardSize, SIZE_DIMENSIONS } from "@/lib/generateScatterLayout";
import { DragCanvasItem } from "@/components/DragCanvas";

export interface PlaygroundItemConfig {
  id: string;
  title: string;
  caption?: string;
  description?: string;
  imageSrc?: string;
  videoSrc?: string;
  type?: "image" | "video" | "note";
  size: PlaygroundCardSize;
  x: number; // canvas pixel x (left)
  y: number; // canvas pixel y (top)
  rotation: number; // degrees: -6 to 6
  tag?: string;
  year?: string;
  badge?: string;
  details?: string;
  href?: string;
  aspect?: string;
}

export const PLAYGROUND_CONFIG_ITEMS: PlaygroundItemConfig[] = [
  // ── CORE HERO CLUSTER (Immediately visible on initial land) ──────────────

  // 1. Top-Left Flagship (North-West Hero Video)
  {
    id: "motion-identity-reel",
    title: "Kinetic Identity Reel",
    caption: "Tactile physics, frame-accurate momentum, and micro-delight motion branding.",
    videoSrc: "/intro.mp4",
    type: "video",
    size: "lg",
    x: 1040,
    y: 480,
    rotation: -2.8,
    tag: "Motion & Video",
    badge: "Featured",
    year: "2025",
    details:
      "A high-energy reel testing physics-driven transitions, optical momentum curves, and micro-delights for modern web and native experiences.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 2. Top-Right Flagship (North-East Interactive Shader)
  {
    id: "polaroid-studio",
    title: "Polaroid Camera Shader",
    caption: "Real-time film emulsion curve simulation & chemical development process in WebGL.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    type: "image",
    size: "lg",
    x: 1620,
    y: 490,
    rotation: 3.6,
    tag: "WebGL Shader",
    badge: "Interactive",
    year: "2025",
    details:
      "A custom WebGL canvas implementation simulating analog film development curves, grain density, and light leaks in real-time.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 3. Right Mid Flagship (East Spatial Workspace)
  {
    id: "canvas-os",
    title: "Canvas OS & Nodes",
    caption: "Infinite spatial workspace with physics-based card links and gesture flow.",
    imageSrc: "/assets/projects/canvas_os.png",
    type: "image",
    size: "lg",
    x: 1820,
    y: 840,
    rotation: -1.5,
    tag: "Interface",
    badge: "OS Design",
    year: "2025",
    details:
      "An experiment in infinite visual node mapping, bi-directional connections, and spring-driven card layout algorithms.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 4. Left Mid Hardware UI (West Thermal Print)
  {
    id: "screentime-receipt",
    title: "Screentime Thermal Print",
    caption: "Visualizing personal digital consumption as thermal printed itemized store receipts.",
    imageSrc: "/assets/projects/screentime_receipt.png",
    type: "image",
    size: "md",
    x: 830,
    y: 820,
    rotation: 4.2,
    tag: "Data Viz",
    badge: "Hardware UI",
    year: "2025",
    details:
      "Translating screen time analytics into physical receipts with itemized application usage, pickup metrics, and digital wellbeing summaries.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 5. Bottom-Left Shader (South-West 3D Glare Card)
  {
    id: "holographic-shader",
    title: "Holographic Foil Shader",
    caption: "Multi-layered rainbow holographic foil reflection with dynamic cursor glare.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    type: "image",
    size: "md",
    x: 960,
    y: 1220,
    rotation: -3.8,
    tag: "WebGL Shader",
    year: "2025",
    details:
      "Real-time 3D tilt matrix transformation calculating specular light reflections and spectral color dispersion.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 6. Bottom-Center Philosophy Note (South Tactile Paper Pin)
  {
    id: "malleable-medium",
    title: "Malleable Medium",
    caption: "Software is the ultimate malleable medium — interfaces should feel tactile, alive, and responsive.",
    type: "note",
    size: "md",
    x: 1330,
    y: 1280,
    rotation: 1.8,
    tag: "Thought Note",
    year: "2025",
    details:
      "Notes on UI polish: unseen details compound into something that feels right. Good default physics and intentional easings make software feel human.",
  },

  // 7. Bottom-Right Portrait (South-East Studio Photo)
  {
    id: "avatar-portrait",
    title: "Analog Studio Portrait",
    caption: "Hand-printed studio portrait on warm heavyweight textured stock paper.",
    imageSrc: "/assets/avatar.png",
    type: "image",
    size: "md",
    x: 1680,
    y: 1210,
    rotation: 2.8,
    tag: "Portrait",
    year: "2026",
    details: "Studio self-portrait taken in Minneapolis with physical medium format camera.",
    href: "https://muditjha.me",
  },

  // ── PERIPHERAL EXPLORATION PIECES (Discovered via Canvas Drag) ───────────

  // 8. North Accent Corridor (Spatial Vision)
  {
    id: "spatial-vision",
    title: "Spatial Vision UI",
    caption: "Dynamic glass shaders and physical eye-tracking feedback primitives for visionOS.",
    imageSrc: "/assets/projects/apple_vision.png",
    type: "image",
    size: "lg",
    x: 1340,
    y: 200,
    rotation: 1.2,
    tag: "Spatial UI",
    badge: "Prototype",
    year: "2025",
    details:
      "Explorations in spatial interface design, exploring eye-tracking affordances, translucent glass depth, and physical gesture feedback for spatial computing platforms.",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  // 9. North-West Deep Corner (Fluid Gesture Physics)
  {
    id: "fluid-gestures",
    title: "Fluid Gesture Physics",
    caption: "Spring-interruptible continuous direct-manipulation gestures with momentum carry-through.",
    imageSrc: "/assets/projects/canvas_os.png",
    type: "image",
    size: "md",
    x: 440,
    y: 320,
    rotation: -4.5,
    tag: "Physics Engine",
    year: "2025",
  },

  // 10. North-East Deep Corner (Chroma Depth Pass)
  {
    id: "chroma-depth",
    title: "Chroma Depth Pass",
    caption: "Multi-pass post-processing shader decomposing depth buffers into optical chromatic fringing.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    type: "image",
    size: "sm",
    x: 2360,
    y: 380,
    rotation: -2.6,
    tag: "Shader Pass",
    year: "2025",
  },

  // 11. South-East Deep Corner (Synthesized Haptics Note)
  {
    id: "tactile-sound",
    title: "Synthesized Haptics",
    caption: "Micro-frequency synthesized clicks and tactile audio designed for zero-latency feedback.",
    type: "note",
    size: "sm",
    x: 2340,
    y: 1360,
    rotation: 4.6,
    tag: "Sound Design",
    year: "2025",
    details: "Using Web Audio API synthesized oscillators for zero-latency physical feedback cues.",
  },

  // 12. South-West Deep Corner (Typographic Distortion)
  {
    id: "typographic-mesh",
    title: "Typographic Mesh Distortion",
    caption: "Interactive vertex-displaced typography reacting to pointer velocity and pressure.",
    imageSrc: "/assets/projects/apple_vision.png",
    type: "image",
    size: "md",
    x: 420,
    y: 1380,
    rotation: 3.2,
    tag: "Typography",
    year: "2025",
  },
];

/**
 * Converts manual config items into DragCanvasItem format, applying
 * size-to-pixel mappings and setting up absolute position coordinates.
 */
export function getPlaygroundItems(): DragCanvasItem[] {
  return PLAYGROUND_CONFIG_ITEMS.map((item) => {
    const pixelWidth = SIZE_DIMENSIONS[item.size || "md"];
    return {
      ...item,
      width: pixelWidth,
      top: item.y,
      left: item.x,
      x: item.x,
      y: item.y,
    };
  });
}
