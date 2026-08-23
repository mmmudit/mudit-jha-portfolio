export interface AudioColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Fallback algorithm that derives a unique 4-color palette from string seed/URL
export function getHarmoniousPaletteFromSeed(seed: string): AudioColorPalette {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const baseHue = Math.abs(hash) % 360;
  const secondHue = (baseHue + 45 + (Math.abs(hash >> 3) % 60)) % 360;
  const accentHue = (baseHue + 150 + (Math.abs(hash >> 5) % 60)) % 360;

  return {
    primary: hslToHex(baseHue, 90, 56), // vibrant main color
    secondary: hslToHex(secondHue, 85, 52), // complementary ribbon
    accent: hslToHex(accentHue, 95, 62), // bright accent ribbon
    highlight: hslToHex(accentHue, 40, 92), // glowing luminous core
  };
}

// Client-side extraction directly from cover art image bitmap
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

      // Downsample for speed
      const sampleSize = 32;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      const buckets: { h: number; s: number; l: number; count: number }[] = [];

      for (let i = 0; i < imgData.length; i += 16) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const [h, s, l] = rgbToHsl(r, g, b);

        // Ignore pure near-black or washed-out grays
        if (l > 12 && l < 90 && s > 15) {
          const existing = buckets.find(
            (bk) => Math.abs(bk.h - h) < 25 && Math.abs(bk.s - s) < 30
          );
          if (existing) {
            existing.count++;
          } else {
            buckets.push({ h, s, l, count: 1 });
          }
        }
      }

      buckets.sort((a, b) => b.count * (b.s + 20) - a.count * (a.s + 20));

      if (buckets.length > 0) {
        const p = buckets[0];
        const s = buckets[1] || { h: (p.h + 50) % 360, s: p.s, l: p.l };
        const a = buckets[2] || { h: (p.h + 160) % 360, s: Math.max(p.s, 80), l: 65 };

        const colors: AudioColorPalette = {
          primary: hslToHex(p.h, Math.max(p.s, 75), Math.min(Math.max(p.l, 48), 62)),
          secondary: hslToHex(s.h, Math.max(s.s, 70), Math.min(Math.max(s.l, 45), 60)),
          accent: hslToHex(a.h, Math.max(a.s, 85), 65),
          highlight: hslToHex(a.h, 30, 94),
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
