import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import pkg from "./package.json";

/**
 * VOODO 2.0 library build.
 *
 * Separate from the v1 build (`vite.config.ts`) for one reason:
 * `preserveModules`. v1 ships a single bundle; v2 ships one file per source
 * module so `@voxel51/voodo/v2/button` resolves to exactly the code for
 * Button. That mirrors the Lovable project's `@/components/ui/button` layout,
 * which is what makes porting a page an import rewrite instead of a
 * refactor — and it keeps a page that imports two components from paying for
 * seventy-one.
 */

const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
];

const isExternal = (id: string) =>
  !id.endsWith(".css") &&
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  plugins: [
    react({ jsxRuntime: "automatic" }),
    dts({
      insertTypesEntry: true,
      include: ["src/v2/**/*"],
      exclude: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.stories.tsx"],
      outDir: "dist/v2",
      entryRoot: "src/v2",
    }),
  ],
  css: {
    postcss: { plugins: [tailwindcss, autoprefixer] },
  },
  build: {
    outDir: "dist/v2",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/v2/index.ts"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: isExternal,
      // Two explicit outputs rather than one shared `entryFileNames`. A single
      // `${name}.js` pattern applies to both formats, so the CJS pass silently
      // overwrites the ESM pass and every file on disk ends up CommonJS —
      // which still resolves for `require` and breaks `import`.
      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src/v2",
          entryFileNames: "[name].js",
          exports: "named",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src/v2",
          entryFileNames: "[name].cjs",
          exports: "named",
        },
      ],
    },
    sourcemap: true,
  },
});
