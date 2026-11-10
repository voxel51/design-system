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

export const Boxed: Story = {
  render: () => (
    <div className="p-6">
      <Table variant="boxed">
        <TableHeader>
          <TableRow>
            <TableHead onSort={() => undefined}>Class</TableHead>
            <TableHead align="end" sort="desc" onSort={() => undefined}>
              Support
            </TableHead>
            <TableHead align="end" onSort={() => undefined}>
              Precision
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>person</TableCell>
            <TableCell align="end">1,204</TableCell>
            <TableCell align="end">0.736</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>car</TableCell>
            <TableCell align="end">318</TableCell>
            <TableCell align="end">0.612</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export default meta;
