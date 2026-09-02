import type { Meta, StoryObj } from "@storybook/react-vite";

import { LoadingDots, Text, TextColor, TextVariant } from "@voxel51/voodo";

const meta: Meta<typeof LoadingDots> = {
  title: "Components/LoadingDots",
  component: LoadingDots,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    text: {
      control: "text",
      description: "Label the dots follow",
    },
  },
};

type Story = StoryObj<typeof LoadingDots>;

export const Default: Story = {};

export const WithText: Story = {
  args: {
    text: "Searching cats",
  },
};

export const InheritsText: Story = {
  render: (args) => (
    <Text variant={TextVariant.Lg} color={TextColor.Tertiary}>
      <LoadingDots {...args} />
    </Text>
  ),
  args: {
    text: "Loading dataset",
  },
};

export default meta;
