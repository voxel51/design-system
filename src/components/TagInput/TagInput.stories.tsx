import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { TagInput } from "@voxel51/voodo";

const meta: Meta<typeof TagInput> = {
  title: "Components/TagInput",
  component: TagInput,
};

type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: () => {
    const [tags, setTags] = useState<string[]>(["automotive", "demo"]);
    const [draft, setDraft] = useState("");
    return (
      <div className="max-w-md">
        <TagInput
          aria-label="Tags"
          value={tags}
          onChange={setTags}
          inputValue={draft}
          onInputChange={setDraft}
          suggestions={["automotive", "demo", "multimodal", "video"]}
          placeholder="Add a tag and press Enter"
        />
      </div>
    );
  },
};

export default meta;
