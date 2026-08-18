import type { Meta, StoryObj } from "@storybook/react-vite";

import { TextBadge } from "@voxel51/voodo/v2";

/**
 * Small text marker that takes its color from a token class. Defaults to
 * `text-accent`; pass `colorClassName` for a different token.
 *
 * Only token classes belong here — never a raw hex or a `text-gray-*`.
 */
const meta: Meta<typeof TextBadge> = {
  title: "v2/Components/TextBadge",
  component: TextBadge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof TextBadge>;

export const Default: Story = { args: { children: "Beta" } };

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <TextBadge>Accent</TextBadge>
      <TextBadge colorClassName="text-status-success">Stable</TextBadge>
      <TextBadge colorClassName="text-status-warning">Preview</TextBadge>
      <TextBadge colorClassName="text-status-failed">Deprecated</TextBadge>
      <TextBadge colorClassName="text-secondary-foreground">Internal</TextBadge>
    </div>
  ),
};
