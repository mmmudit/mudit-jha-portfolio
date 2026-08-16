"use client";

import React, { useState } from "react";
import { COLOR_TOKENS, type ColorToken, type TokenTag } from "../tokens";
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
    { id: "gradient", label: "Atmospheric Gradients" },
    { id: "spine", label: "Bookshelf Spines" },
  ];

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="colors"
        title="Colors & Palette"
        subtitle="The earth-tone paper palette grounded in warm Dough (#fbfaf5), subtle Willow Grey (#c8d5bb) accents, and Rust Grey (#47585c) typography. Includes both canonical foundation tokens and real one-offs found in production."
        count={COLOR_TOKENS.length}
      />

      {/* Category Sub-Filters */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-zinc-800 text-white"
                : "bg-zinc-200/80 text-zinc-600 hover:bg-zinc-300"
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
                name={token.name}
                variable={token.variable}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
