/**
 * Natural Scatter Layout Generator (Helper Utility / Authoring Tool)
 *
 * Implements a "grid-jitter" algorithm that produces hand-arranged mood board aesthetics
 * rather than a rigid grid or chaotic randomness.
 *
 * Use this helper to generate starting coordinates, which can then be hand-tuned
 * in `src/data/playgroundItems.ts`.
 */

export type PlaygroundCardSize = "sm" | "md" | "lg";

export const SIZE_DIMENSIONS: Record<PlaygroundCardSize, number> = {
  sm: 180,
  md: 260,
  lg: 340,
};

export interface RawPlaygroundItem {
  id: string;
  imageSrc?: string;
  videoSrc?: string;
  type?: "image" | "video" | "note";
  title: string;
  caption?: string;
  description?: string;
  size?: PlaygroundCardSize;
  tag?: string;
  year?: string;
  badge?: string;
  details?: string;
  href?: string;
  aspect?: string;
  [key: string]: any;
}

export interface PositionedPlaygroundItem extends RawPlaygroundItem {
  x: number;
  y: number;
  top: number;
  left: number;
  rotation: number;
  width: number;
}

export interface GenerateScatterOptions {
  canvasWidth?: number;
  canvasHeight?: number;
  marginBuffer?: number;
  jitterFactor?: number; // 0.4 - 0.5 recommended
  rotationRange?: [number, number]; // e.g. [-6, 6]
}

/**
 * Generates initial scattered positions for an array of items across a canvas.
 *
 * 1. Computes an invisible base grid sized to fit item count across canvas aspect ratio.
 * 2. Places each item at its cell's center with bounded jitter (40-50% cell bounds).
 * 3. Adds slight organic tilt (-6° to +6°).
 * 4. Maps size tags ('sm' | 'md' | 'lg') to exact pixel widths.
 */
export function generateScatterLayout(
  items: RawPlaygroundItem[],
  options: GenerateScatterOptions = {}
): PositionedPlaygroundItem[] {
  const {
    canvasWidth = 3000,
    canvasHeight = 2000,
    marginBuffer = 260,
    jitterFactor = 0.45,
    rotationRange = [-6, 6],
  } = options;

  const count = items.length;
  if (count === 0) return [];

  // Usable area inside boundary margins
  const usableWidth = canvasWidth - marginBuffer * 2;
  const usableHeight = canvasHeight - marginBuffer * 2;

  // Determine grid dimensions based on aspect ratio
  const aspect = usableWidth / usableHeight;
  let cols = Math.ceil(Math.sqrt(count * aspect));
  let rows = Math.ceil(count / cols);

  // Ensure grid accommodates all items
  while (cols * rows < count) {
    if (usableWidth / cols > usableHeight / rows) {
      cols++;
    } else {
      rows++;
    }
  }

  const cellWidth = usableWidth / cols;
  const cellHeight = usableHeight / rows;

  return items.map((item, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);

    const size = item.size || "md";
    const width = SIZE_DIMENSIONS[size];

    // Center of the assigned grid cell
    const cellCenterX = marginBuffer + (col + 0.5) * cellWidth;
    const cellCenterY = marginBuffer + (row + 0.5) * cellHeight;

    // Positional jitter bounded within 40-50% of cell dimensions
    const maxJitterX = cellWidth * jitterFactor * 0.5;
    const maxJitterY = cellHeight * jitterFactor * 0.5;
    const jitterX = (Math.random() * 2 - 1) * maxJitterX;
    const jitterY = (Math.random() * 2 - 1) * maxJitterY;

    // Center the card on jittered coordinate
    const posX = Math.round(cellCenterX + jitterX - width / 2);
    const posY = Math.round(cellCenterY + jitterY - (width * 0.65) / 2);

    // Random rotation between range (e.g. -6° to +6°)
    const [minRot, maxRot] = rotationRange;
    const rotation = Number((minRot + Math.random() * (maxRot - minRot)).toFixed(1));

    return {
      ...item,
      x: posX,
      y: posY,
      left: posX,
      top: posY,
      rotation,
      width,
      size,
    };
  });
}
