import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  AddIcon,
  Button,
  ChipSelect,
  FilterBar,
  Input,
  LayersOutlineIcon,
  SearchIcon,
} from "@voxel51/voodo";

const meta: Meta<typeof FilterBar> = {
  title: "Components/FilterBar",
  component: FilterBar,
  parameters: { layout: "padded" },
};

type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {
  render: () => {
    const [group, setGroup] = useState("none");
    return (
      <FilterBar
        search={<Input type="search" icon={SearchIcon} placeholder="Search" />}
        actions={
          <Button
            variant="primary"
            size="md"
            leadingIcon={AddIcon}
            collapse="sm"
            aria-label="New project"
          >
            New project
          </Button>
        }
      >
        <ChipSelect
          aria-label="Group by"
          prefix="Group by"
          icon={LayersOutlineIcon}
          value={group}
          onChange={setGroup}
          options={[
            { id: "none", label: "None" },
            { id: "priority", label: "Priority" },
          ]}
        />
      </FilterBar>
    );
  },
};

export default meta;
