import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "@voxel51/voodo/v2";

/**
 * Placeholder block for content that is loading. Match the shape of what
 * will replace it, so nothing jumps when the data lands.
 *
 * Use for known layouts; use `Spinner` when the shape is unknown.
 */
const meta: Meta<typeof Skeleton> = {
  title: "v2/Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
};

/** Shaped to a service row: icon tile, name, description. */
export const ListRow: Story = {
  render: () => (
    <div className="flex w-96 items-center gap-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3 rounded-lg bg-card-2 p-4">
      <Skeleton className="h-32 w-full rounded-md" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  ),
};
