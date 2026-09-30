import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import { ImageList, Orientation, Text, TextVariant } from "@voxel51/voodo";

interface Tile {
  label: string;
  hue: number;
}

const items = Array.from({ length: 12 }, (_, i) => ({
  id: `tile-${i}`,
  data: { label: `sample_${String(i + 1).padStart(3, "0")}.jpg`, hue: i * 30 },
}));

const renderItem = (data: Tile): ReactNode => (
  <div
    className="flex h-full w-full items-end rounded-sm p-2"
    style={{ background: `hsl(${data.hue} 30% 30%)` }}
  >
    <Text variant={TextVariant.Caption}>{data.label}</Text>
  </div>
);

const meta: Meta<typeof ImageList<Tile>> = {
  title: "Components/ImageList",
  component: ImageList,
  parameters: {
    layout: "padded",
  },
};

type Story = StoryObj<typeof ImageList<Tile>>;

/** A virtualised grid of tiles. There is no Figma component for it. */
export const Grid: Story = {
  args: {
    items,
    renderItem,
    cols: 4,
    gap: 8,
    rowHeight: 120,
  },
};

export const Row: Story = {
  args: {
    items: items.slice(0, 6),
    renderItem,
    orientation: Orientation.Row,
    colWidth: 160,
    rowHeight: 120,
    gap: 8,
  },
};

export default meta;
