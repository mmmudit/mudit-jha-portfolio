import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found — Mudit Jha",
  description: "The requested page could not be found.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
