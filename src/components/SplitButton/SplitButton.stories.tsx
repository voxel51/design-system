import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  IconName,
  MenuIconTextItem,
  MenuTextItem,
  SplitButton,
} from "@voxel51/voodo";

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
  },
};

type Story = StoryObj<typeof SplitButton>;

export const Default: Story = {
  args: {
    children: "Schedule",
    menu: (
      <>
        <MenuIconTextItem icon={IconName.Play} text="Run now" />
        <MenuTextItem>Save as draft</MenuTextItem>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export default meta;
