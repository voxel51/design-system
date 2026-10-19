import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Dropdown,
  DropdownTrigger,
  IconName,
  MenuCheckItem,
  MenuIconTextItem,
  MenuSectionTitle,
  MenuSeparator,
  MenuTextItem,
} from "@voxel51/voodo";

const meta: Meta<typeof Dropdown> = {
  title: "Components/Dropdown",
  component: Dropdown,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof Dropdown>;

/** Click the trigger to open the menu. The panel is the Figma ActionMenu. */
export const Default: Story = {
  args: {
    trigger: <DropdownTrigger>Actions</DropdownTrigger>,
    children: (
      <>
        <MenuSectionTitle>Actions</MenuSectionTitle>
        <MenuIconTextItem icon={IconName.Add} text="New project" />
        <MenuIconTextItem
          icon={IconName.Edit}
          text="Rename"
          subtext="Changes the display name only"
        />
        <MenuSeparator />
        <MenuTextItem destructive>Delete</MenuTextItem>
      </>
    ),
  },
};

const SortMenu = () => {
  const [sort, setSort] = useState("asc");
  return (
    <Dropdown trigger={<DropdownTrigger>Sort</DropdownTrigger>}>
      <MenuCheckItem checked={sort === "asc"} onClick={() => setSort("asc")}>
        Ascending
      </MenuCheckItem>
      <MenuCheckItem checked={sort === "desc"} onClick={() => setSort("desc")}>
        Descending
      </MenuCheckItem>
    </Dropdown>
  );
};

export const CheckItems: Story = {
  render: () => <SortMenu />,
};

/** A list taller than the viewport scrolls inside the panel. */
export const LongList: Story = {
  render: () => (
    <Dropdown trigger={<DropdownTrigger>Fields</DropdownTrigger>}>
      {Array.from({ length: 60 }, (_, i) => (
        <MenuTextItem key={i}>{`field_${i + 1}`}</MenuTextItem>
      ))}
    </Dropdown>
  ),
};

export default meta;
