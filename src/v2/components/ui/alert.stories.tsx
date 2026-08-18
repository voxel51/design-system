import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertTriangle, Info } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@voxel51/voodo/v2";

/**
 * Inline message attached to the surrounding content. Two variants:
 * `default` and `destructive`.
 *
 * Alerts persist and stay in the layout. For transient feedback about an
 * action just taken, use a toast.
 */
const meta: Meta<typeof Alert> = {
  title: "v2/Components/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: { variant: { control: "select", options: ["default", "destructive"] } },
  decorators: [(Story) => <div className="w-[32rem]"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Restart required</AlertTitle>
      <AlertDescription>
        Runtime fields changed. The service restarts on save.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Service failed to start</AlertTitle>
      <AlertDescription>
        Exit code 137 — the container was out of memory.
      </AlertDescription>
    </Alert>
  ),
};

/** Title alone, when the detail adds nothing. */
export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Two services are stopped.</AlertTitle>
    </Alert>
  ),
};
