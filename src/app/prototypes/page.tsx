"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Sparkles, Layers, Folder, Maximize2 } from "lucide-react";

const PROTOTYPES = [
  {
    title: "3D Flip-to-Modal Work Card",
    slug: "flip-card",
    description: "Interactive 3D flip card component with physical spring turn and expanding modal morph for work page projects.",
    badge: "NEW",
    icon: Maximize2,
    href: "/prototypes/flip-card",
  },
  {
    title: "Tactile Folder Card",
    slug: "folder-card",
    description: "3D physical folder component with spring hinges and multi-plane depth.",
    badge: "ACTIVE",
    icon: Folder,
    href: "/prototypes/folder-card",
  },
  {
    title: "Duotone Covers",
    slug: "duotone-covers",
    description: "Duotone book cover color synthesis and tactile paper overlays.",
    badge: "LAB",
    icon: Layers,
    href: "/prototypes/duotone-covers",
  },
];

export default function PrototypesDirectoryPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf5] text-zinc-900 font-sans p-6 sm:p-12 dot-grid">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c8d5bb] text-zinc-900 text-xs font-mono font-medium">
                STUDIO LAB
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-zinc-900 tracking-tight">
              Component Prototypes
            </h1>
            <p className="text-sm text-zinc-600 font-sans mt-1">
              Interactive interface explorations and motion prototypes for the Mudit Jha portfolio.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-700 hover:text-zinc-950 bg-white border border-black/5 px-3.5 py-2 rounded-full shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PORTFOLIO</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {PROTOTYPES.map((proto) => {
            const Icon = proto.icon;
            return (
              <Link
                key={proto.slug}
                href={proto.href}
                className="p-5 rounded-[22px] bg-white/80 hover:bg-white border border-black/5 hover:border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-between transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#c8d5bb]/40 border border-[#c8d5bb] flex items-center justify-center text-zinc-900 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-base font-semibold text-zinc-900 group-hover:text-black">
                        {proto.title}
                      </h2>
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-mono font-medium">
                        {proto.badge}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 font-sans mt-1 max-w-lg">
                      {proto.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-zinc-500 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0">
                  <span>LAUNCH</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
