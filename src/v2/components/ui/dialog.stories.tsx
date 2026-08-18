import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@voxel51/voodo/v2";

/**
 * Modal dialog on Radix. Focus is trapped while open and returns to the
 * trigger on close; Escape and overlay click dismiss.
 *
 * `DialogTitle` is required — Radix uses it as the accessible name and warns
 * when it is missing. Use `AlertDialog` instead when the user must choose and
 * cannot dismiss by clicking away.
 */
const meta: Meta<typeof Dialog> = {
  title: "v2/Components/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit argo-prod</DialogTitle>
          <DialogDescription>
            Changes to runtime fields restart the service.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">View details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Service details</DialogTitle>
        </DialogHeader>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-body-sm">
          <dt className="text-secondary-foreground">Endpoint</dt>
          <dd className="font-mono">https://argo.internal:2746</dd>
          <dt className="text-secondary-foreground">Version</dt>
          <dd className="font-mono">v3.5.1</dd>
        </dl>
      </DialogContent>
    </Dialog>
  ),
};
