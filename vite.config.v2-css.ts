import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { resolve } from "path";
import { defineConfig, type Plugin } from "vite";

/**
 * VOODO 2.0 stylesheet build.
 *
 * The theme and the v1 compatibility layer ship as two separate files so an
 * app can adopt v2 components without also re-pointing v1's variables, and
 * can drop the compat import the day the last v1 component is gone. Vite's
 * library mode has no CSS-only entry, so the entries are plain Rollup inputs
 * and the empty JS chunks they produce are discarded below.
 */
const dropEmptyJsChunks = (): Plugin => ({
  name: "voodo-drop-empty-js-chunks",
  generateBundle(_options, bundle) {
    for (const [file, chunk] of Object.entries(bundle)) {
      if (chunk.type === "chunk" && chunk.code.trim().length === 0) {
        delete bundle[file];
      }
    }
  },
});

export default defineConfig({
  resolve: { alias: { "@": resolve(__dirname, "src") } },
  css: { postcss: { plugins: [tailwindcss, autoprefixer] } },
  plugins: [dropEmptyJsChunks()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        "voodo-v2": resolve(__dirname, "src/v2/styles/theme.css"),
        "voodo-v2-compat": resolve(__dirname, "src/v2/styles/compat.css"),
      },
      output: { assetFileNames: "[name][extname]" },
    },
  },
});
