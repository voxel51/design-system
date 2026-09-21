import type { Meta, StoryObj } from "@storybook/react-vite";

import { CodeBlock } from "@voxel51/voodo";

const meta: Meta<typeof CodeBlock> = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  tags: ["!autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    code: {
      control: "text",
      description: "The code to display, and what the copy control copies",
    },
    copyable: {
      control: "boolean",
      description: "Whether the block offers a copy control",
    },
    lineNumbers: {
      control: "boolean",
      description: "Whether the block is numbered down its left edge",
    },
  },
};

type Story = StoryObj<typeof CodeBlock>;

const SOURCE = `import voodo

block = voodo.CodeBlock()
block.render()`;

export const Default: Story = {
  args: {
    code: SOURCE,
  },
};

export const Numbered: Story = {
  args: {
    code: SOURCE,
    lineNumbers: true,
  },
};

export const ReadOnly: Story = {
  args: {
    code: SOURCE,
    copyable: false,
  },
};

export const Overflowing: Story = {
  args: {
    code: `command --with-a-very-long-flag=${"x".repeat(120)} --and-another`,
  },
};

/**
 * A caller that highlights its own code passes the marked-up result as
 * children. The block still copies the plain `code` it was given.
 */
export const Highlighted: Story = {
  args: {
    code: SOURCE,
    children: (
      <span>
        <span style={{ color: "#c678dd" }}>import</span> voodo
      </span>
    ),
  },
};

export default meta;
