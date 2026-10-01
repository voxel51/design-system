import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ContextMenu,
  IconName,
  MenuIconTextItem,
  MenuSectionTitle,
  MenuSeparator,
  MenuTextItem,
  Text,
  TextColor,
} from "@voxel51/voodo";

const meta: Meta<typeof ContextMenu> = {
  title: "Components/ContextMenu",
  component: ContextMenu,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof ContextMenu>;

const menu = (
  <>
    <MenuSectionTitle>Actions</MenuSectionTitle>
    <MenuIconTextItem icon={IconName.Add} text="New project" />
    <MenuIconTextItem icon={IconName.Edit} text="Rename" />
    <MenuSeparator />
    <MenuTextItem destructive>Delete</MenuTextItem>
  </>
);

/** Right-click the area to open the menu. The panel is the Figma ActionMenu. */
export const Default: Story = {
  args: {
    menu,
    children: (
      <div className="flex h-40 w-80 items-center justify-center rounded-md border border-dashed border-content-border-default">
        <Text color={TextColor.Secondary}>Right-click here</Text>
      </div>
    ),
  },
};

export default meta;
