/**
 * View-model for the Activity pattern — usage metering and trends.
 *
 * Ported from the Lovable master's `mocks/activity`. The dimension *catalog*
 * and the synthetic series generator stay in the application; the shapes and
 * the formatting helpers come here, because they decide how a number reads
 * on screen.
 */

/** Which trend measure a dimension contributes to. */
export type Measure = "tokens" | "requests" | "storage";

export interface ActivityDimension {
  id: string;
  label: string;
  /**
   * Display name. Falls back to `label` when unset — the Lovable master
   * kept these in a `DIMENSION_META` map keyed by id, which a design system
   * cannot own; callers map their copy onto the dimension instead.
   */
  title?: string;
  /** Short unit shown after the value. */
  unit: string;
  metered: boolean;
  billed: boolean;
  /** Whether unit cost depends on bring-your-own credentials. */
  byoCreds?: boolean;
  /** Free-tier cap, when the dimension has one. */
  limit?: number;
  /** Attributes the metering spec requires us to log. */
  detail?: string;
  /** Only meaningful at tenant level; hidden in a member's own view. */
  tenantOnly?: boolean;
  measure?: Measure;
  /** Value is a point-in-time count rather than a period sum. */
  snapshot?: boolean;
  /** Share of tenant usage attributable to the current user (0–1). */
  mineShare: number;
  /** Base daily volume used to synthesize the series. */
  daily: number;
  /** Growth trend across the window. */
  growth: number;
}

export interface SeriesPoint {
  /** ISO day, oldest first. */
  day: string;
  value: number;
}

/** A metered quantity against its plan limit. */
export interface Meter {
  label: string;
  used: number;
  limit: number;
  unit: string;
}

/**
 * Format a usage number for display.
 *
 * `GB` and `hours` keep one decimal below 100 and round above it, because a
 * fractional gigabyte matters and 4,096.3 GB does not. Counts abbreviate:
 * 1.2M, 34.5K, otherwise a thousands-separated integer.
 */
export function formatValue(n: number, unit: string): string {
  if (unit === "GB" || unit === "hours") {
    return n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(1);
  }
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

/** "12.4K of 50K requests", or "12.4K requests" when the plan has no cap. */
export function usageSentence(dim: ActivityDimension, total: number): string {
  const value = formatValue(total, dim.unit);
  if (dim.limit)
    return `${value} of ${formatValue(dim.limit, dim.unit)} ${dim.unit}`;
  return `${value} ${dim.unit}`;
}
