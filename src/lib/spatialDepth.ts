export function depthAppearance(distance: number, near: number, far: number) {
  const t = Math.max(0, Math.min(1, (distance - near) / Math.max(0.001, far - near)));
  return { opacity: 1 - t * 0.85, scale: 1 - t * 0.4 };
}
export function sharesTag(a: { tags: string[] }, b: { tags: string[] }) {
  return a.tags.some(tag => b.tags.includes(tag));
}
