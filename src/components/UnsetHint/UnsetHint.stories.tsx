import type { Meta, StoryObj } from "@storybook/react-vite";

import { UnsetHint } from "@voxel51/voodo";

const meta: Meta<typeof UnsetHint> = {
  title: "Components/UnsetHint",
  component: UnsetHint,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof UnsetHint>;

/** Shown while the value is null or undefined. */
export const Unset: Story = {
  args: {
    value: undefined,
    hint: "Click the toggle to set a value",
  },
};

/** Renders nothing once a value exists. */
export const Set: Story = {
  args: {
    value: true,
    hint: "Click the toggle to set a value",
  },
};

export default meta;
