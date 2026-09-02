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
  role: "Product Designer",
  team: ["Kyairra Arwani", "Lindsey Oh", "Sophia Chen"],
  skills: ["Product Design", "Interaction Design", "Prototyping"],
  metadata: [
    { label: "ROLE", value: "Product Designer" },
    { label: "EVENT", value: "FigBuild 2026", href: "https://figbuild.com" },
    {
      label: "TEAM",
      value: [
        { text: "Kyairra Arwani", href: "https://linkedin.com" },
        { text: "Lindsey Oh", href: "https://linkedin.com" },
        { text: "Sophia Chen", href: "https://linkedin.com" },
      ],
    },
    { label: "STACK", value: ["Figma", "SwiftUI", "Protopie"] },
  ],
  description: "A system that progressively changes the digital experience as overstimulation rises.",
  gradient: "from-emerald-100/80 via-teal-100/80 to-stone-200/80",
  actionText: "Case Study",
  cursorLabel: "View case study",
  order: 1,
  heroMedia: {
    mediaType: "image",
    alt: "Clarity Digital Wellbeing Interface Hero",
    placeholderTitle: "CLARITY — HERO PRODUCT DEMO",
    caption: "Clarity concept exploring tactile resistance and real-time overstimulation feedback.",
  },
  introParagraphs: [
    "Clarity explores a simple question:",
    "What if your phone could recognize when scrolling stops feeling good — and make that change impossible to ignore?",
    "Instead of relying on another screen-time notification, we designed the interface itself to respond as digital overstimulation increases.",
  ],
  snapshot: {
    role: "Product Designer",
    team: ["Kyairra Arwani", "Lindsey Oh", "Sophia Chen"],
    challenge: "Help people recognize harmful scrolling while it is happening.",
    concept: "A system that progressively changes the digital experience as overstimulation rises.",
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
        "We explored making the interaction itself change instead.",
        "As overstimulation rises, Clarity progressively introduces:",
      ],
      decisionPoints: [
        {
          title: "Haptic Friction",
          body: "Scrolling begins to feel heavier.",
        },
        {
          title: "Visual Degradation",
          body: "The interface gradually loses visual intensity.",
        },
        {
          title: "Audio Grounding",
          body: "Chaotic audio gives way to calmer grounding feedback.",
        },
      ],
      why: [
        "The goal wasn't to suddenly lock someone out.",
        "It was to create a progression: subtle → noticeable → difficult to ignore.",
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
  tagline: "Leveling up interview prep, together.",
  year: "2026",
  projectType: "Peer Practice Platform",
  event: "Capstone / Product Design",
  role: "Product Designer",
  team: ["Hlina Tessema", "Mohamed Mohmud", "Salman Hussain", "Yahya Said", "Zakaria Essa"],
  skills: ["UX Research", "Product Design", "Prototyping", "Usability Testing"],
  metadata: [
    { label: "ROLE", value: "Product Designer" },
    { label: "PROJECT", value: "CodeQuest Platform" },
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
  ],
  description: "Peer-to-peer technical interview practice platform connecting computer science students in complementary challenger and reviewer roles.",
  gradient: "from-sky-100/80 via-indigo-100/80 to-purple-200/80",
  actionText: "Case Study",
  cursorLabel: "View case study",
  order: 2,
  heroMedia: {
    mediaType: "image",
    placeholderTitle: "CODEQUEST — HERO PRODUCT MOTION GRAPHIC",
    caption: "CodeQuest connects CS students in complementary challenger and reviewer roles for collaborative technical interview practice.",
  },
  caseStudy: [
    {
      _type: "textSection",
      _key: "sec-overview",
      id: "sec-overview",
      eyebrow: "OVERVIEW",
      heading: "What if preparing for technical interviews also helped you build your network?",
      body: [
        "CodeQuest is a peer-to-peer technical interview practice platform where computer science students challenge and review each other.",
        "Each session places students in one of two roles: a challenger solves and explains a coding problem, while a reviewer observes their process and provides structured feedback.",
        "Instead of separating technical practice and networking, CodeQuest brings both into the same experience.",
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-two-roles",
      id: "media-two-roles",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "CHALLENGER [Solves • Explains]  ←→  REVIEWER [Observes • Evaluates]  →  CONNECTION",
      caption: "Challenger solves and explains thinking; Reviewer observes, evaluates, and learns — creating natural connection through a shared task.",
      annotation: {
        text: "peer-to-peer practice loop",
        type: "label",
        position: "top-right",
      },
    },
    {
      _type: "textSection",
      _key: "sec-problem",
      id: "sec-problem",
      eyebrow: "01 — THE PROBLEM",
      heading: "Career preparation was happening everywhere except one place.",
      body: [
        "Our user interviews revealed that students were actively preparing—but the entire experience was heavily fragmented across disconnected tools.",
        "Across six in-depth interviews, three core themes consistently appeared:",
      ],
    },
    {
      _type: "featureBlock",
      _key: "feat-problem-themes",
      id: "feat-problem-themes",
      eyebrow: "RESEARCH SYNTHESIS",
      heading: "Three core challenges in modern student interview preparation",
      features: [
        {
          _key: "feat-prob-01",
          number: "01",
          title: "Interview prep happens independently.",
          body: "Students were teaching themselves with tools such as LeetCode and YouTube rather than relying on coursework for career preparation.",
          placeholderTitle: "INDEPENDENT ISOLATED STUDY [LeetCode & YouTube]",
        },
        {
          _key: "feat-prob-02",
          number: "02",
          title: "Students know networking matters, but starting feels awkward.",
          body: "Several students wished they had started networking earlier in their degree, but felt intimidated and weren't sure where to begin.",
          placeholderTitle: "NETWORKING FRICTION & COLD OUTREACH [LinkedIn]",
        },
        {
          _key: "feat-prob-03",
          number: "03",
          title: "Practice, networking, and events live across disconnected tools.",
          body: "Students repeatedly switch platforms depending on what they're trying to accomplish, creating cognitive fatigue and isolated habits.",
          placeholderTitle: "FRAGMENTED ECOSYSTEM & PLATFORM HOPPING",
        },
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-fragmented-ecosystem",
      id: "media-fragmented-ecosystem",
      mediaType: "image",
      size: "normal",
      placeholderTitle: "STUDENT → [LeetCode (PRACTICE) • YouTube (LEARN) • LinkedIn (NETWORK)] → FRAGMENTED PREP",
      caption: "Isolated tool sprawl forces students to navigate independent prep, passive learning, and cold networking separately.",
    },
    {
      _type: "textSection",
      _key: "sec-hmw",
      id: "sec-hmw",
      subheading: "So we asked:",
      largeQuestion: "How might we make practicing for interviews a social experience rather than another isolated prep tool?",
    },
    {
      _type: "decisionBlock",
      _key: "sec-the-idea",
      id: "sec-the-idea",
      eyebrow: "02 — THE IDEA",
      heading: "Practice the interview from both sides.",
      body: [
        "Instead of simply building another coding-practice platform, each live session connects two students in complementary roles.",
        "Both students meet another CS student in the process. The prototype explicitly supports these complementary perspectives.",
      ],
      placeholderTitle: "MATCH FOUND → CHALLENGER (Code • Explain) & REVIEWER (Watch • Grade • Connect)",
      subsections: [
        {
          _key: "sub-challenger",
          title: "The Challenger",
          body: "Solves a technical problem while explaining their reasoning aloud—practicing both technical implementation and communication skills.",
          placeholderTitle: "CHALLENGER LIVE CODING & EXPLANATION INTERFACE",
        },
        {
          _key: "sub-reviewer",
          title: "The Reviewer",
          body: "Observes the challenger, follows a structured rubric, and provides feedback—while gaining exposure to someone else's problem-solving approach.",
          placeholderTitle: "REVIEWER RUBRIC & EVALUATION WORKFLOW",
        },
      ],
    },
    {
      _type: "textSection",
      _key: "sec-dashboard",
      id: "sec-dashboard",
      eyebrow: "03 — BRINGING PREP INTO ONE HOME",
      heading: "Everything starts from one dashboard.",
      body: [
        "The dashboard brings together upcoming sessions, scheduling, streaks, session history, and independent practice challenges.",
      ],
    },
    {
      _type: "mediaBlock",
      _key: "media-dashboard-annotated",
      id: "media-dashboard-annotated",
      mediaType: "image",
      size: "wide",
      placeholderTitle: "CODEQUEST — CENTRALIZED DASHBOARD HUB",
      caption: "Centralized dashboard displaying upcoming sessions, weekly streaks, previous practice history, and quick join actions.",
      annotation: {
        text: "Weekly consistency & quick join",
        type: "arrow",
        position: "top-right",
      },
    },
    {
      _type: "textSection",
      _key: "sec-usability-testing",
      id: "sec-usability-testing",
      eyebrow: "04 — USABILITY TESTING",
      heading: "The prototype made sense to us. Not always to our users.",
      body: [
        "We conducted guerrilla usability tests with two CS students. Each participant independently completed both sides of the experience:",
        "Challenger Flow: Find an active session → join → complete the challenge → submit.",
        "Reviewer Flow: Schedule a reviewer session → join → evaluate the challenger → submit the review.",
      ],
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-join",
      id: "sec-decision-join",
      eyebrow: "05 — DESIGN DECISION 01",
      heading: "“View Session” sounded passive.",
      body: [
        "Both participants went toward the sidebar rather than using the dashboard CTA, and 'View Session' didn't clearly communicate that clicking it meant actively joining the session. Participants also weren't sure which role they had been assigned.",
        "Our proposed change was to rename the action Join Session and give today's session greater prominence on the dashboard.",
      ],
      beforeLabel: "BEFORE: “View Session”",
      afterLabel: "AFTER: “Join Session”",
      placeholderTitle: "DASHBOARD CTA REFINEMENT",
      caption: "Users interpreted 'View' as looking at session info rather than entering an active interview. Renaming to 'Join Session' made intent unambiguous.",
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-problem-first",
      id: "sec-decision-problem-first",
      eyebrow: "06 — DESIGN DECISION 02",
      heading: "Users expected the problem before the code editor.",
      body: [
        "The challenger experience initially opened directly into the code editor. But during testing, participants expected to understand the problem before they started writing code.",
        "The proposed iteration defaulted to the Problem tab and offered a split-screen mode when students want the prompt and editor visible simultaneously.",
      ],
      beforeLabel: "BEFORE: Code Editor First",
      afterLabel: "AFTER: Problem Prompt First + Split View",
      placeholderTitle: "CHALLENGER WORKSPACE HIERARCHY",
      caption: "Putting the problem statement front and center matches real interview cognitive flow.",
    },
    {
      _type: "comparisonBlock",
      _key: "sec-decision-reviewer",
      id: "sec-decision-reviewer",
      eyebrow: "07 — NEXT ITERATION",
      heading: "The reviewer experience wasn't rewarding enough.",
      body: [
        "The reviewer isn't just there to grade somebody—they're half of CodeQuest's value proposition. But testing suggested that the reviewer dashboard didn't make that contribution feel meaningful. The solution tab was also difficult to discover, and grading instructions were unclear.",
        "Our proposed direction surfaces reviewer statistics and recognition (reviews completed, people helped, reviewer score), improves solution-tab discoverability, and clarifies exactly what reviewers should evaluate.",
      ],
      beforeLabel: "BEFORE: Passive Grader",
      afterLabel: "AFTER: Meaningful Contributor (Stats & Recognition)",
      placeholderTitle: "REVIEWER CONTRIBUTION METRICS & RECOGNITION",
      caption: "Elevating reviewer recognition turns peer evaluation into a rewarding and motivating learning activity.",
    },
    {
      _type: "featureBlock",
      _key: "sec-final-experience",
      id: "sec-final-experience",
      eyebrow: "08 — FINAL EXPERIENCE",
      heading: "Prep. Connect. Compete.",
      body: [
        "A complete loop designed for technical and career growth: Prepare → Meet → Practice → Contribute → Progress.",
      ],
      features: [
        {
          _key: "exp-01",
          number: "01 FIND",
          title: "Upcoming Session",
          body: "Dashboard provides clear scheduled matches with role assignments and countdown timers.",
          placeholderTitle: "DASHBOARD UPCOMING MATCH",
        },
        {
          _key: "exp-02",
          number: "02 CHALLENGE",
          title: "Solve & Explain",
          body: "Join live room → read problem prompt → code solution → articulate thought process out loud.",
          placeholderTitle: "CHALLENGER LIVE CODING WORKSPACE",
        },
        {
          _key: "exp-03",
          number: "03 REVIEW",
          title: "Rubric & Peer Feedback",
          body: "Peer reviewer observes execution, tracks criteria across the rubric, and shares actionable feedback.",
          placeholderTitle: "REVIEWER RUBRIC & FEEDBACK INTERFACE",
        },
        {
          _key: "exp-04",
          number: "04 PROGRESS",
          title: "Stats & Consistency",
          body: "Return to dashboard with updated streaks, solved challenge metrics, and peer review ratings.",
          placeholderTitle: "PROGRESSION & STATS DASHBOARD",
        },
      ],
    },
    {
      _type: "reflectionBlock",
      _key: "sec-reflection",
      id: "sec-reflection",
      eyebrow: "09 — REFLECTION",
      heading: "What I'd explore next",
      body: [
        "Our guerrilla usability testing revealed critical behavioral insights that ground our next exploratory phases.",
      ],
      items: [
        {
          _key: "ref-cq-01",
          number: "Question 01",
          heading: "Does the two-role model stay valuable over time?",
          body: "The challenger role has an obvious reward: interview practice. I'd want to explore what makes reviewing equally valuable so students continue choosing both sides of the experience.",
        },
        {
          _key: "ref-cq-02",
          number: "Question 02",
          heading: "How much structure should a mock interview provide?",
          body: "The prototype gives reviewers a rubric, but testing showed that the grading interaction still wasn't clear enough. I'd explore how much guidance reviewers need without making the session feel scripted.",
        },
        {
          _key: "ref-cq-03",
          number: "Question 03",
          heading: "Does combining networking and practice actually make networking easier?",
          body: "Our interviews suggested students struggled to start networking, but CodeQuest's core assumption is that working on a shared task makes that connection more natural. That's something I'd want to validate with longer-term testing.",
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
        fromSanity.caseStudy && fromSanity.caseStudy.length > 0 ? fromSanity.caseStudy : def.caseStudy,
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

