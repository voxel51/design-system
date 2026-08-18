import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { RichTextEditor } from "@voxel51/voodo/v2";

/**
 * Tiptap editor with a toolbar for headings, lists, links, images and code.
 * `value` and `onChange` carry HTML.
 *
 * `editable={false}` renders the same content read-only, so a saved document
 * and its editor never diverge in styling — both go through the
 * `.prose-tiptap` rules.
 *
 * The heaviest component here: it pulls in Tiptap and ProseMirror. Import it
 * from its subpath (`@voxel51/voodo/v2/rich-text-editor`) so pages that do
 * not use it never load it.
 */
const meta: Meta<typeof RichTextEditor> = {
  title: "v2/Components/RichTextEditor",
  component: RichTextEditor,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[36rem]"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof RichTextEditor>;

const SAMPLE =
  "<h2>Labeling guidelines</h2><p>Draw a tight box around every <strong>vehicle</strong>.</p><ul><li>Include mirrors.</li><li>Exclude shadows.</li></ul>";

export const Editable: Story = {
  render: function EditableStory() {
    const [value, setValue] = React.useState(SAMPLE);
    return <RichTextEditor value={value} onChange={setValue} />;
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [value, setValue] = React.useState("");
    return (
      <RichTextEditor
        value={value}
        onChange={setValue}
        placeholder="Write guidelines…"
      />
    );
  },
};

/** Read-only rendering of the same HTML. */
export const ReadOnly: Story = {
  render: () => <RichTextEditor value={SAMPLE} onChange={() => {}} editable={false} />,
};
