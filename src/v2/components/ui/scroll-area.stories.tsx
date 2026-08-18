import type { Meta, StoryObj } from "@storybook/react-vite";

import { ScrollArea, Separator } from "@voxel51/voodo/v2";

/**
 * Scroll container with a styled scrollbar that looks the same on every
 * platform. Native scrolling and keyboard behavior are preserved.
 *
 * Plain `overflow-auto` is fine for full-page scrolling; use this where a
 * macOS overlay scrollbar would otherwise vanish inside a panel.
 */
const meta: Meta<typeof ScrollArea> = {
  title: "v2/Components/ScrollArea",
  component: ScrollArea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-56 w-72 rounded-md border border-border">
      <div className="p-4">
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i}>
            <div className="py-2 font-mono text-body-sm">worker-{i + 1}</div>
            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
