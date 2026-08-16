"use client";

import React from "react";
import { RADIUS_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function RadiusSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const filteredTokens = RADIUS_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="radius"
        title="Border Radius & Shapes"
        subtitle="Continuous curves and squircle silhouettes that impart an organic, tactile feel to interactive controls, cards, and modal sheets."
        count={RADIUS_TOKENS.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            preview={
              <div className="w-full flex items-center justify-center p-3">
                <div
                  className="w-28 h-16 bg-[#c8d5bb]/35 border border-[#c8d5bb] flex items-center justify-center text-xs font-mono font-bold text-[#3d4c3f] shadow-xs"
                  style={{ borderRadius: token.radiusValue }}
                >
                  {token.radiusValue}
                </div>
              </div>
            }
          />
        ))}
      </div>
    </section>
  );
}
