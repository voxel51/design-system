import type { Meta, StoryObj } from "@storybook/react-vite";

import { UploadList } from "@voxel51/voodo";

const meta: Meta<typeof UploadList> = {
  title: "Components/UploadList",
  component: UploadList,
  parameters: { layout: "padded" },
};

type Story = StoryObj<typeof UploadList>;

export const Default: Story = {
  args: {
    items: [
      { id: "a", name: "a.jpg", kind: "JPG", size: 20480 },
      { id: "b", name: "b.jpg", kind: "JPG", size: 18432 },
      { id: "c", name: "labels.json", kind: "JSON labels", size: 4096 },
    ],
    onRemove: () => undefined,
    onRemoveAll: () => undefined,
  },
};

export default meta;
