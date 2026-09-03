import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  BackgroundColor,
  BrandColor,
  Progress,
  Size,
  StatusColor,
  TextColor,
} from "@voxel51/voodo";

const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100 },
      description: "Current value, clamped to [0, max]",
    },
    max: {
      control: "number",
      description: "Maximum value the bar represents",
    },
    size: {
      control: "select",
      options: [Size.Sm, Size.Md, Size.Lg],
      description: "Track thickness",
    },
    color: {
      control: "select",
      options: [
        BrandColor.Primary,
        TextColor.Secondary,
        TextColor.Decorative,
        StatusColor.Failed,
      ],
      description: "Fill color",
    },
    trackColor: {
      control: "select",
      options: Object.values(BackgroundColor),
      description: "Background color of the unfilled track",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 42,
  },
};

export const NearLimit: Story = {
  name: "Near limit (75-99%)",
  args: {
    value: 82,
    color: TextColor.Decorative,
  },
};

export const OverLimit: Story = {
  name: "At/over limit (100%)",
  args: {
    value: 100,
    color: StatusColor.Failed,
  },
};

export const Small: Story = {
  args: {
    value: 60,
    size: Size.Sm,
  },
};

export const Large: Story = {
  args: {
    value: 60,
    size: Size.Lg,
  },
};

export default meta;
