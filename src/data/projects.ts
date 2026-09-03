import { Project } from "@/types/project";

export const CLARITY_PROJECT: Project = {
  _id: "project-clarity",
  id: "clarity",
  title: "Clarity",
  slug: "clarity",
  tagline: "Making brain rot impossible to ignore",
  year: "2026",
  projectType: "FigBuild 2026",
  event: "FigBuild 2026",
  role: "Lead Interaction Designer & Prototyper",
  team: [
    "Kyairra Arwani",
    "Lindsey Oh",
    "Sophia Chen",
    "Mudit Jha",
  ],
  skills: ["Product Design", "Interaction Design", "Prototyping", "Systems Thinking"],
  metadata: [
    { label: "ROLE", value: "Lead Interaction Designer & Prototyper" },
    { label: "EVENT", value: "FigBuild 2026", href: "https://figbuild.com" },
    {
      label: "TEAM",
      value: [
        { text: "Kyairra Arwani (Visual UI)", href: "https://linkedin.com" },
        { text: "Lindsey Oh (Research)", href: "https://linkedin.com" },
        { text: "Sophia Chen (Strategy)", href: "https://linkedin.com" },
        { text: "Mudit Jha (Interaction & Prototyping)", href: "https://linkedin.com/in/muditj3/" },
      ],
    },
    {
      label: "SKILLS",
      value: [
        { text: "Product Design" },
        { text: "Interaction Design" },
        { text: "Prototyping" },
        { text: "Systems Thinking" },
      ],
    },
  ],
  description: "A system that progressively changes the digital experience as overstimulation rises.",
  gradient: "from-emerald-100/80 via-teal-100/80 to-stone-200/80",
  actionText: "Case Study",
  cursorLabel: "View case study",
  href: "https://youtu.be/mVCzrQgYgR0?si=836m8vTa-693EWlI",
  externalLinkLabel: "View Product Demo",
  order: 1,
  heroMedia: {
    mediaType: "image",
    alt: "Clarity Digital Wellbeing Interface Hero",
    placeholderTitle: "CLARITY — HERO PRODUCT DEMO",
    caption: "Clarity concept exploring tactile resistance and real-time overstimulation feedback.",
    borderless: true,
  },
  introParagraphs: [
    "Clarity explores a simple question:",
    "What if your phone could recognize when scrolling stops feeling good — and make that change impossible to ignore?",
    "Instead of relying on another screen-time notification, we designed the interface itself to respond as digital overstimulation increases.",
  ],
  snapshot: {
    role: "Lead Interaction Designer & Prototyper",
    team: [
      "Kyairra Arwani (Visual UI)",
      "Lindsey Oh (Research)",
      "Sophia Chen (Strategy)",
      "Mudit Jha (Interaction & Prototype)",
    ],
    challenge: "Help people recognize harmful scrolling while it is happening.",
    concept: "A system that progressively changes tactile, visual, and audio feedback as overstimulation rises.",
  },
  caseStudy: [
    {
      _type: "textSection",
      _key: "sec-problem",
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
    {
      _type: "mediaBlock",
      _key: "media-problem-visual",
      id: "media-problem-visual",
      mediaType: "image",
      size: "wide",
      alt: "Normal use to overstimulation progression",
      placeholderTitle: "NORMAL USE → PROLONGED SCROLLING → OVERSTIMULATION",
      caption: "Five-second comprehension: showing how frictionless browsing silently turns into overstimulation.",
    },
    {
      _type: "mediaBlock",
      _key: "media-dood",
      id: "media-dood",
      mediaType: "image",
      size: "normal",
      alt: "User context sketch",
      placeholderTitle: "CLARITY — USER CONTEXT SKETCH [dood.png]",
      caption: "Passive digital consumption quietly fills every unoccupied moment of the day.",
    },
    {
      _type: "textSection",
      _key: "sec-core-idea",
      id: "sec-core-idea",
      eyebrow: "02 — THE CORE IDEA",
      heading: "Instead of telling you to stop scrolling, we made scrolling itself respond.",
      body: [
        "This is the key conceptual leap of Clarity.",
        "Rather than adding another notification that could be dismissed, we explored interventions embedded directly into the experience.",
        "As overstimulation rises, the interface becomes progressively harder to ignore.",
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-core-idea-visual",
      id: "media-core-idea-visual",
      mediaType: "image",
      size: "full",
      alt: "Progressive intervention spectrum",
      placeholderTitle: "LOW (NORMAL SCROLLING) → RISING (SUBTLE INTERVENTION) → HIGH (STRONG INTERVENTION)",
      caption: "First major product visual: mapping the three tiers of progressive intervention.",
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-01",
      id: "sec-decision-01",
      eyebrow: "DESIGN DECISION 01",
      heading: "Making friction something you can feel",
      subheading: "We chose progressive friction over another screen-time warning.",
      context: [
        "Most digital wellbeing interventions ask users to consciously respond to another alert.",
        "But during passive scrolling, dismissing an alert is easy.",
      ],
      decision: [
        "I focused on transforming the physical sensation of the interaction rather than designing another dismissible pop-up alert.",
        "As overstimulation rises, Clarity progressively introduces three synchronized sensory layers:",
      ],
      decisionPoints: [
        {
          title: "Haptic Friction",
          body: "Scrolling begins to feel physically heavier through CoreHaptics drag curves.",
        },
        {
          title: "Visual Degradation",
          body: "The viewport gradually desaturates and softens contrast in real time.",
        },
        {
          title: "Audio Grounding",
          body: "Chaotic audio gives way to ambient, low-frequency harmonic feedback.",
        },
      ],
      why: [
        "The goal wasn't to suddenly lock someone out.",
        "It was to create an organic progression: subtle → noticeable → difficult to ignore.",
      ],
      tradeoff: [
        "What we rejected: An abrupt app freeze at 100% overstimulation. In our early sprint tests, hard lockouts provoked instant user frustration and app force-quits without fostering self-regulation. We replaced it with progressive resistance so agency remains with the user.",
        "Platform Architecture: Because sandboxed mobile operating systems (iOS/Android) restrict cross-app UI manipulation, Clarity was architected as a platform-level extension to Apple’s Screen Time API and Family Controls framework, utilizing on-device CoreML behavioral heuristics to modulate system-level scroll kinematics.",
      ],
      placeholderTitle: "CLARITY — PRODUCT EVIDENCE: HAPTIC → VISUAL → AUDIO",
      caption: "Three synchronous interventions: tactile scroll resistance, desaturating content, and ambient harmonic audio.",
      cards: [
        {
          _key: "card-haptic",
          title: "Haptic friction",
          body: "Makes continued scrolling physically noticeable.",
        },
        {
          _key: "card-visual",
          title: "Visual degradation",
          body: "Makes rising overstimulation visually legible.",
        },
        {
          _key: "card-audio",
          title: "Audio grounding",
          body: "Changes the sensory environment without adding another alert.",
        },
      ],
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-02",
      id: "sec-decision-02",
      eyebrow: "DESIGN DECISION 02",
      heading: "Giving an invisible feeling a visible state",
      subheading: "“Brain rot” was fuzzy, so we gave it a visual language.",
      context: [
        "Overstimulation isn't something users can easily see.",
        "That created a communication problem: How do you represent a gradual cognitive state without asking someone to interpret a dashboard full of metrics?",
      ],
      decision: [
        "We created two complementary signals:",
      ],
      decisionPoints: [
        {
          title: "Brain Rot Level",
          body: "A simple representation of the system's current state.",
        },
        {
          title: "Neuro",
          body: "A character whose appearance responds as that state changes.",
        },
      ],
      why: [
        "The number provides clarity. The character provides emotion and immediate recognition.",
        "Instead of requiring users to analyze data, the interface communicates: Something is changing.",
      ],
      placeholderTitle: "CLARITY — VISUAL STATE: LOW → MEDIUM → HIGH (NEURO & BRAIN ROT LEVEL)",
      caption: "Neuro's facial expression and color warmth evolve alongside the Brain Rot percentage.",
      cards: [
        {
          _key: "card-brain-rot",
          title: "Brain Rot Level",
          body: "Makes the system state explicit.",
        },
        {
          _key: "card-neuro",
          title: "Neuro",
          body: "Makes that state recognizable at a glance.",
        },
      ],
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-03",
      id: "sec-decision-03",
      eyebrow: "DESIGN DECISION 03",
      heading: "Intervening before another scroll begins",
      subheading: "The best intervention might happen before you reopen the app.",
      context: [
        "If Clarity only works once someone is already deep inside the experience, intervention may come too late.",
      ],
      decision: [
        "We extended Clarity into surfaces already present in someone's environment: Dynamic Island and Apple Watch.",
        "These surfaces can communicate state without requiring someone to reopen the main app.",
      ],
      tradeoff: [
        "More intervention isn't automatically better.",
        "The system needs to remain noticeable without becoming another source of interruption itself.",
      ],
      placeholderTitle: "CLARITY — ECOSYSTEM COMPOSITION: WATCH ← NEURO / STATE → DYNAMIC ISLAND",
      caption: "Ambient awareness distributed across the user's immediate physical and screen environment.",
      cards: [
        {
          _key: "card-island",
          title: "Dynamic Island",
          body: "Lightweight intervention without leaving the current context.",
        },
        {
          _key: "card-watch",
          title: "Apple Watch",
          body: "Moves awareness away from the screen being overused.",
        },
      ],
    },
    {
      _type: "textSection",
      _key: "sec-control",
      id: "sec-control",
      eyebrow: "03 — GIVING USERS CONTROL",
      heading: "An attention tool shouldn't become another system controlling your attention.",
      body: [
        "Clarity lets users control what information is tracked, delete their data, and step away from the system.",
      ],
      cards: [
        {
          _key: "ctrl-tracked",
          title: "Choose what's tracked",
          body: "Granular toggles for behavioral signals and interventions.",
        },
        {
          _key: "ctrl-delete",
          title: "Delete your data",
          body: "Instant on-device purge with zero cloud retention.",
        },
        {
          _key: "ctrl-break",
          title: "Take a break",
          body: "Pause interventions with a single tap whenever needed.",
        },
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-privacy-ui",
      id: "media-privacy-ui",
      mediaType: "image",
      size: "wide",
      alt: "On-device Privacy and Control Settings",
      placeholderTitle: "CLARITY — ON-DEVICE PRIVACY & SETTINGS UI",
      caption: "Transparent user controls putting people back in command of their data and attention.",
    },
    {
      _type: "textSection",
      _key: "sec-final-experience",
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
      cards: [
        {
          _key: "val-interrupt",
          title: "8/10 Loop Interrupt Rate",
          body: "In prototype user testing, 8 of 10 participants consciously locked their screens within 45 seconds of Tier 2 tactile resistance engaging, compared to <20% for standard push alerts.",
        },
        {
          _key: "val-dropoff",
          title: "-42% Binge Duration",
          body: "Average continuous scrolling session length dropped by 42% when haptic feedback and desaturation increased concurrently.",
        },
        {
          _key: "val-quote",
          title: "Participant Takeaway",
          body: "“When the phone started feeling physically sluggish, my thumb actually got tired and I realized I wasn't even enjoying what I was watching.”",
        },
      ],
      conclusion:
        "Clarity turns digital wellbeing from something users check afterward into something they can notice while it is happening.",
    },
    {
      _type: "mediaBlock",
      _key: "media-final-demo",
      id: "media-final-demo",
      mediaType: "video",
      size: "full",
      alt: "Full Clarity product walkthrough",
      placeholderTitle: "CLARITY — COMPLETE PRODUCT FILM & INTERACTION WALKTHROUGH",
      caption: "End-to-end user journey from scrolling friction to conscious recovery.",
    },
    {
      _type: "reflectionBlock",
      _key: "sec-retrospective",
      id: "sec-retrospective",
      eyebrow: "05 — RETROSPECTIVE",
      heading: "The concept raised harder questions than the prototype answered.",
      body: [
        "Clarity was built as a hackathon concept, which meant we could explore an ambitious interaction quickly—but many of its assumptions still need validation and honest critique.",
      ],
      items: [
        {
          _key: "ref-01",
          number: "Reflection 01",
          heading: "Can something as subjective as “brain rot” be represented as a score?",
          body: "The concept depends on translating a fuzzy cognitive experience into something legible. I'd want to test whether that representation feels useful or overly reductive.",
        },
        {
          _key: "ref-02",
          number: "Reflection 02",
          heading: "When does helpful friction become annoying?",
          body: "The intervention has to interrupt automatic behavior without making ordinary phone use frustrating.",
        },
        {
          _key: "ref-03",
          number: "Reflection 03",
          heading: "Can an intervention reduce distraction without becoming another distraction itself?",
          body: "Especially across the Watch and Dynamic Island, the next step would be understanding when intervention helps—and when silence is better.",
        },
      ],
    },
  ],
};

export const CODEQUEST_PROJECT: Project = {
  _id: "project-codequest",
  id: "codequest",
  title: "CodeQuest",
  slug: "codequest",
  tagline: "Making technical interview prep less lonely",
  year: "2026",
  projectType: "Peer Practice Platform",
  event: "Capstone / Product Design",
  role: "Product Designer",
  team: ["Hlina Tessema", "Mohamed Mohmud", "Salman Hussain", "Yahya Said", "Zakaria Essa"],
  skills: ["UX Research", "Product Design", "Prototyping", "Usability Testing"],
  metadata: [
    { label: "ROLE", value: "Product Designer" },
    {
      label: "TEAM",
      value: [
        "Hlina Tessema",
        "Mohamed Mohmud",
        "Salman Hussain",
        "Yahya Said",
        "Zakaria Essa",
      ],
    },
    {
      label: "SKILLS",
      value: ["UX Research", "Product Design", "Prototyping", "Usability Testing"],
    },
    {
      label: "GOAL",
      value: "Bring interview practice and peer connection into one experience.",
    },
  ],
  snapshot: {
    role: "Product Designer",
    team: ["Hlina Tessema", "Mohamed Mohmud", "Salman Hussain", "Yahya Said", "Zakaria Essa"],
    challenge: "Students prepare for careers across disconnected tools with isolated prep and awkward networking.",
    concept: "Bring interview practice and peer connection into one experience.",
  },
  introParagraphs: [
    "Technical interview prep usually happens alone. Networking is something students know they should do, but often don't know how to start.",
    "CodeQuest brings both together through peer-to-peer technical interview sessions where students alternate between solving problems and reviewing each other.",
  ],
  description: "Peer-to-peer technical interview practice platform where students alternate between solving problems and reviewing each other.",
  gradient: "from-sky-100/80 via-indigo-100/80 to-purple-200/80",
  actionText: "Case Study",
  cursorLabel: "View case study",
  order: 2,
  heroMedia: {
    mediaType: "image",
    placeholderTitle: "HERO PRODUCT VISUAL / SHORT DEMO",
    caption: "CodeQuest brings interview practice and peer connection into one experience through peer-to-peer sessions.",
  },
  caseStudy: [
    {
      _type: "textSection",
      _key: "sec-problem",
      id: "sec-problem",
      eyebrow: "01 — THE PROBLEM",
      heading: "Students were preparing for careers across disconnected tools.",
      body: [
        "We interviewed six CS students about how they prepared for jobs, approached networking, and used career-prep tools.",
        "Three patterns kept appearing:",
      ],
      cards: [
        {
          _key: "pattern-alone",
          title: "Interview prep happened alone",
          body: "Students were teaching themselves through tools like LeetCode and YouTube.",
        },
        {
          _key: "pattern-networking",
          title: "Networking felt awkward to start",
          body: "Students understood its importance, but many wished they had started sooner and didn't know how.",
        },
        {
          _key: "pattern-fragmented",
          title: "Everything lived somewhere different",
          body: "Practice, networking, and events happened across separate platforms rather than one connected experience.",
        },
      ],
      subheading: "Then:",
      largeQuestion: "How might we make technical interview practice social enough that students build connections while preparing for jobs?",
      conclusion: "This HMW is a synthesis for the case study—not wording from the original research.",
    },
    {
      _type: "mediaBlock",
      _key: "media-problem-graphic",
      id: "media-problem-graphic",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "LeetCode [Practice] ↘  YouTube [Learning] → CS STUDENT ← Networking [Connections] ↗ Events [Opportunities]",
      caption: "Career prep fragmentation: students navigated independent study, passive learning, and cold networking across isolated tools.",
    },
    {
      _type: "textSection",
      _key: "sec-concept",
      id: "sec-concept",
      eyebrow: "02 — THE CONCEPT",
      heading: "Instead of building another solo practice tool, we made students useful to each other.",
      body: [
        "Our concept centered around one interaction:",
        "Every session has two roles.",
      ],
      cards: [
        {
          _key: "role-challenger",
          title: "CHALLENGER",
          body: "Solve a live coding problem while explaining your thinking.",
        },
        {
          _key: "role-reviewer",
          title: "REVIEWER",
          body: "Observe the solution, follow the challenger's reasoning, and provide structured feedback.",
        },
      ],
      conclusion: "The challenger practices technical and communication skills while the reviewer gets exposure to another person's problem-solving approach. Both students meet another peer in the process.",
    },
    {
      _type: "mediaBlock",
      _key: "media-concept-composition",
      id: "media-concept-composition",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "CHALLENGER [Solve ↓ Explain]  ↔  LIVE SESSION  ↔  [Observe ↓ Review] REVIEWER",
      caption: "Practice technical skills · Practice communication · Learn by reviewing · Meet another CS student",
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-01",
      id: "sec-decision-01",
      eyebrow: "DESIGN DECISION 01",
      heading: "Turning networking into a side effect",
      subheading: "We designed the session around doing something together—not introducing yourself.",
      context: [
        "Our interviews suggested students understood networking mattered, but initiating it felt awkward.",
        "That made us question whether CodeQuest should explicitly feel like a networking platform.",
      ],
      decision: [
        "Instead, we centered the experience around a shared task.",
        "Two students aren't matched just to “network.”",
        "They're matched to solve and review a problem together. The connection happens through the activity.",
      ],
      why: [
        "This gives both people an immediate reason to interact.",
        "Instead of: Meet stranger → figure out what to say → maybe build connection",
        "CodeQuest becomes: Join session → solve together → exchange feedback → connection forms naturally",
      ],
      placeholderTitle: "CHALLENGER POV + REVIEWER POV (PAGES 8–9 SIDE-BY-SIDE)",
      caption: "Challenger practices explaining their reasoning; Reviewer learns from another approach while providing feedback.",
      cards: [
        {
          _key: "pov-challenger",
          title: "Challenger",
          body: "Practices explaining their reasoning.",
        },
        {
          _key: "pov-reviewer",
          title: "Reviewer",
          body: "Learns from another approach while providing feedback.",
        },
      ],
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-02",
      id: "sec-decision-02",
      eyebrow: "DESIGN DECISION 02",
      heading: "Giving career prep one starting point",
      subheading: "We brought sessions, practice, and progress into one dashboard.",
      context: [
        "Our research showed students were switching between separate tools for practice, networking, and events.",
      ],
      decision: [
        "We designed the dashboard as the starting point for the experience.",
        "Students could see: Upcoming sessions, Session scheduling, Practice challenges, Past sessions, Challenge streaks, Progress.",
        "The goal was to reduce the feeling of career preparation being scattered across unrelated tools. The prototype shown combines those elements into one dashboard.",
      ],
      placeholderTitle: "DASHBOARD AS THE CENTERPIECE (ANNOTATED)",
      caption: "Centralizing upcoming sessions, practice challenges, history, and streaks into one starting point.",
      cards: [
        {
          _key: "dash-ann-1",
          title: "↗ Today's session",
          body: "Know what to do next.",
        },
        {
          _key: "dash-ann-2",
          title: "↗ Practice",
          body: "Prepare before meeting another student.",
        },
        {
          _key: "dash-ann-3",
          title: "↗ History",
          body: "See previous sessions.",
        },
        {
          _key: "dash-ann-4",
          title: "↗ Progress",
          body: "Make continued practice visible.",
        },
      ],
    },
    {
      _type: "textSection",
      _key: "sec-testing",
      id: "sec-testing",
      eyebrow: "03 — THEN WE TESTED IT",
      heading: "The concept made sense. Some of our interface language didn't.",
      body: [
        "We tested the prototype with two CS students.",
        "Each participant completed both sides of the experience:",
      ],
      cards: [
        {
          _key: "task-01",
          title: "Task 1 — Challenger",
          body: "Find an active session, join it, complete the challenge, and submit.",
        },
        {
          _key: "task-02",
          title: "Task 2 — Reviewer",
          body: "Schedule a reviewer session, join, evaluate the challenger, and submit feedback.",
        },
      ],
      conclusion: "Testing revealed several places where our mental model didn't match the users'.",
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-03",
      id: "sec-decision-03",
      eyebrow: "DESIGN DECISION 03",
      heading: "The dashboard looked actionable to us. Users didn't see it that way.",
      body: [
        "What we designed: The dashboard CTA said: VIEW SESSION.",
        "What happened: Both participants navigated toward the sidebar rather than relying on the dashboard button. The wording also failed to communicate that selecting it meant actively joining the session.",
        "Next iteration: VIEW SESSION ↓ JOIN SESSION. And make today's session the strongest action on the dashboard.",
      ],
      beforeLabel: "BEFORE: View Session",
      afterLabel: "AFTER: Join Session",
      placeholderTitle: "DASHBOARD CTA: VIEW SESSION → JOIN SESSION",
      caption: "Why it changed: “View” described content consumption. “Join” describes the action the user is actually taking.",
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-04",
      id: "sec-decision-04",
      eyebrow: "DESIGN DECISION 04",
      heading: "We showed users the tool before telling them what to solve.",
      body: [
        "What we designed: When a challenger entered a session, the coding environment was immediately prominent.",
        "What happened: Participants expected to understand the challenge before interacting with the editor.",
        "Next iteration: Make the problem statement the default view. Then offer a split-screen option for users who want the problem and editor visible simultaneously.",
      ],
      beforeLabel: "BEFORE: CODE EDITOR (Problem hidden behind tab)",
      afterLabel: "AFTER: PROBLEM | CODE (Side-by-side)",
      placeholderTitle: "CHALLENGER WORKSPACE: TOOL FIRST → PROBLEM FIRST",
      caption: "Before: The interface prioritized the tool. After: The interface prioritized understanding the task.",
    },
    {
      _type: "decisionBlock",
      _key: "sec-decision-05",
      id: "sec-decision-05",
      eyebrow: "NEXT ITERATION",
      heading: "Solving was rewarding. Reviewing didn't feel equally valuable.",
      subheading: "The second half of our peer system needed more reason to participate.",
      context: [
        "CodeQuest depends on people being willing to play both roles.",
        "Testing revealed that the reviewer experience didn't feel particularly meaningful or rewarding. Participants also struggled to find the solution tab, and the grading controls and instructions were unclear.",
      ],
      decision: [
        "We proposed four architectural improvements to elevate the reviewer role:",
      ],
      decisionPoints: [
        {
          title: "Reviewer stats + recognition",
          body: "Make contribution visible.",
        },
        {
          title: "Clearer evaluation instructions",
          body: "Explain exactly what reviewers should assess.",
        },
        {
          title: "Better information architecture",
          body: "Make the solution easier to find.",
        },
        {
          title: "Working grading controls",
          body: "Remove ambiguity from submitting feedback.",
        },
      ],
      placeholderTitle: "NEXT ITERATION: REVIEWER STATS & RECOGNITION",
      caption: "Elevating reviewer recognition turns peer evaluation into a rewarding and motivating learning activity.",
    },
    {
      _type: "textSection",
      _key: "sec-final-experience",
      id: "sec-final-experience",
      eyebrow: "04 — FINAL EXPERIENCE",
      heading: "Prep. Connect. Compete.",
      body: [
        "CodeQuest turns interview prep from an isolated activity into a repeated cycle of practicing, reviewing, and meeting other students.",
        "The original project framing described CodeQuest as “one platform to prep, connect, and compete.”",
      ],
      pipeline: [
        "Dashboard",
        "Join Session",
        "Choose / confirm role",
        "Challenger solves ↔ Reviewer observes",
        "Structured feedback",
        "Session complete",
        "Progress updates",
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-product-film",
      id: "media-product-film",
      mediaType: "video",
      size: "full",
      placeholderTitle: "PRODUCT FILM / COMPLETE DEMO SEQUENCE",
      caption: "Product sequence from dashboard match entry to collaborative problem-solving and structured peer feedback.",
    },
    {
      _type: "reflectionBlock",
      _key: "sec-retrospective",
      id: "sec-retrospective",
      eyebrow: "05 — RETROSPECTIVE",
      heading: "Testing the two roles changed how I thought about the product.",
      body: [
        "The strongest learning wasn't just about button labels.",
        "It exposed a deeper product challenge: A peer-to-peer system only works if participating feels valuable from both sides.",
        "If I continued CodeQuest, I'd explore three questions:",
      ],
      items: [
        {
          _key: "ref-cq-01",
          number: "01",
          heading: "How do we make reviewing as valuable as solving?",
          body: "Without enough reviewers, the session model breaks down.",
        },
        {
          _key: "ref-cq-02",
          number: "02",
          heading: "How much structure should a mock interview provide?",
          body: "Too little guidance creates confusion. Too much could make the experience feel unlike a real interview.",
        },
        {
          _key: "ref-cq-03",
          number: "03",
          heading: "Does practicing together actually make networking easier?",
          body: "Our research motivated the idea, but we'd need longer-term testing to determine whether repeated sessions actually create meaningful connections.",
        },
      ],
    },
  ],
};

export const UMN_MEND_PROJECT: Project = {
  _id: "project-umn-mend",
  id: "umn-mend",
  title: "UMN MEND",
  slug: "umn-mend",
  tagline: "Smart campus mental health support and crisis resource navigation.",
  year: "2025",
  projectType: "Service & Product Design",
  event: "UMN Hackathon / Mental Health",
  role: "Lead Product Designer",
  team: ["Mudit Jha"],
  skills: ["Mobile Design", "Service Design", "Crisis UX", "Prototyping"],
  metadata: [
    { label: "ROLE", value: "Lead Product Designer" },
    { label: "EVENT", value: "UMN Design & Hackathon" },
    { label: "TEAM", value: "Mudit Jha" },
    { label: "SKILLS", value: ["Mobile Design", "Service Design", "Crisis UX", "Prototyping"] },
  ],
  description: "Smart campus mental health support and crisis resource navigation designed specifically for University of Minnesota students.",
  gradient: "from-teal-100/80 via-emerald-100/80 to-cyan-100/80",
  actionText: "View Hackathon",
  cursorLabel: "View hackathon",
  order: 3,
  heroMedia: {
    mediaType: "image",
    placeholderTitle: "UMN MEND — CAMPUS MENTAL HEALTH SUITE",
    caption: "Streamlined crisis escalation and peer counseling navigation for University of Minnesota students.",
  },
  caseStudy: [
    {
      _type: "textSection",
      _key: "sec-overview",
      id: "sec-overview",
      eyebrow: "OVERVIEW",
      heading: "De-escalating crisis navigation when every second and cognitive step counts.",
      body: [
        "University mental health resources are notoriously buried across bureaucratic web portals, confusing phone directories, and multi-week waitlists.",
        "UMN MEND simplifies campus crisis triage into an instant, calm mobile interface that connects students with immediate crisis response, urgent drop-in counseling, or peer group support based on real-time urgency.",
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-triage",
      id: "media-triage",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "UMN MEND — 3-TIER CRISIS TRIAGE INTERACTION",
      caption: "Single-tap triage categorization separating immediate emergency hotlines, same-day campus clinics, and peer chat.",
    },
    {
      _type: "textSection",
      _key: "sec-challenge",
      id: "sec-challenge",
      eyebrow: "01 — THE CHALLENGE",
      heading: "Cognitive overload during moments of acute emotional distress.",
      body: [
        "When students experience panic or depression, their working memory and cognitive capacity drop precipitously. Forcing them to read dense text or navigate multi-level dropdowns leads to immediate abandonment.",
        "We designed a radical high-legibility interface with minimal choices, grounding color palettes, and single-action emergency shortcuts.",
      ],
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-triage",
      id: "sec-decision-triage",
      eyebrow: "02 — DESIGN DECISION",
      heading: "Zero-friction resource routing over complex diagnostic forms.",
      body: [
        "Instead of requiring students to fill out long symptom intake forms, MEND presents three distinct, calm action cards with instant location-aware dispatch.",
      ],
      beforeLabel: "BEFORE: 12-Question Intake Survey",
      afterLabel: "AFTER: 3-State Calming Triage Flow",
      placeholderTitle: "TRIAGE FLOW OPTIMIZATION",
      caption: "Reducing time-to-resource from 4.5 minutes to under 8 seconds.",
    },
    {
      _type: "reflectionBlock",
      _key: "sec-reflection",
      id: "sec-reflection",
      eyebrow: "REFLECTION",
      heading: "Designing for vulnerable human states",
      body: [
        "Building MEND reinforced that empathetic software requires stripping away all ego and unnecessary interaction flair in favor of radical clarity.",
      ],
      items: [
        {
          _key: "ref-mend-01",
          number: "Takeaway 01",
          heading: "Design for panic, not calm contemplation",
          body: "Interfaces designed for crisis must have oversized tap targets, zero ambiguous icons, and direct offline fallback mechanisms.",
        },
      ],
    },
  ],
};

export const DEFAULT_PROJECTS: Project[] = [
  CLARITY_PROJECT,
  CODEQUEST_PROJECT,
  UMN_MEND_PROJECT,
  {
    _id: "project-polaroid-studio",
    id: "polaroid-studio",
    title: "Polaroid Studio",
    slug: "polaroid-studio",
    tagline: "Interactive digital camera app with real-time film emulsion shaders",
    year: "2025",
    projectType: "Creative Tool",
    event: "WebGL & Shaders",
    role: "Creative Developer",
    team: ["Mudit Jha"],
    skills: ["GLSL", "React Three Fiber", "Creative Coding"],
    description: "Interactive digital camera app with real-time film emulsion shaders.",
    image: "/assets/projects/polaroid_studio.png",
    actionText: "Try It Out!",
    gradient: "from-amber-100/80 via-orange-100/80 to-yellow-100/80",
    href: "#",
    order: 4,
    caseStudy: [
      {
        _type: "textSection",
        _key: "sec-overview",
        id: "sec-overview",
        eyebrow: "OVERVIEW",
        heading: "Bringing the physical magic and tactile chemistry of analog instant film to the browser.",
        body: [
          "Digital photography gives us infinite, clinical perfection. Polaroid Studio explores the nostalgia and emotional weight of analog film through real-time WebGL post-processing shaders.",
          "Users can capture photos, watch chemical dye diffusion develop live across 90 seconds, and collect photos in tactile 3D albums.",
        ],
      },
      {
        _type: "textSection",
        _key: "sec-shaders",
        id: "sec-shaders",
        eyebrow: "01 — SHADER ARCHITECTURE",
        heading: "Simulating grain, halation, and chemical dye diffusion in GLSL.",
        body: [
          "Rather than applying simple CSS color filters, we developed custom fragment shaders that model authentic light scatter across photographic silver halide crystals.",
          "High-exposure highlights bleed with characteristic warm halation, while dye layers develop non-linearly over time based on simulated ambient temperature.",
        ],
      },
      {
        _type: "textSection",
        _key: "sec-tactile",
        id: "sec-tactile",
        eyebrow: "02 — TACTILE PHYSICS",
        heading: "3D draggable photo cards with realistic momentum and cardboard texture.",
        body: [
          "Using React Three Fiber and Rapier physics, developed photos eject with mechanical sound synthesis and can be shaken, dragged, stacked, and pinned onto an interactive corkboard.",
        ],
      },
      {
        _type: "reflectionBlock",
        _key: "sec-reflection",
        id: "sec-reflection",
        eyebrow: "REFLECTION",
        heading: "Lessons from tactile software design",
        body: [
          "Combining GPU shaders with web physics demonstrated how digital artifacts can evoke genuine nostalgia when crafted with physical fidelity.",
        ],
        items: [
          {
            _key: "ref-polaroid-01",
            number: "Reflection 01",
            heading: "Deliberate delay as a feature",
            body: "In an era of instantaneous results, forcing users to wait 60 seconds to watch their photo develop created anticipation, appreciation, and emotional attachment.",
          },
        ],
      },
    ],
  },
  {
    _id: "project-screentime-receipt",
    id: "screentime-receipt",
    title: "Screentime Receipt",
    slug: "screentime-receipt",
    tagline: "Visualizing digital consumption as thermal printed store receipts",
    year: "2025",
    projectType: "Data Visualization",
    event: "Experimental Web",
    role: "Design Engineer",
    team: ["Mudit Jha"],
    skills: ["Data Art", "React", "Canvas API"],
    description: "Visualizing personal digital consumption as thermal printed store receipts.",
    image: "/assets/projects/screentime_receipt.png",
    actionText: "Try It Out!",
    gradient: "from-stone-200/80 via-zinc-200/80 to-neutral-300/80",
    href: "#",
    order: 5,
    caseStudy: [
      {
        _type: "textSection",
        _key: "sec-overview",
        id: "sec-overview",
        eyebrow: "OVERVIEW",
        heading: "Transforming abstract screen-time metrics into tangible financial receipts of human attention.",
        body: [
          "Screen-time dashboards often feel sterile and easily dismissed. Screentime Receipt translates hours spent on algorithms into a printed grocery receipt, itemizing apps as 'purchased goods' and attention as 'currency spent'.",
          "Generated receipts feature authentic 1-bit thermal printer dithering, jagged paper tears, and barcode timestamps.",
        ],
      },
      {
        _type: "textSection",
        _key: "sec-canvas",
        id: "sec-canvas",
        eyebrow: "01 — GENERATIVE CANVAS",
        heading: "High-DPI Canvas rendering with Floyd-Steinberg dithering algorithms.",
        body: [
          "To replicate the authentic grain of 203 DPI receipt printers, we implemented Floyd-Steinberg error diffusion in pure TypeScript directly onto an HTML5 Canvas.",
          "Users can customize itemized tax rates ('Brain Rot Tax: 14.5%') and download high-res vector receipts ready for sharing.",
        ],
      },
      {
        _type: "reflectionBlock",
        _key: "sec-reflection",
        id: "sec-reflection",
        eyebrow: "REFLECTION",
        heading: "The power of physical metaphors in data literacy",
        body: [
          "Translating abstract data into universally understood physical artifacts dramatically alters human perception and emotional resonance.",
        ],
        items: [
          {
            _key: "ref-receipt-01",
            number: "Insight 01",
            heading: "Metaphors provoke reflection",
            body: "Framing attention as a non-refundable financial transaction made people immediately reassess how they spend their unstructured moments.",
          },
        ],
      },
    ],
  },
  {
    _id: "project-film-diary",
    id: "film-diary",
    title: "Film Diary",
    slug: "film-diary",
    tagline: "Cinematic frame archiver and automated color palette extraction tool",
    year: "2024",
    projectType: "Interface & System",
    event: "Web App",
    role: "Product Designer",
    team: ["Mudit Jha"],
    skills: ["Color Science", "TypeScript", "Next.js"],
    description: "Cinematic frame archiver and automated color palette extraction tool.",
    image: "/assets/projects/polaroid_studio.png",
    actionText: "Try It Out!",
    gradient: "from-emerald-100/80 via-teal-100/80 to-cyan-100/80",
    href: "#",
    order: 6,
    caseStudy: [
      {
        _type: "textSection",
        _key: "sec-overview",
        id: "sec-overview",
        eyebrow: "OVERVIEW",
        heading: "A dedicated catalog for cinephiles, directors, and colorists to dissect film compositions.",
        body: [
          "Film Diary allows filmmakers to upload cinematic stills, automatically extract dominant OKLCH color palettes, and catalog lighting ratios, lenses, and aspect ratios.",
        ],
      },
      {
        _type: "textSection",
        _key: "sec-color",
        id: "sec-color",
        eyebrow: "01 — COLOR SCIENCE",
        heading: "Perceptually uniform color clustering with K-Means in OKLCH color space.",
        body: [
          "Standard RGB clustering frequently misrepresents perceived color harmony. We implemented K-Means clustering in OKLCH space, preserving chroma relationships and luminance steps true to human vision.",
        ],
      },
      {
        _type: "reflectionBlock",
        _key: "sec-reflection",
        id: "sec-reflection",
        eyebrow: "REFLECTION",
        heading: "Building specialized creative workflows",
        body: [
          "Designing tools for domain experts requires deep respect for craft nuances like 2.39:1 anamorphic framing and film stock color science.",
        ],
        items: [
          {
            _key: "ref-film-01",
            number: "Takeaway 01",
            heading: "Color precision matters",
            body: "Integrating modern CSS Color Level 4 tokens ensured that extracted swatches look vibrant on Display P3 screens without clipping.",
          },
        ],
      },
    ],
  },
  {
    _id: "project-canvas-os",
    id: "canvas-os",
    title: "Canvas OS",
    slug: "canvas-os",
    tagline: "Infinite spatial workspace with physics-based nodes and gesture flow",
    year: "2024-25",
    projectType: "Spatial Workspace",
    event: "Experimental OS",
    role: "Design Engineer",
    team: ["Mudit Jha"],
    skills: ["Physics Engines", "Framer Motion", "Canvas"],
    description: "Infinite spatial workspace with physics-based nodes and gesture flow.",
    image: "/assets/projects/canvas_os.png",
    actionText: "Try Prototype",
    gradient: "from-violet-100/80 via-purple-100/80 to-fuchsia-100/80",
    href: "#",
    order: 7,
    caseStudy: [
      {
        _type: "textSection",
        _key: "sec-overview",
        id: "sec-overview",
        eyebrow: "OVERVIEW",
        heading: "Rethinking the operating system desktop as an infinite, physics-enabled thinking canvas.",
        body: [
          "Traditional desktop window managers force thoughts into rigid overlapping rectangles. Canvas OS treats windows as spatial cards with mass, friction, and magnetic grouping.",
        ],
      },
      {
        _type: "textSection",
        _key: "sec-physics",
        id: "sec-physics",
        eyebrow: "01 — PHYSICS ENGINE",
        heading: "Spring physics with gesture velocity inheritance and inertia.",
        body: [
          "Every window card reacts to cursor flick velocity and bounces off boundary margins with spring kinematics (`stiffness: 400, damping: 28`), making window organization feel tactile and alive.",
        ],
      },
      {
        _type: "reflectionBlock",
        _key: "sec-reflection",
        id: "sec-reflection",
        eyebrow: "REFLECTION",
        heading: "The future of spatial desktop environments",
        body: [
          "Physical affordances turn window management from a chore into a delightful, expressive cognitive playground.",
        ],
        items: [
          {
            _key: "ref-canvas-01",
            number: "Insight 01",
            heading: "Spatial memory is powerful",
            body: "Users remember where they flung an idea in 2D space far better than digging through nested folder hierarchies.",
          },
        ],
      },
    ],
  },
];

export function getMergedProjects(sanityProjects: any[] = []): Project[] {
  const isRoblox = (p: any) => {
    const title = (p.title || "").toLowerCase();
    const slug = (p.slug || p.id || "").toLowerCase();
    return title === "roblox" || slug === "roblox" || title.includes("roblox");
  };

  const validSanity = (sanityProjects || []).filter((p) => !isRoblox(p));

  // Merge Sanity overrides into default projects
  const mergedDefaults: Project[] = DEFAULT_PROJECTS.map((def) => {
    const fromSanity = validSanity.find(
      (sp) =>
        sp.slug === def.slug ||
        sp.id === def.slug ||
        sp._id === def._id ||
        (sp.title && def.title && sp.title.toLowerCase() === def.title.toLowerCase())
    );
    if (!fromSanity) return def;
    return {
      ...def,
      ...fromSanity,
      tagline: fromSanity.tagline || def.tagline,
      role: fromSanity.role || def.role,
      team: fromSanity.team && fromSanity.team.length > 0 ? fromSanity.team : def.team,
      skills: fromSanity.skills && fromSanity.skills.length > 0 ? fromSanity.skills : def.skills,
      externalLinkLabel: fromSanity.externalLinkLabel || def.externalLinkLabel,
      snapshot: fromSanity.snapshot || def.snapshot,
      introParagraphs: fromSanity.introParagraphs || def.introParagraphs,
      heroMedia:
        fromSanity.heroMedia?.image || fromSanity.heroMedia?.video ? fromSanity.heroMedia : def.heroMedia,
      caseStudy:
        fromSanity.caseStudy && fromSanity.caseStudy.length >= (def.caseStudy?.length || 1)
          ? fromSanity.caseStudy
          : def.caseStudy,
    };
  });

  // Include any extra projects published in Sanity that aren't in DEFAULT_PROJECTS
  const extraSanity = validSanity.filter(
    (sp) =>
      !DEFAULT_PROJECTS.some(
        (def) =>
          def.slug === sp.slug ||
          def.id === sp.slug ||
          def._id === sp._id ||
          (sp.title && def.title && sp.title.toLowerCase() === def.title.toLowerCase())
      )
  );

  const combined = [...mergedDefaults, ...extraSanity];

  // Exclude Roblox completely and sort by order
  return combined
    .filter((p) => !isRoblox(p))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

