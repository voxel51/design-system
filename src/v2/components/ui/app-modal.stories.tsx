import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { AppModal, Badge, Button, Input, Label } from "@voxel51/voodo/v2";

/**
 * Opinionated modal wrapper over `Dialog`. Takes title, description, body and
 * footer as props so every modal in the product has the same header spacing,
 * footer order and button placement.
 *
 * Pass `primaryAction` / `secondaryAction` for the common two-button footer,
 * or `footer` to supply your own. `secondaryAction` defaults to a Cancel that
 * closes. `footerBanner` puts a warning directly above the buttons, where it
 * cannot be missed on the way to confirming.
 *
 * Reach for `Dialog` directly only when this shape genuinely does not fit.
 */
const meta: Meta<typeof AppModal> = {
  title: "v2/Components/AppModal",
  component: AppModal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof AppModal>;

export const Default: Story = {
  render: function DefaultStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Rename service</Button>
        <AppModal
          open={open}
          onOpenChange={setOpen}
          title="Rename service"
          description="The id stays the same; only the display name changes."
          primaryAction={{ label: "Rename", onClick: () => setOpen(false) }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="rename">Name</Label>
            <Input id="rename" defaultValue="argo-prod" />
          </div>
        </AppModal>
      </>
    );
  },
};

/** `headerAccessory` sits beside the title; `footerBanner` above the buttons. */
export const WithAccessoryAndBanner: Story = {
  render: function AccessoryStory() {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Edit built-in
        </Button>
        <AppModal
          open={open}
          onOpenChange={setOpen}
          title="Edit argo-prod"
          headerAccessory={<Badge variant="secondary">Built-in</Badge>}
          description="Built-in services allow a limited set of edits."
          footerBanner={
            <div className="flex items-center gap-2 text-body-sm text-status-warning">
              <AlertTriangle className="h-4 w-4" />
              Saving restarts the service.
            </div>
          }
          primaryAction={{ label: "Save", onClick: () => setOpen(false) }}
          secondaryAction={{ label: "Discard", onClick: () => setOpen(false) }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-endpoint">Endpoint</Label>
            <Input id="modal-endpoint" defaultValue="https://argo.internal:2746" />
          </div>
        </AppModal>
      </>
    );
  },
};

/** Disable the primary action while the form is incomplete. */
export const DisabledPrimary: Story = {
  render: function DisabledStory() {
    const [open, setOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    return (
      <>
        <Button onClick={() => setOpen(true)}>New service</Button>
        <AppModal
          open={open}
          onOpenChange={setOpen}
          title="New service"
          primaryAction={{
            label: "Create",
            onClick: () => setOpen(false),
            disabled: name.trim().length === 0,
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="argo-prod"
            />
          </div>
        </AppModal>
      </>
    );
  },
};
