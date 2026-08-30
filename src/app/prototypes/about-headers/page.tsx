"use client";

import { useState, useEffect, useRef } from "react";
import Typewriter from "@/components/fancy/text/typewriter";
import { ChevronsUpDown, Check } from "lucide-react";
import Image from "next/image";

// Sample book cards for realistic surrounding context
const SAMPLE_BOOKS = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    rating: 5,
  },
  {
    title: "The Design of Everyday Things",
    author: "Don Norman",
    img: "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=400&q=80",
    rating: 5,
  },
  {
    title: "Creative Selection",
    author: "Ken Kocienda",
    img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80",
    rating: 5,
  },
  {
    title: "Understanding Comics",
    author: "Scott McCloud",
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
    rating: 5,
  },
];

interface VariantConfig {
  name: string;
  axis: string;
  prefixClass: string;
  typewriterClass: string;
  cursorClass: string;
  cursorChar: string;
  pillBorder: string;
  pillText: string;
  pillBg: string;
  description: string;
}

const VARIANTS: VariantConfig[] = [
  {
    name: "Editorial Slate",
    axis: "Restrained Cool-Neutral",
    prefixClass: "text-zinc-800",
    typewriterClass: "font-hand font-bold text-[36px] text-rust-grey",
    cursorClass: "text-zinc-400 font-light ml-0.5",
    cursorChar: "_",
    pillBorder: "border-zinc-300/80 hover:border-zinc-400",
    pillText: "text-zinc-700",
    pillBg: "bg-white/60 hover:bg-white",
    description: "Deep ink prefix paired with subdued cool slate-grey handwritten script. Minimal, sharp, and timeless.",
  },
  {
    name: "Terracotta Umber",
    axis: "Earthy Studio Warmth",
    prefixClass: "text-zinc-800",
    typewriterClass: "font-hand font-bold text-[36px] text-[oklch(0.50_0.10_45)]",
    cursorClass: "text-[oklch(0.58_0.05_55)] font-light ml-0.5",
    cursorChar: "_",
    pillBorder: "border-[#d9d0bb] hover:border-[#b8a786]",
    pillText: "text-[#8a7c64]",
    pillBg: "bg-[#fbfaf5]/80 hover:bg-[#f3eedf]",
    description: "Warm terracotta-umber script that echoes letterpress ink, craft notebooks, and tactile paper.",
  },
  {
    name: "Botanical Olive",
    axis: "Organic Harmony",
    prefixClass: "text-zinc-800",
    typewriterClass: "font-hand font-bold text-[36px] text-[oklch(0.44_0.07_142)]",
    cursorClass: "text-[oklch(0.62_0.045_140)] font-light ml-0.5",
    cursorChar: "_",
    pillBorder: "border-[oklch(0.85_0.035_127.5)] hover:border-[oklch(0.70_0.04_130)]",
    pillText: "text-[oklch(0.45_0.05_140)]",
    pillBg: "bg-[oklch(0.96_0.015_120)]/60 hover:bg-[oklch(0.94_0.02_120)]",
    description: "Deep organic moss-olive script that pairs natively with the site's willow-grey design tokens.",
  },
  {
    name: "High-Contrast Stamp",
    axis: "Sharp Dual-Tone Punch",
    prefixClass: "text-zinc-500 font-normal",
    typewriterClass: "font-hand font-bold text-[38px] text-zinc-950",
    cursorClass: "text-emerald-600 font-normal ml-0.5",
    cursorChar: "|",
    pillBorder: "border-zinc-300 hover:border-zinc-500",
    pillText: "text-zinc-800",
    pillBg: "bg-white hover:bg-zinc-100",
    description: "Receded muted prefix that lets the handwritten word pop with maximum black ink punch and live emerald cursor.",
  },
];

export default function AboutHeadersPrototypePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // URL Param Sync on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = parseInt(params.get("v") || "1", 10);
    if (!isNaN(v) && v >= 1 && v <= VARIANTS.length) {
      setActiveIdx(v - 1);
    }
    const t = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Update Highlight Position
  useEffect(() => {
    const el = itemRefs.current[activeIdx];
    if (el && highlightRef.current) {
      highlightRef.current.style.width = `${el.offsetWidth}px`;
      highlightRef.current.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, [activeIdx, isReady]);

  // Keyboard navigation contract from PICKER.md
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        selectVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        selectVariant((activeIdx + 1) % VARIANTS.length);
      } else if (e.key === "ArrowLeft") {
        selectVariant((activeIdx - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key === "r" || e.key === "R") {
        setReplayKey((k) => k + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  const selectVariant = (idx: number) => {
    setActiveIdx(idx);
    setReplayKey((k) => k + 1);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(idx + 1));
    window.history.replaceState(null, "", url.toString());
  };

  const current = VARIANTS[activeIdx];

  return (
    <div className="min-h-screen pb-32 pt-12 max-w-[1000px] mx-auto px-4 sm:px-6">
      {/* Prototype Breadcrumb & Details Header */}
      <div className="mb-10 flex flex-col gap-2 border-b border-zinc-200/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
          <span>Prototypes</span>
          <span>/</span>
          <span className="text-zinc-800 font-semibold">About Page Section Header Colors</span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900">
            {current.name}
          </h1>
          <div className="inline-flex items-center gap-2 text-xs font-mono bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-md border border-zinc-200">
            <span>Axis:</span>
            <span className="font-semibold text-zinc-900">{current.axis}</span>
          </div>
        </div>
        <p className="text-sm text-zinc-500 font-display text-pretty max-w-[650px] mt-1">
          {current.description}
        </p>
      </div>

      {/* Realistic Stage: Live Header Preview */}
      <div
        key={`stage-${activeIdx}-${replayKey}`}
        className="w-full bg-[#fbfaf5] border border-zinc-200/90 rounded-2xl p-6 sm:p-10 shadow-xs flex flex-col gap-10"
      >
        {/* 1. The Header Under Test */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 select-none w-full border-b border-zinc-200/40 pb-4">
          <h2 className="font-display text-[26px] sm:text-[34px] md:text-[36px] font-medium leading-tight tracking-tight text-balance">
            <span className={`inline-flex items-baseline gap-[0.25em] flex-wrap ${current.prefixClass}`}>
              <span>reads that keep me</span>
              <Typewriter
                text={["creative.", "curious.", "focused.", "inspired."]}
                className={current.typewriterClass}
                speed={65}
                deleteSpeed={35}
                waitTime={2200}
                cursorChar={current.cursorChar}
                cursorClassName={current.cursorClass}
              />
            </span>
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm sm:text-base font-medium transition-colors ${current.pillBorder} ${current.pillText} ${current.pillBg}`}
            >
              <span className="tabular-nums">2026</span>
              <ChevronsUpDown className="size-3.5 opacity-70" />
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm sm:text-base font-medium transition-colors ${current.pillBorder} ${current.pillText} ${current.pillBg}`}
            >
              <span>Design</span>
              <ChevronsUpDown className="size-3.5 opacity-70" />
            </div>
          </div>
        </div>

        {/* 2. Realistic Sub-Content: Book Cards Shelf */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {SAMPLE_BOOKS.map((b, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl overflow-hidden border border-zinc-200/80 bg-white p-3 shadow-xs"
            >
              <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-zinc-100">
                <Image
                  src={b.img}
                  alt={b.title}
                  fill
                  className="object-cover"
                  sizes="200px"
                  unoptimized
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-medium text-xs text-zinc-900 truncate">
                  {b.title}
                </span>
                <span className="font-sans text-[11px] text-zinc-500 truncate">
                  {b.author}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Second Header (Music) for Side-by-Side Rhythm */}
        <div className="pt-4 border-t border-zinc-200/60 flex flex-wrap items-center justify-between gap-3 sm:gap-4 select-none w-full">
          <h2 className="font-display text-[26px] sm:text-[34px] md:text-[36px] font-medium leading-tight tracking-tight text-balance">
            <span className={`inline-flex items-baseline gap-[0.25em] flex-wrap ${current.prefixClass}`}>
              <span>sounds that keep me</span>
              <Typewriter
                text={["focused.", "calm.", "fueled.", "energized."]}
                className={current.typewriterClass}
                speed={65}
                deleteSpeed={35}
                waitTime={2200}
                cursorChar={current.cursorChar}
                cursorClassName={current.cursorClass}
              />
            </span>
          </h2>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm sm:text-base font-medium transition-colors ${current.pillBorder} ${current.pillText} ${current.pillBg}`}
          >
            <span className="tabular-nums">2026</span>
            <ChevronsUpDown className="size-3.5 opacity-70" />
          </div>
        </div>
      </div>

      {/* Verbatim Prototype Picker Chrome from PICKER.md */}
      <nav
        className="proto-picker"
        data-ready={isReady ? "" : undefined}
        aria-label="Prototype variants"
      >
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {VARIANTS.map((v, i) => (
          <button
            key={v.name}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => selectVariant(i)}
            className="proto-picker-item"
            data-active={activeIdx === i ? "" : undefined}
            aria-current={activeIdx === i ? "true" : undefined}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          onClick={() => setReplayKey((k) => k + 1)}
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
        >
          ↻
        </button>
      </nav>

      {/* Injected Verbatim Styles from PICKER.md */}
      <style jsx global>{`
        .proto-picker {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2147483647;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.82);
          -webkit-backdrop-filter: blur(12px) saturate(1.4);
          backdrop-filter: blur(12px) saturate(1.4);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 8px 24px rgba(0, 0, 0, 0.24),
            0 2px 6px rgba(0, 0, 0, 0.12);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          user-select: none;
          -webkit-user-select: none;
        }

        .proto-picker-highlight {
          position: absolute;
          top: 4px;
          left: 0;
          height: 28px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          will-change: transform;
        }

        .proto-picker[data-ready] .proto-picker-highlight {
          transition:
            transform 250ms cubic-bezier(0.23, 1, 0.32, 1),
            width 250ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .proto-picker[data-ready] .proto-picker-highlight {
            transition: none;
          }
        }

        .proto-picker-item {
          position: relative;
          display: flex;
          align-items: center;
          height: 28px;
          padding: 0 12px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font: inherit;
          cursor: pointer;
          transition: color 150ms ease-out;
        }

        .proto-picker-item:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .proto-picker-item:active {
          transform: scale(0.97);
        }

        .proto-picker-item:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.4);
          outline-offset: 2px;
        }

        .proto-picker-item[data-active] {
          color: #fff;
        }

        .proto-picker-divider {
          width: 1px;
          height: 16px;
          margin: 0 4px;
          background: rgba(255, 255, 255, 0.12);
        }

        .proto-picker-replay {
          padding: 0 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
