---
name: portfolio-audit
description: >-
  Audit design portfolios and case studies across 10 Promises and 3 seniority tiers (Junior, Mid-level, Senior) based on Aneta Kmiecik's Portfolio Audit framework (uxportfolio.co). Identifies lowest-promise gaps, seniority signaling levels, aesthetic bias, and generates targeted remediation plans. Triggers on portfolio audit, case study audit, audit my portfolio, review my case study, portfolio review, senior signals, case study review, portfolio gap analysis.
---

# Portfolio Audit

Audit product design portfolios and case studies using the 10 Promises and 3 Seniority Tiers framework developed by Aneta Kmiecik ([uxportfolio.co](https://www.uxportfolio.co/)).

This skill evaluates design work as design communication. It detects what seniority level a case study or entire portfolio signals to hiring managers, identifies the critical "gap promise" dragging the candidate down, accounts for visual craft bias, and produces a concrete, prioritized revision plan.

---

## Core Philosophy

### 1. Watch for the Gap
> "A senior who signals junior in one promise can get rejected even if they're great in others. The lowest-tier promise often pulls everything else down with it."

Recruiters and hiring managers anchor on risk. If 8 promises scream Senior but **Problem Solving** or **Strategic Thinking** reads like a student team project, the candidate is down-leveled or rejected. When a portfolio is uneven, **always fix the lowest promise first**. Bringing one weak promise up to the overall target level moves the needle far more than polishing already strong promises.

### 2. Visual Design Works in Reverse (Aesthetic Bias)
> "If your craft is high, your portfolio reads as more qualified even when other promises lag behind. Aesthetic bias is real."

High craft creates an immediate halo effect that buys forgiveness for structural narrative flaws. Conversely, flawed typography, inconsistent spacing, or generic UI templates cause reviewers to doubt strategic depth before they even read a word. Treat visual design as both a gateway promise and a multiplier.

### 3. Seniority Signals Compound
- **Junior signals** demonstrate baseline execution competence, personal agency, and fundamental hygiene.
- **Mid-level signals** demonstrate autonomy, navigation of constraints, edge-case thoroughness, and business context.
- **Senior signals** demonstrate systems thinking, high-leverage trade-offs ("what you said no to"), organizational influence, visible AI judgment, and lessons from failure.

### 4. Tailor to Role Context
Levels and expectations are contextual:
- **Seed / Early-stage Startup**: Heavily weights Autonomy & Initiative, AI Fluency, broad Product Thinking, and Visual Design speed/craft over multi-tier matrix management.
- **Growth / Scale-up**: Balances velocity with systems thinking, edge-case rigor, and cross-functional leadership.
- **Big Tech / Enterprise**: Heavily weights Strategic Thinking (revenue/retention metrics), Systems Thinking across platforms, and Leadership & Collaboration (leading without authority, alignment).

---

## Audit Modes & Invocation

Parse user requests into one of three audit modes:

| Mode | Invocation Pattern | Scope | Primary Objective |
| :--- | :--- | :--- | :--- |
| `case-study` *(default if target is a project)* | `portfolio-audit case-study [path/slug/title]` | Promises 1 through 9 on a single case study | Evaluate project storytelling, design decisions, artifacts, and seniority signaling |
| `portfolio` *(default if auditing home/full site)* | `portfolio-audit portfolio` | Promise 10 (Baseline, Project Selection, Positioning) + cross-case study checks | Evaluate whole portfolio architecture, positioning, speed, breadth/depth mix |
| `gap-scan` | `portfolio-audit gap-scan [target]` | Targeted scan across all 10 Promises | Pinpoint the single lowest promise and immediate rejection risk |

---

## The 10 Promises Checklist & Signals

Every promise contains signals across **Junior**, **Mid-level**, and **Senior** tiers. When inspecting markdown, Sanity CMS documents, live web routes, or case study drafts, evaluate each signal as `Checked [x]`, `Unchecked [ ]`, or `Partial [-]`.

---

### Promise 1: Visual Design
*Evaluates visual craft, typographic sensitivity, consistency, and point of view.*

- **Junior signals**:
  - [ ] Typography and hierarchy considered (clear scale, readable line length, intentional weight contrast)
  - [ ] Confident colour choices (harmonious palette, intentional accents, accessible contrast)
  - [ ] Consistent spacing across screens (rhythm, aligned grids, unified padding)
  - [ ] No typos in mockups (dummy copy clean, realistic data, no raw "Lorem ipsum")
  - [ ] Confidential data scrubbed (sensitive metrics, client names, or PII properly masked)
- **Mid-level signals**:
  - [ ] Custom components or interactions (not just out-of-the-box UI kit defaults)
  - [ ] Sharp imagery (high-resolution screenshots, crisp device frames, clear crops)
  - [ ] Custom icons or illustrations (tailored to the domain, stylistically cohesive)
  - [ ] Micro-interactions or hover states (states articulated: hover, active, focus, disabled, transitions)
- **Senior signals**:
  - [ ] Details only a human would notice (optical alignment, deliberate sub-pixel polish, nuanced friction)
  - [ ] A clear visual point of view (distinct taste and aesthetic signature, not generic SaaS minimalism)
  - [ ] The portfolio itself shows the same craft (the site hosting the work is crafted to the exact same visual bar as the case study mockups)

---

### Promise 2: Problem Solving
*Evaluates the clarity of the core tension, framing, constraints, and decision architecture.*

- **Junior signals**:
  - [ ] A specific decision you made (explicit moments showing "I decided X")
  - [ ] What changed because of you (clear delta between before and after your intervention)
  - [ ] Reads like one person, not a team report (personal voice, clear ownership; "I" vs generic "we")
- **Mid-level signals**:
  - [ ] A problem you reframed (challenged initial assumptions; found the real problem beneath the stated brief)
  - [ ] A constraint that shaped the work (technical limitations, legacy debt, time, or legal bounds highlighted)
  - [ ] A user need you uncovered (research finding that surprised the team or shifted direction)
  - [ ] Holistic flows, not just final mockups (end-to-end journey maps, error loops, non-linear journeys)
- **Senior signals**:
  - [ ] A moment where the obvious answer was wrong (counter-intuitive discovery; why the standard pattern failed)
  - [ ] Something you said no to (deliberate scope cut, rejected feature idea, or defended trade-off)
  - [ ] Evidence of systems thinking, not isolated screens (how components, states, and ripple effects work across the broader ecosystem)

---

### Promise 3: Strategic Thinking
*Evaluates business acumen, commercial context, metrics, and systems leverage.*

- **Junior signals**:
  - [ ] The business goals behind the work (why the company funded this initiative)
  - [ ] Numbers tied to context (benchmarks and baselines given, not isolated percentages)
  - [ ] A moment that explains the why (rationale rooted in user behavior or product goals)
- **Mid-level signals**:
  - [ ] A trade-off you named (we traded speed for accuracy, or simplicity for flexibility)
  - [ ] A risk you mitigated (prevented user churn, compliance violation, or engineering rework)
  - [ ] Your take, not just the result (point of view on why this was the right bet)
  - [ ] Qualitative evidence alongside numbers (quotes, usability session clips, testimonials alongside quantitative data)
- **Senior signals**:
  - [ ] An opportunity you spotted (unprompted value creation, white space discovered in the product)
  - [ ] How the work fits into a bigger system (ecosystem architecture, multi-product dependencies)
  - [ ] Evidence you think across projects (patterns or frameworks reused across company roadmaps)
  - [ ] How your design connects to revenue, retention, or another business outcome (clear bridge between UI change and business impact)

---

### Promise 4: AI Fluency
*Evaluates how AI is integrated into the design workflow, product capabilities, and critical judgment.*

- **Junior signals**:
  - [ ] How AI fit into your design process (transparent use of AI for synthesis, ideation, or prototyping)
  - [ ] A specific call you made with AI (concrete example of prompting or AI-assisted generation)
  - [ ] Something kept by hand on purpose (intentional decision to retain human craftsmanship where AI was inadequate)
- **Mid-level signals**:
  - [ ] A workflow you changed (accelerated user interview analysis, synthetic data generation, or interactive code prototypes)
  - [ ] A prompt structure or pattern you used (system prompts, few-shot examples, or repeatable AI scaffolding)
  - [ ] Edge cases you tested (adversarial tests, hallucinations, fallback states, or prompt variations)
  - [ ] Something you rejected from AI and why (critical editorial judgment; recognizing generic or flawed AI output)
- **Senior signals**:
  - [ ] AI judgment visible in the work (discernment about when AI creates genuine user value vs gimmick)
  - [ ] A real shipped product, not just experiments (production AI systems with safety, latency, and feedback loops handled)
  - [ ] How you collaborated with AI, not just used it (pair-programming, agentic workflows, or domain-specific fine-tuning)

---

### Promise 5: Autonomy and Initiative
*Evaluates self-direction, ambiguity handling, and bias toward action.*

- **Junior signals**:
  - [ ] How you work when there's no clear brief (creating structure out of sparse requirements)
  - [ ] Specific moments you stepped up without being asked (volunteered for an unowned problem)
  - [ ] Evidence you manage your own time and trade-offs (shipped on time with self-regulated scope)
- **Mid-level signals**:
  - [ ] Projects you led without a PM in the room (drove roadmapping, alignment, and discovery solo)
  - [ ] How you handle ambiguity in scope (navigated moving goalposts with structured decision frameworks)
  - [ ] A project you pushed past "good enough" (insisted on solving the hard underlying problem, not just patching the UI)
- **Senior signals**:
  - [ ] A problem you raised that nobody had named (proactively surfaced an unseen organizational or product vulnerability)
  - [ ] A bottleneck you removed (unblocked engineering, shortened cycle times, or restructured design handoff)

---

### Promise 6: Product Thinking
*Evaluates product strategy, user intent vs task, lifecycle thinking, and product vision.*

- **Junior signals**:
  - [ ] Understands what the product is actually for, not just the screen (understands the underlying user job-to-be-done)
  - [ ] Considers the user's goal, not only the task in front of them (optimizes for the ultimate outcome, not just button clicks)
  - [ ] Can explain how a feature fits the larger product (situates the work within the existing information architecture)
- **Mid-level signals**:
  - [ ] Designed for edge cases and empty states, not just the happy path (zero-data, first-time, permission errors, latency states)
  - [ ] Weighed effort against impact when scoping (phased rollout: MVP vs v1.5 vs north star)
  - [ ] Thought about what happens after launch (adoption metrics, customer support burden, continuous iteration)
  - [ ] Considered how the feature affects the rest of the product (ripple effects on navigation, settings, notifications)
- **Senior signals**:
  - [ ] A feature you argued against building (killed an ill-conceived idea with data and user logic)
  - [ ] Evidence you think in systems and lifecycles, not features (account lifecycles, retention loops, platform decay)
  - [ ] How a design decision connected to the product's direction (steered multi-quarter product strategy)

---

### Promise 7: Leadership and Collaboration
*Evaluates cross-functional partnership, persuasion, consensus-building, and communication.*

- **Junior signals**:
  - [ ] Feedback you turned into a better decision (welcomed critique and iterated constructively)
  - [ ] A handoff you owned (created clean specs, component tokens, edge-case documentation for dev)
  - [ ] How you communicate complex ideas simply (succinct explanations without design jargon)
- **Mid-level signals**:
  - [ ] A stakeholder you aligned (brought conflicting views into consensus through workshops or prototypes)
  - [ ] A team conflict you navigated (resolved differences with PM or Eng constructively)
  - [ ] Evidence of working across disciplines (deep collaboration with eng, PM, research, data science, or legal)
  - [ ] A boundary you set on scope or quality (held the line on core user experience standards under deadline pressure)
- **Senior signals**:
  - [ ] Mentorship or knowledge sharing (upskilled peers, ran critiques, or published internal guidelines)
  - [ ] A team workflow you helped change (improved design-eng collaboration, discovery processes, or design ops)
  - [ ] Where you led without authority (rallied cross-functional partners around a vision without managerial mandate)

---

### Promise 8: Growth Mindset
*Evaluates adaptability, humility, continuous learning, and curiosity.*

- **Junior signals**:
  - [ ] Skills you've picked up in the last year (new design tools, code basics, prototyping techniques)
  - [ ] How you stay current (newsletters, design communities, side experiments, teardowns)
  - [ ] How you handle feedback that contradicts your view (demonstrates intellectual honesty and ego suppression)
- **Mid-level signals**:
  - [ ] Tools or methods you've added to your workflow (advanced prototyping, AI workflows, quantitative analysis)
  - [ ] What you got wrong and what you changed because of it (post-mortems, humility about failed hypotheses)
  - [ ] Evidence you experiment with emerging tech (testing new interaction paradigms or developer platforms)
- **Senior signals**:
  - [ ] A workflow you changed because something better came along (discarded established habits for superior methods)
  - [ ] A new field or domain you started learning recently (deep diving into LLM latency, domain economics, spatial computing)

---

### Promise 9: Case Study Craft
*Evaluates the case study itself as an artifact of design communication, independent of the product work.*

- **Junior signals**:
  - [ ] Your role on the project is named clearly (specific responsibilities, not vague attribution)
  - [ ] Team size and who you worked with is mentioned (context of team composition: e.g., 2 devs, 1 PM, 1 designer)
  - [ ] The platform you designed for is specified (iOS, Android, Web, Desktop, Responsive)
  - [ ] Each case study has a clear problem to start with (a sharp hook framing the conflict within the first 2 scrolls)
- **Mid-level signals**:
  - [ ] Process artifacts connect to a decision you made (no "design process theater" like random sticky note photos unless tied to a pivotal choice)
  - [ ] Qualitative evidence somewhere (user quotes, testing feedback, usability video snippets)
  - [ ] Concepts you didn't ship show up too (explorations and branches that were pruned)
  - [ ] Removing any artifact would weaken the story (every diagram, mockup, and screenshot earns its place; zero fluff)
- **Senior signals**:
  - [ ] Your process is tailored to the project, not the same method every time (proves adaptive judgment, not a rigid double-diamond template)
  - [ ] Variety in approach across case studies (different stories: one deep systems project, one fast discovery sprint, one craft-heavy UI project)
  - [ ] A lesson from a project that didn't succeed (candid retrospective on what went wrong and what it taught you)

---

### Promise 10: The Portfolio Itself
*Evaluates the entire portfolio experience, positioning, curation, and first impression. Run across the whole site.*

- **Baseline (Every portfolio)**:
  - [ ] Loads fast (optimized assets, responsive performance, zero jarring layout shifts)
  - [ ] Easy to navigate (frictionless menu, obvious back links, intuitive project routing)
  - [ ] A clear way to contact you (working email, LinkedIn, Twitter/X, or contact form with zero hurdles)
  - [ ] Each case study can be scanned in 90 seconds (strong headings, pull quotes, bold takeaways, scannable visual anchors)
- **Project selection**:
  - [ ] Projects are picked for the role you want (tailored to the target career trajectory, not just a historical archive)
  - [ ] A mix of breadth and depth across projects (shows wide adaptability alongside deep-dive mastery)
  - [ ] Nothing older than five years on display (modern, relevant work reflecting current paradigms)
  - [ ] Shipped projects featured over conceptual work (real products with real user and engineering friction)
  - [ ] The 30-second impression matches the impression you want (instant hero clarity upon initial landing)
- **Mid-level positioning**:
  - [ ] Clear positioning on the homepage (articulates who you are, what you specialize in, and your unique value proposition)
  - [ ] One specific person you're designing for (speaks directly to the hiring manager or client profile you want)
  - [ ] At least one decision-rich case study (a flagship deep dive loaded with trade-offs and rationale)
- **Senior positioning**:
  - [ ] Your name is memorable (distinct personal identity and brand)
  - [ ] You wouldn't be embarrassed to read it out loud (no cringe buzzwords like "passionate pixel perfectionist transforming synergy")
  - [ ] Reflects who you are now, not three years ago (up-to-date maturity, current taste, and latest capabilities)

---

## Scoring & Diagnostic Methodology

### 1. Count & Calculate Signals
Count the checked signals across all evaluated promises:
- **Junior Signal Ratio**: $\frac{\text{Checked Junior}}{\text{Total Junior}}$
- **Mid-level Signal Ratio**: $\frac{\text{Checked Mid}}{\text{Total Mid}}$
- **Senior Signal Ratio**: $\frac{\text{Checked Senior}}{\text{Total Senior}}$

### 2. Determine Seniority Pattern
Match the checked pattern against the scoring rubric:
- **Signals Junior Level**: Most Junior tier checked, but few Mid-level signals present.
- **Signals Mid-Level**: All/most Junior tier checked + majority of Mid-level signals checked.
- **Signals Senior Level**: Junior + Mid-level fully satisfied + majority of Senior signals checked.

### 3. Find The Rejection Gap
Sort promises by their completion rate. **The single lowest-scoring promise is the Gap.**
- If a candidate's target is **Senior**, but **Strategic Thinking** or **Problem Solving** is stuck at Junior (e.g. 1/4 signals checked), that is the primary reason the portfolio will get screened out.
- Highlight the gap with high urgency.

### 4. Calibrate Against Industry Benchmarks
Compare the portfolio's signaling against established industry matrices:
- **Product Design Expectations Rubric**
- **Figma Product Design & Writing Career Levels**
- **Design Skills Matrix by Maigen**
- **Jason Mesut Competency Model**
- **Intercom Product Designer Job Levels**
- **Nielsen Norman Group Skill Mapping**

---

## Audit Output Format

Every audit report must strictly follow this markdown structure:

```markdown
# Portfolio Audit: [Case Study Name or Full Portfolio]

**Target Role & Level**: [e.g. Senior Product Designer, Big Tech / Founding Designer, Seed Stage]  
**Overall Signal**: [Junior | Mid-Level | Senior]  
**Primary Gap Promise**: [The single lowest promise dragging the score down]

---

## Executive Summary & Gap Alert

> [!WARNING]
> **The Gap Alert**: [Explain the lowest-scoring promise, why it threatens candidate credibility for the target role, and how aesthetic bias either helps or hurts this case.]

[2–3 paragraphs summarizing overall impression, craft level, narrative strength, and immediate perception.]

---

## Promise Scorecard

| Promise | Junior | Mid | Senior | Score | Signal Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 1. Visual design | 5/5 | 3/4 | 2/3 | 10/12 | Senior |
| 2. Problem solving | 3/3 | 3/4 | 1/3 | 7/10 | Mid-Level |
| 3. Strategic thinking | 2/3 | 1/4 | 0/4 | 3/11 | ⚠️ Junior (GAP) |
| 4. AI fluency | 2/3 | 1/4 | 0/3 | 3/10 | Junior |
| 5. Autonomy & initiative | 3/3 | 2/3 | 1/2 | 6/8 | Mid-Level |
| 6. Product thinking | 3/3 | 3/4 | 1/3 | 7/10 | Mid-Level |
| 7. Leadership & collaboration | 3/3 | 2/4 | 1/3 | 6/10 | Mid-Level |
| 8. Growth mindset | 3/3 | 2/3 | 1/2 | 6/8 | Mid-Level |
| 9. Case study craft | 4/4 | 3/4 | 1/3 | 8/11 | Mid-Level |
| 10. The portfolio itself | 4/4 | 4/5 | 2/3 | 10/12 | Senior |

---

## Detailed Signal Breakdown

### [Promise Name] (Score: X/Y — [Tier Signal])
**Strengths (What lands):**
- [x] **[Signal Name]**: Evidence from case study or code (cite exact file or section).

**Missing Signals (What is costing seniority):**
- [ ] **[Signal Name]**: What is missing and how to articulate it.

*(Repeat for prioritized promises, focusing most deeply on the lowest promises)*

---

## What To Do Next (4-Step Action Plan)

1. **Fix the Lowest Promise First**: Concrete instructions on what specific section, diagram, or paragraph to rewrite to bring the lowest promise up to the target level.
2. **Pull the Target Job Description**: Compare specific verbs and deliverables requested in the target role with claims in this case study.
3. **Cut Process Theater**: Artifacts, stock diagrams, or unanchored mockups to prune to make the case study scannable in 90 seconds.
4. **Elevate Visual Craft & Framing**: Adjustments to micro-copy, typography hierarchy, or visual presentation.

---

## Quarterly Maintenance Cadence
> **Reminder**: Run this audit every quarter. Set a calendar reminder. Take 30 minutes. Fix the single biggest gap.
```

---