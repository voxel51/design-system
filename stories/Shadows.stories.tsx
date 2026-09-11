import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading, Shadow, Text } from "@voxel51/voodo";

const ShadowsDocs = () => {
  return (
    <>
      <Heading>Shadows</Heading>
      <div className="w-full flex gap-4">
        {Object.entries(Shadow).map(([key, value]) => (
          <div className={`w-full p-4 text-center shadow-${value}`}>
            <Text>Shadow.{key}</Text>
          </div>
        ))}
      </div>
    </>
  );
};

const meta: Meta = {
  title: "Design System/Shadows",
  component: ShadowsDocs,
  parameters: {
    docs: {
      page: () => <ShadowsDocs />,
    },
  },
};

type Story = StoryObj<typeof ShadowsDocs>;

export const Overview: Story = {};

export default meta;
