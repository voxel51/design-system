import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading, Radius, Shadow, Text } from "@voxel51/voodo";

const BordersDocs = () => {
  return (
    <>
      <Heading>Border Radius</Heading>
      <div className="w-full flex gap-4">
        {Object.entries(Radius).map(([key, value]) => (
          <div
            className={`w-full p-4 text-center border border-content-border-default rounded-${value}`}
          >
            <Text>Radius.{key}</Text>
          </div>
        ))}
      </div>
    </>
  );
};

const meta: Meta = {
  title: "Design System/Borders",
  component: BordersDocs,
  parameters: {
    docs: {
      page: () => <BordersDocs />,
    },
  },
};

type Story = StoryObj<typeof BordersDocs>;

export const Empty: Story = {};

export default meta;
