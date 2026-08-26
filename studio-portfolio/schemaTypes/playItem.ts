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
      description: "e.g. 'folder', 'prototypes', 'interactive', 'shaders', 'notes'",
      options: {
        list: [
          { title: "Tactile 3D Folder", value: "folder" },
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
      initialValue: 340,
    }),
    defineField({
      name: "size",
      type: "string",
      title: "Card Size Tier",
      description: "sm (180px), md (260px), lg (340px flagship)",
      options: {
        list: [
          { title: "Small (180px)", value: "sm" },
          { title: "Medium (260px)", value: "md" },
          { title: "Large (340px Flagship)", value: "lg" },
        ],
      },
      initialValue: "md",
    }),
    defineField({
      name: "rotation",
      type: "number",
      title: "Organic Rotation (degrees: -6 to 6)",
      description: "e.g. -2.8, 3.6",
      initialValue: 0,
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
          { title: "Tactile 3D Folder Card", value: "folder" },
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
      name: "itemCount",
      type: "string",
      title: "Folder Asset Count",
      description: "e.g. '12 Assets', '8 Presets' (used when category or type is 'folder')",
      initialValue: "12 Assets",
    }),
    defineField({
      name: "accentColor",
      type: "string",
      title: "Folder Accent Color Hex",
      description: "e.g. '#6366f1' or '#10b981'",
      initialValue: "#6366f1",
    }),
    defineField({
      name: "tags",
      type: "array",
      of: [{ type: "string" }],
      title: "Folder Tags / Badges",
      description: "Tags displayed on folder flaps (e.g. ['Framer Motion', '3D Canvas'])",
    }),
    defineField({
      name: "details",
      type: "text",
      title: "Expanded Inspector Details",
      rows: 4,
    }),
    defineField({
      name: "badge",
      type: "string",
      title: "Badge Label",
      description: "e.g. 'Featured', 'Prototype', 'WebGL', 'OS Design'",
    }),
    defineField({
      name: "href",
      type: "url",
      title: "External Project / Demo URL",
      description: "Link opened when user clicks 'Open Project'",
    }),
    defineField({
      name: "mediaUrl",
      type: "string",
      title: "Custom Media URL (Video or Image)",
      description: "Direct URL to MP4/WebM video or image (e.g. /intro.mp4 or https://...)",
    }),
    defineField({
      name: "video",
      type: "file",
      title: "Uploaded Video File (MP4/WebM)",
      options: {
        accept: "video/*",
      },
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
