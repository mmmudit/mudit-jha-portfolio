export interface SpatialItem {
  id: string;
  title: string;
  /** A local or CORS-enabled WebP thumbnail, at most 512px on either edge. */
  image: string;
  tags: string[];
  href: string;
  size: 'sm' | 'md' | 'lg';
}

// The prototype supplies the current /play collection from its server loader.
// This default stays empty so other mounts choose their collection explicitly.
export const spatialItems: SpatialItem[] = [];
