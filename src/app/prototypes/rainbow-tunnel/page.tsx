import type { Metadata } from "next";
import { RainbowPlayground } from "./playground";

export const metadata: Metadata = {
  title: "Rainbow tunnel — Prototype",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RainbowPlayground />;
}
