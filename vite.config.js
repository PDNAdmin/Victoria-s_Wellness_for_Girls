import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  // Relative URLs in the build, so the site works from any folder or host path
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        privacy: resolve(__dirname, "privacy.html"),
        terms: resolve(__dirname, "terms.html"),
      },
    },
  },
});
