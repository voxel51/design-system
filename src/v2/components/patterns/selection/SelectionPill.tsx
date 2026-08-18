import { X } from "lucide-react";
import { IconTooltip } from "../../chrome/IconTooltip";

import { cn } from "../../../lib/utils";

interface SelectionPillProps {
  count: number;
  onClear: () => void;
  /** Optional label after the count. Defaults to "selected". */
  label?: string;
  /**
   * Visual variant. `default` = solid card-elevated (grid tray).
   * `overlay` = matches floating panels (embeddings legend) with backdrop blur.
   */
  variant?: "default" | "overlay";
}

/**
 * Single canonical "N selected · ×" pill used anywhere a selection surfaces
 * (grid tray, embeddings overlay, future panels). Minimal gray pill with an
 * inline clear affordance — no orange, no dividers, one style everywhere.
 */
export function SelectionPill({ count, onClear, label = "selected", variant = "default" }: SelectionPillProps) {
  const isOverlay = variant === "overlay";
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full pl-2.5 pr-1 py-1",
        isOverlay
          ? "bg-card-2/90 backdrop-blur border border-border/60"
          : "bg-card-elevated",
      )}
    >
      <span className="text-body-sm font-medium tabular-nums text-foreground">
        {count.toLocaleString()}
      </span>
      <span className="text-body-sm text-muted-foreground">{label}</span>
      <IconTooltip label="Clear selection">
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className={cn(
            "ml-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors",
            isOverlay ? "hover:bg-card-elevated" : "hover:bg-card-2",
          )}
        >
          <X className="h-3 w-3" strokeWidth={2} />
        </button>
      </IconTooltip>
    </div>
  );
}
