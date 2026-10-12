import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text, TextColor, TextVariant } from "@voxel51/voodo";

import { generateSentences } from "../../../utils/text";

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

const ROLES = [
  TextVariant.HeadingXl,
  TextVariant.HeadingLg,
  TextVariant.HeadingMd,
  TextVariant.HeadingSm,
  TextVariant.HeadingXs,
  TextVariant.BodyPrimary,
  TextVariant.BodySecondary,
  TextVariant.BodyTertiary,
  TextVariant.Label,
  TextVariant.Caption,
  TextVariant.CodePrimary,
  TextVariant.CodeSecondary,
] as const;

/** Every Figma `type/*` role, in the order the Foundations page lists them. */
export const TypeScale: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {ROLES.map((variant) => (
        <Text key={variant} variant={variant}>
          {variant}
        </Text>
      ))}
    </div>
  ),
};

export const HeadingXl: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.HeadingXl,
  },
};

export const HeadingLg: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.HeadingLg,
  },
};

export const HeadingMd: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.HeadingMd,
  },
};

export const HeadingSm: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.HeadingSm,
  },
};

export const HeadingXs: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.HeadingXs,
  },
};

export const BodyPrimary: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.BodyPrimary,
  },
};

export const BodySecondary: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.BodySecondary,
  },
};

export const BodyTertiary: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.BodyTertiary,
  },
};

export const Label: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Label,
  },
};

export const Caption: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.Caption,
  },
};

export const Gradient: Story = {
  args: {
    children: "Generating AI labels",
    variant: TextVariant.HeadingLg,
    gradient: true,
  },
};

export const CodePrimary: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.CodePrimary,
  },
};

export const CodeSecondary: Story = {
  args: {
    children: generateSentences(1),
    variant: TextVariant.CodeSecondary,
  },
};

/** @deprecated size-only scale; kept so the visual stays checkable. */
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
