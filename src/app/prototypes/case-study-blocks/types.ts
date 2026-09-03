export interface BlockReferenceInfo {
  type: string;
  name: string;
  badge: string;
  narrativePhase: string;
  purpose: string;
  bestFor: string[];
  neverUseFor: string[];
  keyFields: {
    name: string;
    type: string;
    required?: boolean;
    description: string;
    example?: string;
  }[];
  copyRules: string[];
  seniorSignalingTip: string;
  sampleGroq: string;
  samplePayload: Record<string, any>;
}

export const CASE_STUDY_BLOCKS_DATA: BlockReferenceInfo[] = [
  {
    type: "textSection",
    name: "Text Section",
    badge: "01 — Editorial Narrative",
    narrativePhase: "Act 1: Problem / Act 2: Core Idea / Act 3: Principles",
    purpose:
      "Sets up the stakes, framing statements, core thesis, callout questions, motion sequence pipelines, and compact control cards.",
    bestFor: [
      "The opening Problem breakdown (01 — THE PROBLEM)",
      "The conceptual leap or paradigm shift (02 — THE CORE IDEA)",
      "User control principles with 3-column micro-cards (03 — GIVING USERS CONTROL)",
      "High-level sequence pipelines with arrow pills (04 — FINAL EXPERIENCE)",
      "Concluding single-paragraph thesis statements",
    ],
    neverUseFor: [
      "Long walls of uninterrupted body text without subheadings or visual anchors",
      "Showing detailed before/after UI (use comparisonBlock instead)",
      "Deep rationale breakdowns with trade-offs (use decisionBlock instead)",
    ],
    keyFields: [
      { name: "id", type: "string", required: true, description: "Anchor link ID for table-of-contents (e.g. 'sec-problem')", example: "sec-problem" },
      { name: "eyebrow", type: "string", description: "Monospace uppercase badge (e.g. '01 — THE PROBLEM')", example: "01 — THE PROBLEM" },
      { name: "heading", type: "string", required: true, description: "Bold claim statement in Figtree font", example: "Scrolling is frictionless even when it stops feeling good." },
      { name: "body", type: "string[]", description: "Array of body paragraphs (1–3 paragraphs max for readability)", example: "['People can move from intentional phone use into passive scrolling...']" },
      { name: "subheading", type: "string", description: "Medium-weight transition statement introducing a pivot", example: "That gave us a different question:" },
      { name: "largeQuestion", type: "text", description: "Pill/box highlighted big research question in quotes", example: "How might we make digital overstimulation noticeable while it is happening?" },
      { name: "pipeline", type: "string[]", description: "Sequence of flow pills separated by arrows", example: "['Normal scrolling', 'Brain Rot rises', 'Neuro changes', 'Friction increases', 'User breaks loop']" },
      { name: "cards", type: "array of {title, body}", description: "Grid of 3 compact cards for principles, controls, or constraints" },
      { name: "conclusion", type: "text", description: "Highlighted concluding box with green/tactile border" },
      { name: "media", type: "object {image, alt, caption}", description: "Optional inline image embedded within the reading column" },
    ],
    copyRules: [
      "Heading MUST be a strong assertion or claim, never a bland label like 'Problem Definition'.",
      "Keep body paragraphs under 3 sentences each to maintain scannability on both mobile and desktop.",
      "Use largeQuestion when introducing the central design provocation or 'How Might We' question.",
      "Pipeline steps should be short verb phrases (2–4 words each).",
    ],
    seniorSignalingTip:
      "Frame the problem around human behavior and friction rather than business metrics alone. The largeQuestion establishes intellectual rigor.",
    sampleGroq: `caseStudy[_type == "textSection"] {
  _type, _key, id, eyebrow, heading, body,
  subheading, largeQuestion, pipeline,
  cards[]{ _key, title, body },
  conclusion
}`,
    samplePayload: {
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
  },
  {
    type: "mediaBlock",
    name: "Media Block",
    badge: "02 — Visual Evidence",
    narrativePhase: "Pacing & Proof (Interspersed between narrative text)",
    purpose:
      "Displays standalone visual proof, interaction clips, user context sketches, UI diagrams, and Figma prototypes at 3 width tiers.",
    bestFor: [
      "5-second comprehension visuals immediately after problem statements",
      "Process sketches, storyboard doodles, and behavioral diagrams",
      "Full-bleed high-res product film and walkthrough clips",
      "Tactile device mockups with custom hand-drawn callout annotations",
    ],
    neverUseFor: [
      "Boring decorative stock photography with no caption or explanatory value",
      "Before & after comparisons (use comparisonBlock with side-by-side or split)",
      "Interactive multi-step feature walkthroughs (use featureBlock)",
    ],
    keyFields: [
      { name: "id", type: "string", description: "Anchor link identifier", example: "media-problem-visual" },
      { name: "mediaType", type: "'image' | 'video' | 'figma'", required: true, description: "Type of media renderer to activate" },
      { name: "image", type: "image (hotspot)", description: "Uploaded Sanity image asset" },
      { name: "video", type: "url", description: "Direct video MP4 or hosted web video URL" },
      { name: "figmaUrl", type: "url", description: "Figma live embed sharing link" },
      { name: "placeholderTitle", type: "string", description: "Fallback wireframe bracket title if asset is loading or missing", example: "CLARITY — USER CONTEXT SKETCH [dood.png]" },
      { name: "caption", type: "string", description: "Editorial caption explaining what the viewer is seeing and why it matters" },
      { name: "size", type: "'normal' | 'wide' | 'full'", description: "Display width tier: normal (reading width), wide (breaks margins), full (edge-to-edge)" },
      { name: "borderless", type: "boolean", description: "Set true to remove tactile card frame and allow raw bleed" },
      { name: "annotation", type: "object {text, type, position}", description: "Handdrawn pencil annotation (arrow, circle, underline, label) with positioning" },
    ],
    copyRules: [
      "Captions must explain the 'so what?' — not just 'Screenshot of UI', but 'Five-second comprehension: showing how frictionless browsing silently turns into overstimulation.'",
      "Use placeholderTitle format '[ PROJECT — DESCRIPTION ]' so unfinished drafts still look deliberate.",
      "Choose size='wide' for complex multi-screen flows and size='normal' for single phone mockups.",
    ],
    seniorSignalingTip:
      "Every media block should answer a specific question raised in the preceding text block. If removing the visual doesn't hurt understanding, cut it.",
    sampleGroq: `caseStudy[_type == "mediaBlock"] {
  _type, _key, id, mediaType,
  "image": image.asset->url,
  video, figmaUrl, placeholderTitle,
  alt, caption, size, borderless,
  annotation { text, type, position }
}`,
    samplePayload: {
      _type: "mediaBlock",
      id: "media-problem-visual",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "NORMAL USE → PROLONGED SCROLLING → OVERSTIMULATION",
      caption: "Five-second comprehension: showing how frictionless browsing silently turns into overstimulation.",
      alt: "Progression from intentional use to sensory overload",
    },
  },
  {
    type: "decisionBlock",
    name: "Decision Block",
    badge: "03 — Design Decisions & Trade-offs",
    narrativePhase: "Act 2–3: Core Strategic & Interaction Deep Dives",
    purpose:
      "The flagship senior-level block: proves intentionality by structuring the design story as Context → Decision (with Pillars) → Why / Trade-off + Visual Evidence + Breakdown Cards.",
    bestFor: [
      "Deep diving into 2–3 pivotal architectural or interaction choices",
      "Contrasting naive or standard approaches with the chosen intervention",
      "Explaining technical constraints, accessibility tensions, or UX trade-offs",
      "Demonstrating synchronous multisensory systems (e.g. tactile haptics + visual degradation + audio)",
    ],
    neverUseFor: [
      "Minor cosmetic styling tweaks (e.g. 'Choosing the color purple')",
      "Generic feature lists with no strategic rationale or trade-off",
      "Blocks where you cannot articulate a genuine trade-off or downside",
    ],
    keyFields: [
      { name: "id", type: "string", required: true, description: "Anchor link identifier", example: "sec-decision-01" },
      { name: "eyebrow", type: "string", description: "Numbered tag pill", example: "DESIGN DECISION 01" },
      { name: "heading", type: "string", required: true, description: "Bold decision statement", example: "Making friction something you can feel" },
      { name: "subheading", type: "string", description: "Strategic contrast / what vs what", example: "We chose progressive friction over another screen-time warning." },
      { name: "context", type: "string[]", description: "Context paragraphs: why existing solutions or naive paths failed" },
      { name: "decision", type: "string[]", description: "Decision paragraphs: the specific interaction model chosen" },
      { name: "decisionPoints", type: "array of {title, body}", description: "3 structural pillars (e.g. Haptic Friction, Visual Degradation, Audio Grounding)" },
      { name: "why", type: "string[]", description: "Why paragraphs: the behavioral, cognitive, or ergonomic rationale" },
      { name: "tradeoff", type: "string[]", description: "Trade-off paragraphs: honest acknowledgment of risks and tension" },
      { name: "placeholderTitle", type: "string", description: "Product evidence visual title banner" },
      { name: "cards", type: "array of {title, body}", description: "2–3 cards underneath visual summarizing impact or mechanism" },
      { name: "image / video", type: "asset", description: "High-resolution prototype screen or video clip demonstrating the decision" },
    ],
    copyRules: [
      "The subheading must state the trade-off or pivot: 'We chose X over Y because Z.'",
      "Always include either why or tradeoff; a decision without a tradeoff signals a lack of senior realism.",
      "Keep decisionPoints concise: a bold title + a 1–2 sentence description of the tactile mechanism.",
    ],
    seniorSignalingTip:
      "Design leaders look for intentionality and trade-off awareness. This block is your highest ROI surface for signaling Senior / Staff design maturity.",
    sampleGroq: `caseStudy[_type == "decisionBlock"] {
  _type, _key, id, eyebrow, heading, subheading,
  context, decision, why, tradeoff,
  decisionPoints[]{ title, body },
  placeholderTitle, caption,
  cards[]{ _key, title, body },
  "image": image.asset->url, "video": video
}`,
    samplePayload: {
      _type: "decisionBlock",
      id: "sec-decision-01",
      eyebrow: "DESIGN DECISION 01",
      heading: "Making friction something you can feel",
      subheading: "We chose progressive friction over another screen-time warning.",
      context: ["Most interventions ask users to consciously dismiss an alert."],
      decision: ["We explored making the interaction itself change instead."],
      decisionPoints: [
        { title: "Haptic Friction", body: "Scrolling begins to feel heavier." },
        { title: "Visual Degradation", body: "The interface gradually loses visual intensity." },
        { title: "Audio Grounding", body: "Chaotic audio gives way to calmer grounding feedback." },
      ],
      why: ["It creates a progression: subtle → noticeable → difficult to ignore."],
      cards: [
        { title: "Haptic friction", body: "Makes continued scrolling physically noticeable." },
        { title: "Visual degradation", body: "Makes rising overstimulation visually legible." },
      ],
    },
  },
  {
    type: "featureBlock",
    name: "Feature Block",
    badge: "04 — System Breakdown",
    narrativePhase: "Act 3: Solution Architecture & Feature Matrix",
    purpose:
      "Presents a suite of related capabilities or interventions with numbered badge indicators, media demos, and concise explanatory copy.",
    bestFor: [
      "Explaining a multi-tier product suite (e.g. On-device tracking, Recovery mode, Ambient alerts)",
      "Breaking down multi-platform interactions (iOS App, WatchOS Glance, Dynamic Island)",
      "Step-by-step feature tours where each step has dedicated media",
    ],
    neverUseFor: [
      "A raw bullet list with no media or visual distinction",
      "Deep behavioral decisions where you need context/why/trade-off (use decisionBlock)",
    ],
    keyFields: [
      { name: "id", type: "string", description: "Anchor link identifier", example: "sec-features" },
      { name: "eyebrow", type: "string", description: "Header tag", example: "CORE CAPABILITIES" },
      { name: "heading", type: "string", description: "Section headline", example: "An attention system distributed across everyday touchpoints." },
      { name: "body", type: "string[]", description: "Intro paragraphs setting up the feature set" },
      {
        name: "features",
        type: "array",
        description: "List of items: { number, title, body, mediaType, image, video, placeholderTitle, caption, borderless }",
      },
    ],
    copyRules: [
      "Each feature item should have a clear numbered indicator (e.g. 'FEATURE 01' or '01').",
      "Keep feature descriptions focused on user benefit rather than purely mechanical implementation details.",
    ],
    seniorSignalingTip:
      "Highlight how individual features interconnect into a unified system rather than feeling like a disconnected laundry list.",
    sampleGroq: `caseStudy[_type == "featureBlock"] {
  _type, _key, id, eyebrow, heading, body,
  features[]{
    _key, number, title, body,
    mediaType, placeholderTitle, caption,
    "image": image.asset->url, "video": video
  }
}`,
    samplePayload: {
      _type: "featureBlock",
      id: "sec-features",
      eyebrow: "ECOSYSTEM TOUCHPOINTS",
      heading: "Meeting the user across phone, watch, and glanceable surfaces.",
      features: [
        {
          number: "01",
          title: "In-App Tactile Scroll",
          body: "Progressive damping algorithm that calculates kinetic resistance.",
          placeholderTitle: "HAPTIC RESISTANCE ENGINE DEMO",
        },
      ],
    },
  },
  {
    type: "figmaEmbed",
    name: "Figma Embed",
    badge: "05 — Interactive Sandbox",
    narrativePhase: "Act 3–4: Hands-On Inspection & Craft Proof",
    purpose:
      "Embeds live, clickable Figma prototypes or design system canvasses directly into the editorial page, with aspect ratio control and design notes.",
    bestFor: [
      "Letting hiring managers interact with real Protopie or Figma prototype flows",
      "Displaying full component design systems with auto-layout variants and state matrices",
      "Demonstrating micro-interaction physics without needing a code sandbox",
    ],
    neverUseFor: [
      "Static single-frame screenshots (use mediaBlock for faster loading & crisp display)",
      "Password-protected or private enterprise Figma files that won't load for external reviewers",
    ],
    keyFields: [
      { name: "id", type: "string", description: "Anchor link identifier", example: "sec-figma-prototype" },
      { name: "eyebrow", type: "string", description: "Tag line", example: "FIGMA LIVE PROTOTYPE" },
      { name: "title", type: "string", description: "Section title", example: "Explore the live interaction model" },
      { name: "figmaUrl", type: "url", required: true, description: "Figma design or prototype sharing URL (e.g. https://www.figma.com/proto/...)", example: "https://www.figma.com/proto/..." },
      { name: "caption", type: "string", description: "Guidance on how to interact or what hotspot flows to test" },
      { name: "size", type: "'normal' | 'wide' | 'full'", description: "Display width tier" },
      { name: "aspectRatio", type: "'16/10' | '16/9' | '4/3' | '1/1'", description: "Frame aspect ratio preset" },
    ],
    copyRules: [
      "In the caption, tell the reviewer which user flow to test (e.g. 'Click the notification pill to simulate rising screen friction').",
      "Always verify the Figma file sharing permissions are set to 'Anyone with the link can view'.",
    ],
    seniorSignalingTip:
      "A live prototype proves you build and validate real interactions rather than just presenting polished static mockups.",
    sampleGroq: `caseStudy[_type == "figmaEmbed"] {
  _type, _key, id, eyebrow, title,
  figmaUrl, caption, size, aspectRatio
}`,
    samplePayload: {
      _type: "figmaEmbed",
      id: "sec-figma-prototype",
      eyebrow: "INTERACTIVE PROTOTYPE",
      title: "Tactile Friction & Audio Model in Protopie / Figma",
      figmaUrl: "https://www.figma.com/proto/sample",
      caption: "Press and hold the primary card to trigger the multi-tier overstimulation feedback.",
      size: "wide",
      aspectRatio: "16/10",
    },
  },
  {
    type: "comparisonBlock",
    name: "Comparison Block",
    badge: "06 — Before / After Contrast",
    narrativePhase: "Act 2: The Transformation / Redesign Evaluation",
    purpose:
      "Highlights dramatic transformations, showing the legacy baseline vs the refined outcome with synchronized before/after media and labels.",
    bestFor: [
      "Showing 'Before' (standard iOS screen time alert) vs 'After' (tactile progressive friction)",
      "Redesign projects showing messy legacy architecture vs streamlined new flow",
      "Information architecture before vs after card-sorting & testing",
    ],
    neverUseFor: [
      "Showing two completely unrelated screens that aren't a direct before/after pair",
      "Showing single images without a baseline comparison",
    ],
    keyFields: [
      { name: "id", type: "string", description: "Anchor link identifier", example: "sec-before-after" },
      { name: "eyebrow", type: "string", description: "Header tag", example: "THE INTERVENTION SHIFT" },
      { name: "heading", type: "string", description: "Comparative headline", example: "From ignorable notification dialogs to physical friction." },
      { name: "body", type: "string[]", description: "Paragraphs explaining the transformation metrics or user test results" },
      { name: "beforeLabel", type: "string", description: "Label above before asset", example: "Standard iOS Dialog" },
      { name: "beforeMedia", type: "image", description: "Before image asset" },
      { name: "afterLabel", type: "string", description: "Label above after asset", example: "Clarity Tactile Damping" },
      { name: "afterMedia", type: "image", description: "After image asset" },
      { name: "placeholderTitle", type: "string", description: "Wireframe title if assets are loading" },
      { name: "caption", type: "string", description: "Summary caption explaining what measurable change occurred" },
    ],
    copyRules: [
      "Keep beforeLabel and afterLabel short (1–3 words).",
      "Ensure both before and after assets share identical dimensions and framing for clean visual comparison.",
    ],
    seniorSignalingTip:
      "A clear before/after instantly grounds your case study in measurable impact and avoids subjective ambiguity.",
    sampleGroq: `caseStudy[_type == "comparisonBlock"] {
  _type, _key, id, eyebrow, heading, body,
  beforeLabel, afterLabel, placeholderTitle, caption,
  "beforeMedia": beforeMedia.asset->url,
  "afterMedia": afterMedia.asset->url
}`,
    samplePayload: {
      _type: "comparisonBlock",
      id: "sec-comparison",
      eyebrow: "INTERVENTION COMPARISON",
      heading: "From ignorable popups to physical scroll resistance.",
      beforeLabel: "Traditional Alert",
      afterLabel: "Clarity Damping",
      caption: "Users dismissed standard alerts in 0.8s, whereas tactile friction prompted intentional pause in 84% of sessions.",
    },
  },
  {
    type: "reflectionBlock",
    name: "Reflection Block",
    badge: "07 — Honest Critique & Learnings",
    narrativePhase: "Act 5: Retrospective, Unanswered Questions, Next Steps",
    purpose:
      "Ends the case study on an authentic, self-aware note. Breaks down what questions the concept raised, where assumptions need testing, and what you'd explore next.",
    bestFor: [
      "Case study closing section (05 — RETROSPECTIVE)",
      "Addressing the hard questions a design director will ask in an interview",
      "Acknowledging ethical implications, edge cases, and accessibility trade-offs",
      "Listing 3 distinct forward-looking research or technical investigations",
    ],
    neverUseFor: [
      "Generic platitudes like 'I learned Figma is great and teamwork is important'",
      "Boasting about 100% perfection with zero open questions or flaws",
    ],
    keyFields: [
      { name: "id", type: "string", description: "Anchor link identifier", example: "sec-retrospective" },
      { name: "eyebrow", type: "string", description: "Retrospective tag", example: "05 — RETROSPECTIVE" },
      { name: "heading", type: "string", description: "Closing statement", example: "The concept raised harder questions than the prototype answered." },
      { name: "body", type: "string[]", description: "Introductory retrospective paragraphs acknowledging context (e.g. hackathon pace vs production rigor)" },
      {
        name: "items",
        type: "array",
        description: "List of numbered points: { number (e.g. '01'), heading (e.g. 'Can subjective feeling be scored?'), body (critique paragraph) }",
      },
    ],
    copyRules: [
      "Each reflection item heading should be phrased as an intellectually rigorous question or critique.",
      "Acknowledge the boundary between prototype fiction and production reality.",
      "Limit to 3 punchy, substantive reflection points.",
    ],
    seniorSignalingTip:
      "Hiring managers universally praise candidates who demonstrate intellectual humility and sharp self-critique over defensive perfectionism.",
    sampleGroq: `caseStudy[_type == "reflectionBlock"] {
  _type, _key, id, eyebrow, heading, body,
  items[]{
    _key, number, heading, body
  }
}`,
    samplePayload: {
      _type: "reflectionBlock",
      id: "sec-retrospective",
      eyebrow: "05 — RETROSPECTIVE",
      heading: "The concept raised harder questions than the prototype answered.",
      body: [
        "Clarity was built as a hackathon concept, which meant we could explore an ambitious interaction quickly—but many assumptions still need critique.",
      ],
      items: [
        {
          number: "01",
          heading: "Can something as subjective as 'brain rot' be represented as a score?",
          body: "The concept depends on translating a fuzzy cognitive state into something legible. I'd want to test whether this feels useful or overly reductive.",
        },
        {
          number: "02",
          heading: "When does helpful friction become annoying?",
          body: "The intervention has to interrupt automatic behavior without making ordinary phone use frustrating.",
        },
      ],
    },
  },
];
