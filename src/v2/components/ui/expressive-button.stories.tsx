import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sparkles } from "lucide-react";

import { ExpressiveButton } from "@voxel51/voodo/v2";

/**
 * Gradient CTA for emphasizing something new. Fills with
 * `--gradient-expressive` (warm orange through magenta to violet).
 *
 * Deliberately loud: at most one per screen, reserved for a genuinely new
 * capability. Everything else is a `Button`.
 */
const meta: Meta<typeof ExpressiveButton> = {
  title: "v2/Components/ExpressiveButton",
  component: ExpressiveButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { size: { control: "select", options: ["sm", "md", "lg"] } },
};
export default meta;

type Story = StoryObj<typeof ExpressiveButton>;

export const Default: Story = { args: { children: "Try the new agent" } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ExpressiveButton size="sm">Small</ExpressiveButton>
      <ExpressiveButton size="md">Medium</ExpressiveButton>
      <ExpressiveButton size="lg">Large</ExpressiveButton>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <ExpressiveButton>
      <Sparkles className="h-4 w-4" /> Auto-label with AI
    </ExpressiveButton>
  ),
};
