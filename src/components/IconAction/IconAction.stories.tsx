import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconAction, IconName, Size } from "@voxel51/voodo";

const meta: Meta<typeof IconAction> = {
  title: "Components/IconAction",
  component: IconAction,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: [Size.Xs, Size.Sm, Size.Md, Size.Lg] },
  },
};

type Story = StoryObj<typeof IconAction>;

export const Default: Story = {
  args: { icon: IconName.Close, "aria-label": "Dismiss" },
};

export const ActiveTint: Story = {
  args: {
    icon: IconName.Add,
    "aria-label": "Panel",
    active: true,
    activeLook: "tint",
  },
};

export default meta;
