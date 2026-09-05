"use client";

import Image from "next/image";
import MuxPlayer from "@mux/mux-player-react";
import { useReducedMotion } from "framer-motion";
import type { FeatureContentBlock, GalleryBlock, HighlightFeatureBlock as HighlightFeatureBlockData, ProcessBlock, ResultsBlock, StatementBlock } from "@/types/project";
import { MediaBlock } from "./MediaBlock";

export function HighlightFeatureBlock({ block }: { block: HighlightFeatureBlockData }) {
  const prefersReducedMotion = useReducedMotion();
  const body = Array.isArray(block.body) ? block.body : block.body ? [block.body] : [];
  const title = block.heading || "Highlight feature";
  const muxPlaybackId = block.muxPlaybackId || block.muxVideo?.playbackId;
  const hasMedia = Boolean(block.image || block.video || muxPlaybackId);

  return <section id={block.id || block._key} className="scroll-mt-10 overflow-hidden rounded-[18px] bg-[#f5f1f2] border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.02),0_4px_16px_rgba(0,0,0,0.03)]">
    <div className="space-y-3 px-5 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
      {block.number && <p className="font-mono text-xs font-medium tracking-wide text-[#47585c] tabular-nums">{block.number}</p>}
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight leading-[1.25] text-zinc-900 text-balance">{title}</h2>
      {body.length > 0 && <div className="max-w-2xl space-y-2 font-sans text-sm sm:text-base leading-[1.65] text-zinc-700 text-pretty">{body.map((item, index) => <p key={index}>{item}</p>)}</div>}
    </div>
    {hasMedia && <figure className="border-t border-black/5 bg-[#e8ebe4]/45">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {muxPlaybackId ? <MuxPlayer playbackId={muxPlaybackId} autoPlay={!prefersReducedMotion} muted playsInline loop thumbnailTime={block.muxThumbTime ?? block.muxVideo?.thumbTime ?? 0} metadataVideoTitle={title} title={block.alt || title} className="size-full" style={{ "--controls": "none" }} /> : block.video ? <video src={block.video} autoPlay={!prefersReducedMotion} muted playsInline loop className="size-full object-contain" aria-label={block.alt || title} /> : block.image ? <Image src={block.image} alt={block.alt || title} fill sizes="(max-width: 768px) 100vw, 960px" className="object-contain" /> : null}
      </div>
      {block.caption && <figcaption className="px-5 py-3 text-center font-sans text-xs sm:text-[13px] text-[#47585c]">{block.caption}</figcaption>}
    </figure>}
  </section>;
}

export function FeatureContentBlock({ block }: { block: FeatureContentBlock }) {
  const body = Array.isArray(block.body) ? block.body : block.body ? [block.body] : [];
  const hasMedia = Boolean(block.image || block.video || block.muxPlaybackId || block.muxVideo?.playbackId);
  const media = hasMedia ? <MediaBlock block={{ ...block, _type: "mediaBlock", size: "full" }} /> : null;
  const text = <div className="space-y-3 sm:space-y-4">{block.eyebrow && <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">{block.eyebrow}</p>}{block.heading && <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight leading-[1.25] text-balance">{block.heading}</h2>}{body.length > 0 && <div className="space-y-3 font-sans text-sm sm:text-[15px] leading-[1.65] text-zinc-700 text-pretty">{body.map((item, index) => <p key={index}>{item}</p>)}</div>}</div>;
  const layout = block.variant || "mediaRight";
  if (layout === "mediaTop" || layout === "fullWidth") return <section id={block.id || block._key} className="space-y-5 sm:space-y-6 scroll-mt-10">{layout === "mediaTop" && media}{text}{layout === "fullWidth" && media}</section>;
  return <section id={block.id || block._key} className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 scroll-mt-10 ${layout === "mediaLeft" ? "" : ""}`}><div className={layout === "mediaLeft" ? "md:order-2" : ""}>{text}</div><div className={layout === "mediaLeft" ? "md:order-1" : ""}>{layout === "sticky" ? <div className="md:sticky md:top-24">{media}</div> : media}</div></section>;
}

export function StatementBlock({ block }: { block: StatementBlock }) {
  const body = Array.isArray(block.body) ? block.body : block.body ? [block.body] : [];
  return <section id={block.id || block._key} className="space-y-4 sm:space-y-5 scroll-mt-10">
    {block.eyebrow && <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">{block.eyebrow}</p>}
    {block.heading && <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight leading-[1.25] text-balance">{block.heading}</h2>}
    {body.length > 0 && <div className="space-y-3 font-sans text-sm sm:text-[15px] leading-[1.65] text-zinc-700 max-w-2xl text-pretty">{body.map((item, index) => <p key={index}>{item}</p>)}</div>}
  </section>;
}

export function GalleryBlock({ block }: { block: GalleryBlock }) {
  if (!block.images?.length) return null;
  return <section id={block.id || block._key} className="space-y-4 sm:space-y-5 scroll-mt-10">
    {(block.eyebrow || block.heading) && <div className="space-y-2">{block.eyebrow && <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">{block.eyebrow}</p>}{block.heading && <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">{block.heading}</h2>}</div>}
    <div className={block.variant === "wide" ? "grid grid-cols-1 gap-5" : "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"}>{block.images.filter((item) => item.image).map((item) => <figure key={item._key} className="space-y-2"><div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-[#f5f4ee]/70 border border-black/5"><Image src={item.image!} alt={item.alt || "Case study screen"} fill sizes="(max-width: 768px) 100vw, 480px" className="object-contain" /></div>{item.caption && <figcaption className="text-center font-sans text-xs text-[#47585c]">{item.caption}</figcaption>}</figure>)}</div>
  </section>;
}

export function ProcessBlock({ block }: { block: ProcessBlock }) {
  const body = Array.isArray(block.body) ? block.body : block.body ? [block.body] : [];
  return <section id={block.id || block._key} className="space-y-5 sm:space-y-6 scroll-mt-10">
    {block.eyebrow && <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">{block.eyebrow}</p>}
    {block.heading && <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">{block.heading}</h2>}
    {body.length > 0 && <div className="space-y-3 font-sans text-sm sm:text-[15px] leading-[1.65] text-zinc-700 max-w-2xl">{body.map((item, index) => <p key={index}>{item}</p>)}</div>}
    {block.steps?.length ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{block.steps.map((step) => <article key={step._key} className="p-5 rounded-[18px] bg-[#f5f4ee]/70 border border-black/5 space-y-2"><h3 className="font-display text-base font-semibold text-zinc-900">{step.title}</h3>{step.body && <p className="font-sans text-sm leading-relaxed text-zinc-700">{step.body}</p>}{step.image && <div className="relative aspect-[4/3] overflow-hidden rounded-[14px]"><Image src={step.image} alt={step.alt || step.title} fill className="object-contain" /></div>}</article>)}</div> : null}
  </section>;
}

export function ResultsBlock({ block }: { block: ResultsBlock }) {
  const body = Array.isArray(block.body) ? block.body : block.body ? [block.body] : [];
  return <section id={block.id || block._key} className="space-y-5 sm:space-y-6 scroll-mt-10">
    {block.eyebrow && <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">{block.eyebrow}</p>}
    {block.heading && <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900 tracking-tight">{block.heading}</h2>}
    {body.length > 0 && <div className="space-y-3 font-sans text-sm sm:text-[15px] leading-[1.65] text-zinc-700 max-w-2xl">{body.map((item, index) => <p key={index}>{item}</p>)}</div>}
    {block.items?.length ? <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">{block.items.map((item) => <div key={item._key} className="p-4 sm:p-5 rounded-[18px] bg-[#f5f4ee]/70 border border-black/5"><p className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">{item.value}</p><p className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] mt-1">{item.label}</p>{item.detail && <p className="font-sans text-xs text-zinc-600 leading-relaxed mt-3">{item.detail}</p>}</div>)}</div> : null}
  </section>;
}
