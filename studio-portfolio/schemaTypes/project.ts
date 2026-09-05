import { defineArrayMember, defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      title: "Tagline / Large Headline",
      description: "e.g. 'Making brain rot impossible to ignore'",
    }),
    defineField({
      name: "year",
      type: "string",
      title: "Year",
      initialValue: "2026",
    }),
    defineField({
      name: "projectType",
      type: "string",
      title: "Project Type / Event",
      description: "e.g. 'FigBuild 2026' or 'Design System'",
    }),
    defineField({
      name: "event",
      type: "string",
      title: "Event / Hackathon",
      description: "e.g. 'FigBuild 2026'",
    }),
    defineField({
      name: "role",
      type: "string",
      title: "Role",
      initialValue: "Product Designer",
    }),
    defineField({
      name: "team",
      type: "array",
      title: "Team Members",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "skills",
      type: "array",
      title: "Skills / Methods",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "metadata",
      type: "array",
      title: "Case Study Metadata (4 Subheadings & Linked Fields)",
      description: "Custom metadata fields displayed before the hero image (e.g. ROLE, TEAM, EVENT, STACK, CLIENT).",
      of: [
        {
          type: "object",
          name: "metadataItem",
          title: "Metadata Field",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Field Label (Subheading)",
              description: "e.g. 'ROLE', 'TEAM', 'EVENT', 'STACK', 'CLIENT', 'LIVE SITE'",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              type: "string",
              title: "Single Value (Use if this field has 1 item)",
              description: "e.g. 'Product Designer' or 'FigBuild 2026'",
            }),
            defineField({
              name: "href",
              type: "url",
              title: "Link URL for Single Value (Optional)",
              description: "e.g. 'https://figbuild.com'",
            }),
            defineField({
              name: "items",
              type: "array",
              title: "Multiple Items (Use for lists like Team Members or Stacks)",
              description: "Add multiple items under this label, each with its own text and optional link.",
              of: [
                {
                  type: "object",
                  name: "subItem",
                  title: "Item",
                  fields: [
                    defineField({
                      name: "text",
                      type: "string",
                      title: "Text",
                      description: "e.g. 'Kyairra Arwani' or 'Figma'",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "href",
                      type: "url",
                      title: "Link URL (Optional)",
                      description: "e.g. 'https://linkedin.com/in/...' or 'https://twitter.com/...' ",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "text",
                      subtitle: "href",
                    },
                    prepare({ title, subtitle }) {
                      return {
                        title: title || "Item",
                        subtitle: subtitle ? `↗ ${subtitle}` : undefined,
                      };
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "label",
              value: "value",
              items: "items",
            },
            prepare({ title, value, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              const subtitle = count > 0 
                ? `${count} item${count > 1 ? "s" : ""}` 
                : (value || "No value");
              return {
                title: title ? title.toUpperCase() : "METADATA FIELD",
                subtitle,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "snapshot",
      type: "object",
      title: "Executive Snapshot (Top Brief)",
      description: "High-level overview card for the project brief (role, team, challenge, concept)",
      fields: [
        defineField({ name: "role", type: "string", title: "Role" }),
        defineField({ name: "team", type: "array", title: "Team", of: [{ type: "string" }] }),
        defineField({ name: "challenge", type: "text", title: "Core Challenge Statement", rows: 2 }),
        defineField({ name: "concept", type: "text", title: "Core Concept Statement", rows: 2 }),
      ],
    }),
    defineField({
      name: "introParagraphs",
      type: "array",
      title: "Introductory Paragraphs (Lead In)",
      description: "Hook paragraphs before the main structured sections",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Short Description (Card & Overview)",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Project Card Thumbnail (Fallback / Override)",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
      ],
    }),
    defineField({
      name: "cardThumbnail",
      type: "image",
      title: "Card Thumbnail Asset",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
      ],
    }),
    defineField({
      name: "cardDemo",
      type: "image",
      title: "Card Demo Asset",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
      ],
    }),
    defineField({
      name: "navIcon",
      type: "image",
      title: "Project Switcher Nav Icon / Logo (Top Avatar Stack)",
      description: "Square app icon, glyph, or logo displayed in the top switcher pill in modals and case studies. If left empty, it defaults to the project card thumbnail.",
      options: { hotspot: true },
    }),
    defineField({
      name: "muxVideo",
      type: "mux.video",
      title: "Mux Video Preview (Hover & Dynamic Thumbnail)",
      description: "Upload a video directly to Mux. Used for auto-generated high-res static thumbnails and smooth hover video previews.",
    }),
    defineField({
      name: "heroMedia",
      type: "object",
      title: "Hero Media (Case Study Top)",
      fields: [
        defineField({
          name: "mediaType",
          type: "string",
          title: "Media Type",
          options: {
            list: [
              { title: "Image", value: "image" },
              { title: "Video URL", value: "video" },
              { title: "Mux Video", value: "mux" },
            ],
            layout: "radio",
          },
          initialValue: "image",
        }),
        defineField({
          name: "image",
          type: "image",
          title: "Hero Image",
          options: { hotspot: true },
        }),
        defineField({
          name: "video",
          type: "url",
          title: "Hero Video URL",
        }),
        defineField({
          name: "muxVideo",
          type: "mux.video",
          title: "Mux Video",
          description: "Upload a video directly to Mux for fast streaming and crisp auto-thumbnails.",
        }),
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
        }),
        defineField({
          name: "caption",
          type: "string",
          title: "Caption",
        }),
        defineField({
          name: "placeholderTitle",
          type: "string",
          title: "Placeholder Title (if media is missing)",
        }),
        defineField({
          name: "borderless",
          type: "boolean",
          title: "Remove Tactile Border / Frame",
          description: "Enable to display clean edge-to-edge media without the container background or border strokes.",
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: "gradient",
      type: "string",
      title: "Gradient Preset",
      description: "Tailwind gradient classes fallback",
      initialValue: "from-zinc-200 to-zinc-300",
    }),
    defineField({
      name: "href",
      type: "string",
      title: "External Project URL",
      initialValue: "#",
    }),
    defineField({
      name: "externalLinkLabel",
      type: "string",
      title: "External Link Label",
      description: "Custom label for modal/sidebar external link, e.g. 'Visit Live Site', 'View Prototype', 'Open Figma File'",
    }),
    defineField({
      name: "actionText",
      type: "string",
      title: "Action Badge Text",
      description: "e.g. 'Try It Out!', 'Case Study'",
    }),
    defineField({
      name: "cursorLabel",
      type: "string",
      title: "Cursor Hover Label",
      description: "Optional fine-pointer hover label, e.g. 'View case study'",
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Display Order",
      initialValue: 1,
    }),
    defineField({
      name: "content",
      title: "Case study content",
      description: "Add, reorder, and remove narrative blocks. Layout choices are intentionally limited to each block’s supported variants.",
      type: "array",
      of: [
        defineArrayMember({ type: "narrative" }),
        defineArrayMember({ type: "statement" }),
        defineArrayMember({ type: "designDecision" }),
        defineArrayMember({ type: "media" }),
        defineArrayMember({ type: "feature" }),
        defineArrayMember({ type: "highlightFeature" }),
        defineArrayMember({ type: "gallery" }),
        defineArrayMember({ type: "process" }),
        defineArrayMember({ type: "comparison" }),
        defineArrayMember({ type: "results" }),
        defineArrayMember({ type: "reflection" }),
      ],
    }),
    defineField({
      name: "caseStudy",
      type: "array",
      title: "Case Study Structured Sections",
      hidden: true,
      readOnly: true,
      description: "Modular content blocks for the editorial tactile case study",
      of: [
        // 1. Text Section
        {
          name: "textSection",
          type: "object",
          title: "Text Section",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Section ID (for anchor linking / TOC)",
              description: "e.g. 'sec-problem', 'sec-core-idea', 'sec-control'",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow (e.g. 01 — THE PROBLEM)" }),
            defineField({ name: "heading", type: "string", title: "Heading Statement" }),
            defineField({ name: "body", type: "array", title: "Body Paragraphs", of: [{ type: "string" }] }),
            defineField({ name: "subheading", type: "string", title: "Subheading / Transition" }),
            defineField({ name: "largeQuestion", type: "text", title: "Large Question / Callout", rows: 2 }),
            defineField({
              name: "pipeline",
              type: "array",
              title: "Motion Pipeline / Sequence Flow Steps",
              description: "Step-by-step sequence e.g. ['Normal scrolling', 'Brain Rot Level rises', ...]",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "cards",
              type: "array",
              title: "Cards (Feature / Principle / Control Cards)",
              description: "Cards for controls or features (e.g. 'Choose what's tracked', 'Delete your data')",
              of: [
                {
                  type: "object",
                  title: "Card",
                  fields: [
                    defineField({ name: "title", type: "string", title: "Card Title", validation: (r) => r.required() }),
                    defineField({ name: "body", type: "text", title: "Card Description", rows: 2 }),
                  ],
                  preview: {
                    select: { title: "title", subtitle: "body" },
                  },
                },
              ],
            }),
            defineField({
              name: "conclusion",
              type: "text",
              title: "Concluding Thesis Statement",
              rows: 3,
            }),
            defineField({
              name: "media",
              type: "object",
              title: "Inline Media (Optional)",
              fields: [
                defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
                defineField({ name: "video", type: "url", title: "Video URL" }),
                defineField({ name: "muxVideo", type: "mux.video", title: "Mux Video" }),
                defineField({ name: "alt", type: "string", title: "Alt text" }),
                defineField({ name: "caption", type: "string", title: "Caption" }),
                defineField({ name: "placeholderTitle", type: "string", title: "Placeholder Title" }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "eyebrow",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Text Section",
                subtitle: subtitle || "Section",
              };
            },
          },
        },
        // 2. Media Block
        {
          name: "mediaBlock",
          type: "object",
          title: "Media Block",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
              description: "e.g. 'media-problem-visual'",
            }),
            defineField({
              name: "mediaType",
              type: "string",
              title: "Media Type",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Video URL", value: "video" },
                  { title: "Mux Video", value: "mux" },
                  { title: "Figma Embed", value: "figma" },
                ],
                layout: "radio",
              },
              initialValue: "image",
            }),
            defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
            defineField({ name: "video", type: "url", title: "Video URL" }),
            defineField({
              name: "muxVideo",
              type: "mux.video",
              title: "Mux Video",
              description: "Upload a video directly to Mux for fast streaming and auto-thumbnails.",
            }),
            defineField({ name: "figmaUrl", type: "url", title: "Figma File / Prototype URL" }),
            defineField({ name: "placeholderTitle", type: "string", title: "Placeholder Label (if media not ready)" }),
            defineField({ name: "alt", type: "string", title: "Alt Text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
            defineField({
              name: "size",
              type: "string",
              title: "Display Width",
              options: {
                list: [
                  { title: "Normal (Reading column)", value: "normal" },
                  { title: "Wide (Breaks past copy)", value: "wide" },
                  { title: "Full (Full container width)", value: "full" },
                ],
                layout: "radio",
              },
              initialValue: "wide",
            }),
            defineField({
              name: "borderless",
              type: "boolean",
              title: "Remove Tactile Border / Frame",
              description: "Enable to display clean edge-to-edge media without the container background or border strokes.",
              initialValue: false,
            }),
            defineField({
              name: "annotation",
              type: "object",
              title: "Hand-drawn Annotation (Optional)",
              fields: [
                defineField({ name: "text", type: "string", title: "Annotation Text" }),
                defineField({
                  name: "type",
                  type: "string",
                  title: "Annotation Style",
                  options: {
                    list: [
                      { title: "Label", value: "label" },
                      { title: "Arrow", value: "arrow" },
                      { title: "Circle", value: "circle" },
                      { title: "Underline", value: "underline" },
                    ],
                  },
                }),
                defineField({
                  name: "position",
                  type: "string",
                  title: "Position",
                  options: {
                    list: [
                      { title: "Top Left", value: "top-left" },
                      { title: "Top Right", value: "top-right" },
                      { title: "Bottom Left", value: "bottom-left" },
                      { title: "Bottom Right", value: "bottom-right" },
                    ],
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "placeholderTitle",
              subtitle: "caption",
              alt: "alt",
              media: "image",
            },
            prepare({ title, subtitle, alt, media }) {
              return {
                title: title || alt || "Media Block",
                subtitle: subtitle || "Image / Video",
                media,
              };
            },
          },
        },
        // 3. Figma Live Embed Block
        {
          name: "figmaEmbed",
          type: "object",
          title: "Figma Live Embed",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow (e.g. FIGMA INTERACTIVE FILE)" }),
            defineField({ name: "title", type: "string", title: "Section Heading (Optional)" }),
            defineField({
              name: "figmaUrl",
              type: "url",
              title: "Figma File or Prototype URL",
              description: "Paste any Figma design file or prototype sharing link (e.g. https://www.figma.com/design/... or https://www.figma.com/proto/...)",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "caption", type: "string", title: "Caption / Design Notes" }),
            defineField({
              name: "size",
              type: "string",
              title: "Display Width",
              options: {
                list: [
                  { title: "Normal (Reading column)", value: "normal" },
                  { title: "Wide (Breaks past copy)", value: "wide" },
                  { title: "Full (Full container width)", value: "full" },
                ],
                layout: "radio",
              },
              initialValue: "wide",
            }),
            defineField({
              name: "aspectRatio",
              type: "string",
              title: "Aspect Ratio",
              options: {
                list: [
                  { title: "16:10 (Default)", value: "16/10" },
                  { title: "16:9 (Widescreen)", value: "16/9" },
                  { title: "4:3 (Standard)", value: "4/3" },
                  { title: "Square (1:1)", value: "1/1" },
                ],
                layout: "radio",
              },
              initialValue: "16/10",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "figmaUrl",
              eyebrow: "eyebrow",
            },
            prepare({ title, subtitle, eyebrow }) {
              return {
                title: title || eyebrow || "Figma Live Embed",
                subtitle: subtitle || "Figma canvas",
              };
            },
          },
        },
        // 4. Feature Block
        {
          name: "featureBlock",
          type: "object",
          title: "Feature / Interventions Block",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow (e.g. CORE EXPERIENCE)" }),
            defineField({ name: "heading", type: "string", title: "Heading" }),
            defineField({ name: "body", type: "array", title: "Intro Paragraphs", of: [{ type: "string" }] }),
            defineField({
              name: "features",
              type: "array",
              title: "Features List",
              of: [
                {
                  type: "object",
                  title: "Feature Item",
                  fields: [
                    defineField({ name: "number", type: "string", title: "Tag / Number (e.g. FEATURE 01)" }),
                    defineField({ name: "title", type: "string", title: "Feature Title", validation: (r) => r.required() }),
                    defineField({ name: "body", type: "text", title: "Feature Description", rows: 3 }),
                    defineField({
                      name: "mediaType",
                      type: "string",
                      title: "Media Type",
                      options: {
                        list: [
                          { title: "Image", value: "image" },
                          { title: "Video URL", value: "video" },
                          { title: "Mux Video", value: "mux" },
                        ],
                      },
                      initialValue: "image",
                    }),
                    defineField({ name: "image", type: "image", title: "Feature Media", options: { hotspot: true } }),
                    defineField({ name: "video", type: "url", title: "Feature Video URL" }),
                    defineField({ name: "muxVideo", type: "mux.video", title: "Mux Video" }),
                    defineField({ name: "placeholderTitle", type: "string", title: "Media Placeholder Title" }),
                    defineField({ name: "caption", type: "string", title: "Caption" }),
                    defineField({ name: "borderless", type: "boolean", title: "Borderless Media", initialValue: false }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      subtitle: "number",
                      media: "image",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "eyebrow",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Feature Block",
                subtitle: subtitle || "Features",
              };
            },
          },
        },
        // 5. Decision Block
        {
          name: "decisionBlock",
          type: "object",
          title: "Design Decision / Deep Dive Block",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
              description: "e.g. 'sec-decision-01'",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow (e.g. DESIGN DECISION 01)" }),
            defineField({ name: "heading", type: "string", title: "Heading Statement" }),
            defineField({ name: "subheading", type: "string", title: "Subheading / Strategic Contrast" }),
            defineField({
              name: "context",
              type: "array",
              title: "Context Paragraphs (Why this was a problem)",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "decision",
              type: "array",
              title: "Decision Paragraphs (What we chose to do)",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "decisionPoints",
              type: "array",
              title: "Decision Points (Key pillars)",
              of: [
                {
                  type: "object",
                  title: "Decision Point",
                  fields: [
                    defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
                    defineField({ name: "body", type: "text", title: "Description", rows: 2 }),
                  ],
                  preview: {
                    select: { title: "title", subtitle: "body" },
                  },
                },
              ],
            }),
            defineField({
              name: "why",
              type: "array",
              title: "Why Paragraphs (Rationale)",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "tradeoff",
              type: "array",
              title: "Trade-off Paragraphs (Honest tensions / constraints)",
              of: [{ type: "string" }],
            }),
            defineField({ name: "body", type: "array", title: "Body Paragraphs (General intro / legacy)", of: [{ type: "string" }] }),
            defineField({
              name: "placeholderTitle",
              type: "string",
              title: "Product Evidence Media Placeholder Title",
              description: "e.g. 'CLARITY — PRODUCT EVIDENCE: HAPTIC → VISUAL → AUDIO'",
            }),
            defineField({
              name: "mediaType",
              type: "string",
              title: "Media Type",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Video URL", value: "video" },
                  { title: "Mux Video", value: "mux" },
                ],
                layout: "radio",
              },
              initialValue: "image",
            }),
            defineField({ name: "image", type: "image", title: "Product Evidence Image", options: { hotspot: true } }),
            defineField({ name: "video", type: "url", title: "Product Evidence Video URL" }),
            defineField({ name: "muxVideo", type: "mux.video", title: "Mux Video" }),
            defineField({ name: "caption", type: "string", title: "Media Caption / Evidence Note" }),
            defineField({
              name: "cards",
              type: "array",
              title: "Explanation Cards (Grid under visual)",
              of: [
                {
                  type: "object",
                  title: "Card",
                  fields: [
                    defineField({ name: "title", type: "string", title: "Title", validation: (r) => r.required() }),
                    defineField({ name: "body", type: "text", title: "Description", rows: 2 }),
                  ],
                  preview: {
                    select: { title: "title", subtitle: "body" },
                  },
                },
              ],
            }),
            defineField({
              name: "subsections",
              type: "array",
              title: "Subsections / Deep Dives (Alternative layout)",
              of: [
                {
                  type: "object",
                  title: "Subsection",
                  fields: [
                    defineField({ name: "title", type: "string", title: "Subsection Title" }),
                    defineField({ name: "body", type: "text", title: "Subsection Body", rows: 3 }),
                    defineField({ name: "placeholderTitle", type: "string", title: "Media Placeholder Title" }),
                    defineField({ name: "media", type: "image", title: "Media" }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "eyebrow",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Decision Block",
                subtitle: subtitle || "Design Decision",
              };
            },
          },
        },
        // 6. Comparison Block
        {
          name: "comparisonBlock",
          type: "object",
          title: "Comparison Block (Before / After)",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
            defineField({ name: "heading", type: "string", title: "Heading" }),
            defineField({ name: "body", type: "array", title: "Body Paragraphs", of: [{ type: "string" }] }),
            defineField({ name: "beforeLabel", type: "string", title: "Before Label", initialValue: "Before" }),
            defineField({ name: "beforeMedia", type: "image", title: "Before Media" }),
            defineField({ name: "afterLabel", type: "string", title: "After Label", initialValue: "After" }),
            defineField({ name: "afterMedia", type: "image", title: "After Media" }),
            defineField({ name: "placeholderTitle", type: "string", title: "Placeholder Title" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "eyebrow",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Comparison Block",
                subtitle: subtitle || "Before / After",
              };
            },
          },
        },
        // 7. Reflection Block
        {
          name: "reflectionBlock",
          type: "object",
          title: "Reflection Block",
          fields: [
            defineField({
              name: "id",
              type: "string",
              title: "Block ID",
            }),
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow", initialValue: "05 — RETROSPECTIVE" }),
            defineField({ name: "heading", type: "string", title: "Heading", initialValue: "The concept raised harder questions than the prototype answered." }),
            defineField({ name: "body", type: "array", title: "Intro Paragraphs", of: [{ type: "string" }] }),
            defineField({
              name: "items",
              type: "array",
              title: "Reflection Points",
              of: [
                {
                  type: "object",
                  title: "Reflection Point",
                  fields: [
                    defineField({ name: "number", type: "string", title: "Number (e.g. 01)" }),
                    defineField({ name: "heading", type: "string", title: "Point Heading" }),
                    defineField({ name: "body", type: "text", title: "Point Body", rows: 3 }),
                  ],
                  preview: {
                    select: {
                      title: "heading",
                      subtitle: "number",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "eyebrow",
            },
            prepare({ title, subtitle }) {
              return {
                title: title || "Reflection Block",
                subtitle: subtitle || "Reflection",
              };
            },
          },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "year",
      media: "image",
    },
  },
});
