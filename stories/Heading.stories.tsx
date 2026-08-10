import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading, HeadingLevel } from "@voxel51/voodo";
import { generateSentences } from "../utils/text";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    level: {
      control: "select",
      options: Object.values(HeadingLevel),
      description: "The text variant",
    },
  },
};

type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  args: {
    children: generateSentences(1),
    level: HeadingLevel.H1,
  },
};

export const H2: Story = {
  args: {
    children: generateSentences(1),
    level: HeadingLevel.H2,
  },
};

export const H3: Story = {
  args: {
    children: generateSentences(1),
    level: HeadingLevel.H3,
  },
};

export const H4: Story = {
  args: {
    children: generateSentences(1),
    level: HeadingLevel.H4,
  },
};

export default meta;
