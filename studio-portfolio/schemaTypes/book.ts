import { defineField, defineType } from "sanity";

export const book = defineType({
  name: "book",
  title: "Book",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Book Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      type: "string",
      title: "Author Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorInitials",
      type: "string",
      title: "Author Initials (for spine base)",
      description: "e.g. 'JMB', 'AW+SS', 'RR', 'AK'",
    }),
    defineField({
      name: "spineColor",
      type: "string",
      title: "Spine Background Color (Hex or CSS)",
      description: "e.g. '#ff4500', '#1e293b', '#eab308', '#27272a'",
      initialValue: "#ff4500",
    }),
    defineField({
      name: "spineTextColor",
      type: "string",
      title: "Spine Text Color (Hex)",
      description: "e.g. '#ffffff' or '#18181b'",
      initialValue: "#ffffff",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Book Cover Image",
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
      name: "link",
      type: "string",
      title: "Book Purchase / Info Link URL",
      initialValue: "#",
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Display Order on Bookshelf",
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
      subtitle: "author",
      media: "coverImage",
    },
  },
});
