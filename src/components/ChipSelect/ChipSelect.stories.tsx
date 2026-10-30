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

export default meta;
