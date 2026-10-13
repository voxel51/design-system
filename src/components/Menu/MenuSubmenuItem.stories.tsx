import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  Dropdown,
  DropdownTrigger,
  EmbeddingsIcon,
  GridViewIcon,
  MenuIconTextItem,
  MenuSectionTitle,
  MenuSeparator,
  MenuSubmenuItem,
  MenuTextItem,
  PuzzleIcon,
  Text,
} from "@voxel51/voodo";

/**
 * A menu row that opens a flyout of further items beside it. Open it by
 * hovering, clicking, or pressing ArrowRight with the row focused; close
 * it with ArrowLeft, Escape, or by moving the pointer away. Picking an
 * item in the flyout closes the whole menu, like any top-level item.
 *
 * Built on Base UI's nested menu (`Menu.SubmenuRoot`), which handles the
 * hover delay, keyboard navigation, focus and positioning.
 */
const meta: Meta<typeof MenuSubmenuItem> = {
  title: "Components/Menu/MenuSubmenuItem",
  component: MenuSubmenuItem,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    text: { control: "text" },
    subtext: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    text: "Plugins",
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof MenuSubmenuItem>;

const Chosen = ({ value }: { value: string | null }) => (
  <Text className="block pt-4 text-center">
    {value ? `Chose: ${value}` : "Nothing chosen yet"}
  </Text>
);

/** The flyout opens beside the row, outside the parent panel. */
export const Default: Story = {
  render: (args) => {
    const [chosen, setChosen] = useState<string | null>(null);
    return (
      <div>
        <Dropdown trigger={<DropdownTrigger>Layout</DropdownTrigger>}>
          <MenuIconTextItem
            icon={<GridViewIcon />}
            text="Image"
            onClick={() => setChosen("Image")}
          />
          <MenuIconTextItem
            icon={<EmbeddingsIcon />}
            text="3D"
            onClick={() => setChosen("3D")}
          />
          <MenuSubmenuItem {...args} icon={<PuzzleIcon />}>
            <MenuSectionTitle>Analyze</MenuSectionTitle>
            <MenuTextItem onClick={() => setChosen("Histograms")}>
              Histograms
            </MenuTextItem>
            <MenuTextItem onClick={() => setChosen("Embeddings")}>
              Embeddings
            </MenuTextItem>
            <MenuSeparator />
            <MenuSectionTitle>Custom</MenuSectionTitle>
            <MenuTextItem onClick={() => setChosen("Label count")}>
              Label count
            </MenuTextItem>
          </MenuSubmenuItem>
          <MenuSeparator />
          <MenuTextItem onClick={() => setChosen("Reset layout")}>
            Reset layout
          </MenuTextItem>
        </Dropdown>
        <Chosen value={chosen} />
      </div>
    );
  },
};

/** A second line of description under the label. */
export const WithSubtext: Story = {
  ...Default,
  args: {
    text: "Plugins",
    subtext: "Open a plugin panel as a tile",
  },
};

/** The row is muted and nothing opens. */
export const Disabled: Story = {
  ...Default,
  args: {
    text: "Plugins",
    subtext: "No plugins available",
    disabled: true,
  },
};

/**
 * Near the right edge the flyout flips to the row's left; near the bottom
 * it slides up. Resize the viewport to see both.
 */
export const NearViewportEdge: Story = {
  render: (args) => (
    <div
      style={{
        position: "fixed",
        right: 8,
        bottom: 8,
      }}
    >
      <Dropdown
        anchor="top end"
        trigger={<DropdownTrigger>Layout</DropdownTrigger>}
      >
        <MenuIconTextItem icon={<GridViewIcon />} text="Image" />
        <MenuSubmenuItem {...args} icon={<PuzzleIcon />}>
          <MenuSectionTitle>Analyze</MenuSectionTitle>
          <MenuTextItem>Histograms</MenuTextItem>
          <MenuTextItem>Embeddings</MenuTextItem>
          <MenuTextItem>Map</MenuTextItem>
          <MenuTextItem>Model evaluation</MenuTextItem>
          <MenuSectionTitle>Custom</MenuSectionTitle>
          <MenuTextItem>Label count</MenuTextItem>
          <MenuTextItem>Sample notes</MenuTextItem>
        </MenuSubmenuItem>
      </Dropdown>
    </div>
  ),
};
