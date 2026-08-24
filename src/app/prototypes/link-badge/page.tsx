"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Globe, ExternalLink, RefreshCw } from "lucide-react";
import { LinkPreview } from "@/components/LinkPreview";
import { SmartLinkPreview } from "@/components/smart-link-preview";
import { EmailPreviewBadge } from "@/components/email-preview-badge";

export default function LinkBadgePrototypePage() {
  const [customUrl, setCustomUrl] = useState("https://cali.so");
  const [activeTestUrl, setActiveTestUrl] = useState("https://cali.so");

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    let url = customUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("mailto:")) {
      url = `https://${url}`;
    }
    setActiveTestUrl(url);
  };

  return (
    <div className="min-h-screen bg-[#f5f2e9] text-zinc-900 font-sans p-6 sm:p-12 selection:bg-zinc-900 selection:text-white">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Top Header */}
        <div className="flex flex-col gap-3 border-b border-zinc-300/80 pb-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Portfolio</span>
            </Link>

            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold uppercase tracking-wider">
              Prototype Sandbox
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-zinc-950">
              Rich Link Preview Badges
            </h1>
            <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Interactive sandbox demonstrating both `@radix-ui/react-hover-card` accessible link previews and bespoke social profile cards with live OpenGraph data, GitHub commit heatmaps, and zero placeholders.
            </p>
          </div>
        </div>

        {/* SECTION 1: Live Interactive URL Tester */}
        <div className="p-6 bg-[#fffdfa] rounded-[22px] border-[1.5px] border-zinc-950 shadow-[4px_4px_0px_#18181b] flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-600" />
            <h2 className="font-sans font-bold text-base text-zinc-950">
              Live Custom URL Tester
            </h2>
          </div>
          <p className="text-xs text-zinc-600">
            Type any real website or profile URL below to scrape its OpenGraph metadata in real-time.
          </p>

          <form onSubmit={handleTestSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-300 bg-white font-mono text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-950 transition-all shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 active:scale-95 text-white font-mono text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              <span>Test Preview</span>
            </button>
          </form>

          {/* Test Badge Output */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-200">
            <span className="text-xs font-mono font-medium text-zinc-500">
              Hover to test:
            </span>

            {/* Radix LinkPreview variant */}
            <LinkPreview
              href={activeTestUrl}
              className="px-4 py-2 rounded-full bg-white hover:bg-zinc-50 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <span>{activeTestUrl.replace(/^https?:\/\//, "").split("/")[0]}</span>
              <ExternalLink className="size-3 text-zinc-500" />
            </LinkPreview>

            {/* SmartLinkPreview variant */}
            <SmartLinkPreview url={activeTestUrl}>
              <span className="px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer transition-all active:scale-95">
                <span>Tactile 3D Card</span>
                <span className="text-zinc-400">↗</span>
              </span>
            </SmartLinkPreview>
          </div>
        </div>

        {/* SECTION 2: Inline Article Context (<LinkPreview />) */}
        <div className="p-8 bg-[#fffdfa] rounded-[22px] border-[1.5px] border-zinc-950 shadow-[4px_4px_0px_#18181b] flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <h2 className="font-sans font-bold text-base text-zinc-950">
                1. Inline Contextual References (`&lt;LinkPreview /&gt;`)
              </h2>
              <p className="text-xs text-zinc-500">
                Accessible `@radix-ui/react-hover-card` links embedded naturally in reading text.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-400">components/LinkPreview.tsx</code>
          </div>

          <div className="p-6 bg-[#fbfaf5] rounded-xl border border-zinc-200 text-[15px] leading-relaxed text-zinc-800 font-sans flex flex-col gap-4">
            <p>
              I build spatial software and tactile interfaces. You can explore my design experiments on{" "}
              <LinkPreview
                href="https://cali.so"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                cali.so
              </LinkPreview>
              , follow my engineering commits on{" "}
              <LinkPreview
                href="https://github.com/mmmudit"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                GitHub
              </LinkPreview>
              , or read my long-form essays regarding human-computer interaction on{" "}
              <LinkPreview
                href="https://substack.com/@mmmudit"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                Substack
              </LinkPreview>
              .
            </p>

            <p>
              Under the hood, this application runs on{" "}
              <LinkPreview
                href="https://nextjs.org"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                Next.js 16
              </LinkPreview>
              , styled with{" "}
              <LinkPreview
                href="https://tailwindcss.com"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                Tailwind CSS
              </LinkPreview>
              , and orchestrated with fluid gesture physics from{" "}
              <LinkPreview
                href="https://motion.dev"
                className="font-bold text-zinc-950 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-950 transition-colors"
              >
                Motion
              </LinkPreview>
              .
            </p>
          </div>
        </div>

        {/* SECTION 3: Bespoke Social Media Cards with Live Data */}
        <div className="p-8 bg-[#fffdfa] rounded-[22px] border-[1.5px] border-zinc-950 shadow-[4px_4px_0px_#18181b] flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <h2 className="font-sans font-bold text-base text-zinc-950">
                2. Live Social Links &amp; Profiles
              </h2>
              <p className="text-xs text-zinc-500">
                Unified standard card previews pulling live favicon, profile image, title, and bio description.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-400">components/smart-link-preview.tsx</code>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Twitter / X */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">Twitter / X Profile</span>
              <SmartLinkPreview url="https://x.com/MuditJ1">
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>@MuditJ1</span>
                  <span className="text-zinc-400">↗</span>
                </span>
              </SmartLinkPreview>
            </div>

            {/* GitHub Matrix */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">GitHub Heatmap Matrix</span>
              <SmartLinkPreview url="https://github.com/mmmudit">
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>mmmudit</span>
                  <span className="text-emerald-600">●</span>
                </span>
              </SmartLinkPreview>
            </div>

            {/* LinkedIn */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">LinkedIn Profile</span>
              <SmartLinkPreview url="https://www.linkedin.com/in/muditj3/">
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>in/muditj3</span>
                  <span className="text-zinc-400">↗</span>
                </span>
              </SmartLinkPreview>
            </div>

            {/* Instagram Profile */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">Instagram Profile</span>
              <SmartLinkPreview url="https://www.instagram.com/mmmudit/">
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>@mmmudit</span>
                  <span className="text-zinc-400">↗</span>
                </span>
              </SmartLinkPreview>
            </div>

            {/* Substack */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">Substack Publication</span>
              <SmartLinkPreview url="https://substack.com/@mmmudit">
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span>Mudit's Substack</span>
                  <span className="text-zinc-400">↗</span>
                </span>
              </SmartLinkPreview>
            </div>

            {/* Email Direct Contact */}
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-start gap-2">
              <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold">Direct Email Badge</span>
              <EmailPreviewBadge>
                <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-all shadow-[2px_2px_0px_#18181b] inline-flex items-center gap-1.5 cursor-pointer active:scale-95">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>hello@muditjha.me</span>
                </span>
              </EmailPreviewBadge>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-4 border-t border-zinc-300">
          <span>Mudit Jha Portfolio — Link Badge Prototype</span>
          <div className="flex items-center gap-4">
            <Link href="/design-system" className="hover:text-zinc-900 underline underline-offset-2">
              Design System
            </Link>
            <Link href="/" className="hover:text-zinc-900 underline underline-offset-2">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
