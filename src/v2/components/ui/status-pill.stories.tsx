import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusPill } from "@voxel51/voodo/v2";

/**
 * Status chip. Tones map onto the status tokens:
 *
 * | Tone | Token | Means |
 * |---|---|---|
 * | `reviewed` | status-success | done, approved |
 * | `in-review` | primary | review pending, needs attention |
 * | `not-started` | status-default | not begun |
 * | `generating` | status-progress | long-running computation |
 * | `failed` | status-failed | error, subtle background |
 * | `failed-solid` | status-failed | error, solid emphasis |
 *
 * `spinning` animates the dot for in-flight work. `withCaret` marks the pill
 * as a menu trigger. Status colors belong here, never on a Button.
 */
const meta: Meta<typeof StatusPill> = {
  title: "v2/Components/StatusPill",
  component: StatusPill,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: "select",
      options: ["reviewed", "in-review", "not-started", "generating", "failed", "failed-solid"],
    },
    withCaret: { control: "boolean" },
    showDot: { control: "boolean" },
    spinning: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof StatusPill>;

export const Default: Story = { args: { label: "Reviewed", tone: "reviewed" } };

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill tone="reviewed" label="Reviewed" />
      <StatusPill tone="in-review" label="In review" />
      <StatusPill tone="not-started" label="Not started" />
      <StatusPill tone="generating" label="Generating" />
      <StatusPill tone="failed" label="Failed" />
      <StatusPill tone="failed-solid" label="Failed" />
    </div>
  ),
};

/** Spinning dot for work in flight. */
export const InProgress: Story = {
  args: { tone: "generating", label: "Training", spinning: true },
};

/** Caret marks the pill as a dropdown trigger. */
export const AsTrigger: Story = {
  args: { tone: "in-review", label: "In review", withCaret: true },
};

export const WithoutDot: Story = {
  args: { tone: "reviewed", label: "Reviewed", showDot: false },
};
