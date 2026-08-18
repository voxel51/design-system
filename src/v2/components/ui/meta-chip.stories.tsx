import type { Meta, StoryObj } from "@storybook/react-vite";
import { GitBranch, Tag } from "lucide-react";

import { MetaChip } from "@voxel51/voodo/v2";

/**
 * Chip for non-status metadata — task, source, params, tags. Flat by design:
 * no borders, no shadows. Geometry matches `StatusPill`, so metadata chips
 * and status chips line up on the same row.
 *
 * Anything communicating state belongs in `StatusPill` instead.
 */
const meta: Meta<typeof MetaChip> = {
  title: "v2/Components/MetaChip",
  component: MetaChip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["sm", "md"] } },
};
export default meta;

type Story = StoryObj<typeof MetaChip>;

export const Default: Story = { args: { children: "detection" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <MetaChip size="sm">sm</MetaChip>
      <MetaChip size="md">md</MetaChip>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <MetaChip><Tag className="h-3 w-3" /> ground-truth</MetaChip>
      <MetaChip><GitBranch className="h-3 w-3" /> main</MetaChip>
    </div>
  ),
};

/** Sits alongside a StatusPill without a baseline shift. */
export const InARow: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <MetaChip>yolov8n</MetaChip>
      <MetaChip>epochs 50</MetaChip>
      <MetaChip>batch 16</MetaChip>
    </div>
  ),
};
