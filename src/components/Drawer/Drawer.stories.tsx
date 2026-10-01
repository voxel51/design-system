import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Drawer,
  IconAction,
  IconName,
  Text,
  TextColor,
  TextVariant,
} from "@voxel51/voodo";

const meta: Meta<typeof Drawer> = {
  title: "Components/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative h-[360px] w-full overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof Drawer>;

const content = (
  <div className="p-4">
    <Text variant={TextVariant.HeadingSm}>Sample details</Text>
    <Text variant={TextVariant.BodySecondary} color={TextColor.Secondary}>
      Drag the handle to resize; the header toggle collapses the drawer.
    </Text>
  </div>
);

/** A resizable panel docked to one edge. There is no Figma component for it. */
export const Bottom: Story = {
  args: {
    side: "bottom",
    maxSize: 240,
    defaultOpen: true,
    header: ({ open, toggle }) => (
      <div className="flex items-center justify-between px-3 py-1">
        <Text variant={TextVariant.Label} color={TextColor.Secondary}>
          Details
        </Text>
        <IconAction
          aria-label={open ? "Collapse" : "Expand"}
          icon={open ? IconName.ChevronBottom : IconName.ChevronTop}
          onClick={toggle}
        />
      </div>
    ),
    children: content,
  },
};

export const Right: Story = {
  args: { ...Bottom.args, side: "right", maxSize: 320 },
};

export default meta;
