import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox, Input, Label } from "@voxel51/voodo/v2";

/**
 * Form label built on Radix Label. Clicking it focuses or toggles the
 * associated control. Dims automatically when its control is disabled via
 * `peer-disabled`.
 */
const meta: Meta<typeof Label> = {
  title: "v2/Components/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = { args: { children: "Service name" } };

export const WithInput: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <Label htmlFor="name">Service name</Label>
      <Input id="name" placeholder="argo-prod" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="autostart" />
      <Label htmlFor="autostart">Start automatically</Label>
    </div>
  ),
};
