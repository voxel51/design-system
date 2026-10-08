import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loader, LoaderType, Size } from "@voxel51/voodo";

const meta: Meta<typeof Loader> = {
  title: "Components/Loader",
  component: Loader,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: Object.values(LoaderType),
      description: "Look of the loader",
    },
    size: {
      control: "select",
      options: Object.values(Size),
      description: "Size of the loader",
    },
  },
};

type Story = StoryObj<typeof Loader>;

export const Default: Story = {};

export const Bars: Story = {
  args: {
    type: "bars",
    size: Size.Xl,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      {Object.values(Size).map((size) => (
        <Loader key={size} {...args} size={size} />
      ))}
    </div>
  ),
  args: {
    type: "bars",
  },
};

export default meta;
