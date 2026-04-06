import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Anchor, Text, Tooltip } from "@voxel51/voodo";
import {
  generateParagraphs,
  generateSentences,
  generateWords,
} from "../../stories/utils/text";

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    anchor: {
      control: "select",
      options: Object.values(Anchor),
      description: "The anchor position",
    },
  },
};

type Story = StoryObj<typeof Tooltip>;

const commonArgs = {
  content: <Text>{generateSentences(1)}</Text>,
  children: <Text>{generateWords(3)}</Text>,
};

export const Default: Story = {
  args: {
    ...commonArgs,
  },
};

export const Top: Story = {
  args: {
    ...commonArgs,
    anchor: Anchor.Top,
  },
};

export const Right: Story = {
  args: {
    ...commonArgs,
    anchor: Anchor.Right,
  },
};

export const Bottom: Story = {
  args: {
    ...commonArgs,
    anchor: Anchor.Bottom,
  },
};

export const Left: Story = {
  args: {
    ...commonArgs,
    anchor: Anchor.Left,
  },
};

export const LongTooltip: Story = {
  args: {
    ...commonArgs,
    content: <Text>{generateParagraphs(2)}</Text>,
  },
};

export default meta;
