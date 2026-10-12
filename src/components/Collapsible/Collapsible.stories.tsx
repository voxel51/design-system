import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Collapsible,
  IconName,
  Text,
  TextAction,
  TextColor,
  TextVariant,
} from "@voxel51/voodo";

const meta: Meta<typeof Collapsible> = {
  title: "Components/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

type Story = StoryObj<typeof Collapsible>;

/**
 * Collapsible owns only the open/close animation; the header render prop
 * supplies the control. There is no Figma component for it.
 */
export const Default: Story = {
  args: {
    defaultOpen: true,
    header: ({ open, toggle }) => (
      <TextAction
        onClick={toggle}
        trailingIcon={open ? IconName.ChevronTop : IconName.ChevronBottom}
      >
        Advanced settings
      </TextAction>
    ),
    children: (
      <div className="px-4 py-2">
        <Text variant={TextVariant.BodySecondary} color={TextColor.Secondary}>
          Minimum confidence, label filters and export format live here.
        </Text>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: { ...Default.args, defaultOpen: false },
};

export default meta;
