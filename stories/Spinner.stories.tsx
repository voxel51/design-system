import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Size, Spinner } from "@voxel51/voodo";

const meta: Meta<typeof Spinner> = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: Object.values(Size),
      description: "Size of the spinner",
    },
  },
};

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Xs: Story = {
  args: {
    size: Size.Xs,
  },
};

export const Sm: Story = {
  args: {
    size: Size.Sm,
  },
};

export const Md: Story = {
  args: {
    size: Size.Md,
  },
};

export const Lg: Story = {
  args: {
    size: Size.Lg,
  },
};

export const WithCustomColor: Story = {
  args: {
    className: "text-semantic-info",
  },
};

export default meta;
