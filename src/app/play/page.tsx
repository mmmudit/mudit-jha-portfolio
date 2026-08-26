import { DragCanvas, type DragCanvasItem } from "@/components/DragCanvas";
import { getPlaygroundItems, PLAYGROUND_CONFIG_ITEMS } from "@/data/playgroundItems";
import { client } from "@/sanity/client";
import { PLAY_ITEMS_QUERY } from "@/sanity/queries";
import { PlayPageClient } from "./play-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Natural scatter fallback positions around canvas center (1500, 1000)
const SCATTER_POSITIONS = [
  { top: 480,  left: 1040, rotation: -2.8, width: 340 }, // NW Hero
  { top: 490,  left: 1620, rotation: 3.6,  width: 340 }, // NE Hero
  { top: 840,  left: 1820, rotation: -1.5, width: 340 }, // E Hero
  { top: 820,  left: 830,  rotation: 4.2,  width: 260 }, // W Card
  { top: 1220, left: 960,  rotation: -3.8, width: 260 }, // SW Card
  { top: 1280, left: 1330, rotation: 1.8,  width: 260 }, // S Note
  { top: 1210, left: 1680, rotation: 2.8,  width: 260 }, // SE Photo
  { top: 200,  left: 1340, rotation: 1.2,  width: 340 }, // N Accent
  // Outer Exploration Quadrants
  { top: 320,  left: 440,  rotation: -4.5, width: 260 }, // NW Corner
  { top: 380,  left: 2360, rotation: -2.6, width: 180 }, // NE Corner
  { top: 1360, left: 2340, rotation: 4.6,  width: 180 }, // SE Corner
  { top: 1380, left: 420,  rotation: 3.2,  width: 260 }, // SW Corner
];

function resolveFallbackMedia(item: any): { imageSrc?: string; videoSrc?: string; type: "image" | "video" | "note" | "folder" } {
  if (item.type === "folder" || item.category === "folder" || item.type === "folder-card") {
    const imageSrc = item.image || item.src || item.mediaUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";
    return { type: "folder", imageSrc };
  }

  if (item.type === "note") {
    return { type: "note" };
  }

  const isVideo =
    item.type === "video" ||
    item.video ||
    (typeof item.src === "string" && (item.src.endsWith(".mp4") || item.src.endsWith(".webm"))) ||
    (typeof item.mediaUrl === "string" && (item.mediaUrl.endsWith(".mp4") || item.mediaUrl.endsWith(".webm")));

  if (isVideo) {
    return {
      videoSrc: item.video || item.src || item.mediaUrl || "/intro.mp4",
      type: "video",
    };
  }

  const imageSrc = item.image || item.src || item.mediaUrl;
  if (imageSrc) {
    return { imageSrc, type: "image" };
  }

  const title = (item.title || "").toLowerCase();
  const tag = (item.tag || item.category || "").toLowerCase();

  if (title.includes("motion") || title.includes("reel") || tag.includes("video")) {
    return { videoSrc: "/intro.mp4", type: "video" };
  }
  if (title.includes("spatial") || title.includes("vision") || tag.includes("spatial")) {
    return { imageSrc: "/assets/projects/apple_vision.png", type: "image" };
  }
  if (title.includes("polaroid") || title.includes("camera") || tag.includes("shader")) {
    return { imageSrc: "/assets/projects/polaroid_studio.png", type: "image" };
  }
  if (title.includes("canvas") || title.includes("os") || tag.includes("canvas")) {
    return { imageSrc: "/assets/projects/canvas_os.png", type: "image" };
  }
  if (title.includes("receipt") || title.includes("screentime") || tag.includes("data")) {
    return { imageSrc: "/assets/projects/screentime_receipt.png", type: "image" };
  }

  return { imageSrc: "/assets/projects/polaroid_studio.png", type: "image" };
}

export default async function PlayPage() {
  let sanityItems: any[] = [];
  try {
    sanityItems = await client.fetch(PLAY_ITEMS_QUERY, {}, { cache: "no-store" });
  } catch (err) {
    console.warn("Failed to fetch Play items from Sanity:", err);
    sanityItems = [];
  }

  // Format Sanity items with deliberate scatter coordinates and sizes
  const formattedSanityItems: DragCanvasItem[] = Array.isArray(sanityItems) && sanityItems.length > 0
    ? sanityItems.map((item, idx) => {
        const media = resolveFallbackMedia(item);
        const scatter = SCATTER_POSITIONS[idx % SCATTER_POSITIONS.length];

        // Check if there is a manual config override matching this item by id or title
        const itemId = item.id || item._id;
        const normalizedTitle = (item.title || "").toLowerCase().trim();
        const configOverride = PLAYGROUND_CONFIG_ITEMS.find(
          (c) => c.id === itemId || c.title.toLowerCase().trim() === normalizedTitle
        );

        const x = typeof item.x === "number" ? item.x : configOverride ? configOverride.x : scatter.left;
        const y = typeof item.y === "number" ? item.y : configOverride ? configOverride.y : scatter.top;
        const rotation = typeof item.rotation === "number" ? item.rotation : configOverride ? configOverride.rotation : scatter.rotation;
        const size = item.size || configOverride?.size;
        const width = typeof item.width === "number" ? item.width : undefined;

        return {
          id: itemId || `sanity-item-${idx}`,
          title: item.title || "Untitled Experiment",
          caption: item.description || item.caption || configOverride?.caption || "",
          type: media.type,
          imageSrc: media.imageSrc,
          videoSrc: media.videoSrc,
          top: y,
          left: x,
          x,
          y,
          rotation,
          size,
          width,
          tag: item.tag || (item.category === "folder" ? "Tactile Folder" : item.category) || configOverride?.tag || "Interactive",
          badge: item.badge || configOverride?.badge || undefined,
          year: item.year || configOverride?.year || "2025",
          details: item.details || item.description || configOverride?.details || "",
          href: item.href || item.link || configOverride?.href || undefined,
          category: item.category || configOverride?.category,
          itemCount: item.itemCount || configOverride?.itemCount,
          accentColor: item.accentColor || configOverride?.accentColor,
          tags: item.tags || configOverride?.tags,
        };
      })
    : [];

  const items = formattedSanityItems.length > 0 ? formattedSanityItems : getPlaygroundItems();

  return <PlayPageClient items={items} />;
}
