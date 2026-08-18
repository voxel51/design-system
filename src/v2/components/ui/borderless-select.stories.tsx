import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { ArrowUpDown, Layers } from "lucide-react";

import { BorderlessSelect } from "@voxel51/voodo/v2";

/**
 * Inline select with no border or field chrome — a prefix label, the current
 * value and a chevron. For toolbar controls ("Group by: Status") where a
 * bordered `Select` would fight the surrounding density.
 *
 * Backed by `DropdownMenu`, so keyboard behavior matches the menus.
 */
const meta: Meta<typeof BorderlessSelect> = {
  title: "v2/Components/BorderlessSelect",
  component: BorderlessSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof BorderlessSelect>;

export const Default: Story = {
  render: function DefaultStory() {
    const [value, setValue] = React.useState("status");
    return (
      <BorderlessSelect
        label="Group by"
        value={value}
        onChange={setValue}
        icon={<Layers className="h-3.5 w-3.5" />}
        options={[
          { key: "status", label: "Status" },
          { key: "kind", label: "Type" },
          { key: "origin", label: "Origin" },
        ]}
      />
    );
  },
};

/** `hideLabel` leaves icon, value and chevron only. */
export const WithoutLabel: Story = {
  render: function WithoutLabelStory() {
    const [value, setValue] = React.useState("recent");
    return (
      <BorderlessSelect
        label="Sort"
        hideLabel
        value={value}
        onChange={setValue}
        icon={<ArrowUpDown className="h-3.5 w-3.5" />}
        options={[
          { key: "recent", label: "Most recent" },
          { key: "name", label: "Name" },
        ]}
      />
    );
  },
};
