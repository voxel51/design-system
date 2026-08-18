import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemWithLabel,
} from "@voxel51/voodo/v2";

/**
 * Single choice from a small, visible set. Arrow keys move between options
 * and select as they go — that is the Radix roving-focus behavior, and it is
 * what users of native radios expect.
 *
 * More than about seven options belongs in a Select.
 */
const meta: Meta<typeof RadioGroup> = {
  title: "v2/Components/RadioGroup",
  component: RadioGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="global" className="flex flex-col gap-3">
      <RadioGroupItemWithLabel value="global" label="Global — one shared instance" />
      <RadioGroupItemWithLabel value="per-user" label="Per-user — one instance each" />
    </RadioGroup>
  ),
};

/** Hand-paired form, when the label needs extra markup. */
export const WithDescription: Story = {
  render: () => (
    <RadioGroup defaultValue="kubernetes" className="flex flex-col gap-4">
      {[
        { value: "kubernetes", title: "Kubernetes", hint: "Scales with the cluster" },
        { value: "docker", title: "Docker", hint: "Single host" },
        { value: "process", title: "Process", hint: "Runs beside the API server" },
      ].map((o) => (
        <div key={o.value} className="flex items-start gap-3">
          <RadioGroupItem value={o.value} id={o.value} className="mt-0.5" />
          <div>
            <Label htmlFor={o.value}>{o.title}</Label>
            <p className="text-meta text-secondary-foreground">{o.hint}</p>
          </div>
        </div>
      ))}
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="a" disabled className="flex flex-col gap-3">
      <RadioGroupItemWithLabel value="a" label="Locked by policy" />
      <RadioGroupItemWithLabel value="b" label="Also locked" />
    </RadioGroup>
  ),
};
