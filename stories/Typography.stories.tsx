import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Heading,
  HeadingLevel,
  Text,
  TextColor,
  TextVariant,
} from "@voxel51/voodo";

const Typography = () => {
  return (
    <>
      <Heading>Typography</Heading>

      <Heading level={HeadingLevel.H2}>Headings</Heading>
      {Object.values(HeadingLevel).map((level) => (
        <Heading level={level} className="sb-unstyled">
          {level}: The quick brown fox jumps over the lazy dog
        </Heading>
      ))}

      <Heading level={HeadingLevel.H2}>Text</Heading>
      {Object.values(TextVariant).map((variant) => (
        <div className="sb-unstyled">
          <Text variant={variant}>
            {variant}: The quick brown fox jumps over the lazy dog
          </Text>
        </div>
      ))}

      <Heading level={HeadingLevel.H2}>Text Colors</Heading>
      {Object.values(TextColor).map((color) => (
        <div className="sb-unstyled">
          <Text variant={TextVariant.Lg} color={color}>
            {color}: The quick brown fox jumps over the lazy dog
          </Text>
        </div>
      ))}
    </>
  );
};

const meta: Meta = {
  title: "Design System/Typography",
  component: Typography,
  parameters: {
    docs: {
      page: () => <Typography />,
    },
  },
};

type Story = StoryObj<typeof Typography>;

export const Empty: Story = {};

export default meta;
