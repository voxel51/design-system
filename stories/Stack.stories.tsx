import React, { HTMLAttributes, ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Stack,
  Orientation,
  Spacing,
  Text,
  Align,
  Justify,
  StackProps,
} from "@voxel51/voodo";
import { generateWords } from "../utils/text";
import { withContainer } from "./decorators/container";

const Box = ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className="border border-slate-400 rounded-sm p-2" {...props}>
    {children}
  </div>
);

const meta: Meta<typeof Stack> = {
  title: "Components/Stack",
  component: Stack,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: Object.values(Orientation),
      description: "The orientation of the stack",
    },
    justify: {
      control: "select",
      options: Object.values(Justify),
      description:
        "The alignment of the child content along the stack's main axis",
    },
    align: {
      control: "select",
      options: Object.values(Align),
      description:
        "The alignment of the child content along the stack's cross axis",
    },
    spacing: {
      control: "select",
      options: Object.values(Spacing),
      description: "The spacing between child content",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof Stack>;

// static content for consistency across renders; otherwise difficult to see impact of prop changes
const defaultContent = new Array(3).fill(0).map((_) => generateWords(3));

const defaultRenderer = {
  render: (props: StackProps) => {
    return (
      <Stack {...props}>
        {defaultContent.map((content, i) => (
          <Box key={i}>
            <Text>{content}</Text>
          </Box>
        ))}
      </Stack>
    );
  },
};

export const BasicExample: Story = {
  ...defaultRenderer,
};

export const Vertical: Story = {
  ...defaultRenderer,
  args: {
    orientation: Orientation.Column,
  },
};

export const Horizontal: Story = {
  ...defaultRenderer,
  args: {
    orientation: Orientation.Row,
  },
};

export const VaryingContentHeight: Story = {
  render: (props: StackProps) => {
    return (
      <Stack {...props}>
        {defaultContent.map((content, i) => (
          <Box key={i} style={{ height: `${(i + 1) * 100}px` }}>
            <Text>{content}</Text>
          </Box>
        ))}
      </Stack>
    );
  },
};

export default meta;
