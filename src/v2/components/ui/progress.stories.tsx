import type { Meta, StoryObj } from "@storybook/react-vite";

import { Progress } from "@voxel51/voodo/v2";

/**
 * Determinate progress bar, for work whose completion is measurable. Use
 * `Spinner` when it is not.
 *
 * `value` is 0–100. Radix exposes it to assistive technology, so no extra
 * ARIA is needed.
 */
const meta: Meta<typeof Progress> = {
  title: "v2/Components/Progress",
  component: Progress,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { value: { control: { type: "range", min: 0, max: 100 } } },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Progress>;

export const Default: Story = { args: { value: 62 } };

export const Steps: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} className="flex items-center gap-3">
          <Progress value={v} className="flex-1" />
          <span className="w-10 text-right text-meta tabular-nums text-secondary-foreground">
            {v}%
          </span>
        </div>
      ))}
    </div>
  ),
};
