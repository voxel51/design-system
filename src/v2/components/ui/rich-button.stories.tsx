import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { Boxes, Database, Workflow } from "lucide-react";

import { RichButton, RichButtonGroup } from "@voxel51/voodo/v2";

/**
 * Large selectable card with icon, label and description — for choosing
 * between a few substantial options, where a radio row would not carry
 * enough explanation.
 *
 * `RichButtonGroup` is exclusive by default. Pass `exclusive={false}` for
 * multi-select, and `value` becomes an array.
 */
const meta: Meta<typeof RichButton> = {
  title: "v2/Components/RichButton",
  component: RichButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof RichButton>;

const OPTIONS = [
  {
    value: "orchestrator",
    label: "Orchestrator",
    description: "Runs delegated operations",
    icon: Workflow,
  },
  {
    value: "vector-index",
    label: "Vector index",
    description: "Similarity search over embeddings",
    icon: Database,
  },
  {
    value: "compute-pool",
    label: "Compute pool",
    description: "Shared GPU capacity",
    icon: Boxes,
  },
];

export const Single: Story = {
  render: function SingleStory() {
    const [value, setValue] = React.useState("orchestrator");
    return (
      <div className="w-[34rem]">
        <RichButtonGroup buttons={OPTIONS} value={value} onChange={setValue} />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: function MultipleStory() {
    const [value, setValue] = React.useState<string[]>(["orchestrator"]);
    return (
      <div className="w-[34rem]">
        <RichButtonGroup
          buttons={OPTIONS}
          exclusive={false}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const Vertical: Story = {
  render: function VerticalStory() {
    const [value, setValue] = React.useState("vector-index");
    return (
      <div className="w-80">
        <RichButtonGroup
          buttons={OPTIONS}
          orientation="vertical"
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};

export const WithDisabledOption: Story = {
  render: function DisabledStory() {
    const [value, setValue] = React.useState("orchestrator");
    return (
      <div className="w-[34rem]">
        <RichButtonGroup
          buttons={OPTIONS.map((o, i) => (i === 2 ? { ...o, disabled: true } : o))}
          value={value}
          onChange={setValue}
        />
      </div>
    );
  },
};
