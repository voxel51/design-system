import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus, Trash2 } from "lucide-react";

import { TextAction } from "@voxel51/voodo/v2";

/**
 * Borderless pill button for secondary actions. Use anywhere you would
 * otherwise hand-roll `rounded-full px-2 text-secondary-foreground
 * hover:bg-card-2`.
 *
 * Works with icon + label, icon only, or label only. When the trigger is
 * icon-only *and* circular, use `IconAction` instead.
 */
const meta: Meta<typeof TextAction> = {
  title: "v2/Components/TextAction",
  component: TextAction,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    tone: { control: "select", options: ["default", "muted", "danger"] },
  },
};
export default meta;

type Story = StoryObj<typeof TextAction>;

export const Default: Story = { args: { children: "New chat" } };

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <TextAction>Default</TextAction>
      <TextAction tone="muted">Muted</TextAction>
      <TextAction tone="danger">Danger</TextAction>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <TextAction size="sm">Small</TextAction>
      <TextAction size="md">Medium</TextAction>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <TextAction><Plus className="h-3.5 w-3.5" /> New chat</TextAction>
      <TextAction tone="danger"><Trash2 className="h-3.5 w-3.5" /> Remove</TextAction>
    </div>
  ),
};
