"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectGrid } from "@/components/project-grid";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { play } from "@/lib/sound";
import { useReducedMotion } from "framer-motion";

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

// Helper: Check if a (lat, lon) falls on Earth landmass
function isEarthLand(lat: number, lon: number): boolean {
  let l = lon;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;

  // Greenland
  if (lat >= 60 && lat <= 83 && l >= -55 && l <= -18) return true;
  // North America
  if (lat >= 50 && lat <= 72 && l >= -168 && l <= -55) return true;
  if (lat >= 25 && lat < 50 && l >= -125 && l <= -67) return true;
  if (lat >= 14 && lat < 25 && l >= -115 && l <= -86) return true;
  // South America
  if (lat >= 0 && lat <= 12 && l >= -79 && l <= -50) return true;
  if (lat >= -20 && lat < 0 && l >= -81 && l <= -35) return true;
  if (lat >= -56 && lat < -20 && l >= -75 && l <= -45) return true;
  // Europe
  if (lat >= 50 && lat <= 71 && l >= -10 && l <= 32) return true;
  if (lat >= 36 && lat < 50 && l >= -10 && l <= 40) return true;
  if (lat >= 50 && lat <= 60 && l >= -11 && l <= 2) return true;
  // Africa
  if (lat >= 15 && lat <= 37 && l >= -17 && l <= 38) return true;
  if (lat >= -5 && lat < 15 && l >= -15 && l <= 51) return true;
  if (lat >= -35 && lat < -5 && l >= 10 && l <= 42) return true;
  // Asia
  if (lat >= 50 && lat <= 77 && l >= 32 && l <= 180) return true;
  if (lat >= 20 && lat < 50 && l >= 35 && l <= 140) return true;
  if (lat >= 8 && lat < 30 && l >= 68 && l <= 92) return true;
  if (lat >= -10 && lat < 20 && l >= 95 && l <= 145) return true;
  // Australia
  if (lat >= -39 && lat <= -11 && l >= 113 && l <= 154) return true;
  // Antarctica
  if (lat <= -65) return true;

  return false;
}

// ----------------------------------------------------------------------------
// VARIANT 1: COSMOS LATITUDES (Direct reproduction of cosmos.so reference)
// ----------------------------------------------------------------------------
function VariantCosmosLatitudes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ targetRotX: 0, targetRotY: 0 });
  const shockwaveRef = useRef({ r: 0, active: false });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 140;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.41;
    const particles: {
      x0: number;
      y0: number;
      z0: number;
      lat: number;
      size: number;
    }[] = [];

    // Construct parallel horizontal slices exactly matching the Cosmos reference
    // Concentric rings at poles + evenly distributed parallel slices
    const latSteps = 32; // Number of horizontal latitude slices
    for (let i = 1; i < latSteps; i++) {
      const phi = (i / latSteps) * Math.PI; // 0 to PI
      const y = -R * Math.cos(phi);
      const ringRadius = R * Math.sin(phi);

      // Number of dots proportional to ring perimeter
      const ringCircumference = 2 * Math.PI * ringRadius;
      const count = Math.max(12, Math.round(ringCircumference / 6.2));

      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2;
        const x = ringRadius * Math.sin(theta);
        const z = ringRadius * Math.cos(theta);

        particles.push({
          x0: x,
          y0: y,
          z0: z,
          lat: 90 - (phi * 180) / Math.PI,
          size: 1.05,
        });
      }
    }

    // Add extra dense polar cap rings for the characteristic Cosmos Moire look
    const polarRings = [0.94, 0.97, 0.985];
    polarRings.forEach((ratio) => {
      [1, -1].forEach((dir) => {
        const y = dir * R * ratio;
        const ringRadius = Math.sqrt(Math.max(0, R * R - y * y));
        const count = 22;
        for (let j = 0; j < count; j++) {
          const theta = (j / count) * Math.PI * 2;
          particles.push({
            x0: ringRadius * Math.sin(theta),
            y0: y,
            z0: ringRadius * Math.cos(theta),
            lat: dir * 85,
            size: 0.9,
          });
        }
      });
    });

    let animId: number;
    let rotY = 0;
    const baseTiltX = 0.42; // ~24deg isometric downward tilt matching reference
    let currentRotX = baseTiltX;
    let currentRotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      if (!shouldReduceMotion) {
        rotY += 0.008;
      }
      currentRotX += (mouseRef.current.targetRotX + baseTiltX - currentRotX) * 0.08;
      currentRotY += (mouseRef.current.targetRotY + rotY - currentRotY) * 0.08;

      const centerX = size / 2;
      const centerY = size / 2;
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      if (shockwaveRef.current.active) {
        shockwaveRef.current.r += 2.8;
        if (shockwaveRef.current.r > R * 2.2) {
          shockwaveRef.current.active = false;
          shockwaveRef.current.r = 0;
        }
      }

      const projected = particles.map((p) => {
        let x0 = p.x0;
        let y0 = p.y0;
        let z0 = p.z0;

        if (shockwaveRef.current.active) {
          const dist = Math.hypot(x0, y0, z0);
          const diff = Math.abs(dist - shockwaveRef.current.r);
          if (diff < 12) {
            const push = (12 - diff) * 0.4;
            x0 += (x0 / dist) * push;
            y0 += (y0 / dist) * push;
            z0 += (z0 / dist) * push;
          }
        }

        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        return {
          x2D: centerX + x1,
          y2D: centerY + y2,
          z3D: z2,
          size: p.size,
        };
      });

      projected.sort((a, b) => a.z3D - b.z3D);

      for (const p of projected) {
        const depthNorm = (p.z3D + R) / (R * 2);
        const clampedDepth = Math.max(0, Math.min(1, depthNorm));

        ctx.save();
        ctx.beginPath();
        const r = p.size * (0.65 + 0.65 * clampedDepth);
        ctx.arc(p.x2D, p.y2D, r, 0, Math.PI * 2);

        // Front dots are bright crisp white/sage, back dots are translucent
        if (clampedDepth > 0.65) {
          ctx.fillStyle = "#70bb44";
          ctx.shadowColor = "#70bb44";
          ctx.shadowBlur = 4 * clampedDepth;
          ctx.globalAlpha = 0.35 + 0.65 * Math.pow(clampedDepth, 1.4);
        } else {
          ctx.fillStyle = "#8ea87d";
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.12 + 0.35 * Math.pow(clampedDepth, 1.2);
        }

        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseRef.current.targetRotY = x * 0.75;
    mouseRef.current.targetRotX = -y * 0.6;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetRotY = 0;
    mouseRef.current.targetRotX = 0;
  };

  const handleClick = () => {
    shockwaveRef.current = { r: 2, active: true };
    play("pulse", { volume: 0.35 });
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Variant 1: Cosmos Latitudes • Concentric Parallel Dot Slices
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

      <div
        onClick={handleClick}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto py-3 px-6 select-none cursor-pointer"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "140px", height: "140px" }}
          className="hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight">
            <span>01:23:45 AM</span>
            <span className="text-zinc-300">•</span>
            <span className="font-sans font-normal text-[#7f7f80]">GMT −05:00</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Minneapolis, MN • Click for Wave
          </span>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// VARIANT 2: COSMOS TERRA (Cosmos dot slices + Illuminated Earth Continents)
// ----------------------------------------------------------------------------
function VariantCosmosTerra() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ targetRotX: 0, targetRotY: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 140;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.41;
    const particles: {
      lat: number;
      lon: number;
      isLand: boolean;
      isBeacon?: boolean;
      size: number;
    }[] = [];

    // Minneapolis node: 44.97° N, -93.26° W
    particles.push({ lat: 44.97, lon: -93.26, isLand: true, isBeacon: true, size: 2.6 });

    const latSteps = 30;
    for (let i = 1; i < latSteps; i++) {
      const phi = (i / latSteps) * Math.PI;
      const lat = 90 - (phi * 180) / Math.PI;
      const ringRadius = R * Math.sin(phi);
      const ringCircumference = 2 * Math.PI * ringRadius;
      const count = Math.max(12, Math.round(ringCircumference / 5.8));

      for (let j = 0; j < count; j++) {
        const lon = -180 + (j / count) * 360;
        const land = isEarthLand(lat, lon);

        particles.push({
          lat,
          lon,
          isLand: land,
          size: land ? 1.3 : 0.8,
        });
      }
    }

    let animId: number;
    let rotY = Math.PI * 0.85; // America facing
    const baseTiltX = 0.38;
    let currentRotX = baseTiltX;
    let currentRotY = rotY;
    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, size, size);

      if (!shouldReduceMotion) {
        rotY += 0.0075;
      }
      currentRotX += (mouseRef.current.targetRotX + baseTiltX - currentRotX) * 0.08;
      currentRotY += (mouseRef.current.targetRotY + rotY - currentRotY) * 0.08;

      const centerX = size / 2;
      const centerY = size / 2;
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const projected = particles.map((p) => {
        const latRad = (p.lat * Math.PI) / 180;
        const lonRad = (p.lon * Math.PI) / 180;

        const x0 = R * Math.cos(latRad) * Math.sin(lonRad);
        const y0 = -R * Math.sin(latRad);
        const z0 = R * Math.cos(latRad) * Math.cos(lonRad);

        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        return {
          x2D: centerX + x1,
          y2D: centerY + y2,
          z3D: z2,
          isLand: p.isLand,
          isBeacon: p.isBeacon,
          size: p.size,
        };
      });

      projected.sort((a, b) => a.z3D - b.z3D);

      for (const p of projected) {
        const depthNorm = (p.z3D + R) / (R * 2);
        const clampedDepth = Math.max(0, Math.min(1, depthNorm));

        ctx.save();
        ctx.beginPath();

        if (p.isBeacon) {
          const beaconSize = 2.8 + Math.sin(time * 6) * 1.2;
          ctx.arc(p.x2D, p.y2D, beaconSize, 0, Math.PI * 2);
          ctx.fillStyle = "#70bb44";
          ctx.shadowColor = "#70bb44";
          ctx.shadowBlur = 10;
          ctx.globalAlpha = Math.max(0.6, clampedDepth);
          ctx.fill();
        } else if (p.isLand) {
          const alpha = 0.3 + 0.7 * Math.pow(clampedDepth, 1.4);
          const r = p.size * (0.7 + 0.65 * clampedDepth);
          ctx.arc(p.x2D, p.y2D, r, 0, Math.PI * 2);

          if (clampedDepth > 0.6) {
            ctx.fillStyle = "#70bb44";
            ctx.shadowColor = "#70bb44";
            ctx.shadowBlur = 5 * clampedDepth;
          } else {
            ctx.fillStyle = "#8ea87d";
            ctx.shadowBlur = 0;
          }
          ctx.globalAlpha = alpha;
          ctx.fill();
        } else {
          // Ocean latitude grid dot
          const alpha = 0.08 + 0.25 * Math.pow(clampedDepth, 1.2);
          ctx.arc(p.x2D, p.y2D, 0.7, 0, Math.PI * 2);
          ctx.fillStyle = "#a8c29b";
          ctx.globalAlpha = alpha;
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseRef.current.targetRotY = x * 0.75;
    mouseRef.current.targetRotX = -y * 0.6;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetRotY = 0;
    mouseRef.current.targetRotX = 0;
  };

  const handleClick = () => {
    play("pulse", { volume: 0.35 });
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Variant 2: Cosmos Terra • Earth Landmass Glow on Sliced Latitudes
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

      <div
        onClick={handleClick}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto py-3 px-6 select-none cursor-pointer"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "140px", height: "140px" }}
          className="hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight">
            <span>01:23:45 AM</span>
            <span className="text-zinc-300">•</span>
            <span className="font-sans font-normal text-[#7f7f80]">CONTINENT GLOW</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Latitude Slices &amp; Landmass
          </span>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// VARIANT 3: COSMOS DUAL-MATRIX (Latitude + Longitude Dot Strands)
// ----------------------------------------------------------------------------
function VariantCosmosDualMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ targetRotX: 0, targetRotY: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 140;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.41;
    const particles: { x0: number; y0: number; z0: number; isEquator: boolean; size: number }[] = [];

    // 1. Concentric Horizontal Latitude Slices
    const latSteps = 24;
    for (let i = 1; i < latSteps; i++) {
      const phi = (i / latSteps) * Math.PI;
      const y = -R * Math.cos(phi);
      const ringRadius = R * Math.sin(phi);
      const count = Math.max(10, Math.round((2 * Math.PI * ringRadius) / 7.5));
      const isEquator = i === latSteps / 2;

      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2;
        particles.push({
          x0: ringRadius * Math.sin(theta),
          y0: y,
          z0: ringRadius * Math.cos(theta),
          isEquator,
          size: isEquator ? 1.4 : 0.95,
        });
      }
    }

    // 2. Vertical Longitude Rings (8 meridian arches)
    const meridianCount = 8;
    for (let m = 0; m < meridianCount; m++) {
      const angle = (m / meridianCount) * Math.PI;
      const count = 36;
      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2;
        const x = R * Math.sin(theta) * Math.cos(angle);
        const y = R * Math.cos(theta);
        const z = R * Math.sin(theta) * Math.sin(angle);
        particles.push({
          x0: x,
          y0: y,
          z0: z,
          isEquator: false,
          size: 0.8,
        });
      }
    }

    let animId: number;
    let rotY = 0;
    const baseTiltX = 0.42;
    let currentRotX = baseTiltX;
    let currentRotY = 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      if (!shouldReduceMotion) {
        rotY += 0.008;
      }
      currentRotX += (mouseRef.current.targetRotX + baseTiltX - currentRotX) * 0.08;
      currentRotY += (mouseRef.current.targetRotY + rotY - currentRotY) * 0.08;

      const centerX = size / 2;
      const centerY = size / 2;
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const projected = particles.map((p) => {
        const x1 = p.x0 * cosY - p.z0 * sinY;
        const z1 = p.x0 * sinY + p.z0 * cosY;

        const y2 = p.y0 * cosX - z1 * sinX;
        const z2 = p.y0 * sinX + z1 * cosX;

        return {
          x2D: centerX + x1,
          y2D: centerY + y2,
          z3D: z2,
          isEquator: p.isEquator,
          size: p.size,
        };
      });

      projected.sort((a, b) => a.z3D - b.z3D);

      for (const p of projected) {
        const depthNorm = (p.z3D + R) / (R * 2);
        const clampedDepth = Math.max(0, Math.min(1, depthNorm));

        ctx.save();
        ctx.beginPath();
        const r = p.size * (0.65 + 0.65 * clampedDepth);
        ctx.arc(p.x2D, p.y2D, r, 0, Math.PI * 2);

        if (p.isEquator) {
          ctx.fillStyle = "#70bb44";
          ctx.shadowColor = "#70bb44";
          ctx.shadowBlur = 6 * clampedDepth;
          ctx.globalAlpha = 0.4 + 0.6 * Math.pow(clampedDepth, 1.4);
        } else if (clampedDepth > 0.6) {
          ctx.fillStyle = "#70bb44";
          ctx.shadowColor = "#70bb44";
          ctx.shadowBlur = 3 * clampedDepth;
          ctx.globalAlpha = 0.25 + 0.75 * Math.pow(clampedDepth, 1.4);
        } else {
          ctx.fillStyle = "#8ea87d";
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.12 + 0.35 * Math.pow(clampedDepth, 1.2);
        }

        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseRef.current.targetRotY = x * 0.75;
    mouseRef.current.targetRotX = -y * 0.6;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetRotY = 0;
    mouseRef.current.targetRotX = 0;
  };

  const handleClick = () => {
    play("pulse", { volume: 0.35 });
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Variant 3: Cosmos Dual-Matrix • Latitude Slices &amp; Meridian Strands
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

      <div
        onClick={handleClick}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto py-3 px-6 select-none cursor-pointer"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "140px", height: "140px" }}
          className="hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight">
            <span>01:23:45 AM</span>
            <span className="text-zinc-300">•</span>
            <span className="font-sans font-normal text-[#7f7f80]">DUAL MATRIX</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Latitude &amp; Longitude Grid
          </span>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// VARIANT 4: COSMOS HARMONIC WAVE (Flowing Sinusoidal Ring Undulation)
// ----------------------------------------------------------------------------
function VariantCosmosHarmonicWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ targetRotX: 0, targetRotY: 0, hover: 0 });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 140;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const R = size * 0.41;
    const particles: {
      phi: number;
      theta: number;
      ringIndex: number;
      size: number;
    }[] = [];

    const latSteps = 30;
    for (let i = 1; i < latSteps; i++) {
      const phi = (i / latSteps) * Math.PI;
      const ringRadius = R * Math.sin(phi);
      const count = Math.max(12, Math.round((2 * Math.PI * ringRadius) / 6.2));

      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2;
        particles.push({
          phi,
          theta,
          ringIndex: i,
          size: 1.05,
        });
      }
    }

    let animId: number;
    let rotY = 0;
    const baseTiltX = 0.42;
    let currentRotX = baseTiltX;
    let currentRotY = 0;
    let time = 0;

    const render = () => {
      time += 0.024;
      ctx.clearRect(0, 0, size, size);

      if (!shouldReduceMotion) {
        rotY += 0.008;
      }
      currentRotX += (mouseRef.current.targetRotX + baseTiltX - currentRotX) * 0.08;
      currentRotY += (mouseRef.current.targetRotY + rotY - currentRotY) * 0.08;

      const centerX = size / 2;
      const centerY = size / 2;
      const cosY = Math.cos(currentRotY);
      const sinY = Math.sin(currentRotY);
      const cosX = Math.cos(currentRotX);
      const sinX = Math.sin(currentRotX);

      const projected = particles.map((p) => {
        // Harmonic radial wave traveling vertically along the sphere
        const wave = Math.sin(time * 2.2 - p.phi * 3.5) * (1.8 + mouseRef.current.hover * 2.5);
        const currentR = R + wave;

        const y0 = -currentR * Math.cos(p.phi);
        const ringR = currentR * Math.sin(p.phi);
        const x0 = ringR * Math.sin(p.theta);
        const z0 = ringR * Math.cos(p.theta);

        const x1 = x0 * cosY - z0 * sinY;
        const z1 = x0 * sinY + z0 * cosY;

        const y2 = y0 * cosX - z1 * sinX;
        const z2 = y0 * sinX + z1 * cosX;

        return {
          x2D: centerX + x1,
          y2D: centerY + y2,
          z3D: z2,
          size: p.size,
        };
      });

      projected.sort((a, b) => a.z3D - b.z3D);

      for (const p of projected) {
        const depthNorm = (p.z3D + R) / (R * 2);
        const clampedDepth = Math.max(0, Math.min(1, depthNorm));

        ctx.save();
        ctx.beginPath();
        const r = p.size * (0.65 + 0.65 * clampedDepth);
        ctx.arc(p.x2D, p.y2D, r, 0, Math.PI * 2);

        if (clampedDepth > 0.65) {
          ctx.fillStyle = "#70bb44";
          ctx.shadowColor = "#70bb44";
          ctx.shadowBlur = 5 * clampedDepth;
          ctx.globalAlpha = 0.35 + 0.65 * Math.pow(clampedDepth, 1.4);
        } else {
          ctx.fillStyle = "#8ea87d";
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.12 + 0.35 * Math.pow(clampedDepth, 1.2);
        }

        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseRef.current.targetRotY = x * 0.75;
    mouseRef.current.targetRotX = -y * 0.6;
    mouseRef.current.hover = 1;
  };

  const handleMouseLeave = () => {
    mouseRef.current.targetRotY = 0;
    mouseRef.current.targetRotX = 0;
    mouseRef.current.hover = 0;
  };

  const handleClick = () => {
    play("pulse", { volume: 0.35 });
  };

  return (
    <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10 mt-20 sm:mt-28 md:mt-40">
      <div className="flex flex-col gap-4 max-w-[640px]">
        <div className="text-[#7f7f80] font-sans font-light text-[13px] sm:text-[15px] uppercase tracking-[-0.5px]">
          Variant 4: Cosmos Harmonic Wave • Vertical Harmonic Pulse
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

      <div
        onClick={handleClick}
        className="group relative flex flex-col items-center gap-3 shrink-0 self-center md:self-auto py-3 px-6 select-none cursor-pointer"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "radial-gradient(circle, rgba(200, 213, 187, 0.65) 0%, rgba(200, 213, 187, 0) 70%)",
          }}
        />
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ width: "140px", height: "140px" }}
          className="hover:scale-105 transition-transform duration-300"
        />
        <div className="flex flex-col items-center gap-0.5 pt-1 text-center">
          <div className="flex items-center gap-2 font-mono text-[13px] font-medium text-zinc-800 tracking-tight">
            <span>01:23:45 AM</span>
            <span className="text-zinc-300">•</span>
            <span className="font-sans font-normal text-[#7f7f80]">HARMONIC WAVE</span>
          </div>
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#7f7f80]/80">
            Harmonic Ring Undulation
          </span>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------
// PROTOTYPE HARNESS & VERBATIM PICKER SPECIFICATION
// ----------------------------------------------------------------------------
const variants = [
  { id: "cosmos-latitudes", name: "Cosmos Latitudes", component: VariantCosmosLatitudes },
  { id: "cosmos-terra", name: "Cosmos Terra", component: VariantCosmosTerra },
  { id: "cosmos-dual", name: "Dual Matrix", component: VariantCosmosDualMatrix },
  { id: "cosmos-wave", name: "Harmonic Wave", component: VariantCosmosHarmonicWave },
];

export default function ParticleGlobePrototypePage() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [remountKey, setRemountKey] = useState(0);
  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveHighlight = useCallback((idx: number) => {
    const el = buttonRefs.current[idx];
    const highlight = highlightRef.current;
    if (el && highlight) {
      highlight.style.width = `${el.offsetWidth}px`;
      highlight.style.transform = `translateX(${el.offsetLeft}px)`;
    }
  }, []);

  const selectVariant = useCallback(
    (idx: number) => {
      setActiveIdx(idx);
      setRemountKey((k) => k + 1);
      const url = new URL(window.location.href);
      url.searchParams.set("v", String(idx + 1));
      window.history.replaceState(null, "", url.toString());
      moveHighlight(idx);
    },
    [moveHighlight]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = parseInt(params.get("v") || "1", 10);
    const initialIdx = v >= 1 && v <= variants.length ? v - 1 : 0;
    setActiveIdx(initialIdx);

    // Enable slide only after first paint
    requestAnimationFrame(() => {
      moveHighlight(initialIdx);
      requestAnimationFrame(() => {
        setReady(true);
      });
    });
  }, [moveHighlight]);

  useEffect(() => {
    const handleResize = () => moveHighlight(activeIdx);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIdx, moveHighlight]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= variants.length) {
        selectVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        selectVariant((activeIdx + 1) % variants.length);
      } else if (e.key === "ArrowLeft") {
        selectVariant((activeIdx - 1 + variants.length) % variants.length);
      } else if (e.key === "r" || e.key === "R") {
        setRemountKey((k) => k + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIdx, selectVariant]);

  const ActiveComponent = variants[activeIdx].component;

  return (
    <main className="min-h-screen px-6 md:px-12 max-w-[1200px] mx-auto pb-36">
      {/* Top Breadcrumb Bar */}
      <header className="pt-8 pb-4 flex items-center justify-between border-b border-black/5 text-xs font-mono text-zinc-500">
        <Link
          href="/prototypes"
          className="flex items-center gap-1.5 hover:text-zinc-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>PROTOTYPES DIRECTORY</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#70bb44] animate-pulse" />
          <span className="text-zinc-800 font-medium">COSMOS PARTICLE GLOBE</span>
        </div>
      </header>

      {/* Realistic Portfolio Surface */}
      <div key={`${activeIdx}-${remountKey}`} className="flex w-full flex-col gap-12">
        <ActiveComponent />
        <Divider />
        <ProjectGrid projects={sampleProjects} />
        <Divider />
        <Footer />
      </div>

      {/* Verbatim Prototype Picker Harness from PICKER.md */}
      <nav
        ref={pickerRef}
        className="proto-picker"
        data-ready={ready ? "" : undefined}
        aria-label="Prototype variants"
      >
        <span ref={highlightRef} className="proto-picker-highlight" aria-hidden="true" />
        {variants.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={activeIdx === i ? "" : undefined}
            aria-current={activeIdx === i ? "true" : undefined}
            onClick={() => selectVariant(i)}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          type="button"
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={() => setRemountKey((k) => k + 1)}
        >
          ↻
        </button>
      </nav>

      {/* Verbatim Picker Styles from PICKER.md */}
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
          font-weight: 500;
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
    </main>
  );
}
