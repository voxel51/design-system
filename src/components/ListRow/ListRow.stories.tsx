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

export default meta;
