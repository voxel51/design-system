import type { Meta, StoryObj } from "@storybook/react-vite";

import { ActivityToaster, Button, activityToast } from "@voxel51/voodo/v2";

/**
 * Compact activity indicator for background work — autosave, run launch,
 * pause and resume. Mount `ActivityToaster` once, then drive it imperatively.
 *
 * Distinct from `notify`: this one occupies a single fixed slot and replaces
 * its own content as the operation moves through processing → success, so
 * rapid saves cannot stack up into a wall of toasts.
 */
const meta: Meta = {
  title: "v2/Components/ActivityToast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const States: Story = {
  render: () => (
    <>
      <ActivityToaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => activityToast.processing("Saving…")}>
          Processing
        </Button>
        <Button variant="secondary" onClick={() => activityToast.success("Saved")}>
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() => activityToast.error("Couldn't save", "Please try again.")}
        >
          Error
        </Button>
        <Button variant="secondary" onClick={() => activityToast.reset()}>
          Reset
        </Button>
      </div>
    </>
  ),
};

/** The usual sequence: processing, then success, which auto-hides. */
export const SaveCycle: Story = {
  render: () => (
    <>
      <ActivityToaster />
      <Button
        onClick={() => {
          activityToast.processing("Saving…");
          window.setTimeout(() => activityToast.success("Saved"), 1200);
        }}
      >
        Run a save
      </Button>
    </>
  ),
};
