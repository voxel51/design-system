import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label, Textarea } from "@voxel51/voodo/v2";

/**
 * Multi-line text field. Shares the Input border and focus tokens. Height
 * is set with `rows` or a `min-h-*` class — it does not auto-grow.
 */
const meta: Meta<typeof Textarea> = {
  title: "v2/Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "What does this service do?" },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="description">Description</Label>
      <Textarea id="description" rows={4} placeholder="Runs delegated operations on Kubernetes." />
    </div>
  ),
};

export const Disabled: Story = {
  args: { value: "Built-in service — description is fixed.", disabled: true },
};
