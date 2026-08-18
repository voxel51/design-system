import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { paletteVar } from "../../../lib/vizPalette";
import {
  formatValue,
  type ActivityDimension,
  type Measure,
  type SeriesPoint,
} from "./types";

interface Props {
  dims: ActivityDimension[];
  /**
   * One series per entry in `dims`, same order, same length, oldest point
   * first. The Lovable master synthesized these from a `seriesFor` generator;
   * real usage data is the caller's to fetch.
   */
  series: SeriesPoint[][];
  measure: Measure;
  unit: string;
}

/**
 * Consumption over time — a stacked area, one band per dimension feeding the
 * selected measure. Series colors follow the shared viz palette order.
 */
export function UsageTrendChart({ dims, series, measure, unit }: Props) {
  const data = useMemo(() => {
    if (!series.length) return [];
    return series[0].map((p, i) => {
      const row: Record<string, string | number> = { day: p.day };
      dims.forEach((d, di) => (row[d.id] = Math.round(series[di][i].value)));
      return row;
    });
  }, [dims, series, measure]);

  // Cool, high-luminance palette slots — legible as *text* on the dark tooltip
  // surface (the default blue slot-2 fails contrast at 12px).
  const SERIES_SLOTS = [13, 7, 18, 9, 4, 14];
  const colorAt = (i: number) => paletteVar(SERIES_SLOTS[i % SERIES_SLOTS.length]);
  const titleFor = (id: string) => {
    const dim = dims.find((d) => d.id === id);
    return dim?.title ?? dim?.label ?? id;
  };


  const fmtDay = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            {dims.map((d, i) => (
              <linearGradient key={d.id} id={`act-${d.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colorAt(i)} stopOpacity={0.4} />
                <stop offset="100%" stopColor={colorAt(i)} stopOpacity={0.06} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.25} vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={fmtDay}
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <YAxis
            width={48}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => formatValue(v, unit)}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "hsl(var(--border))" }}
            wrapperStyle={{ outline: "none" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-md border border-border bg-card-elevated px-2.5 py-2">
                  <div className="text-meta text-secondary-foreground">
                    {fmtDay(String(label))}
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {payload.map((p) => (
                      <div key={String(p.dataKey)} className="flex items-center gap-2 text-xs">
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: p.color }}
                        />
                        <span className="text-secondary-foreground">
                          {titleFor(String(p.dataKey))}
                        </span>
                        <span className="ml-auto tabular-nums text-foreground">
                          {formatValue(Number(p.value), unit)} {unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />

          {dims.map((d, i) => (
            <Area
              key={d.id}
              type="monotone"
              dataKey={d.id}
              stackId="1"
              stroke={colorAt(i)}
              strokeWidth={1.5}
              fill={`url(#act-${d.id})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {dims.length > 1 && (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
          {dims.map((d, i) => (
            <span
              key={d.id}
              className="inline-flex items-center gap-1.5 text-meta text-secondary-foreground"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: colorAt(i) }}
              />
              {titleFor(d.id)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
