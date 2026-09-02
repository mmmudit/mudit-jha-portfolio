import { defineField, defineType } from "sanity";

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
              { title: "Video", value: "video" },
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
      name: "caseStudy",
      type: "array",
      title: "Case Study Structured Sections",
      description: "Modular content blocks for the editorial tactile case study",
      of: [
        // 1. Text Section
        {
          name: "textSection",
          type: "object",
          title: "Text Section",
          fields: [
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow (e.g. 01 — THE PROBLEM)" }),
            defineField({ name: "heading", type: "string", title: "Heading Statement" }),
            defineField({ name: "body", type: "array", title: "Body Paragraphs", of: [{ type: "string" }] }),
            defineField({ name: "subheading", type: "string", title: "Subheading / Transition" }),
            defineField({ name: "largeQuestion", type: "text", title: "Large Question / Callout", rows: 2 }),
            defineField({
              name: "media",
              type: "object",
              title: "Inline Media (Optional)",
              fields: [
                defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
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
          },
        },
        // 2. Media Block
        {
          name: "mediaBlock",
          type: "object",
          title: "Media Block",
          fields: [
            defineField({
              name: "mediaType",
              type: "string",
              title: "Media Type",
              options: {
                list: [
                  { title: "Image", value: "image" },
                  { title: "Video", value: "video" },
                  { title: "Figma Embed", value: "figma" },
                ],
                layout: "radio",
              },
              initialValue: "image",
            }),
            defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
            defineField({ name: "video", type: "url", title: "Video URL" }),
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
              media: "image",
            },
          },
        },
        // 3. Figma Live Embed Block
        {
          name: "figmaEmbed",
          type: "object",
          title: "Figma Live Embed",
          fields: [
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
                          { title: "Video", value: "video" },
                        ],
                      },
                      initialValue: "image",
                    }),
                    defineField({ name: "image", type: "image", title: "Feature Media" }),
                    defineField({ name: "placeholderTitle", type: "string", title: "Media Placeholder Title" }),
                    defineField({ name: "caption", type: "string", title: "Caption" }),
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
          },
        },
        // 4. Decision Block
        {
          name: "decisionBlock",
          type: "object",
          title: "Design Decision / Deep Dive Block",
          fields: [
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow" }),
            defineField({ name: "heading", type: "string", title: "Heading" }),
            defineField({ name: "body", type: "array", title: "Body Paragraphs", of: [{ type: "string" }] }),
            defineField({ name: "placeholderTitle", type: "string", title: "Main Media Placeholder Title" }),
            defineField({
              name: "subsections",
              type: "array",
              title: "Subsections / Deep Dives",
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
          },
        },
        // 5. Comparison Block
        {
          name: "comparisonBlock",
          type: "object",
          title: "Comparison Block (Before / After)",
          fields: [
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
        },
        // 6. Reflection Block
        {
          name: "reflectionBlock",
          type: "object",
          title: "Reflection Block",
          fields: [
            defineField({ name: "eyebrow", type: "string", title: "Eyebrow", initialValue: "REFLECTION" }),
            defineField({ name: "heading", type: "string", title: "Heading", initialValue: "What I'd explore next" }),
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
                    defineField({ name: "number", type: "string", title: "Number (e.g. Reflection 01)" }),
                    defineField({ name: "heading", type: "string", title: "Point Heading" }),
                    defineField({ name: "body", type: "text", title: "Point Body", rows: 3 }),
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
