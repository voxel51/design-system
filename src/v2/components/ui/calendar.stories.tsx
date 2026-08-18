import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Calendar } from "@voxel51/voodo/v2";

/**
 * Month grid on react-day-picker. `mode` selects the behavior: `single`,
 * `multiple` or `range`.
 *
 * This is the raw grid. For a form field, use `DateField`, which pairs it
 * with an input and a popover.
 */
const meta: Meta<typeof Calendar> = {
  title: "v2/Components/Calendar",
  component: Calendar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Single: Story = {
  render: function SingleStory() {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 7, 18));
    return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border" />;
  },
};

export const Range: Story = {
  render: function RangeStory() {
    const [range, setRange] = React.useState<{ from?: Date; to?: Date } | undefined>({
      from: new Date(2026, 7, 10),
      to: new Date(2026, 7, 18),
    });
    return (
      <Calendar
        mode="range"
        selected={range as never}
        onSelect={setRange as never}
        className="rounded-md border border-border"
      />
    );
  },
};

/** Two months side by side for range selection. */
export const TwoMonths: Story = {
  render: () => (
    <Calendar mode="single" numberOfMonths={2} className="rounded-md border border-border" />
  ),
};
