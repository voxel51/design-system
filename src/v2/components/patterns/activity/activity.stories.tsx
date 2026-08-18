import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DimensionRow,
  PlanHeadroom,
  UsageTrendChart,
  type ActivityDimension,
  type SeriesPoint,
} from "@voxel51/voodo/v2";

/**
 * Activity — usage metering rows, plan headroom, and consumption over time.
 *
 * `ActivityDimension` carries a `title` for display; the Lovable master kept
 * those in a `DIMENSION_META` map keyed by id, which a design system cannot
 * own. `UsageTrendChart` takes its `series` as data rather than calling a
 * generator.
 */
const meta: Meta<typeof DimensionRow> = {
  title: "v2/Patterns/Activity",
  component: DimensionRow,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof DimensionRow>;

const dim = (over: Partial<ActivityDimension>): ActivityDimension => ({
  id: "api_requests",
  label: "API requests",
  title: "SDK and API calls",
  unit: "requests",
  metered: true,
  billed: true,
  mineShare: 0.4,
  daily: 4200,
  growth: 0.3,
  ...over,
});

const DIMS: ActivityDimension[] = [
  dim({}),
  dim({
    id: "agent_tokens",
    label: "Agent tokens",
    title: "AI agent usage",
    unit: "tokens",
    daily: 180_000,
    limit: 10_000_000,
  }),
  dim({
    id: "managed_media",
    label: "Managed media",
    title: "Managed storage",
    unit: "GB",
    daily: 12.5,
    snapshot: true,
    limit: 500,
  }),
];

/** Deterministic series so the story renders identically every time. */
const seriesFor = (base: number, days = 30): SeriesPoint[] =>
  Array.from({ length: days }, (_, i) => ({
    day: new Date(Date.UTC(2026, 6, i + 1)).toISOString().slice(0, 10),
    value: Math.round(base * (0.7 + 0.5 * Math.abs(Math.sin(i / 3)))),
  }));

/** A capped dimension shows a bar; an uncapped one shows only the value. */
export const Rows: Story = {
  render: () => (
    <div className="flex w-[36rem] flex-col gap-4">
      <DimensionRow dim={DIMS[0]} total={126_400} delta={0.12} />
      <DimensionRow dim={DIMS[1]} total={4_120_000} delta={-0.04} />
      <DimensionRow dim={DIMS[2]} total={318} delta={null} />
    </div>
  ),
};

export const Headroom: Story = {
  render: () => (
    <div className="w-[36rem]">
      <PlanHeadroom
        meters={[
          { dim: DIMS[1], used: 4_120_000 },
          { dim: DIMS[2], used: 318 },
        ]}
      />
    </div>
  ),
};

export const Trend: Story = {
  render: () => (
    <div className="w-[40rem]">
      <UsageTrendChart
        dims={DIMS.slice(0, 2)}
        series={[seriesFor(4200), seriesFor(180_000)]}
        measure="requests"
        unit="requests"
      />
    </div>
  ),
};
