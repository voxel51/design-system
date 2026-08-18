import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { Checkbox, CheckboxWithLabel } from "@voxel51/voodo/v2";

/**
 * Tri-state checkbox on Radix. `checked` accepts `true`, `false` or
 * `"indeterminate"` — use indeterminate for a parent whose children are
 * partially selected.
 *
 * `CheckboxWithLabel` is the labeled form; prefer it over hand-pairing a
 * `Checkbox` and a `Label`.
 */
const meta: Meta<typeof Checkbox> = {
  title: "v2/Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = { args: { defaultChecked: true } };

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox aria-label="Unchecked" />
      <Checkbox aria-label="Checked" defaultChecked />
      <Checkbox aria-label="Indeterminate" checked="indeterminate" />
      <Checkbox aria-label="Disabled" disabled />
      <Checkbox aria-label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};

export const WithLabel: Story = {
  render: function WithLabelStory() {
    const [checked, setChecked] = React.useState(true);
    return (
      <CheckboxWithLabel
        label="Restart on failure"
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
      />
    );
  },
};

/** Indeterminate parent driven by its children. */
export const ParentChild: Story = {
  render: function ParentChildStory() {
    const [items, setItems] = React.useState([true, false, false]);
    const all = items.every(Boolean);
    const some = items.some(Boolean);
    return (
      <div className="flex flex-col gap-3">
        <CheckboxWithLabel
          label="All services"
          checked={all ? true : some ? "indeterminate" : false}
          onCheckedChange={(v) => setItems(items.map(() => v === true))}
        />
        <div className="ml-6 flex flex-col gap-2">
          {["argo-prod", "qdrant", "jupyter"].map((name, i) => (
            <CheckboxWithLabel
              key={name}
              label={name}
              checked={items[i]}
              onCheckedChange={(v) =>
                setItems(items.map((c, j) => (i === j ? v === true : c)))
              }
            />
          ))}
        </div>
      </div>
    );
  },
};
