import React, { useEffect } from "react";
import type { Preview } from "@storybook/react-vite";
import "@voxel51/voodo/theme.css";

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
        dark: { name: "dark", value: "#1A1A1A" },
        light: { name: "light", value: "#F8F8F8" },
      },
    },
  },
  initialGlobals: {
    backgrounds: {
      value: "light",
    },
  },
  decorators: [toggleTheme],
  tags: ["autodocs"],
};

export default preview;
