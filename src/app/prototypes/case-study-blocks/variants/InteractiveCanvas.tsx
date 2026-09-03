"use client";

import React, { useState } from "react";
import { CaseStudySection } from "@/components/case-study/CaseStudySection";
import { MediaBlock } from "@/components/case-study/MediaBlock";
import { DecisionBlock } from "@/components/case-study/DecisionBlock";
import { ReflectionBlock } from "@/components/case-study/ReflectionBlock";
import { ComparisonBlock } from "@/components/case-study/ComparisonBlock";
import { FigmaEmbedBlock } from "@/components/case-study/FigmaEmbedBlock";
import { FeatureBlock } from "@/components/case-study/FeatureBlock";
import { Eye, Layers, Sparkles, Check, Copy } from "lucide-react";

const SAMPLE_BLOCKS: Record<string, any> = {
  decisionBlock: {
    _type: "decisionBlock",
    id: "sec-decision-01",
    eyebrow: "DESIGN DECISION 01",
    heading: "Making friction something you can feel",
    subheading: "We chose progressive friction over another screen-time warning.",
    context: [
      "Most digital wellbeing interventions ask users to consciously respond to another alert.",
      "But during passive scrolling, dismissing an alert is easy.",
    ],
    decision: [
      "We explored making the interaction itself change instead.",
      "As overstimulation rises, Clarity progressively introduces:",
    ],
    decisionPoints: [
      { title: "Haptic Friction", body: "Scrolling begins to feel heavier and sluggish." },
      { title: "Visual Degradation", body: "The interface gradually loses saturation and contrast." },
      { title: "Audio Grounding", body: "Chaotic audio gives way to calming harmonic frequencies." },
    ],
    why: [
      "The goal was not to lock someone out.",
      "It was to create a progression: subtle → noticeable → difficult to ignore.",
    ],
    placeholderTitle: "CLARITY — PRODUCT EVIDENCE: HAPTIC → VISUAL → AUDIO",
    caption: "Three synchronous interventions: tactile scroll resistance, desaturating content, and ambient harmonic audio.",
    cards: [
      { title: "Haptic friction", body: "Makes continued scrolling physically noticeable." },
      { title: "Visual degradation", body: "Makes rising overstimulation visually legible." },
      { title: "Audio grounding", body: "Changes the sensory environment without another banner alert." },
    ],
  },
  textSection: {
    _type: "textSection",
    id: "sec-problem",
    eyebrow: "01 — THE PROBLEM",
    heading: "Scrolling is frictionless even when it stops feeling good.",
    body: [
      "People can move from intentional phone use into passive scrolling without a clear moment where the experience feels different.",
      "Traditional screen-time tools usually intervene after time has passed.",
    ],
    subheading: "That gave us a different question:",
    largeQuestion: "How might we make digital overstimulation noticeable while it is happening?",
  },
  mediaBlock: {
    _type: "mediaBlock",
    id: "media-problem-visual",
    mediaType: "image",
    size: "wide",
    alt: "Progressive intervention spectrum",
    placeholderTitle: "LOW (NORMAL SCROLLING) → RISING (SUBTLE INTERVENTION) → HIGH (STRONG INTERVENTION)",
    caption: "Five-second comprehension: mapping the three tiers of progressive intervention across time and scroll speed.",
    annotation: {
      text: "Tactile resistance begins here",
      type: "arrow",
      position: "top-right",
    },
  },
  textSectionControls: {
    _type: "textSection",
    id: "sec-control",
    eyebrow: "03 — GIVING USERS CONTROL",
    heading: "An attention tool shouldn't become another system controlling your attention.",
    body: [
      "Clarity lets users control what information is tracked, delete their data, and step away from the system.",
    ],
    cards: [
      { title: "Choose what's tracked", body: "Granular toggles for behavioral signals and interventions." },
      { title: "Delete your data", body: "Instant on-device purge with zero cloud retention." },
      { title: "Take a break", body: "Pause interventions with a single tap whenever needed." },
    ],
    conclusion: "Clarity turns digital wellbeing from something users check afterward into something they can notice while it is happening.",
  },
  textSectionPipeline: {
    _type: "textSection",
    id: "sec-final-experience",
    eyebrow: "04 — FINAL EXPERIENCE",
    heading: "From passive scrolling to conscious interruption.",
    pipeline: [
      "Normal scrolling",
      "Brain Rot Level rises",
      "Neuro changes",
      "Friction increases",
      "Intervention becomes noticeable",
      "User breaks the loop",
    ],
    conclusion: "Clarity proves that ambient physical damping creates genuine pauses without adversarial lockouts.",
  },
  reflectionBlock: {
    _type: "reflectionBlock",
    id: "sec-retrospective",
    eyebrow: "05 — RETROSPECTIVE",
    heading: "The concept raised harder questions than the prototype answered.",
    body: [
      "Clarity was built as a hackathon concept, which meant we could explore an ambitious interaction quickly—but many of its assumptions still need validation and honest critique.",
    ],
    items: [
      {
        number: "01",
        heading: "Can something as subjective as “brain rot” be represented as a score?",
        body: "The concept depends on translating a fuzzy cognitive experience into something legible. I'd want to test whether that representation feels useful or overly reductive.",
      },
      {
        number: "02",
        heading: "When does helpful friction become annoying?",
        body: "The intervention has to interrupt automatic behavior without making ordinary phone use frustrating.",
      },
      {
        number: "03",
        heading: "Can an intervention reduce distraction without becoming another distraction itself?",
        body: "Especially across the Watch and Dynamic Island, the next step would be understanding when intervention helps—and when silence is better.",
      },
    ],
  },
  comparisonBlock: {
    _type: "comparisonBlock",
    id: "sec-comparison",
    eyebrow: "INTERVENTION COMPARISON",
    heading: "From ignorable popups to physical scroll resistance.",
    body: [
      "Traditional screen-time tools treat attention as a binary quota. Clarity treats attention as an active sensory state.",
    ],
    beforeLabel: "Standard Screen Time Alert",
    afterLabel: "Clarity Progressive Damping",
    placeholderTitle: "BEFORE: DISMISSED IN 0.8s | AFTER: PHYSICAL BRAKING & MINDFUL PAUSE",
    caption: "Side-by-side comparison illustrating how sensory damping introduces cognitive awareness without hard lockouts.",
  },
  figmaEmbed: {
    _type: "figmaEmbed",
    id: "sec-figma",
    eyebrow: "FIGMA INTERACTIVE PROTOTYPE",
    title: "Tactile Friction & Audio Model Prototype",
    figmaUrl: "https://www.figma.com/design/example",
    caption: "Interactive physics model built in Protopie and Figma showing the dynamic spring damping curve.",
    size: "wide",
    aspectRatio: "16/10",
  },
  featureBlock: {
    _type: "featureBlock",
    id: "sec-features",
    eyebrow: "ECOSYSTEM TOUCHPOINTS",
    heading: "Meeting users wherever distraction begins.",
    body: [
      "Clarity distributes intervention signals across immediate environmental hardware to avoid requiring app opens.",
    ],
    features: [
      {
        number: "01",
        title: "Dynamic Island Glance",
        body: "Ambient color glow indicating rising cognitive overstimulation without leaving the current app.",
        placeholderTitle: "DYNAMIC ISLAND GLANCE INTERACTION",
      },
      {
        number: "02",
        title: "Apple Watch Haptic Tap",
        body: "Gentle rhythmic pulse on the wrist when phone scrolling exceeds 15 minutes of uninterrupted rapid scrolling.",
        placeholderTitle: "WATCH TACTILE NOTIFICATION ENGINE",
      },
    ],
  },
};

export function InteractiveCanvas() {
  const [selectedKey, setSelectedKey] = useState<string>("decisionBlock");
  const [activeTab, setActiveTab] = useState<"render" | "anatomy">("render");
  const [copied, setCopied] = useState(false);

  const block = SAMPLE_BLOCKS[selectedKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(block, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderComponent = () => {
    switch (block._type) {
      case "textSection":
        return <CaseStudySection block={block} />;
      case "mediaBlock":
        return <MediaBlock block={block} />;
      case "decisionBlock":
        return <DecisionBlock block={block} />;
      case "reflectionBlock":
        return <ReflectionBlock block={block} />;
      case "comparisonBlock":
        return <ComparisonBlock block={block} />;
      case "figmaEmbed":
        return <FigmaEmbedBlock block={block} />;
      case "featureBlock":
        return <FeatureBlock block={block} />;
      default:
        return <div>Unknown block</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-900 pt-10 pb-28 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Bar */}
      <div className="max-w-4xl mx-auto space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 font-mono text-[11px] font-semibold tracking-wider uppercase mb-1.5">
              <Sparkles className="size-3" />
              <span>Live Visual Staging & Preview</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Interactive Component Sandbox
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-600 max-w-2xl mt-1">
              Select any block below to see its exact tactile editorial rendering as it appears on live case study pages.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-black/6 shadow-2xs">
            <button
              onClick={() => setActiveTab("render")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                activeTab === "render" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Eye className="size-3.5" />
              <span>Render</span>
            </button>
            <button
              onClick={() => setActiveTab("anatomy")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                activeTab === "anatomy" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <Layers className="size-3.5" />
              <span>Anatomy</span>
            </button>
          </div>
        </div>

        {/* Block Selector Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Object.entries(SAMPLE_BLOCKS).map(([key, item]) => {
            const isSelected = selectedKey === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedKey(key)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "bg-white text-zinc-600 hover:text-zinc-900 border border-black/6 hover:bg-[#fbfaf7]"
                }`}
              >
                <span>{item._type}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? "bg-zinc-800 text-zinc-300" : "bg-black/5 text-zinc-500"}`}>
                  {item.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="max-w-4xl mx-auto">
        <div className="p-6 sm:p-10 rounded-[28px] bg-white border border-black/8 shadow-sm relative">
          <div className="flex items-center justify-between border-b border-black/6 pb-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase text-zinc-700">
                Staging Area: {block._type}
              </span>
              <span className="font-mono text-[11px] text-zinc-400">({block.id})</span>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f5f4ee] hover:bg-zinc-200 text-zinc-800 font-mono text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
              <span>{copied ? "Copied JSON" : "Copy Payload"}</span>
            </button>
          </div>

          {/* Render Mode */}
          {activeTab === "render" ? (
            <div className="w-full">
              {renderComponent()}
            </div>
          ) : (
            /* Anatomy Mode: Dissecting the props */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs font-sans leading-relaxed">
                <span className="font-bold">Anatomy Inspector:</span> Below are all data keys actively driving this block's rendered state.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {Object.entries(block).map(([k, v]) => (
                  <div key={k} className="p-3.5 rounded-xl bg-[#f5f4ee]/70 border border-black/5 space-y-1">
                    <span className="text-[#47585c] font-bold text-[11px] uppercase tracking-wider block">
                      {k}
                    </span>
                    <div className="text-zinc-800 text-[11px] font-sans break-words max-h-32 overflow-y-auto">
                      {typeof v === "object" ? JSON.stringify(v, null, 2) : String(v)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
