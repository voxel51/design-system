import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Boxes, Database, NotebookPen, Workflow } from "lucide-react";

import {
  BrandIcon,
  ServiceSheet,
  ServicesView,
  SonnerToaster,
  brandLabel,
  type Service,
} from "@voxel51/voodo/v2";

/**
 * Admin Services page — filter and search header, stat strip, and a table of
 * services with per-user instances as expandable child rows.
 *
 * The whole page is one component. That is the point of the pattern layer:
 * the caller supplies `Service[]` and callbacks, not a composition of forty
 * primitives.
 *
 * Ported from the Lovable master with markup unchanged; only the data seams
 * moved — services arrive as a prop, status changes call `onStatusChange`,
 * and the focused id is a prop rather than a router read.
 */
const meta: Meta<typeof ServicesView> = {
  title: "v2/Patterns/Services",
  component: ServicesView,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ServicesView>;

const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

const SERVICES: Service[] = [
  {
    id: "argo-prod",
    name: "argo-prod",
    kindGroup: "Orchestrator",
    kindDetail: "Argo on Kubernetes",
    description: "Runs delegated operations for this workspace.",
    endpoint: "https://argo.internal:2746",
    version: "v3.5.1",
    icon: Workflow,
    accent: "indigo",
    deployment: "kubernetes",
    backend: "argo",
    scope: "global",
    origin: "builtin",
    status: "running",
    since: ago(3 * 60 * 60 * 1000),
  },
  {
    id: "qdrant",
    name: "qdrant",
    kindGroup: "Vector index",
    description: "Similarity search over sample embeddings.",
    version: "v1.9.0",
    icon: Database,
    accent: "teal",
    deployment: "docker",
    backend: "qdrant",
    scope: "global",
    origin: "builtin",
    status: "running",
    since: ago(26 * 60 * 60 * 1000),
  },
  {
    id: "jupyter",
    name: "jupyter",
    kindGroup: "Notebook server",
    description: "One notebook server per member.",
    icon: NotebookPen,
    accent: "amber",
    backend: "jupyter",
    scope: "per-user",
    origin: "builtin",
    status: "running",
    since: ago(45 * 60 * 1000),
    instances: [
      {
        id: "i-1",
        userId: "u1",
        userName: "Ritchie Martori",
        userEmail: "ritchie@voxel51.com",
        status: "running",
        since: ago(45 * 60 * 1000),
      },
      {
        id: "i-2",
        userId: "u2",
        userName: "Sejal Kotak",
        userEmail: "sejal@voxel51.com",
        status: "stopped",
        since: ago(4 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "ray-head",
    name: "ray-head",
    kindGroup: "Compute pool",
    description: "Shared GPU capacity for training runs.",
    icon: Boxes,
    accent: "rose",
    deployment: "kubernetes",
    backend: "ray",
    scope: "global",
    origin: "custom",
    status: "error",
    since: ago(12 * 60 * 1000),
  },
];

export const Default: Story = {
  render: () => (
    <div className="h-[42rem]">
      <SonnerToaster />
      <ServicesView services={SERVICES} />
    </div>
  ),
};

/** Nothing registered yet. */
export const Empty: Story = {
  render: () => (
    <div className="h-[42rem]">
      <ServicesView services={[]} />
    </div>
  ),
};

/** `focusId` scrolls to a service, expands it and opens its sheet. */
export const FocusedService: Story = {
  render: () => (
    <div className="h-[42rem]">
      <SonnerToaster />
      <ServicesView services={SERVICES} focusId="jupyter" />
    </div>
  ),
};

/** The create/edit sheet on its own. Without `onSave` it runs in demo mode. */
export const Sheet: Story = {
  render: function SheetStory() {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="p-8">
        <SonnerToaster />
        <ServiceSheet open={open} onOpenChange={setOpen} />
      </div>
    );
  },
};

/** Editing a built-in service allows a limited set of fields. */
export const SheetEditingBuiltin: Story = {
  render: function EditStory() {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="p-8">
        <SonnerToaster />
        <ServiceSheet open={open} onOpenChange={setOpen} service={SERVICES[0]} />
      </div>
    );
  },
};

/** Deployment and backend badges. */
export const BrandIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 p-8">
      {(Object.keys(brandLabel) as (keyof typeof brandLabel)[]).map((name) => (
        <div key={name} className="flex items-center gap-2 text-body-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-card-2 text-muted-foreground">
            <BrandIcon name={name} size={13} />
          </span>
          {brandLabel[name]}
        </div>
      ))}
    </div>
  ),
};
