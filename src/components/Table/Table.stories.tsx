import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@voxel51/voodo";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  tags: ["!autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {},
};

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="p-6">
      <Table {...args}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>City</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>30</TableCell>
            <TableCell>New York</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Smith</TableCell>
            <TableCell>25</TableCell>
            <TableCell>Los Angeles</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>40</TableCell>
            <TableCell>Chicago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export default meta;
