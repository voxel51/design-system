import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConfidenceBar } from "@voxel51/voodo/v2";

/**
 * Compact 0–100 bar with a trailing percentage, for model confidence on a
 * prediction. Reads inline in a dense list row, where a full `Progress` bar
 * would dominate.
 *
 * `hideLabel` drops the readout; `trackClassName` sets the track width.
 */
const meta: Meta<typeof ConfidenceBar> = {
  title: "v2/Components/ConfidenceBar",
  component: ConfidenceBar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
};
export default meta;

type Story = StoryObj<typeof ConfidenceBar>;

export const Default: Story = { args: { value: 87 } };

export const Range: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {[12, 45, 68, 91, 99].map((v) => (
        <ConfidenceBar key={v} value={v} />
      ))}
    </div>
  ),
};

export const WithoutLabel: Story = { args: { value: 64, hideLabel: true } };

export const WiderTrack: Story = {
  args: { value: 73, trackClassName: "w-48" },
};
