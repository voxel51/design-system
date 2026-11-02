import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock } from "@voxel51/voodo";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "padded",
  },
};

type Story = StoryObj<typeof CodeBlock>;

/** A Python snippet with syntax colours and a copy action. */
export const Python: Story = {
  args: {
    code: `import fiftyone as fo

dataset = fo.load_dataset("quickstart")
export_dir = "/path/for/export"

# Any subclass of fiftyone.types.Dataset is supported
dataset.export(export_dir=export_dir, dataset_type=fo.types.COCODetectionDataset)`,
  },
};

/** A language Prism doesn't know renders as plain text. */
export const Shell: Story = {
  args: {
    language: "shell",
    code: "pip install fiftyone\nfiftyone app launch",
  },
};

export default meta;
