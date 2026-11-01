import type { Meta, StoryObj } from "@storybook/react-vite";

import { IconAction, ListRow, PinIcon, StatusDot } from "@voxel51/voodo";

const meta: Meta<typeof ListRow> = {
  title: "Components/ListRow",
  component: ListRow,
};

type Story = StoryObj<typeof ListRow>;

export const Default: Story = {
  render: () => (
    <div className="flex w-56 flex-col gap-0.5">
      <ListRow
        href="#"
        leading={<StatusDot color="status-progress-text" pulse />}
        title="Similarity index refresh"
        subtitle="Pest Detection 1K · 2 minutes ago"
      />
      <ListRow
        href="#"
        leading={<StatusDot color="status-failed-text" />}
        title="Metadata & thumbnails"
        subtitle="City Cams (multimodal) · 1 hour ago"
      />
      <ListRow
        href="#"
        title="quickstart-groups"
        actions={<IconAction icon={PinIcon} aria-label="Unpin" />}
      />
    </div>
  ),
};

export const ActiveAndDisabled: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-0.5">
      <ListRow title="Compute visualization" subtitle="@voxel51/brain" active />
      <ListRow title="Export dataset" subtitle="@voxel51/io" />
      <ListRow
        title="Delete samples"
        subtitle="@voxel51/utils"
        disabled
        actions={<IconAction icon={PinIcon} aria-label="Pin" />}
      />
    </div>
  ),
};

export default meta;
