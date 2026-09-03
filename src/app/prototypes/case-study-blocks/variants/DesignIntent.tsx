"use client";

import React, { useState } from "react";
import { Sparkles, BookOpen, Compass, ArrowRight, Lightbulb, AlertCircle, CheckCircle2 } from "lucide-react";

interface NarrativeAct {
  act: string;
  title: string;
  subtitle: string;
  recommendedBlocks: {
    type: string;
    role: string;
    headlineFormula: string;
    bodyFormula: string;
    signalLevel: "Mid-level" | "Senior" | "Staff";
    seniorSignal: string;
    commonMistake: string;
    clarityExample: string;
  }[];
}

const NARRATIVE_ACTS: NarrativeAct[] = [
  {
    act: "ACT 1",
    title: "The Friction & The Provocation",
    subtitle: "Hook the reader with a behavioral observation, not a standard business metric.",
    recommendedBlocks: [
      {
        type: "textSection",
        role: "The Problem Framing + Provocation Question",
        headlineFormula: "[Counterintuitive behavioral reality: 'Scrolling is frictionless even when it stops feeling good']",
        bodyFormula: "2 paragraphs max: Describe the silent drift into passivity, then pivot with subheading to largeQuestion.",
        signalLevel: "Senior",
        seniorSignal: "Frames the problem around human interaction ergonomics rather than blaming user lack of discipline.",
        commonMistake: "Writing 'Problem: Users spend 4.2 hours on phones.' That's data, not a design problem.",
        clarityExample: "Heading: 'Scrolling is frictionless even when it stops feeling good.' Subheading: 'That gave us a different question:' largeQuestion: 'How might we make digital overstimulation noticeable while it is happening?'",
      },
      {
        type: "mediaBlock (size: 'wide')",
        role: "5-Second Comprehension Visual",
        headlineFormula: "[Visual proof of the problem: normal use → prolonged scrolling → overstimulation]",
        bodyFormula: "Diagram or sketch showing the invisible progression that current tools fail to catch.",
        signalLevel: "Mid-level",
        seniorSignal: "Immediate visual evidence that anchors the reader before they scroll further.",
        commonMistake: "Inserting a generic stock illustration or phone mockup without explanatory captions.",
        clarityExample: "Caption: 'Five-second comprehension: showing how frictionless browsing silently turns into overstimulation.'",
      },
    ],
  },
  {
    act: "ACT 2",
    title: "The Conceptual Leap",
    subtitle: "The intellectual shift that separates a clever hack from a principled product direction.",
    recommendedBlocks: [
      {
        type: "textSection",
        role: "The Core Paradigm Shift",
        headlineFormula: "[Instead of [standard approach], we explored [physical/sensory intervention]]",
        bodyFormula: "Explain the philosophy in 3 clear assertions. Keep each paragraph to 1–2 sentences.",
        signalLevel: "Staff",
        seniorSignal: "Shows the candidate can question foundational interface assumptions (e.g. alerts vs physical interaction damping).",
        commonMistake: "Skipping the conceptual leap and jumping straight into Figma final mockups.",
        clarityExample: "Heading: 'Instead of telling you to stop scrolling, we made scrolling itself respond.'",
      },
      {
        type: "comparisonBlock",
        role: "The Transformation Contrast",
        headlineFormula: "[Before: standard ignorable dialog → After: physical sensory response]",
        bodyFormula: "Contrast the baseline mechanism with the new interaction model.",
        signalLevel: "Senior",
        seniorSignal: "Direct side-by-side evidence proving why the old paradigm failed and how the new one succeeds.",
        commonMistake: "Showing two screens that look almost identical, forcing the viewer to play 'spot the difference'.",
        clarityExample: "Before: Standard iOS modal dismissed in 0.8s. After: Progressive tactile damping prompting pause.",
      },
    ],
  },
  {
    act: "ACT 3",
    title: "Strategic Decisions & Trade-Offs",
    subtitle: "The heart of your portfolio: proving intentionality, sensory restraint, and architectural trade-offs.",
    recommendedBlocks: [
      {
        type: "decisionBlock",
        role: "Design Decision 01: Physical Interaction Model",
        headlineFormula: "[Making [abstract concept] something you can [feel / see / control]]",
        bodyFormula: "Context (Why alerts fail) → Decision (Tactile friction) → Decision Points (3 pillars) → Why (Subtle to noticeable) → Visual Evidence → 3 Breakdown Cards.",
        signalLevel: "Staff",
        seniorSignal: "Demonstrates multisensory systems thinking (Haptic + Visual + Audio) and trade-off awareness.",
        commonMistake: "Listing design choices without stating what was rejected or what trade-off was accepted.",
        clarityExample: "Heading: 'Making friction something you can feel' Subheading: 'We chose progressive friction over another screen-time warning.'",
      },
      {
        type: "decisionBlock",
        role: "Design Decision 02: Representing Invisible States",
        headlineFormula: "[Giving an invisible feeling a visible state]",
        bodyFormula: "Context (Fuzzy cognitive state) → Decision (Two complementary signals) → Neuro + Score → Why (Emotional recognition vs data analytics).",
        signalLevel: "Senior",
        seniorSignal: "Balances analytical clarity (score) with affective resonance (companion character).",
        commonMistake: "Creating complex dashboards with 20 charts that overwhelm cognitive load.",
        clarityExample: "Decision points: 'Brain Rot Level' (makes state explicit) + 'Neuro' (makes state recognizable at a glance).",
      },
      {
        type: "decisionBlock",
        role: "Design Decision 03: Ecosystem & Cross-Surface Placement",
        headlineFormula: "[Intervening before another scroll begins]",
        bodyFormula: "Context (In-app intervention comes too late) → Decision (Apple Watch & Dynamic Island) → Tradeoff (More intervention isn't always better).",
        signalLevel: "Staff",
        seniorSignal: "Explicitly discusses the risk of over-intervention and the restraint needed for ambient hardware.",
        commonMistake: "Claiming the solution is 100% flawless without acknowledging user annoyance risks.",
        clarityExample: "Tradeoff: 'The system needs to remain noticeable without becoming another source of interruption itself.'",
      },
    ],
  },
  {
    act: "ACT 4",
    title: "System Integrity & User Agency",
    subtitle: "Proving ethical product design, privacy controls, and end-to-end interactive polish.",
    recommendedBlocks: [
      {
        type: "textSection (with cards & pipeline)",
        role: "User Agency & Motion Sequence",
        headlineFormula: "[An attention tool shouldn't become another system controlling attention]",
        bodyFormula: "3 control cards (Choose what's tracked, Delete data, Take a break) + 6-step motion pipeline flow.",
        signalLevel: "Senior",
        seniorSignal: "Addresses privacy, user consent, and escape hatches upfront, proving ethical product responsibility.",
        commonMistake: "Designing high-friction interventions with no user off-ramp or privacy consideration.",
        clarityExample: "Pipeline: ['Normal scrolling' → 'Brain Rot Level rises' → 'Neuro changes' → 'Friction increases' → 'User breaks the loop']",
      },
      {
        type: "figmaEmbed or mediaBlock (size: 'full')",
        role: "End-to-End Product Walkthrough Video",
        headlineFormula: "[Complete interactive film or live playable prototype]",
        bodyFormula: "Full-bleed interactive walkthrough showing smooth transitions between states.",
        signalLevel: "Senior",
        seniorSignal: "Proves interaction feasibility through working video or interactive prototype.",
        commonMistake: "Leaving mockups static with no movement, making tactile ideas purely hypothetical.",
        clarityExample: "MediaBlock: Full walkthrough demo of progressive scroll resistance in action.",
      },
    ],
  },
  {
    act: "ACT 5",
    title: "The Honest Retrospective",
    subtitle: "The most respected section by design leadership: self-critique, open questions, and what you'd explore next.",
    recommendedBlocks: [
      {
        type: "reflectionBlock",
        role: "Critical Retrospective & Open Questions",
        headlineFormula: "['The concept raised harder questions than the prototype answered']",
        bodyFormula: "3 numbered critical inquiries testing the validity, edge cases, and limits of the concept.",
        signalLevel: "Staff",
        seniorSignal: "Demonstrates intellectual humility. Proves you are a designer who stress-tests their own ideas.",
        commonMistake: "Writing 'I learned teamwork was important and Figma auto-layout is fast.'",
        clarityExample: "01: 'Can something as subjective as brain rot be scored?' 02: 'When does helpful friction become annoying?' 03: 'Can an intervention reduce distraction without becoming another distraction?'",
      },
    ],
  },
];

export function DesignIntent() {
  const [selectedAct, setSelectedAct] = useState<number>(0);

  const act = NARRATIVE_ACTS[selectedAct];

  return (
    <div className="min-h-screen bg-[#faf9f5] text-zinc-900 pt-10 pb-28 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header Bar */}
      <div className="max-w-5xl mx-auto space-y-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/8 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 font-mono text-[11px] font-semibold tracking-wider uppercase mb-1.5">
              <BookOpen className="size-3" />
              <span>Editorial Storytelling Playbook</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              The 5-Act Case Study Architecture
            </h1>
            <p className="font-sans text-xs sm:text-sm text-zinc-600 max-w-2xl mt-1">
              How to sequence blocks to create an irresistible narrative arc that signals Senior and Staff product design maturity.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500 bg-white/80 px-2.5 py-1 rounded-lg border border-black/5 shadow-2xs">
              5 Narrative Acts
            </span>
          </div>
        </div>

        {/* Narrative Step Navigator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {NARRATIVE_ACTS.map((a, idx) => {
            const isSelected = selectedAct === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedAct(idx)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                    : "bg-white text-zinc-700 border-black/6 hover:bg-[#fbfaf7]"
                }`}
              >
                <p className={`font-mono text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-amber-400" : "text-[#47585c]"}`}>
                  {a.act}
                </p>
                <p className="font-display text-xs font-semibold mt-0.5 line-clamp-1">
                  {a.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Act Detail Card */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Act Header */}
        <div className="p-6 rounded-[24px] bg-white border border-black/8 shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#f5f4ee] text-zinc-700 font-mono text-xs font-bold uppercase">
              {act.act}
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-zinc-900">
              {act.title}
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-zinc-600">
            {act.subtitle}
          </p>
        </div>

        {/* Recommended Blocks in this Act */}
        <div className="space-y-5">
          {act.recommendedBlocks.map((blockItem, bIdx) => (
            <div
              key={bIdx}
              className="p-6 rounded-[24px] bg-white border border-black/8 shadow-2xs space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/6 pb-3.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded">
                      {blockItem.type}
                    </span>
                    <span className="font-display text-base font-bold text-zinc-800">
                      {blockItem.role}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      blockItem.signalLevel === "Staff"
                        ? "bg-purple-100 text-purple-900 border border-purple-300"
                        : blockItem.signalLevel === "Senior"
                        ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                        : "bg-blue-100 text-blue-900 border border-blue-300"
                    }`}
                  >
                    Signals {blockItem.signalLevel} Maturity
                  </span>
                </div>
              </div>

              {/* Formulas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#f5f4ee]/70 border border-black/5 space-y-1">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#47585c]">
                    Headline Formula
                  </p>
                  <p className="font-display text-xs sm:text-sm font-semibold text-zinc-900">
                    {blockItem.headlineFormula}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f5f4ee]/70 border border-black/5 space-y-1">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#47585c]">
                    Body Paragraph Rule
                  </p>
                  <p className="font-sans text-xs text-zinc-700">
                    {blockItem.bodyFormula}
                  </p>
                </div>
              </div>

              {/* Clarity Blueprint Real Example */}
              <div className="p-4 rounded-xl bg-[#c8d5bb]/20 border border-[#c8d5bb]/50 space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-700" />
                  <span className="font-mono text-[11px] font-bold text-[#47585c] uppercase tracking-wider">
                    Real Production Example from Clarity
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-zinc-800 italic leading-relaxed">
                  "{blockItem.clarityExample}"
                </p>
              </div>

              {/* Signals vs Pitfalls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
                  <CheckCircle2 className="size-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-mono text-[11px] font-bold text-emerald-900 uppercase">
                      What Reviewers Praise
                    </p>
                    <p className="font-sans text-xs text-emerald-900/80 leading-snug">
                      {blockItem.seniorSignal}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-200/60">
                  <AlertCircle className="size-4 text-rose-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-mono text-[11px] font-bold text-rose-900 uppercase">
                      Common Trap to Avoid
                    </p>
                    <p className="font-sans text-xs text-rose-900/80 leading-snug">
                      {blockItem.commonMistake}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
