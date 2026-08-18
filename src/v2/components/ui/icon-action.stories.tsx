import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowLeft, MoreVertical, Trash2, X } from "lucide-react";

import { IconAction } from "@voxel51/voodo/v2";

/**
 * Circular icon-only button. Every icon-only action goes through this — back,
 * close, kebab, toolbar action, panel header control. Never hand-roll
 * `rounded-full + h-? w-? + flex items-center justify-center`.
 *
 * | Size | Hit area | Icon | Use for |
 * |---|---|---|---|
 * | `sm` | 24px | 14px | dense rails, panel headers, in-card kebabs |
 * | `md` | 28px | 14px | default — back, close, list-row actions |
 * | `lg` | 32px | 16px | prominent toolbar actions on the app shell |
 *
 * Do not override `h-*`, `w-*` or `[&_svg]:size-*` at the call site; add a
 * variant here instead.
 *
 * Every icon-only action needs a label. Pass `tooltip` (which wraps the
 * action in the shared Tooltip) plus `aria-label`. Omit `tooltip` when the
 * IconAction is itself a `*Trigger asChild` child — it breaks the Slot — and
 * rely on `aria-label` there.
 */
const meta: Meta<typeof IconAction> = {
  title: "v2/Components/IconAction",
  component: IconAction,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    tone: { control: "select", options: ["default", "danger"] },
    disabled: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof IconAction>;

export const Default: Story = {
  args: { "aria-label": "Close", children: <X /> },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconAction size="sm" aria-label="Small"><X /></IconAction>
      <IconAction size="md" aria-label="Medium"><X /></IconAction>
      <IconAction size="lg" aria-label="Large"><X /></IconAction>
    </div>
  ),
};

/** `danger` tone for destructive actions. */
export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconAction aria-label="More"><MoreVertical /></IconAction>
      <IconAction tone="danger" aria-label="Delete"><Trash2 /></IconAction>
    </div>
  ),
};

/** Preferred form — the built-in tooltip labels the action on hover. */
export const WithTooltip: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconAction tooltip="Back" aria-label="Back"><ArrowLeft /></IconAction>
      <IconAction tooltip="Close" aria-label="Close"><X /></IconAction>
    </div>
  ),
};

export const Disabled: Story = {
  args: { "aria-label": "Delete", disabled: true, children: <Trash2 /> },
};
