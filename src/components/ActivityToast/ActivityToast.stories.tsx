import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityToast, Anchor, IconName, Variant } from "@voxel51/voodo";
import { generateSentences } from "../../stories/utils/text";

const meta: Meta<typeof ActivityToast> = {
  title: "Components/ActivityToast",
  component: ActivityToast,
  tags: ["!autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    anchor: {
      control: "select",
      options: Object.values(Anchor),
      description: "The anchor position",
    },
    variant: {
      control: "select",
      options: Object.values(Variant),
      description: "The variant of the toast",
    },
    message: {
      control: "text",
      description: "The toast message",
    },
    icon: {
      control: "select",
      description: "Optional icon to display",
      options: [undefined, ...Object.values(IconName)],
    },
    open: {
      control: "boolean",
      description: "Whether the container is rendered",
    },
  },
};

type Story = StoryObj<typeof ActivityToast>;

const defaultArgs = {
  open: true,
  icon: IconName.Info,
  message: generateSentences(1),
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Secondary: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Secondary,
  },
};

export const Success: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Success,
  },
};

export const Danger: Story = {
  args: {
    ...defaultArgs,
    variant: Variant.Danger,
  },
};

export default meta;
