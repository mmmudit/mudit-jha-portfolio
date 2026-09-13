"use client";

import React from "react";
import { ShieldCheck, Eye, Keyboard, Sparkles } from "lucide-react";

export function PrinciplesView() {
  const RULES = [
    {
      num: "01",
      title: "Named Tokens Only",
      desc: "Production components must use the named tokens exposed by globals.css and tokens.ts. Never introduce raw hex or OKLCH values in product code.",
      badge: "Non-Negotiable",
    },
    {
      num: "02",
      title: "Closed TypeScript Unions",
      desc: "Component variants, sizes, and block types are closed sets. Anything outside a documented union is a bug, not an option.",
      badge: "Strict Typing",
    },
    {
      num: "03",
      title: "Product vs Prototype Isolation",
      desc: "Routes like /, /about, and /projects/[slug] are canonical product evidence. Files under /prototypes are exploratory only; never promote them without approval.",
      badge: "Integrity",
    },
    {
      num: "04",
      title: "Keyboard & Reduced Motion Parity",
      desc: "Every interactive element must function with full keyboard navigation and respect prefers-reduced-motion: reduce without degradation.",
      badge: "WCAG 2.2 AAA",
    },
    {
      num: "05",
      title: "Shared Components First",
      desc: "Reuse existing components before creating duplicates. Only extend shared primitives when the new behavior is universal across all call sites.",
      badge: "Architecture",
    },
    {
      num: "06",
      title: "Zero Transition-All Debt",
      desc: "Never apply transition-all. Target specific animatable properties (transform, opacity, color, background-color) to eliminate layout thrashing.",
      badge: "60 FPS Performance",
    },
  ];

  return (
    <div className="flex flex-col p-8 sm:p-12 space-y-12 text-zinc-800">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
          <span>Overview</span> / <span>Design Principles</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-3 font-sans">
          Design Principles & Rules
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl leading-relaxed">
          The non-negotiable architectural constraints and accessibility principles codified in <code className="font-mono text-xs rounded bg-[#f5efe3] border border-[#e4dccb] px-1 py-0.5">DESIGN.md</code>.
        </p>
      </div>

      {/* Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {RULES.map((rule) => (
          <div
            key={rule.num}
            className="flex flex-col justify-between rounded-xl border border-[#e4dccb] bg-white/70 p-6 hover:border-[#d9d0bb] transition-colors shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-emerald-700">
                  RULE {rule.num}
                </span>
                <span className="rounded-full bg-[#f5efe3] border border-[#e4dccb] px-2 py-0.5 font-mono text-[10px] text-zinc-700">
                  {rule.badge}
                </span>
              </div>
              <h2 className="text-base font-semibold text-zinc-900 mb-2 font-sans">
                {rule.title}
              </h2>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Accessibility & Reduced Motion Matrix */}
      <div className="rounded-xl border border-[#e4dccb] bg-[#f5efe3]/50 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-emerald-700" />
          <h2 className="text-sm font-semibold uppercase font-mono tracking-wider text-zinc-800">
            Accessibility Standards & Tiers
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          <div className="rounded-lg border border-[#e4dccb] bg-white p-4">
            <Keyboard className="size-4 text-zinc-700 mb-2" />
            <strong className="block text-zinc-900 mb-1">Focus Visibility</strong>
            All interactive elements implement distinct focus-visible rings with sufficient offset and 3:1 contrast against surrounding surfaces.
          </div>

          <div className="rounded-lg border border-[#e4dccb] bg-white p-4">
            <Eye className="size-4 text-zinc-700 mb-2" />
            <strong className="block text-zinc-900 mb-1">Contrast Standards</strong>
            Default body text and headers meet WCAG AAA requirements with at least 7:1 contrast ratio against the warm paper background.
          </div>

          <div className="rounded-lg border border-[#e4dccb] bg-white p-4">
            <Sparkles className="size-4 text-zinc-700 mb-2" />
            <strong className="block text-zinc-900 mb-1">Motion Degradation</strong>
            When prefers-reduced-motion is active, spring physics collapse to instant or 150ms opacity fades with zero spatial translation.
          </div>
        </div>
      </div>
    </div>
  );
}
