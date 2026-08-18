import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, Toaster, useToast } from "@voxel51/voodo/v2";

/**
 * Viewport for the Radix toast queue. Mount it once near the application
 * root; it renders whatever `useToast().toast(...)` enqueues.
 *
 * Do not mount it more than once — two viewports means two stacks competing
 * for the same corner. Same rule against mixing it with `SonnerToaster`.
 */
const meta: Meta<typeof Toaster> = {
  title: "v2/Components/Toaster",
  component: Toaster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Queue: Story = {
  render: function QueueStory() {
    const { toast } = useToast();
    return (
      <>
        <Toaster />
        <Button
          variant="secondary"
          onClick={() => {
            toast({ title: "argo-prod started" });
            toast({ title: "qdrant started" });
            toast({ title: "jupyter stopped" });
          }}
        >
          Enqueue three
        </Button>
      </>
    );
  },
};
