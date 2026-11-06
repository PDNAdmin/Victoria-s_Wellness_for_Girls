import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "32shl5g3",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  // `npm run deploy` publishes the Studio at https://<studioHost>.sanity.studio
  studioHost: "victorias-wellness",
  deployment: { appId: "w2sv052q3059db3zfgookhhx" },
});
