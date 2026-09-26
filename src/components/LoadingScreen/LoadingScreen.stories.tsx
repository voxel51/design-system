import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoadingScreen, TextColor, TextVariant } from "@voxel51/voodo";

const meta: Meta<typeof LoadingScreen> = {
  title: "Components/LoadingScreen",
  component: LoadingScreen,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    text: {
      control: "text",
      description: "What the region is waiting on",
    },
    variant: {
      control: "select",
      options: Object.values(TextVariant),
      description: "Text size",
    },
    color: {
      control: "select",
      options: Object.values(TextColor),
      description: "Text color",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof LoadingScreen>;

export const Default: Story = {
  args: {
    text: "Loading",
  },
};

export const Quiet: Story = {
  args: {
    text: "Loading",
    color: TextColor.Tertiary,
    variant: TextVariant.Sm,
  },
};

export default meta;
