import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { FilterChip } from "@voxel51/voodo";

const meta: Meta<typeof FilterChip> = {
  title: "Components/FilterChip",
  component: FilterChip,
};

type Story = StoryObj<typeof FilterChip>;

export const Default: Story = {
  render: () => {
    const [on, setOn] = useState<string[]>(["demo"]);
    const tags = { automotive: 6, demo: 5, multimodal: 3, video: 3 };
    return (
      <div className="flex max-w-56 flex-wrap gap-1.5">
        {Object.entries(tags).map(([tag, count]) => (
          <FilterChip
            key={tag}
            count={count}
            selected={on.includes(tag)}
            onClick={() =>
              setOn((cur) =>
                cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]
              )
            }
          >
            {tag}
          </FilterChip>
        ))}
      </div>
    );
  },
};

export default meta;
