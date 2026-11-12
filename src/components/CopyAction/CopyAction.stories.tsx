import type { Meta, StoryObj } from "@storybook/react-vite";

import { CopyAction } from "@voxel51/voodo";

const meta: Meta<typeof CopyAction> = {
  title: "Components/CopyAction",
  component: CopyAction,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CopyAction>;

export const Default: Story = { args: { text: "Copied to the clipboard" } };
