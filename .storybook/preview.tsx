import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";

const version = import.meta.env.VOODO_VERSION ?? "all";

// v1 and v2 own separate variable namespaces (`--color-content-*` vs
// `--background`), so both stylesheets can coexist in the combined build.
// compat.css is loaded last there, which is the arrangement a migrating app
// uses: v1 components rendering on v2 values.
if (version !== "2") await import("@voxel51/voodo/theme.css");
if (version !== "1") await import("@voxel51/voodo/v2/theme.css");
if (version === "all") await import("@voxel51/voodo/v2/compat.css");

const toggleTheme = (Story, context) => {
  const isDark = context.globals?.backgrounds?.value === "dark";

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        dark: { name: "dark", value: "#18191A" },
        light: { name: "light", value: "#FAFAFA" },
      },
    },
    options: {
      // Patterns lead: they are the layer the apps lack, and the reason the
      // atoms below them exist. Atoms are reference material, so they sort
      // after.
      storySort: {
        order: [
          "Comparison",
          "v2",
          ["Patterns", "Chrome", "Components", "Tokens"],
          "*",
        ],
      },
    },
  },
  initialGlobals: {
    backgrounds: {
      value: "dark",
    },
  },
  decorators: [toggleTheme],
  tags: ["autodocs"],
};

export default preview;
