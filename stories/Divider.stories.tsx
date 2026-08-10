import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider, Orientation } from "@voxel51/voodo";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: [Orientation.Column, Orientation.Row],
      description: "The orientation of the divider",
    },
    label: {
      control: "text",
      description: "The label text of the divider",
    },
  },
  decorators: [
    (Story, context) => {
      if (context.args.orientation === Orientation.Column) {
        return (
          <div style={{ height: 250 }}>
            <Story />
          </div>
        );
      }

      return <Story />;
    },
  ],
};

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {};

export const LabeledHorizontal: Story = {
  args: {
    label: "Divider with label",
  },
};

export const Vertical: Story = {
  args: {
    orientation: Orientation.Column,
  },
};

export const LabeledVertical: Story = {
  args: {
    label: "Divider with label",
    orientation: Orientation.Column,
  },
};

export default meta;
