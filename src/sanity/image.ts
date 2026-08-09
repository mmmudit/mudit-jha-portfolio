export function urlFor(source: any) {
  if (typeof source === "string") return source;
  if (source?.asset?.url) return source.asset.url;
  return "";
}
