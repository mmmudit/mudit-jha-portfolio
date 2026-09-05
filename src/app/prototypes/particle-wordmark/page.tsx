"use client";

import { TextAnimationCollection } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";

export function Scene() {
  return (
    <div className="shader-frame" style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <TextAnimationCollection
        variant="particle-wordmark"
        mode="light"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

export default function ParticleWordmarkPage() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#f4f7fb]">
      <Scene />
    </main>
  );
}
