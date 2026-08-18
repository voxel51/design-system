import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bold, Italic, Underline } from "lucide-react";

import { Toggle, ToggleGroup, ToggleGroupItem } from "@voxel51/voodo/v2";

/**
 * Two-state button that stays pressed. Carries `aria-pressed`, so it reads as
 * a toggle rather than an action.
 *
 * `Switch` is for settings that apply immediately; `Toggle` is for a mode
 * that stays on while you work, like a formatting mark or an annotation tool.
 */
const meta: Meta<typeof Toggle> = {
  title: "v2/Components/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Bold">
      <Bold className="h-4 w-4" />
    </Toggle>
  ),
};

/** `type="multiple"` allows any combination; `type="single"` is exclusive. */
export const Group: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["bold"]}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const SingleSelection: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="box">
      <ToggleGroupItem value="box">Box</ToggleGroupItem>
      <ToggleGroupItem value="polygon">Polygon</ToggleGroupItem>
      <ToggleGroupItem value="mask">Mask</ToggleGroupItem>
    </ToggleGroup>
  ),
};
