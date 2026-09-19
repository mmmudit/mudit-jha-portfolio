"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LayoutGroup } from "framer-motion";
import PageTransition from "./PageTransition";
import { Header } from "./header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesignSystem = pathname === "/design-system";

  // For the design system portal, render full bleed (edge-to-edge, full height, no outer margins or max-width)
  if (isDesignSystem) {
    return <div className="w-full min-h-screen">{children}</div>;
  }

  // Standard portfolio layout with framed max-width, side gutters, header, and page transitions
  return (
    <LayoutGroup id="global-eye-transition">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="sticky top-0 z-50 w-full px-6 pt-[calc(1rem+env(safe-area-inset-top,0px))] sm:px-14 sm:pt-[calc(1.5rem+env(safe-area-inset-top,0px))] pointer-events-none">
        <Header />
      </div>
      <div className="mx-auto flex w-full max-w-[1334px] flex-col px-6 sm:px-14 pt-8">
        <PageTransition>{children}</PageTransition>
      </div>
    </LayoutGroup>
  );
}
