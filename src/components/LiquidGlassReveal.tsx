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
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  uniform float uTime;
  uniform float uMotion;

  varying vec2 vUv;

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

  vec4 samplePortrait(vec2 uv) {
    vec4 sampleColor = texture2D(uTexture, coverUv(uv));
    return vec4(sampleColor.rgb * sampleColor.a, sampleColor.a);
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 delta = (vUv - uPointer) * aspect;
    float distanceFromPointer = length(delta);
    float radius = 0.255;
    float reveal = 1.0 - smoothstep(radius - 0.078, radius + 0.012, distanceFromPointer);

    if (reveal <= 0.001) {
      discard;
    }

    vec2 direction = delta / max(distanceFromPointer, 0.0001);
    float lensDepth = 1.0 - smoothstep(0.0, radius, distanceFromPointer);
    float ripple = sin(distanceFromPointer * 58.0 - uTime * 2.4) * 0.0018 * uMotion;
    float refraction = pow(lensDepth, 1.65) * (0.012 + 0.013 * uMotion) + ripple;
    vec2 refractedUv = vUv - direction * refraction / aspect;

    float edgeFactor = 1.0 - lensDepth;
    vec2 chroma = direction * edgeFactor * 0.0045 * uMotion / aspect;
    vec4 centerSample = samplePortrait(refractedUv);
    vec4 redSample = samplePortrait(refractedUv + chroma);
    vec4 blueSample = samplePortrait(refractedUv - chroma);

    float proximity = clamp(distanceFromPointer / radius, 0.0, 1.0);
    float blurProgress = smoothstep(0.12, 0.94, proximity);
    float blurRadius = pow(blurProgress, 1.4) * 0.012;
    vec2 blurX = vec2(blurRadius, 0.0) / aspect;
    vec2 blurY = vec2(0.0, blurRadius);
    vec2 blurDiagonalA = vec2(blurRadius * 0.707) / aspect;
    vec2 blurDiagonalB = vec2(blurRadius * 0.707, -blurRadius * 0.707) / aspect;

    vec4 blurredSample = centerSample * 0.22;
    blurredSample += samplePortrait(refractedUv + blurX) * 0.12;
    blurredSample += samplePortrait(refractedUv - blurX) * 0.12;
    blurredSample += samplePortrait(refractedUv + blurY) * 0.12;
    blurredSample += samplePortrait(refractedUv - blurY) * 0.12;
    blurredSample += samplePortrait(refractedUv + blurDiagonalA) * 0.075;
    blurredSample += samplePortrait(refractedUv - blurDiagonalA) * 0.075;
    blurredSample += samplePortrait(refractedUv + blurDiagonalB) * 0.075;
    blurredSample += samplePortrait(refractedUv - blurDiagonalB) * 0.075;

    vec4 portraitSample = mix(centerSample, blurredSample, blurProgress);
    vec3 portrait = portraitSample.rgb / max(portraitSample.a, 0.001);
    vec3 chromaticPortrait = vec3(
      redSample.r / max(redSample.a, 0.001),
      portrait.g,
      blueSample.b / max(blueSample.a, 0.001)
    );
    portrait = mix(portrait, chromaticPortrait, edgeFactor * 0.45 * uMotion);

    vec2 lightDirection = normalize(vec2(-0.7, 0.72));
    float directionalHighlight = pow(max(dot(direction, lightDirection), 0.0), 7.0);
    float rimDistance = (distanceFromPointer - (radius - 0.042)) / 0.038;
    float rim = exp(-(rimDistance * rimDistance)) * reveal;
    float liquidShimmer = 0.82 + 0.18 * sin(
      atan(delta.y, delta.x) * 3.0 + distanceFromPointer * 28.0 - uTime * 1.35
    ) * uMotion;
    float glassHighlight = rim * (0.08 + directionalHighlight * 0.24) * liquidShimmer;

    portrait += vec3(0.86, 0.95, 1.0) * glassHighlight;
    float alpha = max(portraitSample.a * reveal, glassHighlight * 0.3);

    gl_FragColor = vec4(portrait, alpha);
  }
`;

interface LiquidGlassRevealProps {
  src: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  active: boolean;
  reducedMotion: boolean;
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

export function LiquidGlassReveal({
  src,
  pointerX,
  pointerY,
  active,
  reducedMotion,
}: LiquidGlassRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const reducedMotionRef = useRef(reducedMotion);
  const renderRef = useRef<((time: number) => void) | null>(null);
  const frameRef = useRef<number | null>(null);

  const requestRender = useCallback(() => {
    if (frameRef.current === null && renderRef.current) {
      frameRef.current = window.requestAnimationFrame(renderRef.current);
    }
  }, []);

  useEffect(() => {
    activeRef.current = active;
    requestRender();
  }, [active, requestRender]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
    requestRender();
  }, [reducedMotion, requestRender]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
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

    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const imageAspectLocation = gl.getUniformLocation(program, "uImageAspect");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const motionLocation = gl.getUniformLocation(program, "uMotion");
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
    const startedAt = performance.now();

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
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
      gl.uniform2f(pointerLocation, pointerX.get(), 1 - pointerY.get());
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(imageAspectLocation, imageAspect);
      gl.uniform1f(timeLocation, (time - startedAt) / 1000);
      gl.uniform1f(motionLocation, reducedMotionRef.current ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (activeRef.current && !reducedMotionRef.current) {
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

    const stopPointerX = pointerX.on("change", requestRender);
    const stopPointerY = pointerY.on("change", requestRender);
    const resizeObserver = new ResizeObserver(requestRender);
    resizeObserver.observe(canvas);

    return () => {
      disposed = true;
      stopPointerX();
      stopPointerY();
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
  }, [pointerX, pointerY, requestRender, src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 size-full pointer-events-none"
      style={{
        opacity: active ? 1 : 0,
        transitionProperty: "opacity",
        transitionDuration: reducedMotion ? "0ms" : "var(--duration-quick)",
        transitionTimingFunction: "var(--ease-smooth-out)",
      }}
    />
  );
}
