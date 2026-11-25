import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FilterGroup } from "@voxel51/voodo";

const meta: Meta<typeof FilterGroup> = {
  title: "Components/FilterGroup",
  component: FilterGroup,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof FilterGroup>;

const OPTIONS = [
  { value: "images", label: "Images", count: 291 },
  { value: "grouped", label: "Grouped", count: 90 },
  { value: "mcap", label: "MCAP", count: 57 },
  { value: "video", label: "Video", count: 57 },
  { value: "lerobot", label: "LeRobot", count: 17 },
];

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["video"]);
    return (
      <div style={{ width: 208 }}>
        <FilterGroup
          title="Data"
          options={OPTIONS}
          selected={selected}
          onToggle={(value) =>
            setSelected((s) =>
              s.includes(value) ? s.filter((v) => v !== value) : [...s, value]
            )
          }
        />
      </div>
    );
  },
};

export const Folded: Story = {
  render: () => (
    <div style={{ width: 208 }}>
      <FilterGroup
        title="Data"
        options={OPTIONS}
        selected={[]}
        onToggle={() => undefined}
        collapseAfter={3}
      />
    </div>
  ),
};
