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

export function TagIndicator({ tag }: { tag: TokenTag }) {
  const dotColor =
    tag === "canonical"
      ? "bg-zinc-400"
      : tag === "one-off"
      ? "bg-amber-400"
      : "bg-blue-400";

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 capitalize shrink-0 select-none">
      <span className={`size-1.5 rounded-full ${dotColor}`} />
      <span>{tag}</span>
    </span>
  );
}

export const Tag = TagIndicator;

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
    <div id={id} className="scroll-mt-28 mb-6 pb-3 border-b border-zinc-100">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900">
            {title}
          </h2>
          {typeof count === "number" && (
            <span className="px-2 py-0.5 rounded-full text-xs font-mono text-zinc-400 bg-zinc-100">
              {count}
            </span>
          )}
        </div>
        <a
          href={`#${id}`}
          className="text-xs font-mono text-zinc-300 hover:text-zinc-600 transition-colors"
        >
          #{id}
        </a>
      </div>
      <p className="mt-1 text-sm text-zinc-500 max-w-3xl leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

export function Swatch({
  hex,
  variable,
}: {
  hex: string;
  variable?: string;
}) {
  const isLight =
    hex.startsWith("#f") ||
    hex.startsWith("#e") ||
    hex.startsWith("#d") ||
    hex.includes("c8d5bb");

  return (
    <div
      className="relative w-full h-16 rounded-lg flex flex-col justify-end p-2.5 overflow-hidden shrink-0"
      style={{ backgroundColor: hex }}
    >
      <div
        className={`flex items-center justify-between text-[11px] font-mono ${
          isLight ? "text-zinc-800" : "text-white"
        }`}
      >
        <span className="font-semibold">{hex}</span>
        {variable && <span className="opacity-70">{variable}</span>}
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
    <div className="flex flex-col p-3.5 rounded-xl border border-zinc-200/70 bg-white hover:border-zinc-300 transition-all">
      {/* Visual Sample Top Preview */}
      {preview && <div className="mb-3 w-full">{preview}</div>}

      {/* Title */}
      <h3 className="font-sans font-medium text-sm text-zinc-900 truncate mb-1">
        {token.name}
      </h3>

      {/* Code Value & Copy */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-500 mb-2">
        <span className="truncate select-all" title={token.value}>
          {token.value}
        </span>
        <CopyButton text={token.value} />
      </div>

      {/* Usage Description */}
      {token.usage && (
        <p className="text-xs text-zinc-500 leading-relaxed mt-auto pt-1">
          {token.usage}
        </p>
      )}

      {children}
    </div>
  );
}
