"use client";

import { useEffect, useRef } from "react";
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";
import { fragmentShader, vertexShader } from "./shader";

export const rainbowSettings = {
  speed: 0.45,
  waist: 0.045,
  flare: 0.58,
  glow: 0.45,
  intensity: 0.25,
  streaks: 0.25,
  cursor: 0.4,
  paused: false,
};

export type RainbowSettings = typeof rainbowSettings;

export function RainbowTunnel({ settings = rainbowSettings }: { settings?: RainbowSettings }) {
  const currentSettings = useRef(settings);
  const redraw = useRef<() => void>(() => { });
  useEffect(() => {
    currentSettings.current = settings;
    redraw.current();
  }, [settings]);
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = host.current!;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: false, powerPreference: "low-power" });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.cssText = "display:block;width:100%;height:100%;pointer-events:none";
    element.appendChild(renderer.domElement);
    const uniforms = {
      uTime: { value: 0 },
      uWidth: { value: currentSettings.current.waist },
      uFlare: { value: currentSettings.current.flare },
      uGlow: { value: currentSettings.current.glow },
      uIntensity: { value: currentSettings.current.intensity },
      uStreaks: { value: currentSettings.current.streaks },
      uPointer: { value: new Vector2() },
      uResolution: { value: new Vector2() },
    };
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, depthTest: false, depthWrite: false });
    const geometry = new PlaneGeometry(2, 2);
    const scene = new Scene();
    scene.add(new Mesh(geometry, material));
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const target = new Vector2();
    let frame = 0;
    let previous = 0;
    let visible = false;
    let lost = false;

    function draw(now: number) {
      frame = 0;
      const p = currentSettings.current;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!reduced.matches && !p.paused) {
        uniforms.uTime.value += dt * p.speed;
        const smoothing = 1 - Math.exp(-dt * 4);
        uniforms.uPointer.value.x += (target.x * p.cursor - uniforms.uPointer.value.x) * smoothing;
        uniforms.uPointer.value.y += (target.y * p.cursor - uniforms.uPointer.value.y) * smoothing;
      }
      if (reduced.matches) uniforms.uPointer.value.set(0, 0);
      uniforms.uWidth.value = p.waist;
      uniforms.uFlare.value = p.flare;
      uniforms.uGlow.value = p.glow;
      uniforms.uIntensity.value = p.intensity;
      uniforms.uStreaks.value = p.streaks;
      renderer.render(scene, camera);
      if (visible && !document.hidden && !lost && !reduced.matches && !p.paused) frame = requestAnimationFrame(draw);
    }
    function wake() {
      if (!frame && visible && !document.hidden && !lost) {
        previous = 0;
        frame = requestAnimationFrame(draw);
      }
    }
    function resize() {
      renderer.setSize(element.clientWidth, element.clientHeight, false);
      renderer.getDrawingBufferSize(uniforms.uResolution.value);
      wake();
    }
    function pointer(event: PointerEvent) {
      if (!finePointer.matches || reduced.matches || (event.target as Element).closest("[data-tunnel-controls]")) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) target.set(0, 0);
      else target.set(x * 2 - 1, 1 - y * 2);
      wake();
    }
    function leave() { target.set(0, 0); }
    function visibility() {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else wake();
    }
    function contextLost(event: Event) {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      renderer.domElement.style.visibility = "hidden";
    }
    function contextRestored() {
      lost = false;
      renderer.domElement.style.visibility = "visible";
      wake();
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
      else { cancelAnimationFrame(frame); frame = 0; }
    });
    intersection.observe(element);
    window.addEventListener("pointermove", pointer);
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    redraw.current = wake;
    reduced.addEventListener("change", wake);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener("webglcontextrestored", contextRestored);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      redraw.current = () => { };
      reduced.removeEventListener("change", wake);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", contextRestored);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#e0ebfc_0%,#eef1f3_65%,#f8f8f5_100%)]" />;
}
