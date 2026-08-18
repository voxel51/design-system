import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Slider, SliderField } from "@voxel51/voodo/v2";

/**
 * Range input on Radix Slider. Arrow keys step, Home and End jump to the
 * bounds. `value` is an array, so two thumbs make a range.
 *
 * `SliderField` is the labeled form with a value readout.
 */
const meta: Meta<typeof Slider> = {
  title: "v2/Components/Slider",
  component: Slider,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: { defaultValue: [50], min: 0, max: 100, step: 1 },
};

/** Two thumbs define a range. */
export const Range: Story = {
  args: { defaultValue: [25, 75], min: 0, max: 100, step: 1 },
};

/**
 * `SliderField` takes a scalar for one thumb, or `[min, max]` for a range,
 * and can show number inputs bound to the same value.
 */
export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [value, setValue] = React.useState<number | [number, number]>(0.6);
    return (
      <SliderField
        inputLabel="Confidence threshold"
        showInputs
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const RangeField: Story = {
  render: function RangeFieldStory() {
    const [value, setValue] = React.useState<number | [number, number]>([20, 80]);
    return (
      <SliderField
        inputLabels={["Min", "Max"]}
        min={0}
        max={100}
        step={1}
        showInputs
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Disabled: Story = {
  args: { defaultValue: [40], disabled: true },
};
