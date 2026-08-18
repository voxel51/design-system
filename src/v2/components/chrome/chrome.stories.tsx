import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Filter, Layers, Plus, Search, SlidersHorizontal } from "lucide-react";

import {
  Button,
  DropdownActionItem,
  DropdownHeading,
  DropdownPanel,
  DropdownSelectItem,
  DropdownToggleItem,
  IconAction,
  IconTooltip,
  PanelEmptyState,
  PanelHeader,
  VoxelIcon,
} from "@voxel51/voodo/v2";

/**
 * Chrome — application-shell pieces that are design-system material but sit
 * outside `components/ui` in the Lovable master, and so went uncounted by any
 * coverage check that only reads that directory.
 *
 * `IconTooltip` alone has nine call sites there. `PanelEmptyState` is one of
 * the patterns design has asked for by name.
 */
const meta: Meta = {
  title: "v2/Chrome",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

/** Label for an icon-only control. Thin wrapper over the shared Tooltip. */
export const Tooltips: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconTooltip label="Filter samples">
        <IconAction aria-label="Filter">
          <Filter />
        </IconAction>
      </IconTooltip>
      <IconTooltip label="Display settings" side="right">
        <IconAction aria-label="Display">
          <SlidersHorizontal />
        </IconAction>
      </IconTooltip>
    </div>
  ),
};

/** Nothing to show yet, inside a panel rather than a whole page. */
export const EmptyState: Story = {
  render: () => (
    <div className="h-72 w-[38rem] rounded-lg border border-border">
      <PanelEmptyState
        icon={Layers}
        title="No collections yet"
        description="Group the datasets you work with together, and share a collection with your team."
        action={
          <Button>
            <Plus /> New collection
          </Button>
        }
      />
    </div>
  ),
};

/** Without a CTA, when there is nothing useful for the user to do here. */
export const EmptyStateWithoutAction: Story = {
  render: () => (
    <div className="h-72 w-[38rem] rounded-lg border border-border">
      <PanelEmptyState
        icon={Search}
        title="No matches"
        description="No samples match the current filter."
      />
    </div>
  ),
};

/**
 * Floating panel for menu-like surfaces with richer rows than a
 * `DropdownMenu` — headings, toggles and multi-line actions.
 */
export const Dropdown: Story = {
  render: function DropdownStory() {
    const [open, setOpen] = React.useState(true);
    const [sort, setSort] = React.useState("recent");
    const [dense, setDense] = React.useState(true);
    return (
      <div className="relative h-80">
        <Button variant="secondary" onClick={() => setOpen((o) => !o)}>
          Toggle panel
        </Button>
        {open && (
          <div className="mt-2">
            <DropdownPanel onClose={() => setOpen(false)} width="w-60">
              <DropdownHeading>Sort by</DropdownHeading>
              <DropdownSelectItem
                label="Most recent"
                selected={sort === "recent"}
                onClick={() => setSort("recent")}
              />
              <DropdownSelectItem
                label="Name"
                selected={sort === "name"}
                onClick={() => setSort("name")}
              />
              <DropdownHeading>View</DropdownHeading>
              <DropdownToggleItem
                icon={Layers}
                label="Dense rows"
                active={dense}
                onClick={() => setDense((d) => !d)}
              />
              <DropdownActionItem
                icon={Plus}
                label="New collection"
                desc="Group datasets together"
                onClick={() => {}}
              />
            </DropdownPanel>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Agent panel header — tabs, history and settings toggles.
 *
 * Named for a panel but shaped for one specific panel: `activeTab` is
 * `"chat" | "skills"` and the actions are new-chat and history. Generalizing
 * it is a separate change; documenting it as-is beats pretending it is a
 * neutral header.
 */
export const AgentPanelHeader: Story = {
  render: function HeaderStory() {
    const [tab, setTab] = React.useState<"chat" | "skills">("chat");
    const [history, setHistory] = React.useState(false);
    return (
      <div className="w-[30rem] rounded-lg border border-border">
        <PanelHeader
          activeTab={tab}
          onTabChange={setTab}
          showHistory={history}
          onToggleHistory={setHistory}
          onNewChat={() => {}}
          onClose={() => {}}
        />
      </div>
    );
  },
};

/** Brand mark. `idle` runs the ambient animation; `animate` the active one. */
export const Brand: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <VoxelIcon size={24} />
      <VoxelIcon size={40} />
      <VoxelIcon size={64} />
      <VoxelIcon size={64} idle={false} />
    </div>
  ),
};
