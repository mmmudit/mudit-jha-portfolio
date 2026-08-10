import { defineField, defineType } from "sanity";

export const playItem = defineType({
  name: "playItem",
  title: "Play / Lab Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      title: "Category",
      description: "e.g. 'prototypes', 'interactive', 'shaders', 'notes'",
      options: {
        list: [
          { title: "Prototypes", value: "prototypes" },
          { title: "Interactive", value: "interactive" },
          { title: "Shaders", value: "shaders" },
          { title: "Notes", value: "notes" },
        ],
      },
      initialValue: "interactive",
    }),
    defineField({
      name: "tag",
      type: "string",
      title: "Tag Label",
      description: "e.g. 'Spatial UI', 'Shader & WebGL', 'Thought Note', 'Web Audio'",
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
      title: "Short Description",
      rows: 2,
    }),
    defineField({
      name: "x",
      type: "number",
      title: "Canvas X Position",
      initialValue: 0,
    }),
    defineField({
      name: "y",
      type: "number",
      title: "Canvas Y Position",
      initialValue: 0,
    }),
    defineField({
      name: "width",
      type: "number",
      title: "Card Width (px)",
      initialValue: 360,
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Card Image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gradient",
      type: "string",
      title: "Fallback Tailwind Gradient",
      initialValue: "from-purple-100/90 via-rose-100/90 to-amber-100/90",
    }),
    defineField({
      name: "type",
      type: "string",
      title: "Interactive Card Type",
      options: {
        list: [
          { title: "Standard Image", value: "image" },
          { title: "Interactive Polaroid Camera", value: "interactive-polaroid" },
          { title: "Web Audio Synthesizer", value: "audio-node" },
          { title: "3D Glare & Holographic Tilt", value: "3d-tilt" },
          { title: "Thought Note", value: "note" },
          { title: "Canvas Physics Arena", value: "physics-node" },
        ],
      },
      initialValue: "image",
    }),
    defineField({
      name: "details",
      type: "text",
      title: "Expanded Inspector Details",
      rows: 4,
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Display Order",
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tag",
      media: "image",
    },
  },
});
