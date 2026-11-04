import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, TextAction } from "@voxel51/voodo";

const meta: Meta<typeof Alert> = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { children: "PackageError: umap-learn is not installed" },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Failure: Story = {};

export const WithAction: Story = {
  args: { action: <TextAction size="sm">View errors</TextAction> },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      {(["failure", "warning", "info", "success"] as const).map((tone) => (
        <Alert key={tone} tone={tone}>
          {tone}
        </Alert>
      ))}
    </div>
  ),
};
