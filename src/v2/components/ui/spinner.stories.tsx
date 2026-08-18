import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Spinner } from "@voxel51/voodo/v2";

/**
 * Indeterminate loading indicator, for waits with no known duration. Where
 * progress is measurable use `Progress`; where layout is known ahead of time
 * use `Skeleton`, which avoids a content jump.
 */
const meta: Meta<typeof Spinner> = {
  title: "v2/Components/Spinner",
  component: Spinner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

/** Size and color come from the surrounding text context. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner className="h-3 w-3" />
      <Spinner className="h-4 w-4" />
      <Spinner className="h-6 w-6" />
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  ),
};

export const InButton: Story = {
  render: () => (
    <Button disabled>
      <Spinner className="h-4 w-4" /> Starting service
    </Button>
  ),
};
