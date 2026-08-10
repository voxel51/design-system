import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text, TextColor, TextVariant } from "@voxel51/voodo";
import { generateSentences } from "../utils/text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: Object.values(TextVariant),
      description: "The text variant",
    },
    color: {
      control: "select",
      options: Object.values(TextColor),
      description: "The text color",
    },
  },
};

type Story = StoryObj<typeof Text>;

export const XXS: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Xxs,
  },
};

export const XS: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Xs,
  },
};

export const SM: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Sm,
  },
};

export const MD: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Md,
  },
};

export const LG: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Lg,
  },
};

export const XL: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Xl,
  },
};

export const XXL: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Xxl,
  },
};

export default meta;
