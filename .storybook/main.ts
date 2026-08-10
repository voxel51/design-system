import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {
        // The root vite.config.ts is the library build (lib mode, dts
        // emission). Storybook gets its own minimal vite config that
        // aliases @voxel51/voodo to the local source.
        viteConfigPath: ".storybook/vite.config.ts",
      },
    },
  },
  features: {
    experimentalComponentsManifest: true,
  },
};

export default config;
