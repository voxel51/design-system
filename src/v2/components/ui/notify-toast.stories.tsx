import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, SonnerToaster, notify } from "@voxel51/voodo/v2";

/**
 * Bold, colored notification toasts. Four intents, each white-on-color in
 * both themes via the `--toast-*` tokens:
 *
 * - `notify.success` — green, positive confirmations
 * - `notify.error` — red, failures
 * - `notify.info` — blue
 * - `notify.warning` — orange
 *
 * An optional `action` renders a trailing button. Louder than a plain toast
 * by design; use it when the outcome must not be missed.
 */
const meta: Meta = {
  title: "v2/Components/NotifyToast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Intents: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => notify.success("Added to collection")}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => notify.error("Couldn't delete collection")}>
          Error
        </Button>
        <Button variant="secondary" onClick={() => notify.info("Export queued")}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => notify.warning("Quota almost reached")}>
          Warning
        </Button>
      </div>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <Button
        variant="secondary"
        onClick={() =>
          notify.error("Couldn't delete collection", {
            action: { label: "Try again", onClick: () => {} },
          })
        }
      >
        Show
      </Button>
    </>
  ),
};
