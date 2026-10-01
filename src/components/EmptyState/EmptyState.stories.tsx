import type { Meta, StoryObj } from "@storybook/react-vite";

import { EmptyState, IconName } from "@voxel51/voodo";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
  // Fills its container; a bounded column keeps the story readable.
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title text of the EmptyState",
    },
    description: {
      control: "text",
      description: "The description text of the EmptyState",
    },
    icon: {
      control: "select",
      options: Object.values(IconName),
      description: "An icon to display on the card",
    },
  },
};

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: IconName.Draw,
    title: "EmptyState with label",
  },
};

export const WithDescription: Story = {
  args: {
    icon: IconName.Draw,
    title: "EmptyState with label",
    description: "This is an empty state with a description",
  },
};

export default meta;
