"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import {
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Sun,
  Cloud,
  Layers,
  Move3D,
  Zap,
  Eye,
  Sliders,
  Image as ImageIcon,
} from "lucide-react";

// ==========================================
// VARIANTS DEFINITION (USING USER'S UPLOADED SVG ASSETS)
// ==========================================

const VARIANTS = [
  {
    id: "asset-orbital-ring",
    name: "Uploaded Asset Orbit Ring",
    axis: "3D Orbital Belt using Uploaded Cloud SVGs",
    desc: "Uses all 5 of your uploaded cloud SVGs (image 13–17) as 3D billboard sprites floating in an orbital ring around the 3D voxel globe.",
  },
  {
    id: "asset-3tier-parallax",
    name: "3-Tier Asset Parallax",
    axis: "Multi-Plane Depth using Uploaded SVGs",
    desc: "Organizes your uploaded cloud SVGs into 3 depth layers — foreground clouds pass in front of the voxel sphere, midground encircle it, and background clouds drift behind.",
  },
  {
    id: "asset-solar-twilight",
    name: "Asset Solar Twilight",
    axis: "Solar Lighting Sweep with Uploaded SVGs",
    desc: "Your uploaded SVG clouds set against a atmospheric solar horizon where sun orientation shifts cloud lighting and global shadows.",
  },
  {
    id: "asset-floating-islands",
    name: "Asset Floating Islands",
    axis: "Organic Sine Wave Bobbing Physics",
    desc: "Your uploaded cloud SVGs float like atmospheric islands around the voxel globe, gently bobbing up and down with organic floating physics.",
  },
];

// Uploaded SVG Cloud Asset Specs with Exact Native Dimensions
const CLOUD_ASSETS = [
  { path: "/assets/clouds/1.svg", width: 320, height: 198, aspect: 320 / 198, scaleMult: 1.0 },
  { path: "/assets/clouds/2.svg", width: 389, height: 201, aspect: 389 / 201, scaleMult: 1.0 },
  { path: "/assets/clouds/3.svg", width: 247, height: 204, aspect: 247 / 204, scaleMult: 1.0 },
  { path: "/assets/clouds/4.svg", width: 389, height: 186, aspect: 389 / 186, scaleMult: 1.0 },
  { path: "/assets/clouds/5.svg", width: 211, height: 166, aspect: 211 / 166, scaleMult: 0.6 }, // Cloud 5 (5.svg) scale reduced
];

// ==========================================
// GEOGRAPHY VOXEL SPHERE GENERATOR
// ==========================================

interface VoxelItem {
  gridX: number;
  gridY: number;
  gridZ: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  normalX: number;
  normalY: number;
  normalZ: number;
  lat: number;
  lon: number;
  isLand: boolean;
  region: string;
}

function getLandmassInfo(lat: number, lon: number): { isLand: boolean; region: string } {
  let l = lon;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;

  if (lat >= 15 && lat <= 72 && l >= -168 && l <= -52) return { isLand: true, region: "North America" };
  if (lat >= -56 && lat <= 14 && l >= -82 && l <= -34) return { isLand: true, region: "South America" };
  if (lat >= 35 && lat <= 71 && l >= -10 && l <= 42) return { isLand: true, region: "Europe" };
  if (lat >= -35 && lat <= 37 && l >= -18 && l <= 51) return { isLand: true, region: "Africa" };
  if (lat >= 10 && lat <= 75 && l >= 42 && l <= 180) return { isLand: true, region: "Asia" };
  if (lat >= -45 && lat <= -10 && l >= 110 && l <= 154) return { isLand: true, region: "Australia" };

  return { isLand: false, region: "Ocean Surface" };
}

function generateVoxelGrid(radiusVoxels: number = 10, cubeStep: number = 0.82): VoxelItem[] {
  const items: VoxelItem[] = [];
  const R = radiusVoxels;

  for (let gx = -R; gx <= R; gx++) {
    for (let gy = -R; gy <= R; gy++) {
      for (let gz = -R; gz <= R; gz++) {
        const dist = Math.sqrt(gx * gx + gy * gy + gz * gz);
        if (dist >= R - 1.15 && dist <= R + 0.35) {
          const hasOuterNeighbor =
            Math.sqrt((gx + 1) ** 2 + gy ** 2 + gz ** 2) > R + 0.35 ||
            Math.sqrt((gx - 1) ** 2 + gy ** 2 + gz ** 2) > R + 0.35 ||
            Math.sqrt(gx ** 2 + (gy + 1) ** 2 + gz ** 2) > R + 0.35 ||
            Math.sqrt(gx ** 2 + (gy - 1) ** 2 + gz ** 2) > R + 0.35 ||
            Math.sqrt(gx ** 2 + gy ** 2 + (gz + 1) ** 2) > R + 0.35 ||
            Math.sqrt(gx ** 2 + gy ** 2 + (gz - 1) ** 2) > R + 0.35;

          if (hasOuterNeighbor) {
            const bx = gx * cubeStep;
            const by = gy * cubeStep;
            const bz = gz * cubeStep;
            const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;

            const lat = Math.asin(by / len) * (180 / Math.PI);
            const lon = Math.atan2(bx / len, bz / len) * (180 / Math.PI);
            const land = getLandmassInfo(lat, lon);

            items.push({
              gridX: gx,
              gridY: gy,
              gridZ: gz,
              baseX: bx,
              baseY: by,
              baseZ: bz,
              normalX: bx / len,
              normalY: by / len,
              normalZ: bz / len,
              lat,
              lon,
              isLand: land.isLand,
              region: land.region,
            });
          }
        }
      }
    }
  }

  return items;
}

// ==========================================
// THREE.JS VOXEL & UPLOADED CLOUD CANVAS
// ==========================================

interface VoxelCanvasProps {
  variantIndex: number;
  solarAngle: number;
  parallaxIntensity: number;
  autoRotate: boolean;
}

function UploadedCloudVoxelCanvas({
  variantIndex,
  solarAngle,
  parallaxIntensity,
  autoRotate,
}: VoxelCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const aspect = width / height;
    const frustumSize = 56;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    camera.position.set(22, 18, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ----------------------------------------
    // SCENE GROUPS FOR NON-CLIPPING PARALLAX
    // ----------------------------------------
    const bgSkyGroup = new THREE.Group();
    const globeGroup = new THREE.Group();
    const fgCloudGroup = new THREE.Group();

    // Render Order: Background (1) -> Globe (5) -> Foreground (10)
    bgSkyGroup.renderOrder = 1;
    globeGroup.renderOrder = 5;
    fgCloudGroup.renderOrder = 10;

    scene.add(bgSkyGroup);
    scene.add(globeGroup);
    scene.add(fgCloudGroup);

    // Base Voxel Globe Materials
    const topDarkMat = new THREE.MeshBasicMaterial({ color: 0x141416 });
    const sideCreamRight = new THREE.MeshBasicMaterial({ color: 0xf5f4ee });
    const sideCreamLeft = new THREE.MeshBasicMaterial({ color: 0xe6e5df });

    const nightSideMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const nightTopMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });

    const cubeGeo = new THREE.BoxGeometry(0.76, 0.76, 0.76);
    const edgesGeo = new THREE.EdgesGeometry(cubeGeo);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x1a1a1e, linewidth: 1 });

    const voxelsData = generateVoxelGrid(10, 0.82);

    interface VoxelNode {
      mesh: THREE.Mesh;
      data: VoxelItem;
      originalMat: THREE.Material[];
    }

    const voxelNodes: VoxelNode[] = [];

    voxelsData.forEach((item) => {
      const matList = [sideCreamRight, sideCreamLeft, topDarkMat, topDarkMat, sideCreamRight, sideCreamLeft];
      const mesh = new THREE.Mesh(cubeGeo, matList);
      mesh.position.set(item.baseX, item.baseY, item.baseZ);

      const line = new THREE.LineSegments(edgesGeo, lineMat);
      mesh.add(line);

      globeGroup.add(mesh);
      voxelNodes.push({ mesh, data: item, originalMat: matList });
    });

    // ----------------------------------------
    // LOAD USER'S UPLOADED SVG CLOUD TEXTURES
    // ----------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const cloudTextures = CLOUD_ASSETS.map((asset) => {
      const tex = textureLoader.load(encodeURI(asset.path), (t) => {
        t.needsUpdate = true;
      });
      return tex;
    });

    // Create cloud materials with transparent blending
    const cloudMaterials = cloudTextures.map(
      (tex) =>
        new THREE.SpriteMaterial({
          map: tex,
          transparent: true,
          opacity: 0.96,
          depthWrite: false,
          depthTest: true,
        })
    );

    // 1. EVENLY SPACED BACKGROUND CLOUDS (Z = -15.5)
    // Spaced at 60-degree increments around the radial perimeter
    const bgSprites: THREE.Sprite[] = [];
    const bgPositions = [
      { x: 12.5, y: 0.0, z: -15.5, assetIdx: 0, scale: 5.5 },
      { x: 6.25, y: 10.8, z: -15.0, assetIdx: 2, scale: 5.5 },
      { x: -6.25, y: 10.8, z: -16.0, assetIdx: 4, scale: 5.0 },
      { x: -12.5, y: 0.0, z: -15.5, assetIdx: 1, scale: 5.5 },
      { x: -6.25, y: -10.8, z: -15.0, assetIdx: 3, scale: 5.5 },
      { x: 6.25, y: -10.8, z: -16.0, assetIdx: 0, scale: 5.2 },
    ];

    bgPositions.forEach((pos) => {
      const asset = CLOUD_ASSETS[pos.assetIdx];
      const mat = cloudMaterials[pos.assetIdx];
      const sprite = new THREE.Sprite(mat.clone());

      sprite.position.set(pos.x, pos.y, pos.z);
      const heightScale = pos.scale * asset.scaleMult;
      sprite.scale.set(heightScale * asset.aspect, heightScale, 1);

      bgSkyGroup.add(sprite);
      bgSprites.push(sprite);
    });

    // 2. EVENLY SPACED FOREGROUND CLOUDS (Z = +14.2)
    // Interleaved 30 degrees offset from background clouds
    const fgSprites: THREE.Sprite[] = [];
    const fgPositions = [
      { x: 10.8, y: 6.25, z: 14.5, assetIdx: 1, scale: 5.2 },
      { x: 0.0, y: 12.5, z: 14.0, assetIdx: 3, scale: 5.5 },
      { x: -10.8, y: 6.25, z: 14.5, assetIdx: 0, scale: 5.2 },
      { x: -10.8, y: -6.25, z: 14.0, assetIdx: 2, scale: 5.5 },
      { x: 0.0, y: -12.5, z: 14.5, assetIdx: 4, scale: 5.0 },
      { x: 10.8, y: -6.25, z: 14.0, assetIdx: 1, scale: 5.2 },
    ];

    fgPositions.forEach((pos) => {
      const asset = CLOUD_ASSETS[pos.assetIdx];
      const mat = cloudMaterials[pos.assetIdx];
      const sprite = new THREE.Sprite(mat.clone());

      sprite.position.set(pos.x, pos.y, pos.z);
      const heightScale = pos.scale * asset.scaleMult;
      sprite.scale.set(heightScale * asset.aspect, heightScale, 1);

      fgCloudGroup.add(sprite);
      fgSprites.push(sprite);
    });

    // ----------------------------------------
    // MOUSE PARALLAX & DRAG ROTATION
    // ----------------------------------------
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0.003 };
    let mousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      velocity.y = deltaX * 0.005;
      velocity.x = deltaY * 0.005;

      globeGroup.rotation.y += velocity.y;
      globeGroup.rotation.x += velocity.x;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ----------------------------------------
    // ZERO-ALLOCATION RENDER RECYCLING & ACCESSIBILITY
    // ----------------------------------------
    const tempNormal = new THREE.Vector3();
    const NIGHT_MAT_LIST = [nightSideMat, nightSideMat, nightTopMat, nightTopMat, nightSideMat, nightSideMat];

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = motionQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReduced = e.matches;
    };
    motionQuery.addEventListener("change", handleMotionChange);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // ACCESSIBILITY: IF REDUCED MOTION IS PREFERRED, FREEZE UNNECESSARY SPIN & PARALLAX
      if (prefersReduced) {
        if (!isDragging) {
          velocity.x = 0;
          velocity.y = 0;
        }
        fgCloudGroup.position.set(0, 0, 0);
        bgSkyGroup.position.set(0, 0, 0);
        camera.position.set(22, 18, 22);
        camera.lookAt(0, 0, 0);
      } else {
        // Inertia & Auto Rotation for Globe
        if (!isDragging) {
          velocity.x *= 0.94;
          velocity.y *= 0.94;
          if (autoRotate && Math.abs(velocity.y) < 0.0015) {
            velocity.y = 0.0025;
          }
          globeGroup.rotation.y += velocity.y;
          globeGroup.rotation.x += velocity.x;
        }

        // SUBTLE REDUCED PARALLAX DRIFT
        const pFactor = parallaxIntensity;

        // Foreground clouds slide smoothly in FRONT of globe
        fgCloudGroup.position.x = Math.sin(elapsedTime * 0.3) * 0.6 * pFactor;
        fgCloudGroup.position.y = Math.cos(elapsedTime * 0.25) * 0.3 * pFactor;

        // Background clouds slide slowly BEHIND globe
        bgSkyGroup.position.x = -Math.sin(elapsedTime * 0.2) * 0.4 * pFactor;
        bgSkyGroup.position.y = -Math.cos(elapsedTime * 0.15) * 0.2 * pFactor;

        // ORGANIC INDIVIDUAL CLOUD BREATHING (PLAN 015)
        fgSprites.forEach((sprite, idx) => {
          const base = fgPositions[idx];
          const bob = variantIndex === 3 ? Math.sin(elapsedTime * 1.5 + idx) * 0.15 : 0;
          sprite.position.y = base.y + Math.sin(elapsedTime * 0.6 + idx * 1.2) * 0.25 + bob;
        });

        bgSprites.forEach((sprite, idx) => {
          const base = bgPositions[idx];
          sprite.position.y = base.y - Math.sin(elapsedTime * 0.5 + idx * 1.1) * 0.2;
        });

        // SUBTLE MOUSE PERSPECTIVE PARALLAX
        const targetCamX = 22 + mousePos.x * 0.8 * pFactor;
        const targetCamY = 18 + mousePos.y * 0.8 * pFactor;
        camera.position.x += (targetCamX - camera.position.x) * 0.05;
        camera.position.y += (targetCamY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // SOLAR TERMINATOR LIGHTING (PLAN 013: ZERO PER-FRAME ALLOCATIONS)
      const rad = (solarAngle * Math.PI) / 180;
      const sunDir = new THREE.Vector3(Math.cos(rad), 0.3, Math.sin(rad)).normalize();

      voxelNodes.forEach((node) => {
        tempNormal.set(node.data.normalX, node.data.normalY, node.data.normalZ)
          .applyEuler(globeGroup.rotation)
          .normalize();

        const dot = tempNormal.dot(sunDir);
        node.mesh.material = dot > 0.0 ? node.originalMat : NIGHT_MAT_LIST;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const newAspect = w / h;
      camera.left = (-frustumSize * newAspect) / 2;
      camera.right = (frustumSize * newAspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [variantIndex, solarAngle, parallaxIntensity, autoRotate]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing select-none" />;
}

// ==========================================
// MAIN HARNESS PAGE
// ==========================================

export default function VoxelGlobePrototypePage() {
  const [activeVariant, setActiveVariant] = useState<number>(0);
  const [ready, setReady] = useState(false);

  const [solarAngle, setSolarAngle] = useState(45);
  const [parallaxIntensity, setParallaxIntensity] = useState(1.2);
  const [autoRotate, setAutoRotate] = useState(true);

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [highlightStyle, setHighlightStyle] = useState({ width: 0, left: 0 });

  const updateHighlight = useCallback((index: number) => {
    const el = itemRefs.current[index];
    if (el) {
      setHighlightStyle({
        width: el.offsetWidth,
        left: el.offsetLeft,
      });
    }
  }, []);

  const selectVariant = useCallback(
    (index: number) => {
      if (index < 0 || index >= VARIANTS.length) return;
      setActiveVariant(index);
      updateHighlight(index);
      const url = new URL(window.location.href);
      url.searchParams.set("v", (index + 1).toString());
      window.history.replaceState(null, "", url.toString());
    },
    [updateHighlight]
  );

  const replayCurrent = useCallback(() => {
    const current = activeVariant;
    setActiveVariant(-1);
    requestAnimationFrame(() => setActiveVariant(current));
  }, [activeVariant]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vParam = parseInt(params.get("v") || "1", 10);
    const initialIndex = Math.max(0, Math.min(VARIANTS.length - 1, vParam - 1));

    setActiveVariant(initialIndex);

    requestAnimationFrame(() => {
      updateHighlight(initialIndex);
      requestAnimationFrame(() => setReady(true));
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        selectVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        selectVariant((activeVariant + 1) % VARIANTS.length);
      } else if (e.key === "ArrowLeft") {
        selectVariant((activeVariant - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key === "r" || e.key === "R") {
        replayCurrent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectVariant, updateHighlight, activeVariant, replayCurrent]);

  return (
    <div className="relative min-h-screen bg-[#f7f6f2] text-zinc-900 font-sans overflow-hidden antialiased selection:bg-zinc-900 selection:text-white">
      {/* BACKGROUND ARCHITECTURAL GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e4de_1px,transparent_1px),linear-gradient(to_bottom,#e5e4de_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-20 max-w-7xl mx-auto px-6 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/prototypes"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono tracking-tight text-zinc-600 bg-white/80 hover:bg-white border border-zinc-200/80 rounded-full shadow-xs transition-colors backdrop-blur-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            PROTOTYPES
          </Link>
          <div className="h-4 w-px bg-zinc-300" />
          <span className="text-xs font-mono tracking-wider uppercase text-zinc-500">
            UPLOADED SVG CLOUD ASSET PARALLAX
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-full shadow-2xs">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-700" />
            5 UPLOADED CLOUD SVGs LOADED
          </span>
        </div>
      </header>

      {/* MAIN HERO STAGE */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-4 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-140px)]">
        {/* LEFT COLUMN: HERO CONTENT & CONTROLS */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 pt-4 lg:pt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-zinc-700 bg-white/90 border border-zinc-200 rounded-lg shadow-xs w-fit">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>VARIANT {activeVariant + 1}: {VARIANTS[activeVariant]?.name}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-[1.08]">
            Uploaded SVG <br />
            <span className="text-zinc-500 font-normal italic">Cloud Asset Parallax</span> <br />
            Voxel Globe
          </h1>

          <p className="text-base text-zinc-600 leading-relaxed max-w-md">
            {VARIANTS[activeVariant]?.desc}
          </p>

          {/* CONTROLS */}
          <div className="p-4 bg-white/90 border border-zinc-200/90 rounded-2xl shadow-xs space-y-4 backdrop-blur-xs">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-600">
              <span className="flex items-center gap-1.5 font-medium text-zinc-900">
                <Eye className="w-4 h-4 text-indigo-700" />
                ASSET PARALLAX CONTROLS
              </span>
              <span>PUBLIC/ASSETS/CLOUDS/</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>Parallax Depth Shift</span>
                  <span>{parallaxIntensity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={parallaxIntensity}
                  onChange={(e) => setParallaxIntensity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                  <span>Solar Light Orientation</span>
                  <span>{solarAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={solarAngle}
                  onChange={(e) => setSolarAngle(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${autoRotate
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50"
                  }`}
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {autoRotate ? "Pause Globe Spin" : "Auto-Spin Globe"}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
              Explore Portfolio Works
            </button>
            <button className="px-6 py-3 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200/90 text-sm font-medium rounded-xl shadow-2xs transition-all">
              View Design Case Studies
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D ASSET CANVAS STAGE */}
        <div className="lg:col-span-7 relative h-[480px] sm:h-[540px] lg:h-[600px] w-full flex items-center justify-center">
          <div className="absolute w-88 h-88 rounded-full bg-indigo-200/40 blur-3xl -z-10 pointer-events-none" />

          {activeVariant >= 0 && (
            <UploadedCloudVoxelCanvas
              variantIndex={activeVariant}
              solarAngle={solarAngle}
              parallaxIntensity={parallaxIntensity}
              autoRotate={autoRotate}
            />
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/80 border border-zinc-200 rounded-full shadow-2xs text-[11px] font-mono text-zinc-500 backdrop-blur-xs flex items-center gap-2 pointer-events-none">
            <Move3D className="w-3.5 h-3.5 text-zinc-700 animate-bounce" />
            <span>DRAG GLOBE / MOVE MOUSE TO EXPERIENCE ASSET PARALLAX</span>
          </div>
        </div>
      </main>

      {/* ========================================== */}
      {/* VERBATIM HARNESS VISUAL PICKER SPEC */}
      {/* ========================================== */}
      <nav
        className="proto-picker"
        aria-label="Prototype variants"
        data-ready={ready ? "" : undefined}
      >
        <span
          className="proto-picker-highlight"
          aria-hidden="true"
          style={{
            width: `${highlightStyle.width}px`,
            transform: `translateX(${highlightStyle.left}px)`,
          }}
        />
        {VARIANTS.map((v, i) => (
          <button
            key={v.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="proto-picker-item"
            data-active={activeVariant === i ? "" : undefined}
            aria-current={activeVariant === i ? "true" : undefined}
            onClick={() => selectVariant(i)}
          >
            {v.name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          onClick={replayCurrent}
        >
          ↻
        </button>
      </nav>

      {/* STYLES SPEC FOR PICKER (VERBATIM FROM PICKER.md) */}
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

        .proto-picker[data-position="top"] {
          bottom: auto;
          top: 24px;
        }
      `}</style>
    </div>
  );
}
