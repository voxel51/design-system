import { cn } from "../../lib/utils";

/**
 * MetricTile — compact tile for KPI-style evaluation metrics (Precision,
 * Recall, F1, mAP, Accuracy, Support). Big tabular value + eyebrow label.
 * Used across the Model Evaluation panel Summary tab and the run detail's
 * inline evaluation summary.
 */
interface MetricTileProps {
  label: string;
  value: string;
  /** Optional trailing subtext (e.g. `/ 300`). */
  hint?: string;
  className?: string;
}

export function MetricTile({ label, value, hint, className }: MetricTileProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border-subtle/40 bg-card-2 px-3 py-2.5",
        className,
      )}
    >
      <div className="text-caption uppercase tracking-wide text-icon-subtle">{label}</div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-title font-medium text-foreground tabular-nums">{value}</span>
        {hint && <span className="text-body-sm text-icon-subtle tabular-nums">{hint}</span>}
      </div>
    </div>
  );
}
