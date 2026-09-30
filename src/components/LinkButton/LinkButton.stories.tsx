import type { Meta, StoryObj } from "@storybook/react-vite";

import { LinkButton, Size, Text, TextColor, TextVariant } from "@voxel51/voodo";

const meta: Meta<typeof LinkButton> = {
  title: "Components/LinkButton",
  component: LinkButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: [Size.Xs, Size.Sm, Size.Md, Size.Lg],
    },
  },
};

type Story = StoryObj<typeof LinkButton>;

export const Default: Story = {
  args: { children: "Try again" },
};

export const AsLink: Story = {
  args: {
    children: "Read the docs",
    href: "https://docs.voxel51.com",
    target: "_blank",
  },
};

/** Inline in a sentence, matching the surrounding body-secondary type. */
export const Inline: Story = {
  render: () => (
    <Text variant={TextVariant.BodySecondary} color={TextColor.Secondary}>
      Unable to save changes. <LinkButton size={Size.Sm}>Try again</LinkButton>
    </Text>
  ),
};

/** Every Figma size. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-baseline gap-6">
      {[Size.Xs, Size.Sm, Size.Md, Size.Lg].map((s) => (
        <LinkButton key={s} size={s}>
          Try again
        </LinkButton>
      ))}
    </div>
  ),
};

export default meta;
