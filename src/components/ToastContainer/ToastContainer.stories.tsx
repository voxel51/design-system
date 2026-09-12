import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Text,
  ToastContainer,
} from "@voxel51/voodo";

import { generateSentences } from "../../../utils/text";

const meta: Meta<typeof ToastContainer> = {
  title: "Components/ToastContainer",
  component: ToastContainer,
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
    open: {
      control: "boolean",
      description: "Whether the container is rendered",
    },
  },
};

type Story = StoryObj<typeof ToastContainer>;

const defaultArgs = {
  children: (
    // Tailwind v4 defaults a bare `border` to currentColor, which renders this
    // placeholder as a stark text-coloured box. Bind the token explicitly.
    <div
      className={`border ${borderColorClass(
        BorderColor.Default
      )} ${bgColorClass(BackgroundColor.Card2)} rounded-sm p-4`}
    >
      <Text>{generateSentences(1)}</Text>
    </div>
  ),
  open: true,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Top: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.Top,
  },
};

export const TopRight: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.TopRight,
  },
};

export const Right: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.Right,
  },
};

export const BottomRight: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.BottomRight,
  },
};

export const Bottom: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.Bottom,
  },
};

export const BottomLeft: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.BottomLeft,
  },
};

export const Left: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.Left,
  },
};

export const TopLeft: Story = {
  args: {
    ...defaultArgs,
    anchor: Anchor.TopLeft,
  },
};

export default meta;
