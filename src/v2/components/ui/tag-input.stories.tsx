import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import { TagInput } from "@voxel51/voodo/v2";

/**
 * Free-form list of short strings. Enter commits the current text; Backspace
 * on an empty field removes the last tag.
 *
 * Use for open sets — sample tags, label classes. A fixed set belongs in a
 * `Select`.
 */
const meta: Meta<typeof TagInput> = {
  title: "v2/Components/TagInput",
  component: TagInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: function DefaultStory() {
    const [tags, setTags] = React.useState<string[]>(["vehicle", "pedestrian"]);
    return (
      <TagInput
        value={tags}
        onChange={setTags}
        placeholder="Add a class"
        aria-label="Label classes"
      />
    );
  },
};

export const Empty: Story = {
  render: function EmptyStory() {
    const [tags, setTags] = React.useState<string[]>([]);
    return <TagInput value={tags} onChange={setTags} placeholder="Add a tag" />;
  },
};

/** `showClearAll` adds a control that empties the list in one action. */
export const WithClearAll: Story = {
  render: function ClearAllStory() {
    const [tags, setTags] = React.useState<string[]>(["train", "val", "test"]);
    return <TagInput value={tags} onChange={setTags} showClearAll />;
  },
};

export const Disabled: Story = {
  render: () => (
    <TagInput value={["locked", "by-policy"]} onChange={() => {}} disabled />
  ),
};
