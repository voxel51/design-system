import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "@voxel51/voodo";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
};

type Story = StoryObj<typeof Avatar>;

export const Initials: Story = {
  args: { name: "Ada Lovelace" },
};

export const Small: Story = {
  args: { name: "Ada Lovelace", size: "sm" },
};

export const Large: Story = {
  args: { name: "Ada Lovelace", size: "lg" },
};

export default meta;
