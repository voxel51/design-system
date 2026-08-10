import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Anchor, Button, IconName, Toast, Variant } from "@voxel51/voodo";
import { generateWords } from "../utils/text";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    anchor: {
      control: "select",
      options: Object.values(Anchor),
      description: "The anchor position",
    },
    variant: {
      control: "select",
      options: Object.values(Variant),
      description: "The variant of the toast",
    },
    icon: {
      control: "select",
      description: "Optional icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
    open: {
      control: "boolean",
      description: "Whether the container is rendered",
    },
  },
};

type Story = StoryObj<typeof Toast>;

const defaultArgs = {
  open: true,
  icon: WrenchScrewdriverIcon,
  title: generateWords(4),
  description: generateWords(6),
  action: <Button variant={Variant.Secondary}>{generateWords(2)}</Button>,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Secondary: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Secondary,
  },
};

export const Success: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Success,
  },
};

export const Danger: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Danger,
  },
};

export default meta;
