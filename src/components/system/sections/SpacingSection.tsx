"use client";

import React from "react";
import { SPACING_TOKENS, type TokenTag } from "../tokens";
import { SectionHeader, TokenCard } from "../primitives";

export function SpacingSection({ filterTag }: { filterTag?: TokenTag | "all" }) {
  const filteredTokens = SPACING_TOKENS.filter((t) => {
    if (filterTag && filterTag !== "all" && t.tag !== filterTag) return false;
    return true;
  });

  return (
    <section className="flex flex-col mb-16">
      <SectionHeader
        id="spacing"
        title="Spacing & Layout Containers"
        subtitle="Spatial rhythm defining container max-widths, responsive page margin gutters, component gaps, and hit-box paddings."
        count={SPACING_TOKENS.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTokens.map((token) => (
          <TokenCard
            key={token.id}
            token={token}
            preview={
              <div className="w-full flex flex-col items-center justify-center p-2 gap-1.5">
                <div className="w-full max-w-[200px] h-6 bg-zinc-200/90 rounded-md flex items-center justify-center text-[11px] font-mono text-zinc-700 overflow-hidden relative border border-zinc-300">
                  <div
                    className="h-full bg-[#c8d5bb]/80 border-r border-[#c8d5bb]"
                    style={{
                      width: token.pixelValue.includes("px")
                        ? Math.min(parseInt(token.pixelValue, 10), 180) + "px"
                        : "60%",
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold">
                    {token.pixelValue}
                  </span>
                </div>
              </div>
            }
          />
        ))}
      </div>
    </section>
  );
}
