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
      name: "description",
      type: "text",
      title: "Short Description (Card & Overview)",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Project Card Thumbnail",
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
                ],
                layout: "radio",
              },
              initialValue: "image",
            }),
            defineField({ name: "image", type: "image", title: "Image", options: { hotspot: true } }),
            defineField({ name: "video", type: "url", title: "Video URL" }),
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
        // 3. Feature Block
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
