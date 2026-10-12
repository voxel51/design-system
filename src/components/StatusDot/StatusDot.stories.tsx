import type { Meta, StoryObj } from "@storybook/react-vite";

import { BrandColor, SemanticColor, StatusDot } from "@voxel51/voodo";

const meta: Meta<typeof StatusDot> = {
  title: "Components/StatusDot",
  component: StatusDot,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    pulse: { control: "boolean", description: "Pulses for work in progress" },
  },
};

type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {};

export const Pulsing: Story = {
  args: { pulse: true },
};

export const Success: Story = {
  args: { color: SemanticColor.Success },
};

export const Accent: Story = {
  args: { color: BrandColor.Accent },
};

export default meta;
