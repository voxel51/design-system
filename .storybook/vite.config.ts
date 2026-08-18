import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      // Stories import the published package names; resolve them to local
      // source so stories can never drift from the component API.
      {
        find: "@voxel51/voodo/v2/theme.css",
        replacement: resolve(__dirname, "../src/v2/styles/theme.css"),
      },
      {
        find: "@voxel51/voodo/v2/compat.css",
        replacement: resolve(__dirname, "../src/v2/styles/compat.css"),
      },
      // Per-component subpaths, mirroring the published `./v2/*` export.
      // Must precede the barrel alias, and both are anchored: a plain string
      // `find` substitutes on prefix, which would turn
      // `@voxel51/voodo/v2/form` into `src/v2/index.ts/form`.
      {
        find: /^@voxel51\/voodo\/v2\/([a-z0-9-]+)$/,
        replacement: resolve(__dirname, "../src/v2/components/ui/$1"),
      },
      {
        find: /^@voxel51\/voodo\/v2$/,
        replacement: resolve(__dirname, "../src/v2/index.ts"),
      },
      {
        find: "@voxel51/voodo/theme.css",
        replacement: resolve(__dirname, "../src/styles/globals.css"),
      },
      {
        find: /^@voxel51\/voodo$/,
        replacement: resolve(__dirname, "../src/index.ts"),
      },
      { find: "@", replacement: resolve(__dirname, "../src") },
    ],
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    react({ jsxRuntime: "automatic" }),
    svgr({ svgrOptions: { icon: true } }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
});
