import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  StatusPill,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@voxel51/voodo/v2";

/**
 * Semantic data table. Renders real `<table>` elements, so screen readers
 * announce row and column relationships and browser find works.
 *
 * Sorting, selection and virtualization are the caller's; this is markup and
 * tokens only.
 */
const meta: Meta<typeof Table> = {
  title: "v2/Components/Table",
  component: Table,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [(Story) => <div className="w-[40rem]"><Story /></div>],
};
export default meta;

type Story = StoryObj<typeof Table>;

const rows = [
  { name: "argo-prod", kind: "Orchestrator", status: "Running", tone: "reviewed" },
  { name: "qdrant", kind: "Vector index", status: "Running", tone: "reviewed" },
  { name: "jupyter", kind: "Notebook server", status: "Stopped", tone: "not-started" },
  { name: "ray-head", kind: "Compute pool", status: "Failed", tone: "failed" },
] as const;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r.name}>
            <TableCell className="font-mono">{r.name}</TableCell>
            <TableCell className="text-secondary-foreground">{r.kind}</TableCell>
            <TableCell className="text-right">
              <StatusPill tone={r.tone} label={r.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaptionAndFooter: Story = {
  render: () => (
    <Table>
      <TableCaption>Services in this workspace.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead className="text-right">Instances</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-mono">jupyter</TableCell>
          <TableCell className="text-right tabular-nums">3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-mono">argo-prod</TableCell>
          <TableCell className="text-right tabular-nums">1</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell className="text-right tabular-nums">4</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};
