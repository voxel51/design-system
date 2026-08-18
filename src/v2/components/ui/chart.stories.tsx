import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@voxel51/voodo/v2";

/**
 * Recharts wrapper that supplies theme-aware colors, tooltip and legend.
 *
 * `ChartConfig` maps each series key to a label and a color. Take colors from
 * the categorical palette (`hsl(var(--palette-N))`) so series stay distinct
 * and legible in both themes — never a raw hex.
 *
 * `ChartContainer` is responsive; give it a height, not a width.
 */
const meta: Meta<typeof ChartContainer> = {
  title: "v2/Components/Chart",
  component: ChartContainer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof ChartContainer>;

const config = {
  labeled: { label: "Labeled", color: "hsl(var(--palette-1))" },
  reviewed: { label: "Reviewed", color: "hsl(var(--palette-2))" },
} satisfies ChartConfig;

const data = [
  { day: "Mon", labeled: 120, reviewed: 80 },
  { day: "Tue", labeled: 180, reviewed: 130 },
  { day: "Wed", labeled: 90, reviewed: 70 },
  { day: "Thu", labeled: 220, reviewed: 160 },
  { day: "Fri", labeled: 170, reviewed: 140 },
];

export const Bars: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-[36rem]">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="labeled" fill="var(--color-labeled)" radius={4} />
        <Bar dataKey="reviewed" fill="var(--color-reviewed)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};

export const Lines: Story = {
  render: () => (
    <ChartContainer config={config} className="h-64 w-[36rem]">
      <LineChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="labeled" stroke="var(--color-labeled)" dot={false} strokeWidth={2} />
        <Line dataKey="reviewed" stroke="var(--color-reviewed)" dot={false} strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  ),
};
