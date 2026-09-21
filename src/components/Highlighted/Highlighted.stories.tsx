import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock, Highlighted } from "@voxel51/voodo";

const meta: Meta<typeof Highlighted> = {
  title: "Components/Highlighted",
  component: Highlighted,
  tags: ["!autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    code: {
      control: "text",
      description: "The code to mark up",
    },
    language: {
      control: "select",
      options: ["bash", "javascript", "json", "python", "typescript", "yaml"],
      description: "The language to mark it up as",
    },
  },
};

type Story = StoryObj<typeof Highlighted>;

const PYTHON = `import fiftyone as fo

dataset = fo.load_dataset("quickstart")
session = fo.launch_app(dataset)`;

/** On its own it is bare markup, for a caller that frames it itself. */
export const Bare: Story = {
  args: {
    code: PYTHON,
  },
};

/** Paired with {@link CodeBlock}, which frames it and carries the copy control. */
export const InABlock: Story = {
  args: {
    code: PYTHON,
  },
  render: (args) => (
    <CodeBlock code={args.code} lineNumbers>
      <Highlighted {...args} />
    </CodeBlock>
  ),
};

export const Bash: Story = {
  args: {
    code: "fiftyone app launch --port 5151",
    language: "bash",
  },
};

export default meta;
