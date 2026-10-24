"use client";

import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import gsap from "gsap";
import { fibonacciSphere } from "@/lib/spatialLayout";
import { sharesTag } from "@/lib/spatialDepth";

// ============================================================================
// TYPES & DATA CONTRACTS
// ============================================================================

export interface SpatialProject {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  tags?: string[];
  link?: string;
  accentColor?: string;
  size?: "sm" | "md" | "lg";
}

export type SpatialOrbitLayout = "cylinder" | "sphere" | "helix";
export type SpatialSubMode = "orbit" | "float" | "immersed";
export type PortfolioViewMode = "spatial" | "index";

export type SpatialMode = SpatialSubMode;
export type SpatialTuning = {
  radius: number;
  damping: number;
  transitionDuration: number;
  autoSpeed: number;
};

export interface SpatialCanvasProps {
  projects?: SpatialProject[];
  /** Legacy support for items passed as SpatialItem */
  items?: any[];
  layout?: SpatialOrbitLayout;
  mode?: SpatialSubMode;
  initialMode?: SpatialMode;
  viewMode?: PortfolioViewMode;
  theme?: "light" | "dark";
  radius?: number;
  selectedId?: string | null;
  onProjectSelect?: (projectId: string | null) => void;
  onSelect?: (item: any) => void;
  onHoverChange?: (project: SpatialProject | null) => void;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showConstellations?: boolean;
  showPointField?: boolean;
  frameloop?: "always" | "demand";
  tuning?: React.RefObject<SpatialTuning> | any;
  showModeToggle?: boolean;
  damping?: number;
  transitionDuration?: number;
  autoSpeed?: number;
  className?: string;
}

function projectSharesTag(a: SpatialProject, b: SpatialProject): boolean {
  if (!a.tags || !b.tags) return false;
  return a.tags.some((tag) => b.tags!.includes(tag));
}

// ============================================================================
// 16 CURATED PROJECTS FOR CELESTIAL SPHERE (Matching Airla density)
// ============================================================================

export const DEFAULT_SPATIAL_PROJECTS: SpatialProject[] = [
  {
    id: "polaroid-studio",
    title: "Polaroid Camera Shader",
    category: "WebGL Shader",
    year: "2025",
    image: "/assets/projects/polaroid_studio.png",
    description:
      "Real-time analog film emulsion curve simulation & chemical development process in WebGL with procedural dye diffusion.",
    tags: ["WebGL", "Shader", "Film"],
    link: "https://muditjha.com",
    accentColor: "#f59e0b",
    size: "lg",
  },
  {
    id: "spatial-vision",
    title: "Spatial Vision UI",
    category: "VisionOS Interface",
    year: "2025",
    image: "/assets/projects/apple_vision.png",
    description:
      "Dynamic glass refraction shaders, gaze tracking spatial cues, and tactile eye-tracking feedback primitives in 3D.",
    tags: ["Spatial UI", "VisionOS", "3D"],
    link: "https://muditjha.com",
    accentColor: "#38bdf8",
    size: "lg",
  },
  {
    id: "canvas-os",
    title: "Canvas OS & Nodes",
    category: "Spatial System",
    year: "2025",
    image: "/assets/projects/canvas_os.png",
    description:
      "Infinite 2.5D spatial workspace featuring spring-hinge node clustering, gesture momentum, and multi-plane depth.",
    tags: ["Spatial UI", "Interface", "Canvas"],
    link: "https://muditjha.com",
    accentColor: "#4ade80",
    size: "md",
  },
  {
    id: "screentime-receipt",
    title: "Screentime Thermal Print",
    category: "Data Viz",
    year: "2024",
    image: "/assets/projects/screentime_receipt.png",
    description:
      "Visualizing personal digital consumption as high-contrast thermal itemized receipts with physical paper curl.",
    tags: ["Data Viz", "Design Tool", "Print"],
    link: "https://muditjha.com",
    accentColor: "#fb7185",
    size: "md",
  },
  {
    id: "kinetic-reel",
    title: "Kinetic Identity Reel",
    category: "Motion Branding",
    year: "2025",
    image: "/spatial-thumbnails/intro.webp",
    description:
      "Physics-driven kinetic typography and optical momentum studies designed for high-refresh display interfaces.",
    tags: ["Motion", "Branding", "Video"],
    link: "https://muditjha.com",
    accentColor: "#a855f7",
    size: "lg",
  },
  {
    id: "tactile-portraits",
    title: "Analog Portrait Studio",
    category: "Editorial Imaging",
    year: "2024",
    image: "/assets/portrait-original.png",
    description:
      "High-fidelity paper stock rendering, halftoning shaders, and tactile grain diffusion on heavyweight card substrate.",
    tags: ["Editorial", "Print", "Halftone"],
    link: "https://muditjha.com",
    accentColor: "#eab308",
    size: "sm",
  },
  {
    id: "interactive-eye",
    title: "Optical Eye Tracker",
    category: "Computer Vision",
    year: "2024",
    image: "/assets/eye-reference.png",
    description:
      "Real-time iris parallax raymarching and specular reflection map synced to cursor and head movement vectors.",
    tags: ["Computer Vision", "Optics", "Shader"],
    link: "https://muditjha.com",
    accentColor: "#06b6d4",
    size: "sm",
  },
  {
    id: "umn-system",
    title: "Campus Spatial Wayfinding",
    category: "Spatial Architecture",
    year: "2024",
    image: "/assets/umn.jpg",
    description:
      "Topological campus mapping system utilizing volumetric 3D pathfinding and tactile building extrusion models.",
    tags: ["Spatial UI", "3D", "Architecture"],
    link: "https://muditjha.com",
    accentColor: "#ec4899",
    size: "md",
  },
  {
    id: "duotone-covers",
    title: "Duotone Cover Lab",
    category: "Color Science",
    year: "2025",
    image: "/assets/projects/polaroid_studio.png",
    description:
      "Synthesizing analog two-ink offset lithography palettes with real-time ink absorption and tactile paper overlay.",
    tags: ["Design Tool", "Editorial", "Color"],
    link: "https://muditjha.com",
    accentColor: "#f97316",
    size: "sm",
  },
  {
    id: "liquid-glass",
    title: "Liquid Glass Refraction",
    category: "WebGL Material",
    year: "2025",
    image: "/assets/projects/apple_vision.png",
    description:
      "Apple-inspired frosted translucent glass panels with real-time chromatic aberration and dynamic specular glints.",
    tags: ["WebGL", "Shader", "Material"],
    link: "https://muditjha.com",
    accentColor: "#0ea5e9",
    size: "md",
  },
  {
    id: "gooey-puck",
    title: "Dynamic Island Gooey Puck",
    category: "Micro-Interaction",
    year: "2025",
    image: "/assets/projects/canvas_os.png",
    description:
      "Fluid SVG filter neck extraction simulating organic mercury surface tension on gesture pull.",
    tags: ["Interface", "Motion", "SVG"],
    link: "https://muditjha.com",
    accentColor: "#10b981",
    size: "sm",
  },
  {
    id: "tactile-folder",
    title: "Tactile Folder System",
    category: "Physical Interface",
    year: "2024",
    image: "/assets/projects/screentime_receipt.png",
    description:
      "3D physical folder component with spring hinges, multi-sheet paper cascading, and realistic depth shadows.",
    tags: ["Interface", "Spatial UI", "3D"],
    link: "https://muditjha.com",
    accentColor: "#6366f1",
    size: "md",
  },
  {
    id: "voxel-globe-sys",
    title: "Voxel Topo Matrix",
    category: "Geospatial 3D",
    year: "2025",
    image: "/spatial-thumbnails/intro.webp",
    description:
      "Interactive 3D voxel terrain with architectural monochrome pop physics and city targeting HUD markers.",
    tags: ["3D", "WebGL", "Mapping"],
    link: "https://muditjha.com",
    accentColor: "#8b5cf6",
    size: "lg",
  },
  {
    id: "audio-synth",
    title: "Pixel Audio Visualizer",
    category: "Audio Computing",
    year: "2024",
    image: "/assets/projects/polaroid_studio.png",
    description:
      "Subtle sound synthesis and frequency-bin waterfall rendering via Web Audio API FFT analysis.",
    tags: ["Audio", "Interactive", "Sound"],
    link: "https://muditjha.com",
    accentColor: "#d946ef",
    size: "sm",
  },
  {
    id: "grain-emulsion",
    title: "Grain & Dither Emulsion",
    category: "Procedural Shaders",
    year: "2025",
    image: "/assets/portrait-original.png",
    description:
      "Hardware-accelerated blue noise dithering and organic silver halide grain simulation in GLSL.",
    tags: ["Shader", "Film", "Color"],
    link: "https://muditjha.com",
    accentColor: "#14b8a6",
    size: "sm",
  },
  {
    id: "zero-g-orbit",
    title: "Zero-G Momentum Field",
    category: "Creative Physics",
    year: "2025",
    image: "/assets/projects/apple_vision.png",
    description:
      "Simulating N-body harmonic microgravity drift and momentum deceleration for floating media collections.",
    tags: ["Physics", "Motion", "3D"],
    link: "https://muditjha.com",
    accentColor: "#0284c7",
    size: "md",
  },
];

// ============================================================================
// CARD SHADER (16:10 Rounded Box SDF + Specular Frosted Rim + Theme Adaptation)
// ============================================================================

const CardShader = {
  uniforms: {
    uTexture: { value: null },
    uAspect: { value: 16 / 10 },
    uRadius: { value: 0.08 },
    uHover: { value: 0.0 },
    uSelected: { value: 0.0 },
    uDimmed: { value: 0.0 },
    uBorderWidth: { value: 0.014 },
    uBorderColor: { value: new THREE.Color("#ffffff") },
    uIsDark: { value: 0.0 }, // 0.0 = Light (Airla), 1.0 = Dark
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uAspect;
    uniform float uRadius;
    uniform float uHover;
    uniform float uSelected;
    uniform float uDimmed;
    uniform float uBorderWidth;
    uniform vec3 uBorderColor;
    uniform float uIsDark;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    // Signed Distance Function for 2D rounded box
    float roundedBoxSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b + vec2(r);
      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
    }

    void main() {
      vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
      vec2 b = vec2(uAspect * 0.5, 0.5);

      float dist = roundedBoxSDF(p, b, uRadius);
      float edgeWidth = fwidth(dist);

      float alpha = 1.0 - smoothstep(-edgeWidth, edgeWidth, dist);
      if (alpha < 0.002) {
        discard;
      }

      vec4 tex = texture2D(uTexture, vUv);

      // Subtle edge depth
      float vignette = clamp(1.0 - length(vUv - 0.5) * 0.22, 0.82, 1.0);
      vec3 col = tex.rgb * vignette;

      // Specular perimeter rim
      float rimDist = abs(dist + uBorderWidth * 0.5) - uBorderWidth * 0.5;
      float rim = 1.0 - smoothstep(0.0, edgeWidth * 2.2, rimDist);

      // Emission / Highlight
      vec3 emission = (uIsDark > 0.5)
        ? (vec3(0.08) * uHover + vec3(0.2) * uSelected)
        : (vec3(0.05) * uHover + vec3(0.12) * uSelected);
      col += emission;

      // Dimming when another card is active
      col = mix(col, col * 0.35, uDimmed * 0.85);

      // Stroke color adaptation (soft black/slate in light mode, soft white in dark mode)
      vec3 defaultRim = (uIsDark > 0.5) ? vec3(1.0) : vec3(0.12, 0.14, 0.18);
      vec3 rimCol = mix(defaultRim, uBorderColor, uHover * 0.8);
      float rimAlpha = mix((uIsDark > 0.5 ? 0.25 : 0.35), 0.9, uHover * 0.6 + uSelected * 0.8);

      col = mix(col, rimCol, rim * rimAlpha);

      gl_FragColor = vec4(col, alpha * (1.0 - uDimmed * 0.35));
    }
  `,
};

// ============================================================================
// HELPER: PROCEDURAL GRADIENT FALLBACK TEXTURE
// ============================================================================

function createFallbackTexture(title: string, color: string, isDark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320; // 16:10
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 512, 320);
    if (isDark) {
      grad.addColorStop(0, "#181a20");
      grad.addColorStop(1, "#0d0e12");
    } else {
      grad.addColorStop(0, "#f4f4f5");
      grad.addColorStop(1, "#e4e4e7");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    const radial = ctx.createRadialGradient(256, 160, 20, 256, 160, 220);
    radial.addColorStop(0, `${color}33`);
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 512, 320);

    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 320);
      ctx.stroke();
    }
    for (let y = 0; y < 320; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.88)" : "rgba(24, 24, 27, 0.88)";
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, 256, 160);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

// ============================================================================
// PROJECT CARD PLANE COMPONENT (16:10 with Zero-G Float Physics)
// ============================================================================

interface CardPlaneProps {
  project: SpatialProject;
  index: number;
  total: number;
  basePosition: THREE.Vector3;
  baseRotation: THREE.Euler;
  isSelected: boolean;
  isAnySelected: boolean;
  isHovered: boolean;
  isRelated: boolean;
  mode: SpatialSubMode;
  theme: "light" | "dark";
  onCardClick: (project: SpatialProject, worldPos: THREE.Vector3, worldNormal: THREE.Vector3) => void;
  onHoverEnter: (project: SpatialProject) => void;
  onHoverLeave: () => void;
  onPositionUpdate: (index: number, currentPos: THREE.Vector3) => void;
}

const CardPlane: React.FC<CardPlaneProps> = ({
  project,
  index,
  total,
  basePosition,
  baseRotation,
  isSelected,
  isAnySelected,
  isHovered,
  isRelated,
  mode,
  theme,
  onCardClick,
  onHoverEnter,
  onHoverLeave,
  onPositionUpdate,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const currentWorldPos = useMemo(() => new THREE.Vector3(), []);
  const isDark = theme === "dark";

  // Pseudo-random frequencies for realistic asynchronous Zero-G drift
  const driftFreqs = useMemo(() => {
    const seed = index + 1;
    return {
      fx: 0.35 + (seed % 5) * 0.08,
      fy: 0.45 + (seed % 4) * 0.07,
      fz: 0.30 + (seed % 6) * 0.06,
      rotX: 0.25 + (seed % 3) * 0.05,
      rotY: 0.20 + (seed % 4) * 0.04,
      rotZ: 0.30 + (seed % 5) * 0.05,
      phase: seed * 1.618,
    };
  }, [index]);

  // Load texture with fallback
  const texture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const loader = new THREE.TextureLoader();
    const fallback = createFallbackTexture(project.title, project.accentColor || "#38bdf8", isDark);
    try {
      return loader.load(
        project.image,
        (loadedTex) => {
          loadedTex.minFilter = THREE.LinearFilter;
          loadedTex.generateMipmaps = false;
          if (materialRef.current) {
            materialRef.current.uniforms.uTexture.value = loadedTex;
          }
        },
        undefined,
        () => {
          if (materialRef.current) {
            materialRef.current.uniforms.uTexture.value = fallback;
          }
        }
      );
    } catch {
      return fallback;
    }
  }, [project.image, project.title, project.accentColor, isDark]);

  // Shader Material initialization
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uAspect: { value: 16 / 10 },
        uRadius: { value: 0.08 },
        uHover: { value: 0.0 },
        uSelected: { value: 0.0 },
        uDimmed: { value: 0.0 },
        uBorderWidth: { value: 0.014 },
        uBorderColor: {
          value: new THREE.Color(project.accentColor || (isDark ? "#ffffff" : "#3b82f6")),
        },
        uIsDark: { value: isDark ? 1.0 : 0.0 },
      },
      vertexShader: CardShader.vertexShader,
      fragmentShader: CardShader.fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [texture, project.accentColor, isDark]);

  // Smooth hover scale & emission tween using GSAP
  useEffect(() => {
    if (!meshRef.current || !materialRef.current) return;

    const targetScale = isHovered ? 1.08 : isRelated ? 1.03 : 1.0;
    const targetHover = isHovered ? 1.0 : isRelated ? 0.45 : 0.0;

    gsap.to(meshRef.current.scale, {
      x: targetScale,
      y: targetScale,
      z: targetScale,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(materialRef.current.uniforms.uHover, {
      value: targetHover,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [isHovered, isRelated]);

  // Selection & dimming state uniforms
  useEffect(() => {
    if (!materialRef.current) return;
    gsap.to(materialRef.current.uniforms.uSelected, {
      value: isSelected ? 1.0 : 0.0,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(materialRef.current.uniforms.uDimmed, {
      value: isAnySelected && !isSelected ? 1.0 : 0.0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [isSelected, isAnySelected]);

  // Smooth mode transition factor (0.0 = Orbit, 1.0 = Float)
  const floatIntensityRef = useRef(mode === "float" ? 1.0 : 0.0);
  useEffect(() => {
    gsap.to(floatIntensityRef, {
      current: mode === "float" ? 1.0 : 0.0,
      duration: 1.2,
      ease: "power2.inOut",
    });
  }, [mode]);

  // Simulation loop: Orbit vs Zero-Gravity Float
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const time = clock.getElapsedTime();
    const floatDamp = isSelected ? 0.0 : isAnySelected ? 0.2 : 1.0;
    const fFactor = floatIntensityRef.current;

    // 1. Subtle rhythmic orbit wave (Orbit mode)
    const orbitWaveY = Math.sin(time * 0.95 + driftFreqs.phase) * 0.06;
    const orbitWaveX = Math.cos(time * 0.75 + driftFreqs.phase) * 0.025;

    // 2. Multi-axis harmonic zero-gravity drift (Float mode)
    const zeroGx = Math.sin(time * driftFreqs.fx + driftFreqs.phase) * 0.24 + Math.cos(time * 0.2 + driftFreqs.phase) * 0.12;
    const zeroGy = Math.cos(time * driftFreqs.fy + driftFreqs.phase * 1.4) * 0.28 + Math.sin(time * 0.25 + driftFreqs.phase) * 0.14;
    const zeroGz = Math.sin(time * driftFreqs.fz + driftFreqs.phase * 2.1) * 0.22;
    const zeroGRotX = Math.sin(time * driftFreqs.rotX + driftFreqs.phase) * 0.09;
    const zeroGRotY = Math.cos(time * driftFreqs.rotY + driftFreqs.phase) * 0.08;
    const zeroGRotZ = Math.sin(time * driftFreqs.rotZ + driftFreqs.phase) * 0.07;

    // Blend between Orbit breathing and Float zero-gravity physics
    const targetX = basePosition.x + (orbitWaveX * (1 - fFactor) + zeroGx * fFactor) * floatDamp;
    const targetY = basePosition.y + (orbitWaveY * (1 - fFactor) + zeroGy * fFactor) * floatDamp;
    const targetZ = basePosition.z + (zeroGz * fFactor) * floatDamp;

    const targetRotX = baseRotation.x + (zeroGRotX * fFactor) * floatDamp;
    const targetRotY = baseRotation.y + (zeroGRotY * fFactor) * floatDamp;
    const targetRotZ = baseRotation.z + (zeroGRotZ * fFactor) * floatDamp;

    groupRef.current.position.set(targetX, targetY, targetZ);
    groupRef.current.rotation.set(targetRotX, targetRotY, targetRotZ);

    // Track world position for constellation lines
    groupRef.current.getWorldPosition(currentWorldPos);
    onPositionUpdate(index, currentWorldPos);
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!groupRef.current || !meshRef.current) return;

    const worldPos = new THREE.Vector3();
    meshRef.current.getWorldPosition(worldPos);

    const worldNormal = new THREE.Vector3(0, 0, 1);
    const worldQuat = new THREE.Quaternion();
    meshRef.current.getWorldQuaternion(worldQuat);
    worldNormal.applyQuaternion(worldQuat).normalize();

    onCardClick(project, worldPos, worldNormal);
  };

  // Dimensional card scale based on size tier
  const cardScale = project.size === "sm" ? 0.88 : project.size === "lg" ? 1.18 : 1.0;

  return (
    <group
      ref={groupRef}
      position={[basePosition.x, basePosition.y, basePosition.z]}
      rotation={[baseRotation.x, baseRotation.y, baseRotation.z]}
      scale={[cardScale, cardScale, 1]}
    >
      <mesh
        ref={meshRef}
        material={shaderMaterial}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHoverEnter(project);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHoverLeave();
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[2.4, 1.5, 32, 32]} />
      </mesh>
    </group>
  );
};

// ============================================================================
// CONSTELLATION LINES (Connects nodes that share tags on hover)
// ============================================================================

interface ConstellationLinesProps {
  projects: SpatialProject[];
  cardPositions: THREE.Vector3[];
  hoveredProject: SpatialProject | null;
  theme: "light" | "dark";
}

const ConstellationLines: React.FC<ConstellationLinesProps> = ({
  projects,
  cardPositions,
  hoveredProject,
  theme,
}) => {
  const isDark = theme === "dark";
  const lineColor = isDark ? "#64748b" : "#94a3b8";

  const lines = useMemo(() => {
    if (!hoveredProject) return [];
    const hoveredIdx = projects.findIndex((p) => p.id === hoveredProject.id);
    if (hoveredIdx < 0 || !cardPositions[hoveredIdx]) return [];

    const origin = cardPositions[hoveredIdx];
    const pairs: Array<{ id: string; points: [THREE.Vector3, THREE.Vector3] }> = [];

    projects.forEach((proj, i) => {
      if (i !== hoveredIdx && projectSharesTag(proj, hoveredProject) && cardPositions[i]) {
        pairs.push({
          id: `${hoveredProject.id}-${proj.id}`,
          points: [origin, cardPositions[i]],
        });
      }
    });

    return pairs;
  }, [hoveredProject, projects, cardPositions]);

  if (!lines.length) return null;

  return (
    <group>
      {lines.map((l) => (
        <Line
          key={l.id}
          points={l.points}
          color={lineColor}
          lineWidth={0.8}
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      ))}
    </group>
  );
};

// ============================================================================
// CELESTIAL POINT CLOUD STARFIELD (Delicate dot sphere matching Airla)
// ============================================================================

interface CelestialPointFieldProps {
  radius: number;
  theme: "light" | "dark";
}

const CelestialPointField: React.FC<CelestialPointFieldProps> = ({ radius, theme }) => {
  const isDark = theme === "dark";
  const pointPositions = useMemo(() => {
    const pts = fibonacciSphere(1200, radius * 1.15);
    return new Float32Array(pts.flat());
  }, [radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        color={isDark ? "#475569" : "#94a3b8"}
        transparent
        opacity={isDark ? 0.28 : 0.45}
        depthWrite={false}
      />
    </points>
  );
};

// ============================================================================
// SPATIAL SCENE MANAGER
// ============================================================================

interface SceneManagerProps {
  projects: SpatialProject[];
  layout: SpatialOrbitLayout;
  mode: SpatialSubMode;
  theme: "light" | "dark";
  radius: number;
  selectedId: string | null;
  onProjectSelect?: (projectId: string | null) => void;
  onHoverChange?: (project: SpatialProject | null) => void;
  autoRotate: boolean;
  autoRotateSpeed: number;
  showConstellations: boolean;
  showPointField: boolean;
}

const SceneManager: React.FC<SceneManagerProps> = ({
  projects,
  layout,
  mode,
  theme,
  radius,
  selectedId,
  onProjectSelect,
  onHoverChange,
  autoRotate,
  autoRotateSpeed,
  showConstellations,
  showPointField,
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const defaultCameraPos = useMemo(() => new THREE.Vector3(0, 0, 8.2), []);
  const isAnimatingRef = useRef(false);

  const [hoveredProject, setHoveredProject] = useState<SpatialProject | null>(null);
  const cardPositionsRef = useRef<THREE.Vector3[]>(
    projects.map(() => new THREE.Vector3())
  );
  const [positionsTick, setPositionsTick] = useState(0);

  const handlePositionUpdate = useCallback((idx: number, pos: THREE.Vector3) => {
    cardPositionsRef.current[idx] = pos;
  }, []);

  // Update line calculations periodically
  useFrame(() => {
    if (hoveredProject) {
      setPositionsTick((t) => (t + 1) % 60);
    }
  });

  // Fibonacci Sphere distribution (Uniform 3D spherical shell)
  const layoutCalculations = useMemo(() => {
    const total = projects.length;
    if (layout === "sphere") {
      const fibPositions = fibonacciSphere(total, radius);
      return fibPositions.map(([x, y, z]) => {
        const position = new THREE.Vector3(x, y, z);
        const rotation = new THREE.Euler();
        // Look outward from center (0, 0, 0)
        const dummy = new THREE.Object3D();
        dummy.position.set(x, y, z);
        dummy.lookAt(x * 2, y * 2, z * 2);
        rotation.copy(dummy.rotation);
        return { position, rotation };
      });
    } else if (layout === "cylinder") {
      return projects.map((_, i) => {
        const angle = i * ((Math.PI * 2) / total);
        const position = new THREE.Vector3(
          radius * Math.sin(angle),
          (i % 2 === 0 ? 0.15 : -0.15),
          radius * Math.cos(angle)
        );
        const rotation = new THREE.Euler(0, angle + Math.PI, 0);
        return { position, rotation };
      });
    } else {
      // Helix
      const turns = 1.35;
      return projects.map((_, i) => {
        const angle = i * ((Math.PI * 2 * turns) / total);
        const yOffset = ((i - (total - 1) / 2) / total) * 3.2;
        const position = new THREE.Vector3(
          radius * Math.sin(angle),
          yOffset,
          radius * Math.cos(angle)
        );
        const rotation = new THREE.Euler(-0.06, angle + Math.PI, 0);
        return { position, rotation };
      });
    }
  }, [projects, layout, radius]);

  // Handle Card Click -> Camera flies in front of card
  const handleCardClick = useCallback(
    (project: SpatialProject, worldPos: THREE.Vector3, worldNormal: THREE.Vector3) => {
      if (!controlsRef.current || isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      controlsRef.current.enabled = false;

      const targetCamDistance = 2.65;
      const targetCamPos = worldPos.clone().add(worldNormal.clone().multiplyScalar(targetCamDistance));

      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controlsRef.current.target);

      const timeline = gsap.timeline({
        onUpdate: () => {
          controlsRef.current?.update();
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          onProjectSelect?.(project.id);
        },
      });

      timeline.to(
        camera.position,
        {
          x: targetCamPos.x,
          y: targetCamPos.y,
          z: targetCamPos.z,
          duration: 1.25,
          ease: "power3.inOut",
        },
        0
      );

      timeline.to(
        controlsRef.current.target,
        {
          x: worldPos.x,
          y: worldPos.y,
          z: worldPos.z,
          duration: 1.25,
          ease: "power3.inOut",
        },
        0
      );
    },
    [camera, onProjectSelect]
  );

  // Return to overview position
  useEffect(() => {
    if (selectedId === null && !isAnimatingRef.current && controlsRef.current) {
      const distFromDefault = camera.position.distanceTo(defaultCameraPos);
      if (distFromDefault > 0.5) {
        isAnimatingRef.current = true;
        controlsRef.current.enabled = false;

        gsap.killTweensOf(camera.position);
        gsap.killTweensOf(controlsRef.current.target);

        const timeline = gsap.timeline({
          onUpdate: () => {
            controlsRef.current?.update();
          },
          onComplete: () => {
            isAnimatingRef.current = false;
            if (controlsRef.current) {
              controlsRef.current.enabled = true;
            }
          },
        });

        timeline.to(
          camera.position,
          {
            x: defaultCameraPos.x,
            y: defaultCameraPos.y,
            z: defaultCameraPos.z,
            duration: 1.15,
            ease: "power3.inOut",
          },
          0
        );

        timeline.to(
          controlsRef.current.target,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.15,
            ease: "power3.inOut",
          },
          0
        );
      }
    }
  }, [selectedId, camera, defaultCameraPos]);

  return (
    <>
      {/* OrbitControls with Heavy Damping (dampingFactor: 0.04) */}
      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.04}
        minPolarAngle={Math.PI / 2 - 0.35}
        maxPolarAngle={Math.PI / 2 + 0.35}
        minAzimuthAngle={-Infinity}
        maxAzimuthAngle={Infinity}
        enableZoom={selectedId === null}
        minDistance={4.5}
        maxDistance={12.0}
        rotateSpeed={0.65}
        autoRotate={autoRotate && selectedId === null && mode === "orbit"}
        autoRotateSpeed={autoRotateSpeed}
      />

      {/* Subtle Celestial Point Cloud (Airla aesthetic) */}
      {showPointField && <CelestialPointField radius={radius} theme={theme} />}

      {/* Constellation Lines connecting related nodes */}
      {showConstellations && (
        <ConstellationLines
          projects={projects}
          cardPositions={cardPositionsRef.current}
          hoveredProject={hoveredProject}
          theme={theme}
        />
      )}

      {/* 3D Sphere of Project Planes */}
      <group>
        {projects.map((proj, idx) => {
          const calc = layoutCalculations[idx];
          const isHovered = hoveredProject?.id === proj.id;
          const isRelated = !!(hoveredProject && !isHovered && projectSharesTag(proj, hoveredProject));

          return (
            <CardPlane
              key={proj.id}
              project={proj}
              index={idx}
              total={projects.length}
              basePosition={calc.position}
              baseRotation={calc.rotation}
              isSelected={selectedId === proj.id}
              isAnySelected={selectedId !== null}
              isHovered={isHovered}
              isRelated={isRelated}
              mode={mode}
              theme={theme}
              onCardClick={handleCardClick}
              onHoverEnter={(p) => {
                setHoveredProject(p);
                onHoverChange?.(p);
              }}
              onHoverLeave={() => {
                setHoveredProject(null);
                onHoverChange?.(null);
              }}
              onPositionUpdate={handlePositionUpdate}
            />
          );
        })}
      </group>
    </>
  );
};

// ============================================================================
// MAIN COMPONENT: SPATIAL CANVAS
// ============================================================================

export default function SpatialCanvas(props: SpatialCanvasProps) {
  const {
    projects: directProjects,
    items,
    layout: directLayout,
    mode = "orbit",
    initialMode,
    viewMode = "spatial",
    theme = "light",
    radius = 5.0,
    selectedId: controlledSelectedId,
    onProjectSelect: controlledOnProjectSelect,
    onSelect,
    onHoverChange,
    autoRotate = true,
    autoRotateSpeed = 0.45,
    showConstellations = true,
    showPointField = true,
    frameloop: controlledFrameloop,
    className = "",
  } = props;

  const isDark = theme === "dark";

  // Convert legacy items if provided
  const projects = useMemo(() => {
    if (directProjects && directProjects.length > 0) return directProjects;
    if (items && items.length > 0) {
      return items.slice(0, 16).map((it, idx) => ({
        id: it.id || `item-${idx}`,
        title: it.title || "Project Experiment",
        category: it.tag || it.category || "Interactive",
        year: it.year || "2025",
        image: it.image || it.imageSrc || "/assets/projects/polaroid_studio.png",
        description: it.details || it.description || it.caption || "",
        tags: it.tags || (it.tag ? [it.tag] : []),
        link: it.href,
        accentColor:
          it.accentColor ||
          ["#38bdf8", "#f59e0b", "#4ade80", "#fb7185", "#a855f7"][idx % 5],
        size: it.size || "md",
      }));
    }
    return DEFAULT_SPATIAL_PROJECTS;
  }, [directProjects, items]);

  const layout: SpatialOrbitLayout =
    directLayout ||
    (initialMode === "orbit"
      ? "cylinder"
      : initialMode === "float"
      ? "sphere"
      : "sphere"); // Default to sphere matching Airla screenshot

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const selectedId = controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const handleSelect = useCallback(
    (id: string | null) => {
      setInternalSelectedId(id);
      controlledOnProjectSelect?.(id);
      if (id && onSelect) {
        const found = projects.find((p) => p.id === id);
        if (found) onSelect(found);
      }
    },
    [controlledOnProjectSelect, onSelect, projects]
  );

  // Power optimization: frameloop="demand" strictly pauses WebGL rendering in Index mode
  const effectiveFrameloop =
    controlledFrameloop !== undefined
      ? controlledFrameloop
      : viewMode === "index"
      ? "demand"
      : "always";

  return (
    <div
      className={`relative w-full h-full min-h-screen select-none overflow-hidden transition-colors duration-500 ${
        isDark ? "bg-[#090a0d] text-white" : "bg-[#ffffff] text-zinc-900"
      } ${className}`}
    >
      <Canvas
        frameloop={effectiveFrameloop}
        camera={{ position: [0, 0, 8.2], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <color attach="background" args={[isDark ? "#090a0d" : "#ffffff"]} />
        <fog attach="fog" args={[isDark ? "#090a0d" : "#ffffff", 10, 26]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={isDark ? 0.75 : 1.1} />
        <directionalLight
          position={[6, 9, 6]}
          intensity={isDark ? 1.3 : 1.15}
          color="#f8fafc"
        />
        <directionalLight
          position={[-6, -4, -4]}
          intensity={isDark ? 0.45 : 0.35}
          color={isDark ? "#64748b" : "#cbd5e1"}
        />

        <Suspense fallback={null}>
          <SceneManager
            projects={projects}
            layout={layout}
            mode={mode}
            theme={theme}
            radius={radius}
            selectedId={selectedId}
            onProjectSelect={handleSelect}
            onHoverChange={onHoverChange}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            showConstellations={showConstellations}
            showPointField={showPointField}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
