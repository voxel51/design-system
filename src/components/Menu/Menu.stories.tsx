import { Menu } from "@base-ui/react/menu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState, type ReactNode } from "react";

import {
  IconName,
  MenuCheckItem,
  MenuIconTextItem,
  MenuSectionTitle,
  MenuSeparator,
  MenuTextItem,
  actionMenuPanelStyles,
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

/**
 * An always-open menu panel. The rows only work inside a Base UI menu, so
 * this opens one in place: the hidden trigger anchors it, the panel is
 * rendered into this story rather than portaled to the body, and nothing
 * can close it.
 */
const Panel = ({ children }: { children: ReactNode }) => {
  const container = useRef<HTMLDivElement>(null);
  return (
    <div className="relative min-h-80 min-w-60">
      <Menu.Root open modal={false} onOpenChange={() => {}}>
        <Menu.Trigger
          aria-hidden
          tabIndex={-1}
          className="absolute top-0 left-0 size-0 opacity-0"
        />
        <Menu.Portal container={container}>
          <Menu.Positioner side="bottom" align="start">
            <Menu.Popup className={actionMenuPanelStyles()}>
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <div ref={container} />
    </div>
  );
};

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

const ColumnToggles = () => {
  const [shown, setShown] = useState(new Set(["Name", "Created"]));
  const toggle = (column: string) =>
    setShown((current) => {
      const next = new Set(current);
      if (next.has(column)) next.delete(column);
      else next.add(column);
      return next;
    });
  return (
    <Panel>
      <MenuSectionTitle>Columns</MenuSectionTitle>
      {["Name", "Created", "Modified", "Size"].map((column) => (
        <MenuCheckItem
          key={column}
          checked={shown.has(column)}
          onClick={() => toggle(column)}
        >
          {column}
        </MenuCheckItem>
      ))}
    </Panel>
  );
};

/** Check items toggle in place: the menu stays open between clicks. */
export const CheckItems: Story = {
  render: () => <ColumnToggles />,
};

export default meta;
