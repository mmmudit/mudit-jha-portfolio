export interface AudioColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

function srgbToLinear(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  const s = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(s * 255);
}

// Convert sRGB (0-255) to OKLCH [Lightness 0-1, Chroma 0-0.4, Hue 0-360]
export function rgbToOklch(r: number, g: number, b: number): [number, number, number] {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const l_ = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m_ = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s_ = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let H = (Math.atan2(b_, a) * 180) / Math.PI;
  if (H < 0) H += 360;

  return [L, C, H];
}

// Convert OKLCH to sRGB hex format for universal canvas & CSS rendering
export function oklchToHex(L: number, C: number, H: number): string {
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b_ = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b_;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const lr = +4.0767434757 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  const r = linearToSrgb(lr);
  const g = linearToSrgb(lg);
  const b = linearToSrgb(lb);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// OKLCH-based harmonious palette generator (prevents HSL hue drift and maintains uniform perceived brightness)
export function getHarmoniousPaletteFromSeed(seed: string): AudioColorPalette {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseHue = Math.abs(hash) % 360;
  const secondHue = (baseHue + 45 + (Math.abs(hash >> 3) % 45)) % 360;
  const accentHue = (baseHue + 155 + (Math.abs(hash >> 5) % 50)) % 360;

  return {
    primary: oklchToHex(0.62, 0.19, baseHue), // Vibrant main anchor with consistent perceptual lightness
    secondary: oklchToHex(0.58, 0.16, secondHue), // Harmonious secondary wave
    accent: oklchToHex(0.68, 0.18, accentHue), // High-clarity accent ribbon
    highlight: oklchToHex(0.92, 0.04, accentHue), // Luminous glow core (L > 0.9)
  };
}

// Client-side extraction directly from cover art image bitmap using OKLCH clustering
const colorCache = new Map<string, AudioColorPalette>();

export function extractColorsFromImage(
  imageUrl: string,
  fallbackSeed: string,
  callback: (colors: AudioColorPalette) => void
) {
  if (!imageUrl) {
    callback(getHarmoniousPaletteFromSeed(fallbackSeed));
    return;
  }

  if (colorCache.has(imageUrl)) {
    callback(colorCache.get(imageUrl)!);
    return;
  }

  const img = new window.Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Downsample for rapid sample extraction
      const sampleSize = 32;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const buckets: { L: number; C: number; H: number; count: number }[] = [];

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const [L, C, H] = rgbToOklch(r, g, b);

        // Filter out extreme near-blacks, pure whites, and muddy zero-chroma grays
        if (L > 0.12 && L < 0.92 && C > 0.035) {
          const existing = buckets.find(
            (bk) => Math.abs(bk.H - H) < 28 && Math.abs(bk.C - C) < 0.06
          );
          if (existing) {
            existing.count++;
          } else {
            buckets.push({ L, C, H, count: 1 });
          }
        }
      }

      // Sort by frequency weighted by chroma vibrancy
      buckets.sort((a, b) => b.count * (b.C + 0.1) - a.count * (a.C + 0.1));

      if (buckets.length > 0) {
        const p = buckets[0];
        const s = buckets[1] || { L: p.L, C: p.C * 0.85, H: (p.H + 45) % 360 };
        const a = buckets[2] || { L: Math.min(0.72, p.L + 0.1), C: Math.max(p.C, 0.15), H: (p.H + 150) % 360 };

        const colors: AudioColorPalette = {
          primary: oklchToHex(Math.min(Math.max(p.L, 0.52), 0.65), Math.max(p.C, 0.16), p.H),
          secondary: oklchToHex(Math.min(Math.max(s.L, 0.48), 0.62), Math.max(s.C, 0.14), s.H),
          accent: oklchToHex(0.68, Math.max(a.C, 0.16), a.H),
          highlight: oklchToHex(0.92, 0.04, a.H),
        };

        colorCache.set(imageUrl, colors);
        callback(colors);
        return;
      }
    } catch {
      // CORS or canvas error -> fallback
    }

    const fallback = getHarmoniousPaletteFromSeed(imageUrl || fallbackSeed);
    colorCache.set(imageUrl, fallback);
    callback(fallback);
  };

  img.onerror = () => {
    const fallback = getHarmoniousPaletteFromSeed(imageUrl || fallbackSeed);
    colorCache.set(imageUrl, fallback);
    callback(fallback);
  };

  img.src = imageUrl;
}
