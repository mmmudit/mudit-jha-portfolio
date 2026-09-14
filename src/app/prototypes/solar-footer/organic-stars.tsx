import type { CSSProperties } from "react";
import styles from "./solar-footer.module.css";

type StarKind = "dust" | "pin" | "spark";

interface OrganicStar {
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

function makeFieldStar(index: number): OrganicStar {
  const x = noise(index + 3) * 96 + 2;
  const y = noise(index + 47) * 88 + 6;
  const brightness = noise(index + 91);
  const kind: StarKind = brightness > 0.88 ? "spark" : brightness > 0.54 ? "pin" : "dust";

  return {
    id: `field-${index}`,
    x,
    y,
    size: 0.65 + brightness * 1.8,
    opacity: 0.16 + brightness * 0.6,
    duration: 5.2 + noise(index + 117) * 6.4,
    delay: noise(index + 151) * -8,
    kind,
  };
}

function makeCluster(
  cluster: number,
  centerX: number,
  centerY: number,
  count: number,
): OrganicStar[] {
  return Array.from({ length: count }, (_, index) => {
    const angle = noise(cluster * 23 + index) * Math.PI * 2;
    const distance = 1.5 + Math.pow(noise(cluster * 47 + index), 1.8) * 10;
    const brightness = noise(cluster * 79 + index);

    return {
      id: `cluster-${cluster}-${index}`,
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance * 0.62,
      size: 0.55 + brightness * 1.55,
      opacity: 0.12 + brightness * 0.5,
      duration: 6 + noise(cluster * 101 + index) * 6,
      delay: noise(cluster * 131 + index) * -9,
      kind: brightness > 0.8 ? "pin" : "dust",
    };
  });
}

const field = Array.from({ length: 38 }, (_, index) => makeFieldStar(index));
const clusters = [
  ...makeCluster(1, 18, 29, 8),
  ...makeCluster(2, 74, 63, 10),
  ...makeCluster(3, 48, 42, 6),
];

const stars = [...field, ...clusters];

export function OrganicStars({ tone }: { tone: "grazing" | "corona" | "haze" }) {
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
