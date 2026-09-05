"use client";

import React from "react";
import { Project, CaseStudyBlock, ProjectContentBlock } from "@/types/project";
import { CaseStudyHero } from "./CaseStudyHero";
import { CaseStudySection } from "./CaseStudySection";
import { MediaBlock } from "./MediaBlock";
import { FigmaEmbedBlock } from "./FigmaEmbedBlock";
import { FeatureBlock } from "./FeatureBlock";
import { DecisionBlock } from "./DecisionBlock";
import { ComparisonBlock } from "./ComparisonBlock";
import { ReflectionBlock } from "./ReflectionBlock";
import { FeatureContentBlock, GalleryBlock, HighlightFeatureBlock, ProcessBlock, ResultsBlock, StatementBlock } from "./ContentBlocks";

interface CaseStudyRendererProps {
  project: Project;
  className?: string;
}

export function CaseStudyRenderer({ project, className = "" }: CaseStudyRendererProps) {
  const contentBlocks: ProjectContentBlock[] = project.content || [];
  const caseStudyBlocks: CaseStudyBlock[] = project.caseStudy || [];

  return (
    <article className={`w-full max-w-4xl mx-auto space-y-12 sm:space-y-16 pb-12 ${className}`}>
      {/* Editorial Case Study Hero */}
      <CaseStudyHero project={project} />

      {/* Structured Content Blocks */}
      {contentBlocks.length > 0 ? (
        <div className="space-y-12 sm:space-y-16">
          {contentBlocks.map((block) => {
            switch (block._type) {
              case "narrative": return <CaseStudySection key={block._key} block={{ ...block, _type: "textSection" }} />;
              case "statement": return <StatementBlock key={block._key} block={block} />;
              case "designDecision": return <DecisionBlock key={block._key} block={{ ...block, _type: "decisionBlock" }} />;
              case "media": return <MediaBlock key={block._key} block={{ ...block, _type: "mediaBlock", size: block.variant === "contained" ? "normal" : block.variant === "fullBleed" ? "full" : "wide" }} />;
              case "feature": return <FeatureContentBlock key={block._key} block={block} />;
              case "highlightFeature": return <HighlightFeatureBlock key={block._key} block={block} />;
              case "gallery": return <GalleryBlock key={block._key} block={block} />;
              case "process": return <ProcessBlock key={block._key} block={block} />;
              case "comparison": return <ComparisonBlock key={block._key} block={{ ...block, _type: "comparisonBlock", beforeMedia: block.beforeImage, afterMedia: block.afterImage }} />;
              case "results": return <ResultsBlock key={block._key} block={block} />;
              case "reflection": return <ReflectionBlock key={block._key} block={{ ...block, _type: "reflectionBlock" }} />;
            }
          })}
        </div>
      ) : caseStudyBlocks.length > 0 ? (
        <div className="space-y-12 sm:space-y-16">
          {caseStudyBlocks.map((block, idx) => {
            const key = block._key || `block-${idx}`;

            switch (block._type) {
              case "textSection":
                return <CaseStudySection key={key} block={block} />;

              case "mediaBlock":
                return <MediaBlock key={key} block={block} />;

              case "figmaEmbed":
                return <FigmaEmbedBlock key={key} block={block} />;

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
