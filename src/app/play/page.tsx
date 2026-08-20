import { Carousel3D, type Carousel3DItem } from "@/components/Carousel3D";
import { client } from "@/sanity/client";
import { PLAY_ITEMS_QUERY } from "@/sanity/queries";
import { PlayPageClient } from "./play-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RICK_ASTLEY_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const DEFAULT_PLAY_ITEMS: Carousel3DItem[] = [
  {
    type: "video",
    src: "/intro.mp4",
    title: "Motion Identity & Kinetic Reel",
    tag: "Motion & Video",
    badge: "Featured",
    year: "2025",
    description: "Explorations in tactile physics, frame-accurate momentum, and motion branding.",
    details:
      "A high-energy reel testing physics-driven transitions, optical momentum curves, and micro-delights for modern web and native experiences.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(251, 146, 60, 0.35)", // warm amber tangerine
      topRight: "rgba(244, 63, 94, 0.28)", // rose magenta flare
      bottomLeft: "rgba(168, 85, 247, 0.24)", // violet tungsten
      bottomRight: "rgba(251, 191, 36, 0.22)", // golden flare
      centerGlow: "rgba(251, 146, 60, 0.20)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/apple_vision.png",
    title: "Spatial Vision UI",
    tag: "Spatial UI",
    badge: "Prototype",
    year: "2025",
    description: "Designing spatial gesture primitives & dynamic glass materials.",
    details:
      "Explorations in spatial interface design, exploring eye-tracking affordances, translucent glass depth, and physical gesture feedback for spatial computing platforms.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(168, 85, 247, 0.32)", // ethereal violet
      topRight: "rgba(56, 189, 248, 0.28)", // spatial cyan
      bottomLeft: "rgba(244, 114, 182, 0.25)", // soft glass rose
      bottomRight: "rgba(129, 140, 248, 0.22)", // indigo aura
      centerGlow: "rgba(192, 132, 252, 0.18)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/polaroid_studio.png",
    title: "Polaroid Camera Shader",
    tag: "Shader & WebGL",
    badge: "Interactive",
    year: "2025",
    description: "Interactive instant camera app with real-time film emulsion shaders.",
    details:
      "A custom WebGL canvas implementation simulating analog film development curves, grain density, and light leaks in real-time.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(245, 158, 11, 0.36)", // vintage film burn amber
      topRight: "rgba(234, 88, 12, 0.30)", // burnt orange leak
      bottomLeft: "rgba(253, 224, 71, 0.25)", // golden emulsion
      bottomRight: "rgba(249, 115, 22, 0.22)", // warm sepia
      centerGlow: "rgba(245, 158, 11, 0.20)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/canvas_os.png",
    title: "Canvas OS & Spatial Nodes",
    tag: "Infinite Canvas",
    badge: "OS Design",
    year: "2025",
    description: "Infinite spatial workspace with physics-based nodes and gesture flow.",
    details:
      "An experiment in infinite visual node mapping, bi-directional connections, and spring-driven card layout algorithms.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(59, 130, 246, 0.32)", // cobalt blue
      topRight: "rgba(6, 182, 212, 0.28)", // electric cyan
      bottomLeft: "rgba(99, 102, 241, 0.24)", // neon indigo
      bottomRight: "rgba(14, 165, 233, 0.20)", // sky flare
      centerGlow: "rgba(59, 130, 246, 0.18)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/screentime_receipt.png",
    title: "Screentime Thermal Print",
    tag: "Data Viz",
    badge: "Hardware UI",
    year: "2025",
    description: "Visualizing personal digital consumption as thermal printed store receipts.",
    details:
      "Translating screen time analytics into physical receipts with itemized application usage, pickup metrics, and digital wellbeing summaries.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(100, 116, 139, 0.28)", // titanium slate
      topRight: "rgba(16, 185, 129, 0.28)", // thermal receipt mint green
      bottomLeft: "rgba(148, 163, 184, 0.22)", // soft graphite
      bottomRight: "rgba(52, 211, 153, 0.20)", // emerald sheen
      centerGlow: "rgba(148, 163, 184, 0.18)",
    },
  },
  {
    type: "video",
    src: "/intro.mp4",
    title: "Fluid Micro-Interactions",
    tag: "Motion & Video",
    year: "2025",
    description: "Prototyping responsive spring curves and physical touch feedback.",
    details:
      "Studies on making touch and pointer interactions feel instantaneous, interruptible, and grounded in real-world physical dynamics.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(249, 115, 22, 0.34)", // sunset coral
      topRight: "rgba(225, 29, 72, 0.28)", // vivid crimson
      bottomLeft: "rgba(168, 85, 247, 0.24)", // soft lavender
      bottomRight: "rgba(251, 146, 60, 0.22)", // tangerine glow
      centerGlow: "rgba(249, 115, 22, 0.18)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/polaroid_studio.png",
    title: "Holographic Foil Shader",
    tag: "Shader & WebGL",
    year: "2024",
    description: "Multi-layered rainbow holographic card reflection with dynamic cursor glare.",
    details:
      "Real-time 3D tilt matrix transformation calculating specular light reflections and spectral color dispersion as the mouse traverses the card surface.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(6, 182, 212, 0.34)", // iridescent cyan
      topRight: "rgba(236, 72, 153, 0.30)", // prismatic magenta
      bottomLeft: "rgba(250, 204, 21, 0.25)", // solar yellow
      bottomRight: "rgba(168, 85, 247, 0.22)", // violet dispersion
      centerGlow: "rgba(236, 72, 153, 0.18)",
    },
  },
  {
    type: "image",
    src: "/assets/projects/apple_vision.png",
    title: "Tactile Systems & Polish",
    tag: "Design Systems",
    year: "2025",
    description: "Software as a malleable medium — unseen details compounding into feeling right.",
    details:
      "A curated collection of design tokens, accessible components, and custom motion primitives built for scale and polish.",
    href: RICK_ASTLEY_URL,
    ambientColors: {
      topLeft: "rgba(132, 204, 22, 0.30)", // fresh willow
      topRight: "rgba(234, 179, 8, 0.26)", // warm honey
      bottomLeft: "rgba(34, 197, 94, 0.22)", // soft emerald
      bottomRight: "rgba(200, 213, 187, 0.35)", // signature willow grey
      centerGlow: "rgba(200, 213, 187, 0.22)",
    },
  },
];

function resolveFallbackMedia(item: any): { src: string; type: "image" | "video" } {
  if (item.src) {
    const isVideo =
      item.type === "video" ||
      item.video ||
      typeof item.src === "string" && (item.src.endsWith(".mp4") || item.src.endsWith(".webm"));
    return { src: item.src, type: isVideo ? "video" : "image" };
  }
  if (item.image) {
    return { src: item.image, type: "image" };
  }
  if (item.video) {
    return { src: item.video, type: "video" };
  }

  const title = (item.title || "").toLowerCase();
  const tag = (item.tag || item.category || "").toLowerCase();

  if (title.includes("motion") || title.includes("reel") || tag.includes("video")) {
    return { src: "/intro.mp4", type: "video" };
  }
  if (title.includes("spatial") || title.includes("vision") || tag.includes("spatial")) {
    return { src: "/assets/projects/apple_vision.png", type: "image" };
  }
  if (title.includes("polaroid") || title.includes("camera") || tag.includes("shader")) {
    return { src: "/assets/projects/polaroid_studio.png", type: "image" };
  }
  if (title.includes("canvas") || title.includes("os") || tag.includes("canvas")) {
    return { src: "/assets/projects/canvas_os.png", type: "image" };
  }
  if (title.includes("receipt") || title.includes("screentime") || tag.includes("data")) {
    return { src: "/assets/projects/screentime_receipt.png", type: "image" };
  }

  return { src: "/assets/projects/polaroid_studio.png", type: "image" };
}

export default async function PlayPage() {
  let sanityItems: any[] = [];
  try {
    sanityItems = await client.fetch(PLAY_ITEMS_QUERY, {}, { cache: "no-store" });
  } catch (err) {
    console.warn("Failed to fetch Play items from Sanity:", err);
    sanityItems = [];
  }

  // Format all items returned from Sanity Studio database
  const formattedSanityItems: Carousel3DItem[] = Array.isArray(sanityItems) && sanityItems.length > 0
    ? sanityItems.map((item) => {
        const media = resolveFallbackMedia(item);
        return {
          type: media.type,
          src: media.src,
          title: item.title || "Untitled Experiment",
          tag: item.tag || item.category || "Interactive",
          category: item.category || undefined,
          badge: item.badge || undefined,
          year: item.year || "2025",
          description: item.description || "",
          details: item.details || item.description || "",
          href: item.href || item.link || RICK_ASTLEY_URL,
        };
      })
    : [];

  // Use live Sanity items whenever available; fallback to default if Sanity is empty
  const initialItems =
    formattedSanityItems.length > 0 ? formattedSanityItems : DEFAULT_PLAY_ITEMS;

  return (
    <div className="relative w-full min-h-[calc(100vh-140px)] flex flex-col items-center justify-start pb-16">
      <PlayPageClient initialItems={initialItems} />
    </div>
  );
}
