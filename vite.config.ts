import tailwindcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import svgr from "vite-plugin-svgr";

import pkg from "./package.json";

const externalPackages = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.peerDependencies),
  "react/jsx-runtime",
  "react/jsx-dev-runtime",
  "@emotion/react",
  "@emotion/styled",
];

// Externalize every declared dependency rather than inlining it into
// dist/index.js. Consumers install these packages automatically (they're in
// `dependencies`), so bundling them here would ship them twice — and as one
// opaque blob that downstream bundlers can't tree-shake or dedupe against
// their own copies. Keeping them external means an app that never renders a
// DatePicker never pays for react-datepicker, and apps that already use e.g.
// @headlessui/react get a single shared copy.
//
// Two rules when touching this:
// - A new runtime dependency belongs in `dependencies` (not devDependencies),
//   which makes it external here automatically.
// - CSS ids must stay internal: imports like
//   react-datepicker/dist/react-datepicker.css have to be compiled into
//   voodo.css, because consumers only ever load our theme.css export — an
//   externalized CSS import would emit a bare import statement that breaks
//   CJS consumers and styles nothing.
// The `${name}/` check also matches subpath imports (e.g. @dnd-kit/core/foo).
const isExternal = (id: string) =>
  !id.endsWith(".css") &&
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    svgr({
      svgrOptions: {
        icon: true,
      },
    }),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: [
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.test.tsx",
        "**/*.test.ts",
        "**/*.stories.tsx",
        "src/setupTests.ts",
        // Type-contract tests: type-checked, never shipped
        "src/__contracts__/**",
      ],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: isExternal,
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          "react-is": "ReactIs",
          "@emotion/react": "EmotionReact",
          "@emotion/styled": "EmotionStyled",
        },
        preserveModules: false,
        exports: "named",
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
    emptyOutDir: true,
  },
});
