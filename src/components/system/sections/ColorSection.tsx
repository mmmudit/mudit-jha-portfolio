"use client";

import { useState } from "react";
import { COLOR_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard, Swatch } from "../primitives";

export function ColorSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredTokens = COLOR_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    if (activeCategory !== "all" && t.category !== activeCategory) return false;
    return true;
  });

  const categories = [
    { id: "all", label: "All Colors" },
    { id: "brand", label: "Brand & Identity" },
    { id: "neutral", label: "Neutrals & Strokes" },
    { id: "functional", label: "Functional & Feedback" },
  ];

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="colors"
        title="Colors & Palette"
        subtitle="The earth-tone paper palette grounded in warm Dough (#fbfaf5), subtle Willow Grey (#c8d5bb) accents, Rust Grey (#47585c) typography, and Status Green (#31b564)."
        count={COLOR_TOKENS.length}
      />

      {/* Category Sub-Filters */}
      <div className="flex flex-wrap items-center gap-1 mb-6 text-xs font-mono">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? "bg-zinc-900 text-white font-medium"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Token Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            preview={
              <Swatch
                hex={token.hex}
                variable={token.variable}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
