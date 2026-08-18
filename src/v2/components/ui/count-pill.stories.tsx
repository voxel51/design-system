import type { Meta, StoryObj } from "@storybook/react-vite";

import { CountPill } from "@voxel51/voodo/v2";

/**
 * Numeric count badge.
 *
 * | Size | Height | Use for |
 * |---|---|---|
 * | `sm` | 20px | facet counts, thread counts, list-row badges — the default |
 * | `md` | 24px | section headers, standalone counts |
 * | `lg` | 28px | hero and summary counts, empty-state KPIs |
 *
 * `primary` tone marks the count as active or selected; `neutral` is the
 * resting state.
 */
const meta: Meta<typeof CountPill> = {
  title: "v2/Components/CountPill",
  component: CountPill,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["neutral", "primary"] },
  },
};
export default meta;

type Story = StoryObj<typeof CountPill>;

export const Default: Story = { args: { count: 12 } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CountPill count={8} size="sm" />
      <CountPill count={8} size="md" />
      <CountPill count={8} size="lg" />
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CountPill count={24} tone="neutral" />
      <CountPill count={24} tone="primary" />
    </div>
  ),
};

export const LargeNumbers: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <CountPill count={9} />
      <CountPill count={99} />
      <CountPill count={1284} />
    </div>
  ),
};
