"use client";

import React from "react";
import { Project, CaseStudyBlock } from "@/types/project";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudySection } from "./CaseStudySection";
import { MediaBlock } from "./MediaBlock";
import { FeatureBlock } from "./FeatureBlock";
import { DecisionBlock } from "./DecisionBlock";
import { ComparisonBlock } from "./ComparisonBlock";
import { ReflectionBlock } from "./ReflectionBlock";

interface CaseStudyRendererProps {
  project: Project;
  className?: string;
}

export function CaseStudyRenderer({ project, className = "" }: CaseStudyRendererProps) {
  const caseStudyBlocks: CaseStudyBlock[] = project.caseStudy || [];

  return (
    <article className={`w-full max-w-4xl mx-auto space-y-12 sm:space-y-16 pb-12 ${className}`}>
      {/* Editorial Case Study Hero */}
      <CaseStudyHero project={project} />

      {/* Structured Content Blocks */}
      {caseStudyBlocks.length > 0 ? (
        <div className="space-y-12 sm:space-y-16">
          {caseStudyBlocks.map((block, idx) => {
            const key = block._key || `block-${idx}`;

            switch (block._type) {
              case "textSection":
                return <CaseStudySection key={key} block={block} />;

              case "mediaBlock":
                return <MediaBlock key={key} block={block} />;

              case "featureBlock":
                return <FeatureBlock key={key} block={block} />;

              case "decisionBlock":
                return <DecisionBlock key={key} block={block} />;

              case "comparisonBlock":
                return <ComparisonBlock key={key} block={block} />;

              case "reflectionBlock":
                return <ReflectionBlock key={key} block={block} />;

              default:
                return null;
            }
          })}
        </div>
      ) : (
        /* Fallback Narrative for Legacy / Minimal Projects */
        <div className="space-y-10 font-sans border-t border-black/5 pt-6">
          {project.overview && (
            <div id="sec-overview" className="space-y-2.5 scroll-mt-8">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
                OVERVIEW
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                Vision & Intent
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
                {project.overview}
              </p>
            </div>
          )}

          {project.challenge && (
            <div id="sec-challenge" className="space-y-2.5 scroll-mt-8">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
                01 — THE PROBLEM
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                The Design Challenge
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
                {project.challenge}
              </p>
            </div>
          )}

          {project.solution && (
            <div id="sec-execution" className="space-y-2.5 scroll-mt-8">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
                02 — THE SOLUTION
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                Craft & Execution
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
                {project.solution}
              </p>
            </div>
          )}

          {project.impact && (
            <div id="sec-reflection" className="space-y-2.5 scroll-mt-8">
              <p className="font-mono text-xs font-semibold tracking-wider text-[#47585c] uppercase">
                03 — REFLECTION
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-zinc-900">
                Reflection & Impact
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-zinc-700">
                {project.impact}
              </p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
