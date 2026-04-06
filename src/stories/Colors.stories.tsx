import { ColorItem, ColorPalette } from "@storybook/addon-docs/blocks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ActionColor,
  BackgroundColor,
  BorderColor,
  BrandColor,
  Heading,
  HeadingLevel,
  IconColor,
  SemanticColor,
  StatusColor,
  TextColor,
} from "@voxel51/voodo";
import React from "react";
import { capitalize } from "./utils/text";

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

const filterEnum = (
  enumObj: Record<string, string>,
  filter: (value: string) => boolean
): Record<string, string> => {
  const result: Record<string, string> = {};

  Object.entries(enumObj).forEach(([key, value]) => {
    if (filter(value)) {
      result[key] = value;
    }
  });

  return result;
};

const Colors = () => (
  <>
    {["light", "dark"].map((themeMode) => (
      <>
        <Heading>{capitalize(themeMode)} Theme</Heading>

        <Heading level={HeadingLevel.H2}>Content</Heading>
        <ColorPalette>
          <ColorItem
            title="Brand"
            subtitle=""
            colors={buildColorPalette(BrandColor, "", themeMode)}
          />

          <ColorItem
            title="Semantic"
            subtitle=""
            colors={buildColorPalette(SemanticColor, "", themeMode)}
          />

          <ColorItem
            title="Background"
            subtitle=""
            colors={buildColorPalette(BackgroundColor, "content-", themeMode)}
          />

          <ColorItem
            title="Text"
            subtitle=""
            colors={buildColorPalette(TextColor, "content-", themeMode)}
          />

          <ColorItem
            title="Border"
            subtitle=""
            colors={buildColorPalette(BorderColor, "content-", themeMode)}
          />

          <ColorItem
            title="Icon"
            subtitle=""
            colors={buildColorPalette(IconColor, "content-", themeMode)}
          />

          <ColorItem
            title="Status"
            subtitle=""
            colors={buildColorPalette(StatusColor, "content-", themeMode)}
          />
        </ColorPalette>

        <Heading level={HeadingLevel.H2}>Actions</Heading>
        <ColorPalette>
          {["primary", "secondary", "success", "danger"].map((colorVariant) => (
            <ColorItem
              title={`${capitalize(colorVariant)} actions`}
              subtitle=""
              colors={buildColorPalette(
                filterEnum(ActionColor, (color) =>
                  color.startsWith(`action-${colorVariant}`)
                ),
                "",
                themeMode
              )}
            />
          ))}
        </ColorPalette>
      </>
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

export const Empty: Story = {
  // we must render *something* as a Story so that the Docs page shows up
  // but rendering <Colors /> here will cause a cryptic error about missing
  // fonts. Instead we just render a dummy div.
  // https://storybook.js.org/docs/writing-docs/doc-blocks#why-cant-i-use-the-doc-blocks-inside-my-stories
  render: () => <div></div>,
};

export default meta;
