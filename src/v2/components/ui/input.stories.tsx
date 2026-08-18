import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input, Label } from "@voxel51/voodo/v2";

/**
 * Single-line text field. Border moves through `--input` → `--input-hover`
 * → `--input-focus`; placeholder uses `--placeholder-foreground`.
 *
 * Accepts every native input attribute, so `type`, `required` and
 * `pattern` work as usual.
 */
const meta: Meta<typeof Input> = {
  title: "v2/Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "select", options: ["text", "email", "password", "number", "search"] },
    disabled: { control: "boolean" },
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: "argo-prod" } };

/** Pair with `Label`; `htmlFor` wires the click target. */
export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="endpoint">Endpoint</Label>
      <Input id="endpoint" placeholder="https://argo.internal:2746" />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="you@voxel51.com" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="8080" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { placeholder: "Managed by the platform", disabled: true },
};
