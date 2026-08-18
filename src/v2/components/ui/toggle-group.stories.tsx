import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@voxel51/voodo/v2";

/**
 * Set of related toggles sharing one selection state. `type="single"` behaves
 * like a segmented control; `type="multiple"` allows any combination.
 *
 * Arrow keys move between items. Icon-only items need an `aria-label`.
 */
const meta: Meta<typeof ToggleGroup> = {
  title: "v2/Components/ToggleGroup",
  component: ToggleGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ToggleGroup>;

export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={["boxes"]}>
      <ToggleGroupItem value="boxes">Boxes</ToggleGroupItem>
      <ToggleGroupItem value="masks">Masks</ToggleGroupItem>
      <ToggleGroupItem value="keypoints">Keypoints</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="a" disabled>
      <ToggleGroupItem value="a">Locked</ToggleGroupItem>
      <ToggleGroupItem value="b">Also locked</ToggleGroupItem>
    </ToggleGroup>
  ),
};
