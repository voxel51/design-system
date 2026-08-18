import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  SelectionActions,
  SelectionPill,
  SelectionTray,
  SonnerToaster,
  selectionStore,
} from "@voxel51/voodo/v2";

/**
 * Selection — the contextual surface shown while samples are selected.
 *
 * Selection is UI state, not application data, so the design system owns the
 * store: `selectionStore` and `useSelection` ship here rather than arriving
 * through an adapter. `SelectionTray` reads it directly, which is why these
 * stories seed the store rather than passing ids.
 *
 * Sending a selection to the agent stays application wiring — `onSendPrompt`.
 */
const meta: Meta<typeof SelectionActions> = {
  title: "v2/Patterns/Selection",
  component: SelectionActions,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof SelectionActions>;

export const Actions: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <SelectionActions count={24} onSendPrompt={() => {}} />
    </>
  ),
};

/** Compact drops the secondary labels for a toolbar swap. */
export const ActionsCompact: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <SelectionActions count={24} compact onSendPrompt={() => {}} />
    </>
  ),
};

export const Pill: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <SelectionPill count={1} onClear={() => {}} />
      <SelectionPill count={248} onClear={() => {}} />
      <SelectionPill count={12} onClear={() => {}} variant="overlay" />
    </div>
  ),
};

/** The tray reads the shared selection store; this story seeds it. */
export const Tray: Story = {
  render: function TrayStory() {
    React.useEffect(() => {
      selectionStore.replace(
        Array.from({ length: 6 }, (_, i) => `sample-${i + 1}`),
        "grid",
      );
      return () => selectionStore.clear();
    }, []);
    return (
      <div className="relative h-72 w-[44rem] rounded-lg bg-card-2">
        <SonnerToaster />
        <SelectionTray />
      </div>
    );
  },
};
