import type { Meta, StoryObj } from "@storybook/react-vite";

import { ClampedText } from "@voxel51/voodo";

const meta: Meta<typeof ClampedText> = {
  title: "Components/ClampedText",
  component: ClampedText,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    lines: { control: "number", description: "Lines shown before Show more" },
    expanded: { control: "boolean", description: "Keeps the text open" },
  },
};

export default meta;
type Story = StoryObj<typeof ClampedText>;

const LOG = Array.from(
  { length: 20 },
  (_, i) => `line ${i} of a long log`
).join("\n");

export const Long: Story = { args: { children: LOG, lines: 6 } };

export const Short: Story = { args: { children: "Fits, so no controls." } };
