'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { spatialItems, type SpatialItem } from '@/data/spatialItems';
import { SPHERE_RADIUS } from '@/lib/spatialLayout';
import { ProjectModal } from '@/components/project-modal';
import type { Project } from '@/types/project';
import type { SpatialMode, SpatialTuning } from './spatial/SpatialCanvas';

const SpatialCanvas = dynamic(() => import('./spatial/SpatialCanvas'), {
  ssr: false,
  loading: () => <p role="status" className="grid h-full place-items-center text-sm text-rust-grey">Loading sphere…</p>,
});

export interface SpatialSphereProps {
  tuning?: React.RefObject<SpatialTuning>;
  items?: SpatialItem[];
  projects?: Project[];
  initialMode?: SpatialMode;
  radius?: number;
  damping?: number;
  transitionDuration?: number;
  autoSpeed?: number;
  onSelect?: (item: SpatialItem) => void;
  /** The prototype supplies its own mode picker. */
  showModeToggle?: boolean;
}

export default function SpatialSphere({ items = spatialItems, projects = [], initialMode = 'float', radius = SPHERE_RADIUS, damping = 0.95, transitionDuration = 0.8, autoSpeed = 0.08, onSelect, showModeToggle = true, tuning }: SpatialSphereProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const visible = items.slice(0, 30);
  function open(item: SpatialItem) {
    if (onSelect) return onSelect(item);
    const project = projects.find(project => project.id === item.id || project._id === item.id || project.slug === item.id);
    if (project) setSelected(project);
    else window.location.assign(item.href);
  }
  return <section aria-label="Spatial project explorer" className="relative isolate h-[min(80svh,800px)] min-h-[480px] w-full overflow-hidden rounded-3xl border border-zinc-300 bg-background text-foreground">
    <SpatialCanvas tuning={tuning} items={visible} initialMode={initialMode} radius={Math.max(2.5, radius)} damping={damping} transitionDuration={transitionDuration} autoSpeed={autoSpeed} onSelect={open} showModeToggle={showModeToggle} />
    {items.length > 30 && <p className="absolute left-4 top-4 text-xs">Showing the first 30 projects.</p>}
    {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
  </section>;
}
