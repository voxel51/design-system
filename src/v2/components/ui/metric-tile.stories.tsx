import type { Meta, StoryObj } from "@storybook/react-vite";

import { MetricTile } from "@voxel51/voodo/v2";

/**
 * Single labeled number. `hint` carries a denominator or unit (`/ 300`,
 * `samples`) so the value stays legible on its own line.
 *
 * `value` is a string — format it at the call site, where the locale and
 * precision are known.
 */
const meta: Meta<typeof MetricTile> = {
  title: "v2/Components/MetricTile",
  component: MetricTile,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof MetricTile>;

export const Default: Story = { args: { label: "mAP@50", value: "0.847" } };

export const WithHint: Story = {
  args: { label: "Labeled", value: "218", hint: "/ 300" },
};

export const Row: Story = {
  render: () => (
    <div className="flex gap-4">
      <MetricTile label="Precision" value="0.912" />
      <MetricTile label="Recall" value="0.874" />
      <MetricTile label="Samples" value="12,480" />
      <MetricTile label="Labeled" value="218" hint="/ 300" />
    </div>
  ),
};
