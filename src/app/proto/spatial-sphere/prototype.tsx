'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import SpatialSphere from '@/components/SpatialSphere';
import type { SpatialItem } from '@/data/spatialItems';
import type { Project } from '@/types/project';
import './prototype.css';

const defaults = { radius: 5, damping: 0.95, transitionDuration: 0.8, autoSpeed: 0.08 };
const variants = ['Immersed', 'Float', 'Orbit'] as const;
const modes = ['immersed', 'float', 'orbit'] as const;

export default function Prototype({ items, projects }: { items: SpatialItem[]; projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const [replay, setReplay] = useState(0);
  const config = useRef({ ...defaults });
  const [copied, setCopied] = useState(false);
  const picker = useRef<HTMLElement>(null);
  const highlight = useRef<HTMLSpanElement>(null);
  function select(index: number) {
    setCurrent(index);
    const url = new URL(window.location.href);
    url.searchParams.set('v', String(index + 1));
    window.history.replaceState(null, '', url);
  }
  useEffect(() => {
    const index = Number(new URLSearchParams(window.location.search).get('v')) - 1;
    const frame = requestAnimationFrame(() => { if (Number.isInteger(index) && index >= 0 && index < 3) setCurrent(index); });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    function key(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || (event.target instanceof HTMLElement && (event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)))) return;
      // Arrows inside the sphere rotate it; picker shortcuts apply elsewhere.
      if (event.target instanceof HTMLElement && event.target.closest('[aria-label^="Project sphere"]')) return;
      if (/^[1-3]$/.test(event.key)) select(Number(event.key) - 1);
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select((current + (event.key === 'ArrowRight' ? 1 : 2)) % 3); }
      if (event.key.toLowerCase() === 'r') setReplay(value => value + 1);
    }
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [current]);
  useLayoutEffect(() => {
    function measure() {
      const button = picker.current?.querySelectorAll<HTMLButtonElement>('.proto-picker-item')[current];
      if (button && highlight.current) { highlight.current.style.width = `${button.offsetWidth}px`; highlight.current.style.transform = `translateX(${button.offsetLeft}px)`; }
    }
    measure();
    const frame = requestAnimationFrame(() => picker.current?.setAttribute('data-ready', ''));
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', measure); };
  }, [current]);
  return <main className="mx-auto max-w-6xl px-4 pb-28 pt-12 sm:px-8">
    <div className="mb-8 max-w-lg"><p className="mb-2 font-mono text-xs text-rust-grey">INTERACTION STUDY / SPATIAL WORK</p><h1 className="text-3xl tracking-tight">A different perspective.</h1><p className="mt-3 text-sm text-rust-grey">{current === 0 ? 'Stand at the center and look into the work. Drag to turn your view.' : current === 1 ? 'A quiet overview, suspended in space. Drag to explore at your pace.' : 'Let the work turn toward you. Hover or drag to pause its orbit.'}</p></div>
    <SpatialSphere key={`${current}-${replay}`} items={items} projects={projects} initialMode={modes[current]} showModeToggle={false} tuning={config} />
    <details className="fixed right-4 top-4 z-50 max-w-[calc(100vw-2rem)] rounded-xl border border-zinc-300 bg-background p-3 text-xs shadow-sm">
      <summary className="min-h-8 cursor-pointer">Tune interaction</summary>
      <div className="mt-3 grid w-56 gap-4">
        {([{ key: 'radius', label: 'Radius', min: 2.5, max: 8, step: 0.1 }, { key: 'damping', label: 'Inertia', min: 0.8, max: 0.99, step: 0.01 }, { key: 'transitionDuration', label: 'Camera duration (s)', min: 0.2, max: 2, step: 0.1 }, { key: 'autoSpeed', label: 'Orbit speed', min: 0, max: 0.3, step: 0.01 }] as const).map(control => <label key={control.key} className="grid gap-2">{control.label} <output className="tabular-nums">{defaults[control.key]}</output><input type="range" min={control.min} max={control.max} step={control.step} defaultValue={defaults[control.key]} onInput={event => { const value = Number(event.currentTarget.value); config.current[control.key] = value; const output = event.currentTarget.previousElementSibling; if (output) output.textContent = String(value); }} /></label>)}
        <button className="min-h-11 rounded-md border border-zinc-300" onClick={async () => { try { await navigator.clipboard.writeText(JSON.stringify(config.current, null, 2)); setCopied(true); } catch { setCopied(false); } }}>{copied ? 'Copied' : 'Copy settings'}</button>
      </div>
    </details>
    <nav ref={picker} className="proto-picker" aria-label="Prototype variants">
      <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
      {variants.map((name, i) => <button key={name} className="proto-picker-item" data-active={i === current ? '' : undefined} aria-current={i === current ? 'true' : undefined} onClick={() => select(i)}>{name}</button>)}
      <span className="proto-picker-divider" aria-hidden="true" />
      <button className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={() => setReplay(value => value + 1)}>↻</button>
    </nav>
    <p className="mt-4 text-xs text-rust-grey">1–3 to switch · R to reset · {items.length} items from Play.</p>
  </main>;
}
