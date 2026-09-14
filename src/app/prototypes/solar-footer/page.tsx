import { SolarFooterPrototype } from "./solar-footer-prototype";

export default async function SolarFooterPrototypePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string }>;
}) {
  const { v } = await searchParams;
  const parsed = Number.parseInt(v ?? "1", 10);
  const initialVariant = Number.isFinite(parsed)
    ? Math.min(3, Math.max(1, parsed)) - 1
    : 0;

  return <SolarFooterPrototype initialVariant={initialVariant} />;
}
