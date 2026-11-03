import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { CodeEditor } from "@voxel51/voodo";

const meta: Meta<typeof CodeEditor> = {
  title: "Components/CodeEditor",
  component: CodeEditor,
  parameters: {
    layout: "padded",
  },
};

type Story = StoryObj<typeof CodeEditor>;

const json = JSON.stringify(
  {
    type: "detections",
    classes: ["cat", "dog"],
    attributes: [{ name: "occluded", type: "bool", component: "toggle" }],
  },
  null,
  2
);

/** Editable JSON; edits flow back through `onChange`. */
export const Editable: Story = {
  render: () => {
    const [value, setValue] = useState(json);
    return <CodeEditor value={value} onChange={setValue} height={320} />;
  },
};

/** Read-only view of a document. */
export const ReadOnly: Story = {
  args: { value: json, readOnly: true, height: 240 },
};

export default meta;
