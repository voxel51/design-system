import { Progress } from "../../ui/progress";
import { cn } from "../../../lib/utils";
import {
  formatValue,
  type ActivityDimension,
} from "./types";

export type Meter = {
  dim: ActivityDimension;
  used: number;
};

/** Tone thresholds: quiet under 75%, warm 75–99%, red at/over the cap. */
function toneFor(pct: number) {
  if (pct >= 1) return { bar: "bg-status-failed", text: "text-status-failed" };
  if (pct >= 0.75) return { bar: "bg-icon-decorative", text: "text-icon-decorative" };
  return { bar: "bg-foreground/40", text: "text-secondary-foreground" };
}

/**
 * Plan headroom — the free-tier caps a user actually hits, as compact meters
 * built on the shared Progress primitive.
 */
export function PlanHeadroom({ meters }: { meters: Meter[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {meters.map(({ dim, used }) => {
          const limit = dim.limit ?? 0;
          const ratio = limit ? used / limit : 0;
          const tone = toneFor(ratio);
          return (
            <div key={dim.id} className="min-w-0 space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate text-body-sm text-foreground">{dim.title ?? dim.label}</span>
                <span className={cn("shrink-0 text-meta tabular-nums", tone.text)}>
                  {Math.round(ratio * 100)}%
                </span>
              </div>
              <Progress
                value={Math.min(ratio, 1) * 100}
                className="h-1"
                indicatorClassName={tone.bar}
              />
              <div className="text-meta tabular-nums text-secondary-foreground">
                {formatValue(used, dim.unit)} / {formatValue(limit, dim.unit)} {dim.unit}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
