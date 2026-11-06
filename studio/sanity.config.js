import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes/index.js";
import { structure, SINGLETONS } from "./structure.js";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "32shl5g3";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "victorias-wellness",
  title: "Victoria's Wellness",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
    // Settings, Home page and the legal pages exist once each: no "create new" for them
    templates: (templates) => templates.filter((t) => !SINGLETONS.has(t.schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted by accident
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType)
        ? actions.filter(({ action }) => !["duplicate", "delete", "unpublish"].includes(action))
        : actions,
  },
});
