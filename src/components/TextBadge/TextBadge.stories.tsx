import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconColor, TextBadge, TextColor } from "@voxel51/voodo";

import { generateWords } from "../../../utils/text";

const meta: Meta<typeof TextBadge> = {
  title: "Components/TextBadge",
  component: TextBadge,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    color: {
      control: "select",
      options: Object.values(TextColor),
      description: "The text color",
    },
  },
};

type Story = StoryObj<typeof TextBadge>;

export const Default: Story = {
  args: {
    children: generateWords(1),
  },
};

export const CustomColor: Story = {
  args: {
    children: generateWords(1),
    color: IconColor.Info,
  },
};

export default meta;
