import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Clickable, Icon, IconName, ListItem } from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";

const meta: Meta<typeof ListItem> = {
  title: "Components/ListItem",
  component: ListItem,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    canDrag: {
      control: "boolean",
      description: "Whether list item can be dragged",
    },
    canSelect: {
      control: "boolean",
      description: "Whether list item can be selected",
    },
    primaryContent: {
      control: "text",
      description: "Primary item content",
    },
    secondaryContent: {
      control: "text",
      description: "Secondary item content",
    },
  },
  decorators: [withContainer()],
};

type Story = StoryObj<typeof ListItem>;

export const Selectable: Story = {
  args: {
    canSelect: true,
    primaryContent: "Selectable list item",
  },
};

export const Draggable: Story = {
  args: {
    canDrag: true,
    primaryContent: "Draggable list item",
  },
};

export const WithPrimaryContent: Story = {
  args: {
    primaryContent: "Primary content goes here",
  },
};

export const withSecondaryContent: Story = {
  args: {
    primaryContent: "Primary content goes here",
    secondaryContent: "Secondary content goes here",
  },
};

export const WithActions: Story = {
  args: {
    primaryContent: "List item with actions",
    secondaryContent: "Click an action",
    actions: (
      <span className="flex gap-x-md align-items text-content-text-primary">
        <Clickable className="size-5">
          <Icon name={IconName.Delete} />
        </Clickable>
        <Clickable className="size-5">
          <WrenchScrewdriverIcon />
        </Clickable>
      </span>
    ),
  },
};

export default meta;
