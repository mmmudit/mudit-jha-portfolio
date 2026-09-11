"use client";

import { useCallback, useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;

  varying vec2 vUv;

  float random(vec2 cell) {
    return fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float matrixGlyph(vec2 local, float seed) {
    float stem = step(0.18, local.x) * step(local.x, 0.82);
    float cap = step(0.12, local.y) * step(local.y, 0.84);
    float split = step(0.12, abs(local.y - (0.3 + seed * 0.38)));
    float notch = step(0.12, abs(local.x - (0.32 + seed * 0.36)));
    return stem * cap * max(split, notch);
  }

  vec2 coverUv(vec2 uv) {
    float canvasAspect = uResolution.x / uResolution.y;

    if (canvasAspect > uImageAspect) {
      float visibleHeight = uImageAspect / canvasAspect;
      uv.y = (1.0 - visibleHeight) + uv.y * visibleHeight;
    } else {
      float visibleWidth = canvasAspect / uImageAspect;
      uv.x = (1.0 - visibleWidth) * 0.5 + uv.x * visibleWidth;
    }

    return uv;
  }

  void main() {
    if (uProgress <= 0.001) {
      discard;
    }

    vec2 cellSize = vec2(6.0, 9.0) * uPixelRatio;
    vec2 cell = floor(gl_FragCoord.xy / cellSize);
    vec2 local = fract(gl_FragCoord.xy / cellSize);

    float columnSeed = random(vec2(cell.x, 11.0));
    float cellSeed = random(cell);
    float verticalThreshold = 1.0 - vUv.y;
    float columnStagger = (columnSeed - 0.5) * 0.12;
    float cellJitter = (cellSeed - 0.5) * 0.035;
    float threshold = clamp(
      verticalThreshold + columnStagger + cellJitter,
      0.0,
      1.0
    );
    float distanceBehindFront = uProgress - threshold;
    float cellReveal = smoothstep(-0.018, 0.032, distanceBehindFront);

    if (uProgress >= 0.999) {
      cellReveal = 1.0;
    }

    if (cellReveal <= 0.001) {
      discard;
    }

    vec4 portrait = texture2D(uTexture, coverUv(vUv));
    float leadingEdge = smoothstep(-0.06, 0.018, distanceBehindFront)
      * (1.0 - smoothstep(0.02, 0.2, distanceBehindFront));
    float fallingPulse = 0.5 + 0.5 * sin(
      uTime * (7.0 + columnSeed * 5.0)
      - cell.y * (0.72 + columnSeed * 0.3)
      + columnSeed * 18.8495559
    );
    float pulseGate = smoothstep(0.42, 0.92, fallingPulse);
    float glyph = matrixGlyph(local, cellSeed);
    float scanLine = 1.0 - smoothstep(0.0, 0.085, abs(distanceBehindFront));
    float matrix = max(leadingEdge * pulseGate * glyph, scanLine * glyph * 0.72)
      * (1.0 - step(0.999, uProgress));
    vec3 matrixColor = mix(
      vec3(0.22, 0.92, 0.52),
      vec3(0.58, 1.0, 0.82),
      fallingPulse
    ) * matrix * 0.72;

    gl_FragColor = vec4(
      portrait.rgb + matrixColor,
      portrait.a * max(cellReveal, matrix * 0.9)
    );
  }
`;

interface PixelDissolveRevealProps {
  src: string;
  progress: MotionValue<number>;
  reducedMotion?: boolean;
}

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export function PixelDissolveReveal({
  src,
  progress,
  reducedMotion = false,
}: PixelDissolveRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRef = useRef<((time: number) => void) | null>(null);
  const frameRef = useRef<number | null>(null);

  const requestRender = useCallback(() => {
    if (frameRef.current === null && renderRef.current) {
      frameRef.current = window.requestAnimationFrame(renderRef.current);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
    });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    const positionBuffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!positionBuffer || !texture) return;

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const imageAspectLocation = gl.getUniformLocation(program, "uImageAspect");
    const progressLocation = gl.getUniformLocation(program, "uProgress");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const pixelRatioLocation = gl.getUniformLocation(program, "uPixelRatio");
    const textureLocation = gl.getUniformLocation(program, "uTexture");

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(textureLocation, 0);

    let imageAspect = 1;
    let textureReady = false;
    let disposed = false;
    let pixelRatio = 1;
    const startedAt = performance.now();

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    renderRef.current = (time: number) => {
      frameRef.current = null;
      if (disposed || !textureReady) return;

      resizeCanvas();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(imageAspectLocation, imageAspect);
      gl.uniform1f(progressLocation, progress.get());
      gl.uniform1f(timeLocation, (time - startedAt) / 1000);
      gl.uniform1f(pixelRatioLocation, pixelRatio);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      const currentProgress = progress.get();
      if (!reducedMotion && currentProgress > 0.001 && currentProgress < 0.999) {
        requestRender();
      }
    };

    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => {
      if (disposed) return;
      imageAspect = image.naturalWidth / image.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      textureReady = true;
      requestRender();
    };
    image.src = src;

    const stopProgress = progress.on("change", requestRender);
    const resizeObserver = new ResizeObserver(requestRender);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      stopProgress();
      resizeObserver.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = null;
      renderRef.current = null;
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [progress, reducedMotion, requestRender, src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full pointer-events-none"
    />
  );
}
