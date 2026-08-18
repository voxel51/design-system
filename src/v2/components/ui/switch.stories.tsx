import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Switch, SwitchWithLabel } from "@voxel51/voodo/v2";

/**
 * Boolean toggle on Radix Switch. Applies immediately — use it for settings
 * that take effect on change, not for form fields awaiting a submit. Use a
 * Checkbox where a Save button confirms.
 */
const meta: Meta<typeof Switch> = {
  title: "v2/Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = { args: { defaultChecked: true } };

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled off" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};

export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [on, setOn] = React.useState(true);
    return <SwitchWithLabel label="Auto-start on deploy" checked={on} onCheckedChange={setOn} />;
  },
};
