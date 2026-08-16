"use client";

import React, { useState } from "react";
import { TYPOGRAPHY_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function TypographySection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const [sampleText, setSampleText] = useState("mudit jha — tactile paper sanctuary");

  const filteredTokens = TYPOGRAPHY_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="typography"
        title="Typography & Fonts"
        subtitle="Curated typography hierarchy combining Figtree (Display headlines), Geist Sans (Body copy & navigation), Geist Mono (HUD & Live Clock stats), and MyFont (Custom handwriting accent)."
        count={TYPOGRAPHY_TOKENS.length}
      />

      {/* Interactive Type Tester Bar */}
      <div className="mb-8 p-4 bg-white/70 rounded-2xl border border-zinc-200/80 shadow-xs">
        <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5 font-semibold">
          Live Interactive Type Tester
        </label>
        <input
          type="text"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          placeholder="Type custom text to preview typography..."
          className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-400 font-sans text-zinc-800"
        />
      </div>

      {/* Font Family Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-white/60 rounded-2xl border border-zinc-200">
          <span className="text-xs font-mono uppercase text-zinc-400">Display Face</span>
          <h3 className="font-display text-2xl font-semibold text-zinc-900 mt-1">Figtree</h3>
          <p className="font-display text-lg mt-2 text-zinc-700 leading-snug">
            {sampleText}
          </p>
          <div className="mt-3 text-xs font-mono text-zinc-400">
            Variable: --font-figtree • Weights: 400, 500, 600, 700
          </div>
        </div>

        <div className="p-5 bg-white/60 rounded-2xl border border-zinc-200">
          <span className="text-xs font-mono uppercase text-zinc-400">Body & UI Face</span>
          <h3 className="font-sans text-2xl font-semibold text-zinc-900 mt-1">Geist Sans</h3>
          <p className="font-sans text-base mt-2 text-zinc-700 leading-relaxed">
            {sampleText}
          </p>
          <div className="mt-3 text-xs font-mono text-zinc-400">
            Variable: --font-geist-sans • Clean modern humanist neo-grotesque
          </div>
        </div>

        <div className="p-5 bg-white/60 rounded-2xl border border-zinc-200">
          <span className="text-xs font-mono uppercase text-zinc-400">Mono & HUD Face</span>
          <h3 className="font-mono text-xl font-medium text-zinc-900 mt-1">Geist Mono</h3>
          <p className="font-mono text-sm mt-2 text-zinc-700 tabular-nums">
            {sampleText} 12:45:00 PM • GMT -05:00
          </p>
          <div className="mt-3 text-xs font-mono text-zinc-400">
            Variable: --font-geist-mono • High legibility tabular data
          </div>
        </div>

        <div className="p-5 bg-white/60 rounded-2xl border border-zinc-200">
          <span className="text-xs font-mono uppercase text-zinc-400">Handwriting Accent</span>
          <h3 className="font-hand text-3xl text-zinc-900 mt-1">MyFont Custom</h3>
          <p className="font-hand text-3xl mt-2 text-zinc-700">
            {sampleText}
          </p>
          <div className="mt-3 text-xs font-mono text-zinc-400">
            Variable: --font-myfont • Personal signature and expressive accents
          </div>
        </div>
      </div>

      {/* Typography Token Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            preview={
              <div className="w-full py-2 px-1 text-center overflow-hidden">
                <span
                  className={token.className}
                  style={{ wordBreak: "break-word" }}
                >
                  {sampleText || token.name}
                </span>
              </div>
            }
          />
        ))}
      </div>
    </section>
  );
}
