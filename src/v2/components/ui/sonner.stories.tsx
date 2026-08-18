import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, SonnerToaster, sonnerToast } from "@voxel51/voodo/v2";

/**
 * Sonner toast host and imperative API. Mount `SonnerToaster` once near the
 * application root, then call `sonnerToast(...)` from anywhere.
 *
 * Exported from the flat barrel under prefixed names because the Radix toast
 * (`toaster.tsx`) already claims `Toaster` and `toast`. At the subpath —
 * `@voxel51/voodo/v2/sonner` — they keep their original names.
 *
 * Theme is read from the `.dark` class on the root element rather than from
 * next-themes, so it follows the design system's own switch.
 */
const meta: Meta = {
  title: "v2/Components/Sonner",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

export const Variants: Story = {
  render: () => (
    <>
      <SonnerToaster />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => sonnerToast("Service started")}>
          Default
        </Button>
        <Button variant="secondary" onClick={() => sonnerToast.success("Service started")}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => sonnerToast.error("Failed to start")}>
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            sonnerToast("Service stopped", {
              description: "argo-prod · stopped just now",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          With action
        </Button>
      </div>
    </>
  ),
};
