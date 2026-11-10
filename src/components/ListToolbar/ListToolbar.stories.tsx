import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import {
  CircleIcon,
  ListToolbar,
  type ListToolbarProps,
  UserRoundIcon,
} from "@voxel51/voodo";

const meta: Meta<typeof ListToolbar> = {
  title: "Components/ListToolbar",
  component: ListToolbar,
};

type Story = StoryObj<typeof ListToolbar>;

const Demo = ({
  width,
  ...props
}: { width: number } & Partial<ListToolbarProps>) => {
  const [query, setQuery] = useState("");
  const [owner, setOwner] = useState("all");
  const [status, setStatus] = useState("all");
  return (
    <div style={{ width }}>
      <ListToolbar
        {...props}
        count="12 runs"
        search={{ value: query, onChange: setQuery, placeholder: "Search" }}
        filters={[
          {
            id: "owner",
            label: "Owner",
            icon: UserRoundIcon,
            options: [
              { id: "all", label: "All" },
              { id: "mine", label: "Mine" },
            ],
            value: owner,
            onChange: setOwner,
          },
          {
            id: "status",
            label: "Status",
            icon: CircleIcon,
            options: [
              { id: "all", label: "All statuses" },
              { id: "running", label: "Running" },
              { id: "failed", label: "Failed" },
            ],
            value: status,
            onChange: setStatus,
          },
        ]}
      />
    </div>
  );
};

export const Wide: Story = { render: () => <Demo width={640} /> };
export const Narrow: Story = { render: () => <Demo width={320} /> };

export const Capped: Story = {
  render: () => <Demo width={900} size="md" searchMaxWidth={360} />,
};
export const FoldsLater: Story = {
  render: () => <Demo width={500} narrowBelow={640} />,
};
export const NeverFolds: Story = {
  render: () => <Demo width={260} narrowBelow={0} />,
};

export const CountAtStart: Story = {
  render: () => <Demo width={640} countPlacement="start" />,
};
export const CountAtEnd: Story = {
  render: () => <Demo width={640} countPlacement="end" />,
};

export default meta;
