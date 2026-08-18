import { ArrowUpDown, LayoutPanelLeft, Loader2, Sparkles, X } from "lucide-react";
import type { NlResolution } from "./types";

interface Props {
  /** Agent is still resolving the query. */
  thinking?: boolean;
  resolution: NlResolution | null;
  resultCount?: number;
  onRemoveClause: (id: string) => void;
}

/**
 * Interpretation strip under the search bar. A single quiet line: what the
 * agent understood, the match count, and the applied filters as removable
 * chips. No CTAs — clearing lives in the search field, and sample actions
 * live in the selection tray.
 */
export function NlResultBar({ thinking, resolution, resultCount, onRemoveClause }: Props) {
  if (!thinking && !resolution) return null;

  if (thinking) {
    return (
      <div className="flex h-9 items-center gap-2 border-b border-border/20 px-5 text-body-sm text-secondary-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        Reading your question…
      </div>
    );
  }

  const r = resolution!;

  return (
    <div className="flex h-9 items-center gap-2 border-b border-border/20 px-5">
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
      <span className="truncate text-body-sm text-foreground">{r.summary}</span>

      {typeof resultCount === "number" && (
        <span className="shrink-0 text-body-sm tabular-nums text-tertiary-foreground">
          · {resultCount.toLocaleString()} samples
        </span>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {r.clauses.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onRemoveClause(c.id)}
            title="Remove this filter"
            className="group inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-meta text-secondary-foreground transition-colors hover:bg-card-elevated hover:text-foreground"
          >
            <span className="text-foreground/90">{c.field}</span>
            <span className="text-muted-foreground">{c.operator}</span>
            <span className="text-foreground/90">{c.value}</span>
            <X className="h-2.5 w-2.5 opacity-0 transition-opacity group-hover:opacity-70" />
          </button>
        ))}
        {r.sort && (
          <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-meta text-secondary-foreground">
            <ArrowUpDown className="h-2.5 w-2.5 text-icon-subtle" />
            {r.sort.label}
          </span>
        )}
        {r.panel && (
          <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-meta text-secondary-foreground">
            <LayoutPanelLeft className="h-2.5 w-2.5 text-icon-subtle" />
            {r.panel.label}
          </span>
        )}
      </div>
    </div>
  );
}
