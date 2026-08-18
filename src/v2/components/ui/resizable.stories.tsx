import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@voxel51/voodo/v2";

/**
 * Draggable split panes on react-resizable-panels. Sizes are percentages, and
 * handles are keyboard-operable with arrow keys.
 *
 * `withHandle` draws a visible grip; without it the divider is still
 * draggable but only shows on hover.
 */
const meta: Meta<typeof ResizablePanelGroup> = {
  title: "v2/Components/Resizable",
  component: ResizablePanelGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ResizablePanelGroup>;

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-56 w-[36rem] rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center text-body-sm text-secondary-foreground">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center text-body-sm text-secondary-foreground">
          Content
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="h-56 w-[36rem] rounded-lg border border-border"
    >
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center text-body-sm text-secondary-foreground">
          Canvas
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={40}>
        <div className="flex h-full items-center justify-center font-mono text-meta text-secondary-foreground">
          Logs
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
