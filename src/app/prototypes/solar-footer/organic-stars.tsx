"use client";

import { useMemo, type CSSProperties } from "react";
import styles from "./solar-footer.module.css";

type StarKind = "dust" | "pin" | "spark";

export interface OrganicStar {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  kind: StarKind;
}

const fract = (value: number) => value - Math.floor(value);
const noise = (seed: number) => fract(Math.sin(seed * 12.9898 + 78.233) * 43_758.5453);

function makeFieldStar(index: number, seed = 0): OrganicStar {
  const s = seed === 0 ? index : index + seed * 37.19;
  const x = noise(s + 3) * 96 + 2;
  const y = noise(s + 47) * 88 + 6;
  const brightness = noise(s + 91);
  const kind: StarKind = brightness > 0.88 ? "spark" : brightness > 0.54 ? "pin" : "dust";

  return {
    id: `field-${index}`,
    x,
    y,
    size: 0.65 + brightness * 1.8,
    opacity: 0.16 + brightness * 0.6,
    duration: 5.2 + noise(s + 117) * 6.4,
    delay: noise(s + 151) * -8,
    kind,
  };
}

function makeCluster(
  cluster: number,
  centerX: number,
  centerY: number,
  count: number,
  seed = 0,
): OrganicStar[] {
  return Array.from({ length: count }, (_, index) => {
    const s = seed === 0 ? cluster * 23 + index : cluster * 23 + index + seed * 43.17;
    const angle = noise(s) * Math.PI * 2;
    const distance = 1.5 + Math.pow(noise(s + 24), 1.8) * 10;
    const brightness = noise(s + 56);

    return {
      id: `cluster-${cluster}-${index}`,
      x: Math.max(2, Math.min(98, centerX + Math.cos(angle) * distance)),
      y: Math.max(5, Math.min(95, centerY + Math.sin(angle) * distance * 0.62)),
      size: 0.55 + brightness * 1.55,
      opacity: 0.12 + brightness * 0.5,
      duration: 6 + noise(s + 78) * 6,
      delay: noise(s + 108) * -9,
      kind: brightness > 0.8 ? "pin" : "dust",
    };
  });
}

export function generateOrganicStars(seed = 0): OrganicStar[] {
  const field = Array.from({ length: 38 }, (_, index) => makeFieldStar(index, seed));

  const c1x = seed === 0 ? 18 : 12 + noise(seed * 19.3 + 1) * 72;
  const c1y = seed === 0 ? 29 : 15 + noise(seed * 29.7 + 2) * 65;
  const c2x = seed === 0 ? 74 : 15 + noise(seed * 43.1 + 3) * 70;
  const c2y = seed === 0 ? 63 : 20 + noise(seed * 59.9 + 4) * 60;
  const c3x = seed === 0 ? 48 : 10 + noise(seed * 71.3 + 5) * 78;
  const c3y = seed === 0 ? 42 : 18 + noise(seed * 83.7 + 6) * 62;

  const clusters = [
    ...makeCluster(1, c1x, c1y, 8, seed),
    ...makeCluster(2, c2x, c2y, 10, seed),
    ...makeCluster(3, c3x, c3y, 6, seed),
  ];

  return [...field, ...clusters];
}

export function OrganicStars({
  tone,
  seed = 0,
}: {
  tone: "grazing" | "corona" | "haze";
  seed?: number;
}) {
  const stars = useMemo(() => generateOrganicStars(seed), [seed]);

  return (
    <div className={`${styles.organicStars} ${styles[`organicStars${tone}`]}`} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className={styles.organicStar}
          data-kind={star.kind}
          style={
            {
              left: `${star.x.toFixed(2)}%`,
              top: `${star.y.toFixed(2)}%`,
              "--star-size": `${star.size.toFixed(2)}px`,
              "--star-opacity": star.opacity.toFixed(2),
              "--star-low-opacity": (star.opacity * 0.62).toFixed(2),
              "--star-duration": `${star.duration.toFixed(2)}s`,
              "--star-delay": `${star.delay.toFixed(2)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
