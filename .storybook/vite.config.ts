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
      // Stories import the published package name; resolve it to the local
      // source so stories can never drift from the component API.
      {
        find: "@voxel51/voodo/theme.css",
        replacement: resolve(__dirname, "../src/styles/globals.css"),
      },
      {
        find: "@voxel51/voodo",
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
