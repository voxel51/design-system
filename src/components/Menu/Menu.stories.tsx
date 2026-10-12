import { Menu, MenuItems } from "@headlessui/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import {
  IconName,
  MenuCheckItem,
  MenuIconTextItem,
  MenuSectionTitle,
  MenuSeparator,
  MenuTextItem,
  menuPanelStyles,
} from "@voxel51/voodo";

/**
 * The menu items rendered inside a static panel, so the Figma ActionMenu rows
 * can be compared without opening a Dropdown.
 */
const meta: Meta = {
  title: "Components/Menu",
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj;

const Panel = ({ children }: { children: ReactNode }) => (
  <Menu>
    <MenuItems static className={menuPanelStyles()}>
      {children}
    </MenuItems>
  </Menu>
);

export const Items: Story = {
  render: () => (
    <Panel>
      <MenuSectionTitle>Actions</MenuSectionTitle>
      <MenuIconTextItem icon={IconName.Add} text="New project" />
      <MenuIconTextItem
        icon={IconName.Edit}
        text="Rename"
        subtext="Changes the display name only"
      />
      <MenuTextItem>Move to folder</MenuTextItem>
      <MenuSeparator />
      <MenuTextItem destructive>Delete</MenuTextItem>
      <MenuTextItem destructive disabled>
        Delete permanently
      </MenuTextItem>
    </Panel>
  ),
};

export const CheckItems: Story = {
  render: () => (
    <Panel>
      <MenuSectionTitle>Sort</MenuSectionTitle>
      <MenuCheckItem checked>Ascending</MenuCheckItem>
      <MenuCheckItem>Descending</MenuCheckItem>
    </Panel>
  ),
};

export default meta;
