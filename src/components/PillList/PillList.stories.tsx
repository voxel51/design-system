import type { Meta, StoryObj } from "@storybook/react-vite";

import { PillList } from "@voxel51/voodo";

const meta: Meta<typeof PillList> = {
  title: "Components/PillList",
  component: PillList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    max: { control: "number", description: "Pills shown before +N more" },
    expanded: { control: "boolean", description: "Keeps every pill showing" },
  },
};

export default meta;
type Story = StoryObj<typeof PillList>;

const MODELS = Array.from({ length: 30 }, (_, i) => `yolov8-model-${i}-torch`);

export const Default: Story = { args: { items: MODELS } };

export const Few: Story = { args: { items: MODELS.slice(0, 4) } };
