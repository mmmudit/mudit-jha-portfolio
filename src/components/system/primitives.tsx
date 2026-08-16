"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { type BaseToken, type TokenTag } from "./tokens";

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label || text}`}
      className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-mono rounded-md text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors border border-zinc-200/80 active:scale-95 select-none"
    >
      {copied ? (
        <>
          <Check className="size-3 text-emerald-600" />
          <span className="text-emerald-700 font-medium">Copied</span>
        </>
      ) : (
        <>
          <Copy className="size-3 text-zinc-400" />
          <span className="text-zinc-700">{label || "Copy"}</span>
        </>
      )}
    </button>
  );
}

export function Tag({ tag }: { tag: TokenTag }) {
  switch (tag) {
    case "canonical":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#c8d5bb]/40 text-[#3d4c3f] border border-[#c8d5bb]/80 select-none">
          canonical
        </span>
      );
    case "one-off":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 border border-amber-300 select-none">
          one-off
        </span>
      );
    case "experiment":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-800 border border-purple-300 select-none">
          experiment
        </span>
      );
  }
}

export function SectionHeader({
  id,
  title,
  subtitle,
  count,
}: {
  id: string;
  title: string;
  subtitle: string;
  count?: number;
}) {
  return (
    <div id={id} className="scroll-mt-28 mb-8 pb-4 border-b border-zinc-200/80">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[28px] sm:text-[32px] font-semibold tracking-[-1px] text-zinc-900">
            {title}
          </h2>
          {typeof count === "number" && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-200/70 text-zinc-700">
              {count} tokens
            </span>
          )}
        </div>
        <a
          href={`#${id}`}
          className="text-xs font-mono text-zinc-400 hover:text-zinc-700 transition-colors"
        >
          #{id}
        </a>
      </div>
      <p className="mt-1 text-sm sm:text-base text-zinc-600 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export function Swatch({
  hex,
  name,
  variable,
}: {
  hex: string;
  name: string;
  variable?: string;
}) {
  const isLight =
    hex.startsWith("#f") ||
    hex.startsWith("#e") ||
    hex.startsWith("#d") ||
    hex.includes("c8d5bb");

  return (
    <div
      className="relative w-full h-24 rounded-xl flex flex-col justify-end p-3 border border-black/10 overflow-hidden shadow-inner"
      style={{ backgroundColor: hex }}
    >
      <div
        className={`flex items-center justify-between text-xs font-mono ${
          isLight ? "text-zinc-800" : "text-white"
        }`}
      >
        <span className="font-bold">{hex}</span>
        {variable && <span className="opacity-70 text-[11px]">{variable}</span>}
      </div>
    </div>
  );
}

export function TokenCard({
  token,
  preview,
  children,
}: {
  token: BaseToken;
  preview?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-[#fbfaf5] rounded-2xl border border-zinc-300/80 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-zinc-400/80 transition-all">
      {/* Visual Sample Top Preview */}
      {preview && (
        <div className="mb-3.5 w-full rounded-xl overflow-hidden bg-white/70 border border-zinc-200/70 p-3 flex items-center justify-center min-h-[88px]">
          {preview}
        </div>
      )}

      {/* Main Info */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-sans font-medium text-base text-zinc-900 leading-snug">
          {token.name}
        </h3>
        <Tag tag={token.tag} />
      </div>

      {/* Monospace Code / Value String */}
      <div className="flex items-center justify-between gap-2 bg-zinc-100/90 rounded-lg px-2.5 py-1.5 border border-zinc-200/70 mb-2.5">
        <code className="text-xs font-mono text-zinc-800 truncate select-all" title={token.value}>
          {token.value}
        </code>
        <CopyButton text={token.value} />
      </div>

      {/* Class Name (if present) */}
      {token.className && (
        <div className="flex items-center justify-between gap-2 mb-2 text-[11px] font-mono text-zinc-500">
          <span className="truncate">class: {token.className}</span>
          <CopyButton text={token.className} label="Class" />
        </div>
      )}

      {/* Description / Usage */}
      <div className="mt-auto pt-2 border-t border-zinc-200/60">
        <p className="text-xs text-zinc-500 leading-relaxed">
          <span className="font-semibold text-zinc-700">Usage: </span>
          {token.usage}
        </p>
        {token.description && (
          <p className="mt-1 text-[11px] text-zinc-400 italic leading-normal">
            {token.description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}
