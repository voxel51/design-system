import type { Meta, StoryObj } from "@storybook/react-vite";

import { Clickable, Text } from "@voxel51/voodo";

const meta: Meta<typeof Clickable> = {
  title: "Components/Clickable",
  component: Clickable,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof Clickable>;

/**
 * Clickable adds only the pointer cursor; it has no Figma component of its
 * own and inherits every other style from its content.
 */
export const Default: Story = {
  args: {
    children: <Text>Hover to see the pointer cursor</Text>,
  },
};

export default meta;
