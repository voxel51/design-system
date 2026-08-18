import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@voxel51/voodo/v2";

/**
 * Horizontal application menu bar. Once one menu is open, hovering a sibling
 * switches to it — the desktop-application convention Radix implements.
 *
 * Rare in the product; a `DropdownMenu` per action group usually fits better.
 */
const meta: Meta<typeof Menubar> = {
  title: "v2/Components/Menubar",
  component: Menubar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New dataset <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Import…</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Export…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Grid</MenubarItem>
          <MenubarItem>List</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
