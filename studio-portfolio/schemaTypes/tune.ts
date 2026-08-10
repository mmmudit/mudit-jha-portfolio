import { defineField, defineType } from "sanity";

export const tune = defineType({
  name: "tune",
  title: "Tune / Music",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Song / Track Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artist",
      type: "string",
      title: "Artist Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "album",
      type: "string",
      title: "Album Name",
    }),
    defineField({
      name: "coverImage",
      type: "image",
      title: "Album Cover Art",
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
      title: "Fallback Cover Gradient",
      initialValue: "from-zinc-800 via-zinc-900 to-black",
    }),
    defineField({
      name: "link",
      type: "string",
      title: "Spotify / Apple Music Track Link",
      initialValue: "#",
    }),
    defineField({
      name: "audioPreviewUrl",
      type: "string",
      title: "Audio Preview MP3 URL (optional)",
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
      subtitle: "artist",
      media: "coverImage",
    },
  },
});
