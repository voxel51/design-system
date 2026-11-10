import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { MarkdownEditor } from "@voxel51/voodo";

import { withContainer } from "../../../stories/decorators/container";

const meta: Meta<typeof MarkdownEditor> = {
  title: "Components/MarkdownEditor",
  component: MarkdownEditor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [withContainer()],
};

export default meta;

type Story = StoryObj<typeof MarkdownEditor>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("- first item\n- second item");
    return (
      <MarkdownEditor
        {...args}
        value={value}
        onChange={setValue}
        renderPreview={(text) => (
          <pre className="whitespace-pre-wrap">{text}</pre>
        )}
        placeholder="Leave a note (markdown)"
      />
    );
  },
};
