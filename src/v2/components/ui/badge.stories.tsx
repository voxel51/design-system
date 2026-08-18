import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "@voxel51/voodo/v2";

/**
 * Small inline label. Four variants: `default` (brand fill), `secondary`,
 * `destructive`, `outline`.
 *
 * For state — running, failed, in review — use `StatusPill`, which carries
 * the status tokens and a state dot. Badge is for classification.
 */
const meta: Meta<typeof Badge> = {
  title: "v2/Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Custom" } };

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
