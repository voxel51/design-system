import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar, AvatarFallback, AvatarImage } from "@voxel51/voodo/v2";

/**
 * User image with a fallback. `AvatarFallback` renders while the image loads
 * and if it fails, so initials are always supplied — never rely on the image
 * alone.
 */
const meta: Meta<typeof Avatar> = {
  title: "v2/Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>RM</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-caption">RM</AvatarFallback>
      </Avatar>
      <Avatar className="h-9 w-9">
        <AvatarFallback className="text-meta">SK</AvatarFallback>
      </Avatar>
      <Avatar className="h-12 w-12">
        <AvatarFallback>TM</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/** A broken src falls back rather than showing a broken image. */
export const BrokenImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://example.invalid/missing.png" alt="" />
      <AvatarFallback>MO</AvatarFallback>
    </Avatar>
  ),
};
