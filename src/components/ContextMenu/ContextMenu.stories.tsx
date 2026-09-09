import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ContextMenu,
  MenuSectionTitle,
  MenuSeparator,
  MenuTextItem,
  Text,
  TextColor,
  TextVariant,
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
    <MenuSectionTitle>Track</MenuSectionTitle>
    <MenuTextItem onClick={() => console.log("seek")}>
      Seek to start
    </MenuTextItem>
    <MenuTextItem onClick={() => console.log("split")}>
      Split at playhead
    </MenuTextItem>
    <MenuSeparator />
    <MenuTextItem destructive onClick={() => console.log("delete")}>
      Delete track
    </MenuTextItem>
  </>
);

const target = (
  <div className="flex h-32 w-64 items-center justify-center rounded-lg border border-dashed">
    <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
      Right-click here
    </Text>
  </div>
);

export const Default: Story = {
  args: {
    menu,
    children: target,
  },
};

export const Disabled: Story = {
  args: {
    menu,
    children: target,
    disabled: true,
  },
};

export default meta;
