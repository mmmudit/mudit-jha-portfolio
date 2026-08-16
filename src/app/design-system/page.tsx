import type { Metadata } from "next";
import { SystemPage } from "@/components/system/SystemPage";

export const metadata: Metadata = {
  title: "Design System — Mudit Jha",
  description: "Visual language, token catalog, and live shared components audit.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemRoute() {
  return (
    <main className="min-h-screen">
      <SystemPage />
    </main>
  );
}
