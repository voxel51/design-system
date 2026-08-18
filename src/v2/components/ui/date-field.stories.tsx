import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { DateField } from "@voxel51/voodo/v2";

/**
 * Date input with a calendar popover. `value` is an ISO date string
 * (`yyyy-MM-dd`) — not a `Date` — so it round-trips through an API without a
 * timezone shifting the day.
 */
const meta: Meta<typeof DateField> = {
  title: "v2/Components/DateField",
  component: DateField,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-64"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof DateField>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = React.useState("2026-08-18");
    return <DateField value={value} onChange={setValue} />;
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = React.useState("");
    return <DateField value={value} onChange={setValue} placeholder="Pick a due date" />;
  },
};
