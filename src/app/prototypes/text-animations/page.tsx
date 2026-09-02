"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Zap,
  Check,
  Play,
  Copy,
  Compass,
  Activity,
  Maximize2,
  Wind,
  Layers,
  Eye,
  Sliders,
} from "lucide-react";
import { play } from "@/lib/sound";
import { MagneticText, type MagneticVariant } from "@/components/magnetic-text";

const PROTOTYPE_OPTIONS: Array<{
  id: MagneticVariant;
  name: string;
  tagline: string;
  badge: string;
  physicsDetails: string;
  icon: React.ComponentType<{ className?: string }>;
  code: string;
}> = [
  {
    id: "proximity-lens",
    name: "4B. Word Proximity Lens (Active on Home)",
    tagline: "Continuous parabolic wave: words dynamically scale & levitate based on exact cursor (x,y) proximity.",
    badge: "SAVED ON HOME",
    physicsDetails: "Max Radius: 135px • Parabolic Cosine Easing • Stiffness: 440, Damping: 25",
    icon: Maximize2,
    code: `<MagneticText text="Design engineer & creative generalist." variant="proximity-lens" />`,
  },
  {
    id: "char-liquid-lens",
    name: "4B-1. Character-Level Liquid Lens",
    tagline: "Ultra-fine continuous Gaussian curve across every individual letter glyph.",
    badge: "ULTRA LIQUID",
    physicsDetails: "Glyph Level • Max Radius: 90px • Micro Lift: -8px • Scale: 1.18x",
    icon: Sparkles,
    code: `<MagneticText text="Design engineer & creative generalist." variant="char-liquid-lens" />`,
  },
  {
    id: "velocity-wind",
    name: "4B-2. Kinetic Velocity Wind Displace",
    tagline: "Tracks cursor vector & velocity: letters sway like grass in a breeze before spring recoil.",
    badge: "INERTIAL PHYSICS",
    physicsDetails: "Real-time Vector Velocity (vx, vy) • Rotational Lean: ±8° • Snappy Recoil",
    icon: Wind,
    code: `<MagneticText text="Design engineer & creative generalist." variant="velocity-wind" />`,
  },
  {
    id: "3d-focal-tilt",
    name: "4B-3. 3D Focal Light Point",
    tagline: "Letters pitch and yaw on 3D axes to point directly toward your cursor light coordinate in space.",
    badge: "3D SPATIAL",
    physicsDetails: "Perspective: 900px • 3D Euler Pitch/Yaw: ±22° • Dynamic Z-Depth: +20px",
    icon: Compass,
    code: `<MagneticText text="Design engineer & creative generalist." variant="3d-focal-tilt" />`,
  },
  {
    id: "weight-morph",
    name: "4B-4. Variable Font Gravitational Well",
    tagline: "Continuous radial field interpolates letter-spacing and scale tension as cursor approaches.",
    badge: "TYPOGRAPHIC",
    physicsDetails: "Tracking Morph: +0.04em • Optical Scale: 1.06x • Spring Tension: 450",
    icon: Zap,
    code: `<MagneticText text="Design engineer & creative generalist." variant="weight-morph" />`,
  },
  {
    id: "chromatic-focus",
    name: "4B-5. Chromatic Focal Aberration",
    tagline: "Focal depth of field: characters under cursor sharpen with soft sage green chromatic refraction.",
    badge: "OPTICAL REFRACTION",
    physicsDetails: "Dual Sage & Charcoal Chromatic Dispersion • Radial Cosine Falloff",
    icon: Eye,
    code: `<MagneticText text="Design engineer & creative generalist." variant="chromatic-focus" />`,
  },
];

export default function TextAnimationsPrototypePage() {
  const [selectedVariant, setSelectedVariant] = useState<MagneticVariant>("proximity-lens");
  const [replayKey, setReplayKey] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedOption =
    PROTOTYPE_OPTIONS.find((opt) => opt.id === selectedVariant) || PROTOTYPE_OPTIONS[0];

  const handleReplay = () => {
    play("tick");
    setReplayKey((k) => k + 1);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(selectedOption.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#fbfaf5] text-zinc-900 font-sans p-6 sm:p-12 dot-grid">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-black/5 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c8d5bb] text-zinc-900 text-xs font-mono font-medium">
                PROXIMITY MOTION LAB
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-zinc-900 tracking-tight">
              4B: Proximity & Magnetic Physics
            </h1>
            <p className="text-sm text-zinc-600 font-sans mt-1">
              Continuous pointer proximity explorations with fluid dynamics, inertia, 3D depth, and character waves.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-700 hover:text-zinc-950 bg-white border border-black/5 px-3.5 py-2 rounded-full shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>HOME</span>
            </Link>
          </div>
        </div>

        {/* Live Interactive Stage */}
        <div className="p-8 sm:p-12 rounded-[28px] bg-white border border-black/10 shadow-[0_4px_24px_rgba(0,0,0,0.04)] relative isolate overflow-hidden">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider">
                Live Interactive Stage — Sweep Cursor Over The Text
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReplay}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-xs font-mono font-medium text-zinc-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET STAGE</span>
              </button>
            </div>
          </div>

          {/* Hero Stage Content */}
          <div className="max-w-[700px] space-y-4 py-4">
            <h1 className="font-display text-[48px] sm:text-[56px] font-semibold tracking-[-3px] text-zinc-800 select-none">
              mudit jha
            </h1>

            {/* Active Rendered Magnetic Option */}
            <div className="min-h-[110px] flex items-center">
              <p
                key={replayKey}
                className="font-display text-[24px] sm:text-[26px] font-medium leading-[1.3] tracking-[-0.1px] text-button-secondary text-pretty"
              >
                <MagneticText
                  text="Design engineer & creative generalist."
                  variant={selectedVariant}
                  className="font-semibold text-zinc-900"
                />{" "}
                Building thoughtful things at the intersection of tech and{" "}
                <span className="font-hand italic font-bold text-[30px] leading-none text-willow-grey">
                  human
                </span>{" "}
                behavior.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-zinc-500">
            <div>
              <span>PHYSICS: </span>
              <span className="text-zinc-800 font-medium">{selectedOption.physicsDetails}</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 font-mono cursor-pointer self-start sm:self-auto"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "COPIED CODE" : "COPY CODE"}</span>
            </button>
          </div>
        </div>

        {/* Variants Selection Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-zinc-900">
              Select 4B Proximity Variant
            </h2>
            <span className="text-xs font-mono text-zinc-500">6 CRAFTED EXPERIENCES</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROTOTYPE_OPTIONS.map((opt) => {
              const isSelected = opt.id === selectedVariant;
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    play("toggle");
                    setSelectedVariant(opt.id);
                    setReplayKey((k) => k + 1);
                  }}
                  className={`p-5 rounded-[22px] text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer border ${
                    isSelected
                      ? "bg-[#c8d5bb]/25 border-zinc-900 shadow-md ring-1 ring-zinc-900"
                      : "bg-white/80 hover:bg-white border-black/5 hover:border-black/15 shadow-xs"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700">
                        {opt.badge}
                      </span>
                    </div>

                    <h3 className="font-display text-sm font-semibold text-zinc-900 mt-2">
                      {opt.name}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed font-sans">{opt.tagline}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {isSelected ? "ACTIVE ON STAGE" : "TEST VARIANT"}
                    </span>
                    {isSelected ? (
                      <span className="w-2 h-2 rounded-full bg-zinc-900" />
                    ) : (
                      <Play className="w-3 h-3 text-zinc-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
