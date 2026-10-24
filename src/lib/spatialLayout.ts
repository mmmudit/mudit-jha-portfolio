export type SpatialPosition = [number, number, number];
export const SPHERE_RADIUS = 5;
export const CARD_SIZES = { sm: 0.85, md: 1.15, lg: 1.55 } as const;

/** Replace this function with a spiral without changing the renderer. */
export function fibonacciSphere(count: number, radius = SPHERE_RADIUS): SpatialPosition[] {
  const angle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, i) => {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - y * y));
    return [Math.cos(angle * i) * ring * radius, y * radius, Math.sin(angle * i) * ring * radius];
  });
}
