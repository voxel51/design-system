import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { ArrowDownWideNarrowIcon, ChipSelect } from "@voxel51/voodo";

const meta: Meta<typeof ChipSelect> = {
  title: "Components/ChipSelect",
  component: ChipSelect,
};

type Story = StoryObj<typeof ChipSelect>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("newest");
    return (
      <ChipSelect
        aria-label="Sort by"
        prefix="Sort by"
        icon={ArrowDownWideNarrowIcon}
        value={value}
        onChange={setValue}
        options={[
          { id: "newest", label: "Newest" },
          { id: "oldest", label: "Oldest" },
          { id: "name", label: "Name" },
        ]}
      />
    );
  },
};

export const Small: Story = {
  render: () => {
    const [value, setValue] = useState("25");
    return (
      <ChipSelect
        aria-label="Rows per page"
        size="sm"
        value={value}
        onChange={setValue}
        options={[
          { id: "25", label: "25 / page" },
          { id: "50", label: "50 / page" },
        ]}
      />
    );
  },
};

export default meta;
