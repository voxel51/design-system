import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Toaster, toast, useToast } from "@voxel51/voodo/v2";

/**
 * Toast store for the Radix stack. `useToast()` returns `{ toasts, toast,
 * dismiss }`; the standalone `toast()` does the same from outside React.
 *
 * `toast()` returns a handle with `id`, `update` and `dismiss`, so a toast
 * raised when work starts can be rewritten in place when it finishes rather
 * than stacking a second one.
 *
 * Requires a mounted `Toaster`.
 */
const meta: Meta = {
  title: "v2/Components/useToast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const DismissProgrammatically: Story = {
  render: function DismissStory() {
    const { dismiss } = useToast();
    return (
      <>
        <Toaster />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => toast({ title: "Working…", duration: 60_000 })}
          >
            Show sticky toast
          </Button>
          <Button variant="secondary" onClick={() => dismiss()}>
            Dismiss all
          </Button>
        </div>
      </>
    );
  },
};

/** Update in place instead of raising a second toast. */
export const UpdateInPlace: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => {
          const t = toast({ title: "Starting argo-prod…", duration: 60_000 });
          window.setTimeout(
            () => t.update({ id: t.id, title: "argo-prod is running", duration: 3000 }),
            1200,
          );
        }}
      >
        Start service
      </Button>
    </>
  ),
};
