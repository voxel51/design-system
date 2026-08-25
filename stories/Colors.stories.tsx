import { ColorItem, ColorPalette } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BrandColor,
  colors,
  Heading,
  HeadingLevel,
  SemanticColor,
} from "@voxel51/voodo";
import React from "react";
import { capitalize } from "../utils/text";

const getCssValueFromElement = (
  element: HTMLElement,
  variable: string
): string => getComputedStyle(element).getPropertyValue(variable).trim();

const getCSSValue = (variable: string, applyClass?: string) => {
  if (applyClass) {
    // Our theme colors may change depending on their container;
    // the dark theme depends on being in a container with a 'dark' class, for example.
    // To extract the correct value, we create a dummy element, apply the class, and query the element for its value.
    const element = document.createElement("div");
    element.classList.add(applyClass);
    element.style.position = "absolute";
    element.style.visibility = "hidden";

    document.body.appendChild(element);

    const value = getCssValueFromElement(element, variable);

    document.body.removeChild(element);

    return value;
  } else {
    return getCssValueFromElement(document.documentElement, variable);
  }
};

const buildColorPalette = (
  enumObj: Record<string, string>,
  prefix: string,
  themeMode?: string
) => {
  const result: Record<string, string> = {};

  const keys = Object.keys(enumObj);
  const values = Object.values(enumObj);

  keys.forEach((key, idx) => {
    const value = values[idx];
    result[key] = getCSSValue(`--color-${prefix}${value}`, themeMode);
  });

  return result;
};

/**
 * Every semantic group Figma defines, read off the tokens rather than a
 * hand-written list of enums — a new group in Figma shows up here on the next
 * generator run instead of being silently absent. `content` is the code-side
 * namespace the semantic groups nest under.
 */
const semanticGroups = Object.keys(colors.dark.content).sort();

const groupSwatches = (group: string, themeMode: string) => {
  const keys = Object.keys(
    colors.dark.content[group as keyof typeof colors.dark.content]
  );
  const result: Record<string, string> = {};

  keys.forEach((key) => {
    result[key] = getCSSValue(`--color-content-${group}-${key}`, themeMode);
  });

  return result;
};

const Colors = () => (
  <>
    {["light", "dark"].map((themeMode) => (
      <React.Fragment key={themeMode}>
        <Heading>{capitalize(themeMode)} Theme</Heading>

        <Heading level={HeadingLevel.H2}>Mode-independent</Heading>
        <ColorPalette>
          <ColorItem
            title="Brand"
            subtitle="Not Figma tokens — Figma's Theme collection is per-mode and cannot express a mode-independent constant, so these are derived from the primitives."
            colors={buildColorPalette(BrandColor, "", themeMode)}
          />
          <ColorItem
            title="Semantic"
            subtitle=""
            colors={buildColorPalette(SemanticColor, "", themeMode)}
          />
        </ColorPalette>

        <Heading level={HeadingLevel.H2}>Semantic groups</Heading>
        <ColorPalette>
          {semanticGroups.map((group) => (
            <ColorItem
              key={group}
              title={capitalize(group)}
              subtitle={`--color-content-${group}-*`}
              colors={groupSwatches(group, themeMode)}
            />
          ))}
        </ColorPalette>
      </React.Fragment>
    ))}
  </>
);

const meta: Meta = {
  title: "Design System/Colors",
  component: Colors,
  parameters: {
    docs: {
      page: () => <Colors />,
    },
  },
};

type Story = StoryObj<typeof Colors>;

export const Overview: Story = {
  // we must render *something* as a Story so that the Docs page shows up
  // but rendering <Colors /> here will cause a cryptic error about missing
  // fonts. Instead we just render a dummy div.
  // https://storybook.js.org/docs/writing-docs/doc-blocks#why-cant-i-use-the-doc-blocks-inside-my-stories
  render: () => <div></div>,
};

export default meta;
