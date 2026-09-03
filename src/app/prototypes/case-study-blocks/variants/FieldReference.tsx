"use client";

import React, { useState } from "react";
import { CASE_STUDY_BLOCKS_DATA } from "../types";
import { Check, Copy, Terminal, Database, Code2, ShieldAlert } from "lucide-react";

export function FieldReference() {
  const [activeBlockType, setActiveBlockType] = useState<string>("decisionBlock");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const block = CASE_STUDY_BLOCKS_DATA.find((b) => b.type === activeBlockType) || CASE_STUDY_BLOCKS_DATA[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-900 pt-10 pb-28 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Bar */}
      <div className="max-w-6xl mx-auto space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 font-mono text-[11px] font-semibold tracking-wider uppercase mb-1.5">
              <Database className="size-3" />
              <span>Sanity Schema & GROQ Reference</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Case Study Schema Matrix
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-600 max-w-2xl mt-1">
              Exact field definitions, validation constraints, GROQ projection snippets, and payload structures for all Sanity case study blocks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500 bg-white/80 px-2.5 py-1 rounded-lg border border-black/5 shadow-2xs">
              7 Blocks Defined
            </span>
          </div>
        </div>

        {/* Horizontal Block Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CASE_STUDY_BLOCKS_DATA.map((item) => {
            const isActive = item.type === activeBlockType;
            return (
              <button
                key={item.type}
                onClick={() => setActiveBlockType(item.type)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white/80 text-zinc-600 hover:text-zinc-900 border border-black/6 hover:bg-white"
                }`}
              >
                <span>{item.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isActive ? "bg-zinc-800 text-zinc-300" : "bg-black/5 text-zinc-500"}`}>
                  {item.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Detail Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Field Definitions & Constraints (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Block Overview Card */}
          <div className="p-5 sm:p-6 rounded-[22px] bg-white border border-black/8 shadow-2xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#47585c]">
                  {block.badge}
                </span>
                <h2 className="font-display text-xl font-bold text-zinc-900 mt-0.5">
                  {block.name} (<code className="font-mono text-base text-zinc-600">{block.type}</code>)
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#f5f4ee] border border-black/5 text-xs font-sans text-zinc-700 font-medium text-right">
                {block.narrativePhase}
              </span>
            </div>

            <p className="font-sans text-sm text-zinc-700 leading-relaxed">
              {block.purpose}
            </p>

            {/* Quick Best For / Never For */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 space-y-1.5">
                <p className="font-mono text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  ✓ Recommended For
                </p>
                <ul className="text-xs text-emerald-900/80 space-y-1 font-sans">
                  {block.bestFor.slice(0, 3).map((item, idx) => (
                    <li key={idx} className="leading-snug">• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 space-y-1.5">
                <p className="font-mono text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  ✕ Never Use For
                </p>
                <ul className="text-xs text-amber-900/80 space-y-1 font-sans">
                  {block.neverUseFor.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="leading-snug">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Schema Fields Table */}
          <div className="p-5 sm:p-6 rounded-[22px] bg-white border border-black/8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-black/6 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="size-4 text-zinc-700" />
                <h3 className="font-display text-base font-bold text-zinc-900">
                  Schema Fields ({block.keyFields.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-zinc-500">studio-portfolio/schemaTypes/project.ts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-black/6 text-zinc-500 font-mono uppercase text-[10px] tracking-wider">
                    <th className="pb-2 font-semibold">Field Name</th>
                    <th className="pb-2 font-semibold">Type</th>
                    <th className="pb-2 font-semibold">Requirement</th>
                    <th className="pb-2 font-semibold">Description / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/4 font-sans">
                  {block.keyFields.map((field) => (
                    <tr key={field.name} className="hover:bg-[#fbfaf7] transition-colors">
                      <td className="py-2.5 pr-2 font-mono font-bold text-zinc-900">
                        {field.name}
                      </td>
                      <td className="py-2.5 pr-2 font-mono text-zinc-600">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-[11px]">
                          {field.type}
                        </span>
                      </td>
                      <td className="py-2.5 pr-2">
                        {field.required ? (
                          <span className="font-mono text-[10px] font-bold text-rose-600 uppercase bg-rose-50 px-1.5 py-0.5 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] text-zinc-400 uppercase">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-zinc-600 leading-relaxed text-[11px]">
                        {field.description}
                        {field.example && (
                          <span className="block font-mono text-[10px] text-zinc-500 mt-0.5">
                            e.g. {field.example}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Editorial Writing Guardrails */}
          <div className="p-5 rounded-[20px] bg-[#f5f4ee]/80 border border-black/6 space-y-2.5">
            <p className="font-mono text-xs font-bold text-[#47585c] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="size-3.5" />
              Copywriting Rules for This Block
            </p>
            <div className="space-y-1.5 font-sans text-xs text-zinc-700 leading-relaxed">
              {block.copyRules.map((rule, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="text-zinc-400 font-bold">•</span>
                  <span>{rule}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Snippets & Seed Payload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* GROQ Query Box */}
          <div className="p-5 rounded-[22px] bg-[#1a1c1e] text-zinc-200 border border-black/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="size-4 text-emerald-400" />
                <span className="font-mono text-xs font-semibold text-zinc-300">GROQ Projection Snippet</span>
              </div>
              <button
                onClick={() => handleCopy(block.sampleGroq, "groq")}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
              >
                {copiedKey === "groq" ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copiedKey === "groq" ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <pre className="font-mono text-xs text-emerald-300/90 bg-black/40 p-3.5 rounded-xl overflow-x-auto scrollbar-none leading-relaxed">
              {block.sampleGroq}
            </pre>
          </div>

          {/* Sample JSON Payload */}
          <div className="p-5 rounded-[22px] bg-[#1a1c1e] text-zinc-200 border border-black/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="size-4 text-sky-400" />
                <span className="font-mono text-xs font-semibold text-zinc-300">Sanity JSON Payload</span>
              </div>
              <button
                onClick={() => handleCopy(JSON.stringify(block.samplePayload, null, 2), "payload")}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs font-mono text-zinc-300 transition-colors cursor-pointer"
              >
                {copiedKey === "payload" ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                <span>{copiedKey === "payload" ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <pre className="font-mono text-[11px] text-zinc-300 bg-black/40 p-3.5 rounded-xl overflow-x-auto scrollbar-none max-h-[340px] leading-relaxed">
              {JSON.stringify(block.samplePayload, null, 2)}
            </pre>
          </div>

          {/* Senior Signaling Callout */}
          <div className="p-4 rounded-[18px] bg-[#c8d5bb]/30 border border-[#c8d5bb]/60 space-y-1.5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#47585c] font-bold">
              Senior Design Signaling Tip
            </p>
            <p className="font-sans text-xs text-zinc-800 leading-relaxed">
              {block.seniorSignalingTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
