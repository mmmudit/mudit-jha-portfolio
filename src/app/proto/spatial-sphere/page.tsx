import Prototype from './prototype';
import { loadPlayItems } from './loadPlayItems';
import { playThumbnail } from './playThumbnails';
import type { SpatialItem } from '@/data/spatialItems';
import type { Project } from '@/types/project';

export const dynamic = 'force-dynamic';

export default async function SpatialSpherePrototypePage() {
  const playItems = (await loadPlayItems()).slice(0, 30);
  const items: SpatialItem[] = await Promise.all(playItems.map(async item => ({
    id: item.id,
    title: item.title,
    image: await playThumbnail(item),
    tags: [...new Set([...(item.tags || []), ...(item.tag ? [item.tag] : [])])],
    href: item.href || `/play#${encodeURIComponent(item.id)}`,
    size: item.size || 'md',
  })));
  const projects: Project[] = playItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.details || item.description || item.caption || '',
    tagline: item.caption,
    year: item.year,
    category: item.tag || item.category,
    skills: item.tags,
    image: item.imageSrc,
    href: item.href,
    heroMedia: item.videoSrc ? { mediaType: 'video', video: item.videoSrc, alt: item.title } : item.imageSrc ? { mediaType: 'image', image: item.imageSrc, alt: item.title } : undefined,
  }));
  return <Prototype items={items} projects={projects} />;
}
