import type { Meta, StoryObj } from "@storybook/react-vite";

import { Dropzone } from "@voxel51/voodo";

const meta: Meta<typeof Dropzone> = {
  title: "Components/Dropzone",
  component: Dropzone,
  parameters: { layout: "padded" },
};

type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    title: "Drop images or videos and/or labels",
    description: "or click to browse your computer",
    onFiles: () => undefined,
  },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export default meta;
