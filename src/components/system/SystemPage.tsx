"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SystemLayout } from "./SystemLayout";
import { IntroductionView } from "./views/IntroductionView";
import { BrandAssetsView } from "./views/BrandAssetsView";
import { PrinciplesView } from "./views/PrinciplesView";
import { UnionsView } from "./views/UnionsView";

import { ColorSection } from "./sections/ColorSection";
import { TypographySection } from "./sections/TypographySection";
import { ShadowSection } from "./sections/ShadowSection";
import { RadiusSection } from "./sections/RadiusSection";
import { EffectsSection } from "./sections/EffectsSection";
import { MotionSection } from "./sections/MotionSection";
import { ComponentSection } from "./sections/ComponentSection";
import { type TokenTag } from "./tokens";

function SystemPageContent() {
  const searchParams = useSearchParams();
  const urlView = searchParams.get("view");
  const [internalView, setInternalView] = useState<string>("introduction");

  // Derive active view: URL param takes precedence if provided, otherwise internal state
  const activeView = urlView || internalView;
  const filterTag: TokenTag | "all" = "all";

  const handleSelectView = (view: string, subAnchor?: string) => {
    setInternalView(view);

    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("view", view);
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });

      if (subAnchor) {
        setTimeout(() => {
          const el = document.getElementById(subAnchor);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }, 150);
      }
    }
  };

  return (
    <SystemLayout activeView={activeView} onSelectView={handleSelectView}>
      {activeView === "introduction" && (
        <IntroductionView onSelectView={handleSelectView} />
      )}

      {activeView === "brand" && <BrandAssetsView />}

      {activeView === "principles" && <PrinciplesView />}

      {activeView === "colors" && (
        <div className="p-8 sm:p-12">
          <ColorSection filterTag={filterTag} />
        </div>
      )}

      {activeView === "typography" && (
        <div className="p-8 sm:p-12">
          <TypographySection filterTag={filterTag} />
        </div>
      )}

      {activeView === "materials" && (
        <div className="p-8 sm:p-12 space-y-16">
          <ShadowSection filterTag={filterTag} />
          <EffectsSection filterTag={filterTag} />
          <RadiusSection filterTag={filterTag} />
        </div>
      )}

      {activeView === "motion" && (
        <div className="p-8 sm:p-12">
          <MotionSection filterTag={filterTag} />
        </div>
      )}

      {activeView === "components" && (
        <div className="p-8 sm:p-12">
          <ComponentSection />
        </div>
      )}

      {activeView === "unions" && <UnionsView />}

      {activeView === "accessibility" && <PrinciplesView />}
    </SystemLayout>
  );
}

export function SystemPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center p-12 text-xs font-mono text-zinc-500">
          Loading Design System...
        </div>
      }
    >
      <SystemPageContent />
    </Suspense>
  );
}
