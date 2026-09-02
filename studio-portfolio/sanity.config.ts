import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import { schemaTypes } from "./schemaTypes";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "mr1ttplh";
export const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "Portfolio Studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool(), muxInput()],
  schema: {
    types: schemaTypes,
  },
});
