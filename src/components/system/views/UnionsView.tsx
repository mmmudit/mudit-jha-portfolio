"use client";

import React from "react";

export function UnionsView() {
  const UNIONS = [
    {
      name: "TokenTag",
      source: "src/components/system/tokens.ts",
      union: `"canonical" | "one-off" | "experiment"`,
      description: "Tags every design token. Only 'canonical' tokens may be used in production.",
    },
    {
      name: "ColorCategory",
      source: "src/components/system/tokens.ts",
      union: `"brand" | "neutral" | "functional"`,
      description: "Closed category set for palette grouping and semantic role mapping.",
    },
    {
      name: "ElevationRole",
      source: "src/components/system/tokens.ts",
      union: `"surface" | "raised" | "floating" | "overlay"`,
      description: "Closed set for tactile paper card elevation layers and shadow depths.",
    },
    {
      name: "MotionPreset",
      source: "src/components/system/tokens.ts",
      union: `"duration" | "easing" | "spring" | "interaction" | "keyframe"`,
      description: "Allowed motion animation classification tokens.",
    },
    {
      name: "TypographyCategory",
      source: "src/components/system/tokens.ts",
      union: `"display" | "body" | "mono" | "handwriting"`,
      description: "The four allowed font families in the typography hierarchy.",
    },
  ];

  return (
    <div className="flex flex-col p-8 sm:p-12 space-y-12 text-zinc-800">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
          <span>System Specs</span> / <span>Closed Type Unions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-3 font-sans">
          Closed Type Unions
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl leading-relaxed">
          In Mudit&apos;s design system, a TypeScript union is a strictly closed set. Nothing outside a documented component variant or size union exists—an unlisted value is a bug, not an option.
        </p>
      </div>

      {/* Unions Table */}
      <div className="overflow-hidden rounded-xl border border-[#e4dccb] bg-white/80 shadow-2xs">
        <table className="w-full text-left text-xs font-mono">
          <thead className="border-b border-[#e4dccb] bg-[#f5efe3]/80 text-zinc-600">
            <tr>
              <th className="p-4">Type Name</th>
              <th className="p-4">Closed Union Definition</th>
              <th className="p-4">Source File</th>
              <th className="p-4">Rule / Enforcement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e4dccb]/70 text-zinc-800">
            {UNIONS.map((u) => (
              <tr key={u.name} className="hover:bg-[#fbfaf5] transition-colors">
                <td className="p-4 font-bold text-zinc-900">{u.name}</td>
                <td className="p-4 text-emerald-800 font-medium">
                  <code className="rounded bg-[#f5efe3] border border-[#e4dccb] px-2 py-0.5">
                    {u.union}
                  </code>
                </td>
                <td className="p-4 text-zinc-500">{u.source}</td>
                <td className="p-4 text-zinc-600 font-sans">{u.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
