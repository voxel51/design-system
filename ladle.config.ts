import { defineConfig } from "ladle";
import path from "path";

export default defineConfig({
  stories: "src/**/*.stories.@(ts|tsx|js|jsx)",
  viteFinal: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },
});
