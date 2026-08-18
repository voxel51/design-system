import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Toaster, useToast } from "@voxel51/voodo/v2";

/**
 * Radix toast, driven by the `useToast` hook and rendered by `Toaster`.
 * Mount `Toaster` once near the application root.
 *
 * Two toast systems ship here. This one is the Radix stack with a queue and a
 * viewport; `Sonner` is the stacked-notification alternative. Pick one per
 * application — running both means two viewports competing for the same
 * corner.
 */
const meta: Meta = {
  title: "v2/Components/Toast",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: function DefaultStory() {
    const { toast } = useToast();
    return (
      <>
        <Toaster />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => toast({ title: "Service started", description: "argo-prod is running." })}
          >
            Show toast
          </Button>
          <Button
            variant="secondary-danger"
            onClick={() =>
              toast({
                variant: "destructive",
                title: "Failed to start",
                description: "Exit code 137 — out of memory.",
              })
            }
          >
            Destructive
          </Button>
        </div>
      </>
    );
  },
};
