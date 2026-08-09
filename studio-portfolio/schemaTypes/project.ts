import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project Card",
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
    }),
    defineField({
      name: "year",
      type: "string",
      title: "Year",
      initialValue: "2025",
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Project Cover Image",
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
      name: "gradient",
      type: "string",
      title: "Gradient Preset",
      description: "Tailwind gradient classes fallback, e.g. 'from-amber-100/80 via-rose-100/80 to-purple-100/80'",
      initialValue: "from-zinc-200 to-zinc-300",
    }),
    defineField({
      name: "href",
      type: "string",
      title: "Project Link URL",
      initialValue: "#",
    }),
    defineField({
      name: "actionText",
      type: "string",
      title: "Action Badge Text (optional)",
      description: "e.g. 'Try It Out!', 'Try Prototype'",
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Display Order",
      initialValue: 1,
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
