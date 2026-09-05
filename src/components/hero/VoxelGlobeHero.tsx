"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Uploaded SVG Cloud Asset Specs with Exact Native Dimensions
const CLOUD_ASSETS = [
  { path: "/assets/clouds/1.svg", width: 320, height: 198, aspect: 320 / 198, scaleMult: 1.0 },
  { path: "/assets/clouds/2.svg", width: 389, height: 201, aspect: 389 / 201, scaleMult: 1.0 },
  { path: "/assets/clouds/3.svg", width: 247, height: 204, aspect: 247 / 204, scaleMult: 1.0 },
  { path: "/assets/clouds/4.svg", width: 389, height: 186, aspect: 389 / 186, scaleMult: 1.0 },
  { path: "/assets/clouds/5.svg", width: 211, height: 166, aspect: 211 / 166, scaleMult: 0.6 },
];

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
}

function getLandmassInfo(lat: number, lon: number): boolean {
  let l = lon;
  while (l > 180) l -= 360;
  while (l < -180) l += 360;

  if (lat >= 15 && lat <= 72 && l >= -168 && l <= -52) return true;
  if (lat >= -56 && lat <= 14 && l >= -82 && l <= -34) return true;
  if (lat >= 35 && lat <= 71 && l >= -10 && l <= 42) return true;
  if (lat >= -35 && lat <= 37 && l >= -18 && l <= 51) return true;
  if (lat >= 10 && lat <= 75 && l >= 42 && l <= 180) return true;
  if (lat >= -45 && lat <= -10 && l >= 110 && l <= 154) return true;

  return false;
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
              isLand: getLandmassInfo(lat, lon),
            });
          }
        }
      }
    }
  }

  return items;
}

export interface VoxelGlobeHeroProps {
  size?: number;
  className?: string;
  solarAngle?: number;
  parallaxIntensity?: number;
  autoRotate?: boolean;
  onTap?: () => void;
  isZeroG?: boolean;
}

export function VoxelGlobeHero({
  size = 140,
  className = "",
  solarAngle = 45,
  parallaxIntensity = 0.5,
  autoRotate = true,
  onTap,
  isZeroG = false,
}: VoxelGlobeHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onTapRef = useRef(onTap);
  onTapRef.current = onTap;
  const isZeroGRef = useRef(isZeroG);
  isZeroGRef.current = isZeroG;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    const scene = new THREE.Scene();
    const aspect = width / height;
    const frustumSize = 48;
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
    // SCENE GROUPS WITH STRICT DEPTH SORTING (NO CLIPPING)
    // ----------------------------------------
    const bgSkyGroup = new THREE.Group();
    const globeGroup = new THREE.Group();
    const fgCloudGroup = new THREE.Group();

    bgSkyGroup.renderOrder = 1;
    globeGroup.renderOrder = 5;
    fgCloudGroup.renderOrder = 10;

    scene.add(bgSkyGroup);
    scene.add(globeGroup);
    scene.add(fgCloudGroup);

    // Voxel Globe Materials
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
    // LOAD UPLOADED CLOUD SVGs (NATIVE ASPECT RATIO)
    // ----------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const cloudTextures = CLOUD_ASSETS.map((asset) => {
      const tex = textureLoader.load(encodeURI(asset.path), (t) => {
        t.needsUpdate = true;
      });
      return tex;
    });

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
    // MOUSE & TOUCH GESTURE PARALLAX & DRAG ROTATION
    // ----------------------------------------
    let isDragging = false;
    let pointerDownTime = 0;
    let pointerStartPos = { x: 0, y: 0 };
    let previousPosition = { x: 0, y: 0 };
    let velocity = { x: 0, y: 0.003 };
    let mousePos = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      pointerDownTime = Date.now();
      pointerStartPos = { x: e.clientX, y: e.clientY };
      previousPosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) return;

      const deltaX = e.clientX - previousPosition.x;
      const deltaY = e.clientY - previousPosition.y;

      velocity.y = deltaX * 0.005;
      velocity.x = deltaY * 0.005;

      globeGroup.rotation.y += velocity.y;
      globeGroup.rotation.x += velocity.x;

      previousPosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        const elapsed = Date.now() - pointerDownTime;
        const dist = Math.hypot(e.clientX - pointerStartPos.x, e.clientY - pointerStartPos.y);
        if (elapsed < 350 && dist < 8) {
          onTapRef.current?.();
        }
      }
      isDragging = false;
    };

    // TOUCH SUPPORT
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        pointerDownTime = Date.now();
        pointerStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousPosition.x;
      const deltaY = e.touches[0].clientY - previousPosition.y;

      velocity.y = deltaX * 0.005;
      velocity.x = deltaY * 0.005;

      globeGroup.rotation.y += velocity.y;
      globeGroup.rotation.x += velocity.x;

      previousPosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isDragging && e.changedTouches.length > 0) {
        const elapsed = Date.now() - pointerDownTime;
        const dist = Math.hypot(
          e.changedTouches[0].clientX - pointerStartPos.x,
          e.changedTouches[0].clientY - pointerStartPos.y
        );
        if (elapsed < 350 && dist < 12) {
          onTapRef.current?.();
        }
      }
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.style.touchAction = "none";
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    domEl.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

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
        if (isZeroGRef.current) {
          // ZERO-GRAVITY CELESTIAL FREE FLOAT
          if (!isDragging) {
            velocity.y = 0.0045;
            globeGroup.rotation.y += velocity.y;
            globeGroup.rotation.x += Math.sin(elapsedTime * 0.7) * 0.0012;
          }
        } else {
          // Inertia & Auto Rotation for Globe
          if (!isDragging) {
            velocity.x *= 0.92;
            velocity.y *= 0.94;
            if (autoRotate && Math.abs(velocity.y) < 0.0015) {
              velocity.y = 0.0025;
            }
            globeGroup.rotation.y += velocity.y;
            globeGroup.rotation.x += velocity.x;

            // GYROSCOPIC UPRIGHT RESTORING SPRING: gently return tilt to natural horizon
            globeGroup.rotation.x += (0 - globeGroup.rotation.x) * 0.035;
          }
        }

        // SUBTLE REDUCED PARALLAX DRIFT
        const pFactor = parallaxIntensity;

        fgCloudGroup.position.x = Math.sin(elapsedTime * 0.3) * 0.6 * pFactor;
        fgCloudGroup.position.y = Math.cos(elapsedTime * 0.25) * 0.3 * pFactor;

        bgSkyGroup.position.x = -Math.sin(elapsedTime * 0.2) * 0.4 * pFactor;
        bgSkyGroup.position.y = -Math.cos(elapsedTime * 0.15) * 0.2 * pFactor;

        // ORGANIC INDIVIDUAL CLOUD BREATHING
        fgSprites.forEach((sprite, idx) => {
          const base = fgPositions[idx];
          sprite.position.y = base.y + Math.sin(elapsedTime * 0.6 + idx * 1.2) * 0.25;
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

      // SOLAR TERMINATOR LIGHTING (ZERO PER-FRAME ALLOCATIONS)
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
      const w = container.clientWidth || size;
      const h = container.clientHeight || size;
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
      domEl.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size, solarAngle, parallaxIntensity, autoRotate]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      className={`relative cursor-grab active:cursor-grabbing select-none overflow-visible active:scale-[0.985] transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] ${className}`}
    />
  );
}
