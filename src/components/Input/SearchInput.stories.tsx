import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { SearchInput } from "@voxel51/voodo";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  parameters: { layout: "centered" },
};

type Story = StoryObj<typeof SearchInput>;

const Demo = ({ scoped }: { scoped?: boolean }) => {
  const [value, setValue] = useState("");
  const [scope, setScope] = useState("all");
  return (
    <div style={{ width: 360 }}>
      <SearchInput
        value={value}
        onChange={setValue}
        placeholder="Search datasets"
        scopes={
          scoped
            ? [
                { id: "all", label: "All" },
                { id: "name", label: "Name" },
                { id: "tags", label: "Tags" },
              ]
            : undefined
        }
        scope={scope}
        onScopeChange={setScope}
      />
    </div>
  );
};

export const Default: Story = { render: () => <Demo /> };

/** The scope menu narrows the search to one dimension. */
export const WithScope: Story = { render: () => <Demo scoped /> };

export default meta;
