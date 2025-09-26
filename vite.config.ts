import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts({ insertTypesEntry: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "ux-common",
      formats: ["es", "cjs"],
      fileName: (format) => `ux-common.${format}.js`,
    },
    rollupOptions: {
      // Don't bundle peer dependencies
      external: ["react", "react-dom", "@mui/material"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@mui/material": "MaterialUI",
        },
      },
    },
  },
});
