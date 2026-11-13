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

/** `wrap` soft-wraps long lines, e.g. an error's technical details. */
export const Wrap: Story = {
  args: {
    wrap: true,
    language: "shell",
    code: `Traceback (most recent call last):
  File "/usr/local/lib/python3.11/site-packages/fiftyone/server/routes/dataset.py", line 128, in get_dataset
ValueError: Dataset 'a-very-long-dataset-name-without-any-spaces-that-keeps-going-and-going' not found`,
  },
};

export default meta;
