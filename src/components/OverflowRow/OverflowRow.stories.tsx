import type { Meta, StoryObj } from "@storybook/react-vite";

import { OverflowRow, TextAction } from "@voxel51/voodo";

const meta: Meta<typeof OverflowRow> = {
  title: "Components/OverflowRow",
  component: OverflowRow,
  parameters: { layout: "padded" },
};

export default meta;

type Story = StoryObj<typeof OverflowRow>;

const labels = [
  "Group",
  "Patches",
  "Run QA checks",
  "Open histogram",
  "Plugins",
];

const Row = ({ width }: { width: number }) => (
  <div style={{ display: "flex", width }}>
    <OverflowRow label="More actions">
      {labels.map((label) => (
        <TextAction key={label}>{label}</TextAction>
      ))}
    </OverflowRow>
  </div>
);

export const Wide: Story = { render: () => <Row width={700} /> };

export const Narrow: Story = { render: () => <Row width={260} /> };
