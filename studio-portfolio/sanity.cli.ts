import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "mr1ttplh",
    dataset: "production",
  },
  typegen: {
    enabled: true,
    path: "../src/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../sanity.types.ts",
    overloadClientMethods: true,
  },
});
