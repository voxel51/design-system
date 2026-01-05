import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

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
    dts({
      insertTypesEntry: true,
      include: ["src/**/*"],
      exclude: [
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.test.tsx",
        "**/*.test.ts",
        "src/setupTests.ts",
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
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-is",
        "@emotion/react",
        "@emotion/styled",
      ],
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
