import type { Meta, StoryObj } from "@storybook/react-vite";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@voxel51/voodo/v2";

/**
 * Primary action control. Eleven variants across three intents: neutral
 * (`default`, `secondary`, `outline`, `ghost`, `link`), approve/reject
 * (`positive`, `negative`), and destructive (`destructive`,
 * `secondary-danger`).
 *
 * `positive` / `negative` are the approve and reject actions. `success` and
 * `danger` exist for legacy call sites — status colors belong on chips, not
 * buttons.
 *
 * `asChild` renders the child element with the button's styling, so a link
 * stays a link.
 */
const meta: Meta<typeof Button> = {
  title: "v2/Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "link",
        "positive",
        "negative",
        "destructive",
        "secondary-danger",
        "success",
        "danger",
      ],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
    asChild: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: "Save changes" } };

/** Every variant, in intent order. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="positive">Approve</Button>
      <Button variant="negative">Reject</Button>
      <Button variant="destructive">Delete</Button>
      <Button variant="secondary-danger">Delete</Button>
    </div>
  ),
};

/** `sm` and `default` share a height; `lg` steps up to 40px. */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
};

/** Icons are sized by the button (`[&_svg]:size-4`); do not size them at the call site. */
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button>
        <Plus /> New service
      </Button>
      <Button variant="secondary-danger">
        <Trash2 /> Delete
      </Button>
      <Button disabled>
        <Loader2 className="animate-spin" /> Saving
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: "Unavailable", disabled: true },
};
