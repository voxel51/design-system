import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton, Stack } from "@voxel51/voodo";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  args: { width: 240, height: 16 },
};

export const Page: Story = {
  render: () => (
    <Stack orientation="col" spacing="md" className="w-[360px]">
      <Skeleton width={180} height={20} />
      <Skeleton />
      <Skeleton width="80%" />
      <Skeleton height={96} radius={12} />
    </Stack>
  ),
};

export default meta;
