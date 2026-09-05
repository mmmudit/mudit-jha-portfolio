import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "mr1ttplh",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  apiVersion: "2026-09-04",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

if (!process.env.SANITY_API_WRITE_TOKEN) {
  throw new Error("SANITY_API_WRITE_TOKEN is required to migrate Clarity.");
}

const project = await client.fetch('*[_type == "project" && slug.current == "clarity"][0]{_id, caseStudy, content}');
if (!project) throw new Error("The Clarity project was not found.");

const removeLegacyPlaceholderFields = (block) => {
  const { placeholderTitle, ...contentBlock } = block;
  return contentBlock;
};

const content = project.content?.length ? project.content.map(removeLegacyPlaceholderFields) : (project.caseStudy || []).map((block) => {
  const { _type, size, beforeMedia, afterMedia, cards, placeholderTitle, ...fields } = block;
  if (block.id === "sec-core-idea") return { ...fields, _type: "statement" };
  if (block.id === "sec-final-experience") {
    return {
      ...fields,
      _type: "results",
      items: (cards || []).map((card) => ({ _key: card._key, value: card.title, label: card.body })),
    };
  }
  if (_type === "textSection") return { ...fields, _type: "narrative" };
  if (_type === "decisionBlock") return { ...fields, _type: "designDecision" };
  if (_type === "mediaBlock") {
    return { ...fields, _type: "media", variant: size === "normal" ? "contained" : size === "full" ? "fullBleed" : "wide" };
  }
  if (_type === "reflectionBlock") return { ...fields, _type: "reflection" };
  return { ...fields, _type };
});

await client.patch(project._id).set({ content }).commit();
console.log(`Saved ${content.length} Clarity content blocks without legacy placeholder fields.`);
