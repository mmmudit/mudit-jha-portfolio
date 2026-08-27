"use client";

import React, { useState, useEffect, useRef } from "react";
import { PulsingGlobe } from "@/components/pulsing-globe";
import { ProjectGrid } from "@/components/project-grid";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { play } from "@/lib/sound";

const sampleProjects = [
  {
    _id: "1",
    title: "Apple",
    slug: "apple",
    year: "2025",
    description: "Designing new features to drive spatial interaction and user delight.",
    image: "/assets/projects/apple_vision.png",
    gradient: "from-amber-100/80 via-rose-100/80 to-purple-100/80",
    href: "https://apple.com",
  },
  {
    _id: "2",
    title: "Roblox",
    slug: "roblox",
    year: "2024",
    description: "Reimagining the future of social gameplay and user communication.",
    image: "/assets/projects/canvas_os.png",
    gradient: "from-sky-100/80 via-blue-100/80 to-indigo-100/80",
    href: "https://roblox.com",
  },
];

// --- 1. Pure Aura (Minimalist Ambient Halo) ---
function VariantPureAura() {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Design Engineer &amp; Creative Generalist
        </div>

        <h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
          mudit jha
        </h1>

        <p className="font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-[#7f7f80] text-pretty">
          Building thoughtful things at the intersection of tech and{" "}
          <span className="font-hand italic font-bold text-[30px] leading-none text-[#9bb48c]">
            human
          </span>{" "}
          behavior.
        </p>
      </div>

      {/* Free-Floating Globe with Soft Breathing Halo */}
      <div
        onClick={() => play("pulse", { volume: 0.35 })}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto py-3 px-6 select-none cursor-pointer"
      >
        {/* Ambient Halo */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
        />
        <PulsingGlobe size={92} className="group-hover:scale-105 transition-transform duration-300" />
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight">
            <span>01:23:45 AM</span>
            <span className="text-zinc-300">•</span>
            <span className="font-sans font-normal text-[#7f7f80]">GMT −05:00</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Minneapolis, MN
          </span>
        </div>
      </div>
    </section>
  );
}

// --- 2. Celestial Radar (Concentric Orbital Ripples) ---
function VariantCelestialRadar() {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Minneapolis • 44.9778° N, 93.2650° W
        </div>

        <h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
          mudit jha
        </h1>

        <p className="font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-[#7f7f80] text-pretty">
          Building thoughtful things at the intersection of tech and{" "}
          <span className="font-hand italic font-bold text-[30px] leading-none text-[#9bb48c]">
            human
          </span>{" "}
          behavior.
        </p>
      </div>

      {/* Globe with Concentric Radar Wave Rings */}
      <div className="relative flex flex-col items-center justify-center gap-3 shrink-0 self-center md:self-auto p-8 select-none">
        {/* Concentric Ambient Radar Circles */}
        <div className="absolute inset-2 -z-10 rounded-full border border-[#c8d5bb]/35 pointer-events-none" />
        <div className="absolute inset-6 -z-10 rounded-full border border-[#c8d5bb]/20 pointer-events-none" />
        <div
          className="absolute inset-0 -z-20 rounded-full blur-xl pointer-events-none opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.5) 0%, rgba(200, 213, 187, 0) 75%)",
          }}
        />

        <PulsingGlobe size={86} />

        <div className="flex items-center gap-2 font-mono text-[12px] uppercase text-[#7f7f80] tracking-wider pt-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#70bb44] animate-pulse" />
          <span>01:23:45 AM</span>
          <span className="text-zinc-300">•</span>
          <span>44.97° N</span>
        </div>
      </div>
    </section>
  );
}

// --- 3. Interactive Sol (Magnetic Gravitation & Flares) ---
function VariantInteractiveSol() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.15, y: y * 0.15 });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Interactive Design Engineering
        </div>

        <h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
          mudit jha
        </h1>

        <p className="font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-[#7f7f80] text-pretty">
          Building thoughtful things at the intersection of tech and{" "}
          <span className="font-hand italic font-bold text-[30px] leading-none text-[#9bb48c]">
            human
          </span>{" "}
          behavior.
        </p>
      </div>

      {/* Magnetic Interactive Sol */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => play("pulse", { volume: 0.4 })}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto p-6 select-none cursor-pointer"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-95 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(156, 210, 90, 0.4) 0%, rgba(200, 213, 187, 0.2) 50%, transparent 75%)",
          }}
        />
        <div
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: "transform 150ms cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <PulsingGlobe size={96} />
        </div>
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <span className="font-mono text-[13px] font-medium text-zinc-800">
            01:23:45 AM
          </span>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]">
            Minneapolis (GMT−05)
          </span>
        </div>
      </div>
    </section>
  );
}

// --- 4. Editorial Astrolabe (Horizontal Typography Lockup) ---
function VariantEditorialAstrolabe() {
  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[620px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Design Engineer &amp; Creative Generalist
        </div>

        <h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 text-balance">
          mudit jha
        </h1>

        <p className="font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-[#7f7f80] text-pretty">
          Building thoughtful things at the intersection of tech and{" "}
          <span className="font-hand italic font-bold text-[30px] leading-none text-[#9bb48c]">
            human
          </span>{" "}
          behavior.
        </p>
      </div>

      {/* Horizontal Astrolabe Lockup */}
      <div
        onClick={() => play("pulse", { volume: 0.35 })}
        className="group relative flex items-center gap-5 p-4 pr-6 rounded-full border border-[#c8d5bb]/35 bg-[#c8d5bb]/10 backdrop-blur-sm shadow-sm shrink-0 self-center md:self-auto select-none cursor-pointer hover:border-[#9bb48c]/50 transition-colors duration-200"
      >
        <PulsingGlobe size={68} className="group-hover:scale-105 transition-transform duration-200" />
        <div className="w-px h-10 bg-[#c8d5bb]/50" />
        <div className="flex flex-col justify-center gap-0.5">
          <div className="font-mono text-[14px] font-medium text-zinc-800 tracking-tight">
            01:23:45 AM
          </div>
          <div className="font-sans text-[11px] uppercase tracking-wider text-[#7f7f80]">
            Minneapolis • GMT−05
          </div>
        </div>
      </div>
    </section>
  );
}

const variants = [
  { id: "pure-aura", name: "Pure Aura", component: VariantPureAura },
  { id: "celestial-radar", name: "Celestial Radar", component: VariantCelestialRadar },
  { id: "interactive-sol", name: "Interactive Sol", component: VariantInteractiveSol },
  { id: "editorial-astrolabe", name: "Astrolabe Pill", component: VariantEditorialAstrolabe },
];

export default function GlobeLayoutPrototype() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = parseInt(params.get("v") || "1", 10);
    if (v >= 1 && v <= variants.length) {
      setActiveIdx(v - 1);
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
  }, []);

  const selectVariant = (idx: number) => {
    setActiveIdx(idx);
    const url = new URL(window.location.href);
    url.searchParams.set("v", String(idx + 1));
    window.history.replaceState(null, "", url.toString());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) selectVariant(num - 1);
      else if (e.key === "ArrowRight") selectVariant((activeIdx + 1) % variants.length);
      else if (e.key === "ArrowLeft") selectVariant((activeIdx - 1 + variants.length) % variants.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx]);

  const ActiveComponent = variants[activeIdx].component;

  return (
    <main className="min-h-screen px-6 md:px-12 max-w-[1200px] mx-auto pb-32">
      {/* Variant Viewport Context */}
      <div key={activeIdx} className="flex w-full flex-col gap-12">
        <ActiveComponent />

        <Divider />
        <ProjectGrid projects={sampleProjects} />
        <Divider />
        <Footer />
      </div>

      {/* Verbatim Prototype Picker from PICKER.md */}
      <nav
        className="proto-picker"
        data-ready={ready ? "" : undefined}
        aria-label="Prototype variants"
      >
        <span
          className="proto-picker-highlight"
          aria-hidden="true"
          style={{
            transform: `translateX(${activeIdx * 135 + 4}px)`,
            width: "131px",
          }}
        />
        {variants.map((v, i) => (
          <button
            key={v.id}
            type="button"
            className="proto-picker-item"
            data-active={activeIdx === i ? "" : undefined}
            aria-current={activeIdx === i ? "true" : undefined}
            onClick={() => selectVariant(i)}
            style={{ width: "135px", justifyContent: "center" }}
          >
            {v.name}
          </button>
        ))}
      </nav>

      {/* Picker Styles verbatim from PICKER.md */}
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
          background: rgba(255, 255, 255, 0.14);
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
          font-weight: 500;
        }
      `}</style>
    </main>
  );
}
