"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Move, Sliders, Layout, Layers, RefreshCw } from "lucide-react";
import { DragCanvas, DragCanvasItem } from "@/components/DragCanvas";

const DEMO_PLAYGROUND_ITEMS: DragCanvasItem[] = [
  {
    id: "spatial-vision",
    title: "Spatial Vision UI",
    caption: "Dynamic glass shaders, spatial gaze cues, and tactile eye-tracking feedback primitives.",
    imageSrc: "/assets/projects/apple_vision.png",
    top: 260,
    left: 340,
    rotation: -4.5,
    width: 440,
    tag: "Spatial UI",
  },
  {
    id: "polaroid-studio",
    title: "Polaroid Camera Shader",
    caption: "Real-time analog film emulsion curve simulation & chemical development process in WebGL.",
    imageSrc: "/assets/projects/polaroid_studio.png",
    top: 180,
    left: 920,
    rotation: 3.5,
    width: 400,
    tag: "WebGL Shader",
  },
  {
    id: "screentime-receipt",
    title: "Screentime Thermal Print",
    caption: "Visualizing personal digital consumption as thermal printed itemized receipts.",
    imageSrc: "/assets/projects/screentime_receipt.png",
    top: 720,
    left: 480,
    rotation: -2.8,
    width: 380,
    tag: "Data Viz",
  },
  {
    id: "canvas-os",
    title: "Canvas OS & Nodes",
    caption: "Infinite spatial workspace with physics-based card links and gesture flow.",
    imageSrc: "/assets/projects/canvas_os.png",
    top: 640,
    left: 1060,
    rotation: 5.2,
    width: 460,
    tag: "Interface",
  },
  {
    id: "avatar-studio",
    title: "Analog Portrait Studio",
    caption: "Hand-printed studio portrait on warm heavyweight stock paper.",
    imageSrc: "/assets/avatar.png",
    top: 420,
    left: 1680,
    rotation: -6.0,
    width: 320,
    tag: "Portrait",
  },
  {
    id: "wordmark-sketch",
    title: "Wordmark Typography",
    caption: "Custom handcrafted signature typography and brush stroke exploration.",
    imageSrc: "/assets/mudit-wordmark.png",
    top: 860,
    left: 1540,
    rotation: 2.2,
    width: 440,
    tag: "Branding",
  },
];

export default function DragCanvasPrototypePage() {
  const [elasticity, setElasticity] = useState(0.18);
  const [dragAxis, setDragAxis] = useState<"both" | "x" | "y">("both");
  const [selectedItem, setSelectedItem] = useState<DragCanvasItem | null>(null);
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#f5f2e9] text-zinc-900 font-sans p-6 sm:p-10 selection:bg-zinc-900 selection:text-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
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

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-zinc-950">
                Draggable Moodboard Canvas
              </h1>
              <p className="text-sm text-zinc-600 max-w-2xl leading-relaxed mt-1">
                A free-form draggable playground with Framer Motion constraints, rubber-band elasticity, trackpad inertia panning, and non-blocking card hover overlays.
              </p>
            </div>

            {/* Quick Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="pressable inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-zinc-300 bg-white text-xs font-mono font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors shadow-xs"
              >
                <RefreshCw className="size-3.5 text-zinc-500" />
                <span>Recenter Canvas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Canvas Showcase */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <Move className="size-3.5 text-zinc-600" />
              <span>Click &amp; drag anywhere or use your trackpad to pan</span>
            </div>

            {selectedItem && (
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                Clicked: {selectedItem.title}
              </span>
            )}
          </div>

          <DragCanvas
            key={key}
            items={DEMO_PLAYGROUND_ITEMS}
            canvasWidth={2400}
            canvasHeight={1600}
            dragAxis={dragAxis}
            dragElastic={elasticity}
            className="h-[75vh] min-h-[580px] w-full"
            onItemClick={(item) => setSelectedItem(item)}
          />
        </div>

        {/* Configuration Bar */}
        <div className="p-6 bg-white rounded-[22px] border border-zinc-300/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            {/* Axis Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                Drag Axis:
              </span>
              <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-100/80 p-0.5">
                {(["both", "x", "y"] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => setDragAxis(axis)}
                    className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-colors ${
                      dragAxis === axis
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-500 hover:text-zinc-800"
                    }`}
                  >
                    {axis}
                  </button>
                ))}
              </div>
            </div>

            {/* Elasticity Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">
                Elasticity:
              </span>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.02"
                value={elasticity}
                onChange={(e) => setElasticity(parseFloat(e.target.value))}
                className="accent-zinc-900 cursor-pointer"
              />
              <span className="text-xs font-mono text-zinc-700 min-w-[32px]">
                {elasticity}
              </span>
            </div>
          </div>

          <div className="text-xs font-mono text-zinc-400">
            Exported from <code className="text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded">src/components/DragCanvas.tsx</code>
          </div>
        </div>
      </div>
    </div>
  );
}
