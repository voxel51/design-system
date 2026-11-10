import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { StatTile, StatTileGroup } from "@voxel51/voodo";

const meta: Meta<typeof StatTile> = {
  title: "Components/StatTile",
  component: StatTile,
};

type Story = StoryObj<typeof StatTile>;

export const Default: Story = {
  render: () => (
    <StatTileGroup>
      <StatTile label="Middle 50%" value="0.21–0.64" />
      <StatTile label="Median" value="0.42" />
      <StatTile label="Most common" value="cat" hint="38%" />
    </StatTileGroup>
  ),
};

export const Filters: Story = {
  render: function Render() {
    const [filter, setFilter] = useState<string | null>(null);
    const toggle = (key: string) => () =>
      setFilter((current) => (current === key ? null : key));
    return (
      <StatTileGroup>
        <StatTile
          label="True positives"
          value="1,024"
          onSelect={toggle("tp")}
          selected={filter === "tp"}
          selectLabel="Show true positives"
        />
        <StatTile
          label="False positives"
          value="128"
          onSelect={toggle("fp")}
          selected={filter === "fp"}
          selectLabel="Show false positives"
        />
        <StatTile
          label="Precision"
          value="0.81"
          color="brand-primary"
          delta="+0.04 (5%)"
          deltaTone="success"
          compare={{ value: "0.77", color: "brand-accent" }}
        />
      </StatTileGroup>
    );
  },
};

export default meta;
