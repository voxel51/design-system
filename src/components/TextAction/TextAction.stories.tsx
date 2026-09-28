import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconName, Size, TextAction } from "@voxel51/voodo";

const meta: Meta<typeof TextAction> = {
  title: "Components/TextAction",
  component: TextAction,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: [Size.Sm, Size.Md] },
  },
};

type Story = StoryObj<typeof TextAction>;

export const Default: Story = {
  args: { children: "Upgrade", trailingIcon: IconName.ArrowUpRight },
};

export const Small: Story = {
  args: { ...Default.args, size: Size.Sm },
};

export default meta;
