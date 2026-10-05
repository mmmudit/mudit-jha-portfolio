export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uWidth;
  uniform float uFlare;
  uniform float uGlow;
  uniform float uIntensity;
  uniform float uStreaks;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  float bell(float distance, float spread) {
    return exp(-distance * distance / (spread * spread));
  }

  void main() {
    vec2 uv = vUv;
    float x = (uv.x - 0.5 - uPointer.x * 0.075) * 2.0;
    float edge = abs(x);
    float bend = 0.008 * sin(x * 3.0 + uTime * 0.28);
    float center = 0.37 + uPointer.y * 0.06 + bend;
    float spread = uWidth + uFlare * pow(edge, 2.35);
    float lane = (uv.y - center) / spread;

    vec3 background = mix(vec3(0.975, 0.976, 0.966), vec3(0.876, 0.921, 0.990), smoothstep(0.12, 0.94, uv.y));
    // Overlapping spectral ribbons, narrow at the waist and diffuse at the edges.
    float softness = 0.32 + uGlow * 0.22 + edge * 0.15;
    vec3 pigment = vec3(0.0);
    float weight = 0.0;
    float band;
    band = bell(lane - 0.92, softness);
    pigment += vec3(0.20, 0.72, 0.83) * band; weight += band;
    band = bell(lane - 0.47, softness);
    pigment += vec3(0.43, 0.81, 0.64) * band; weight += band;
    band = bell(lane - 0.08, softness * 0.88);
    pigment += vec3(0.98, 0.83, 0.49) * band; weight += band;
    band = bell(lane + 0.32, softness);
    pigment += vec3(0.86, 0.53, 0.69) * band; weight += band;
    band = bell(lane + 0.72, softness);
    pigment += vec3(0.57, 0.61, 0.87) * band; weight += band;
    band = bell(lane + 1.04, softness * 0.8);
    pigment += vec3(0.24, 0.71, 0.85) * band; weight += band;

    float sideFade = 1.0 - smoothstep(0.60, 1.12, edge);
    float haze = bell(lane, 1.45 + uGlow * 0.3);
    vec3 color = mix(background, pigment / max(weight, 0.001),
      (1.0 - exp(-weight)) * uIntensity * sideFade);
    color = mix(color, vec3(0.84, 0.93, 0.95), haze * uGlow * 0.055 * sideFade);

    // Light travels along the same curved coordinates as the colored bands.
    float rays = 0.0;
    float footprint = 1.8 / (uResolution.y * spread);
    for (int i = 0; i < 22; i++) {
      float seed = float(i);
      float position = -1.16 + seed * 0.11;
      position += 0.022 * sin(x * 4.0 + seed * 2.7 + uTime * 0.23);
      float thin = bell(lane - position, max(0.009 + 0.005 * sin(seed * 9.1), footprint));
      float phase = edge * 6.0 - uTime * (0.38 + 0.12 * sin(seed)) + seed * 1.73;
      float pulse = pow(0.5 + 0.5 * sin(phase), 12.0);
      rays += thin * (0.13 + 0.87 * pulse) * (0.5 + 0.5 * sin(seed * 7.4));
    }
    color = mix(color, vec3(1.0), clamp(rays * uStreaks * sideFade * 0.38, 0.0, 0.5));
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) / 380.0;
    gl_FragColor = vec4(color, 1.0);
  }
`;
