"use client";

import React, { useState } from "react";
import SpatialPortfolioController from "@/components/spatial/SpatialPortfolioController";

export default function SpatialCanvasPrototypePage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* State controller matching airladesigns.com */}
      <SpatialPortfolioController
        theme={theme}
        brandTitle="MUDIT JHA"
        headlineFirstLine="Designer of unique"
        headlineSecondLine="brands and interfaces"
      />

      {/* Subtle theme toggle in corner */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          className="px-3 py-1.5 rounded-full bg-zinc-900/5 hover:bg-zinc-900/10 text-zinc-600 text-[11px] font-mono border border-zinc-200 backdrop-blur-md transition-all cursor-pointer"
        >
          {theme === "light" ? "Dark Theme" : "Light Theme"}
        </button>
      </div>
    </div>
  );
}
