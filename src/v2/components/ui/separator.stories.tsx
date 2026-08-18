import type { Meta, StoryObj } from "@storybook/react-vite";

import { Separator } from "@voxel51/voodo/v2";

/**
 * Divider between content groups. `decorative` (the default) hides it from
 * assistive technology; set `decorative={false}` when the rule genuinely
 * separates two sections a screen-reader user should be told about.
 */
const meta: Meta<typeof Separator> = {
  title: "v2/Components/Separator",
  component: Separator,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { orientation: { control: "radio", options: ["horizontal", "vertical"] } },
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80">
      <p className="text-body-sm">Runtime</p>
      <Separator className="my-3" />
      <p className="text-body-sm text-secondary-foreground">Image, command, port.</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-body-sm">
      <span>Running</span>
      <Separator orientation="vertical" />
      <span>4 workers</span>
      <Separator orientation="vertical" />
      <span>v3.5.1</span>
    </div>
  ),
};
