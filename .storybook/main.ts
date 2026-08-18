import type { StorybookConfig } from "@storybook/react-vite";

/**
 * `VOODO_VERSION` selects which design system the build documents:
 *
 *   VOODO_VERSION=1  → v1 only (headless-ui + voodo tokens)
 *   VOODO_VERSION=2  → v2 only (shadcn/radix + Tailwind 4 tokens)
 *   unset            → both, for side-by-side comparison
 *
 * Two single-version builds can be deployed to separate URLs and diffed
 * page for page. The combined build is what you open locally when working
 * on the migration itself.
 */
const version = process.env.VOODO_VERSION ?? "all";

const V1_STORIES = [
  "../src/components/**/*.stories.@(js|jsx|ts|tsx)",
  "../src/v1-pages/**/*.stories.@(js|jsx|ts|tsx)",
  "../stories/**/*.stories.@(js|jsx|ts|tsx)",
];
const V2_STORIES = ["../src/v2/**/*.stories.@(js|jsx|ts|tsx)"];
const COMPARE_STORIES = ["../compare/**/*.stories.@(js|jsx|ts|tsx)"];

const stories =
  version === "1"
    ? V1_STORIES
    : version === "2"
      ? V2_STORIES
      : [...V1_STORIES, ...V2_STORIES, ...COMPARE_STORIES];

const config: StorybookConfig = {
  stories,
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
  env: (existing) => ({ ...existing, VOODO_VERSION: version }),
};

export default config;
