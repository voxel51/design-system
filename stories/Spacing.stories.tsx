import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Heading,
  HeadingLevel,
  Orientation,
  Spacing,
  Stack,
  Text,
} from "@voxel51/voodo";

const SpacingDocs = () => {
  return (
    <>
      <Heading>Spacing</Heading>
      {Object.entries(Spacing).map(([key, value]) => (
        <>
          <Heading level={HeadingLevel.H2}>Spacing.{key}</Heading>
          <Stack orientation={Orientation.Column} spacing={value}>
            {new Array(3).fill(0).map((_, row) => (
              <Stack orientation={Orientation.Row} spacing={value}>
                {new Array(3).fill(0).map((_, col) => (
                  <div className="border border-content-border-default rounded-[0.25rem] p-4 w-full text-center">
                    <Text>{3 * row + col}</Text>
                  </div>
                ))}
              </Stack>
            ))}
          </Stack>
          <div className="sb-unstyled mb-8" />
        </>
      ))}
    </>
  );
};

const meta: Meta = {
  title: "Design System/Spacing",
  component: SpacingDocs,
  parameters: {
    docs: {
      page: () => <SpacingDocs />,
    },
  },
};

type Story = StoryObj<typeof SpacingDocs>;

export const Empty: Story = {};

export default meta;
