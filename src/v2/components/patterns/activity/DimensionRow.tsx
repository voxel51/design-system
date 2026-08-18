import { Info } from "lucide-react";
import { Progress } from "../../ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../ui/tooltip";
import { cn } from "../../../lib/utils";
import { usageSentence, type ActivityDimension } from "./types";

interface Props {
  dim: ActivityDimension;
  total: number;
  delta: number | null;
}

/**
 * One consumption row: plain-language name on the left, a readable
 * "x of y" value on the right, and a cap bar only when a cap exists.
 * Engineering detail lives in the info tooltip so the row stays scannable.
 */
export function DimensionRow({ dim, total, delta }: Props) {
  const ratio = dim.limit ? Math.min(total / dim.limit, 1) : null;
  const over = dim.limit ? total / dim.limit >= 1 : false;
  const near = dim.limit ? total / dim.limit >= 0.75 : false;
  const title = dim.title ?? dim.label;
  const deltaPct = delta === null ? null : Math.round(delta * 100);

  return (
    <div className="flex items-center justify-between gap-6 py-3">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-body text-foreground">{title}</span>
        {dim.detail && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                aria-label={`Details for ${title}`}
                className="shrink-0 text-icon-subtle transition-colors hover:text-foreground"
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[260px]">
              {dim.detail}
              {dim.byoCreds && (
                <span className="mt-1 block text-secondary-foreground">
                  Costs less when you bring your own credentials.
                </span>
              )}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="w-60 shrink-0 space-y-1.5 text-right">
        <div className="flex items-baseline justify-end gap-2">
          <span className="whitespace-nowrap text-body tabular-nums text-foreground">
            {usageSentence(dim, total)}
          </span>
          {deltaPct !== null && deltaPct !== 0 && (
            <span className="text-meta tabular-nums text-secondary-foreground">
              {deltaPct > 0 ? "+" : ""}
              {deltaPct}%
            </span>
          )}
        </div>
        {ratio !== null && (
          <Progress
            value={ratio * 100}
            className="h-1"
            indicatorClassName={cn(
              over
                ? "bg-status-failed"
                : near
                  ? "bg-icon-decorative"
                  : "bg-foreground/35",
            )}
          />
        )}
      </div>
    </div>
  );
}
