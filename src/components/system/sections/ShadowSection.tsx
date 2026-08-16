"use client";

import React from "react";
import { SHADOW_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function ShadowSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const filteredTokens = SHADOW_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="shadows"
        title="Shadows & Elevation"
        subtitle="Depth is achieved through multi-layered ambient paper falloffs and top edge illumination rather than heavy dark drop shadows. Designed specifically for the tactile Dough paper background."
        count={SHADOW_TOKENS.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            preview={
              <div className="w-full flex items-center justify-center p-4">
                <div
                  className="w-36 h-16 rounded-xl bg-[#fbfaf5] border border-zinc-200/80 flex items-center justify-center text-xs font-mono font-medium text-zinc-700 select-none transition-transform duration-200 hover:scale-105"
                  style={{ boxShadow: token.boxShadow }}
                >
                  {token.elevation}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </section>
  );
}
