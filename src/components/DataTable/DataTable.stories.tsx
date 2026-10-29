import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, DataTable, DeleteOutlineIcon, Pill } from "@voxel51/voodo";

const meta: Meta<typeof DataTable> = {
  title: "Components/DataTable",
  component: DataTable,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof DataTable>;

const rows = [
  ["Brain scans", "Running", "1.4.0", "2 hours ago"],
  ["A plugin with a very long name that will not fit", "Stopped", "0.9.1", ""],
].map(([name, status, version, updated]) => ({
  id: name,
  cells: {
    name,
    status: (
      <Pill isStatus size="sm">
        {status}
      </Pill>
    ),
    version,
    updated,
    delete: (
      <Button
        size="sm"
        variant="secondary"
        leadingIcon={DeleteOutlineIcon}
        collapse="auto"
        aria-label="Delete"
      >
        Delete
      </Button>
    ),
  },
}));

export const Default: Story = {
  args: {
    columns: [
      { key: "name", label: "Name", role: "primary" },
      { key: "status", label: "Status", role: "status" },
      { key: "version", label: "Version" },
      { key: "updated", label: "Updated", hideBelow: "md" },
      { key: "delete", label: "", role: "actions", align: "end" },
    ],
    rows,
    empty: "Nothing here yet",
  },
  render: (args) => (
    <div className="flex flex-col gap-6 p-6">
      <DataTable {...args} />
      <div className="w-[360px]">
        <DataTable {...args} />
      </div>
    </div>
  ),
};

export const WithDetail: Story = {
  args: {
    ...Default.args,
    rows: rows.map((row, index) =>
      index === 0
        ? { ...row, detail: <div className="p-3">Expanded details</div> }
        : row
    ),
  },
  render: Default.render,
};

export default meta;
