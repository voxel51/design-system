import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { IconAction } from "../../ui/icon-action";
import { IconTooltip } from "../../chrome/IconTooltip";
import { selectionStore, useSelection } from "../../../lib/selectionStore";
import { SelectionActions } from "./SelectionActions";
import { SelectionPill } from "./SelectionPill";


interface SelectionTrayProps {
  thumbFor?: (id: string) => string | undefined;
  onAnnotate?: () => void;
  onReview?: () => void;
  onAskAgent?: () => void;
}

/**
 * Bottom-docked contextual actions tray. Grid area only, visible only when
 * the global selection is non-empty. Restrained neutral styling — no orange
 * accents — so it reads as a persistent workspace surface rather than a CTA.
 */
export function SelectionTray({ thumbFor, onAnnotate, onReview, onAskAgent }: SelectionTrayProps) {
  const { ids, count, clear } = useSelection();
  // Expanded by default — the tray is a visual product surface, so showing
  // the picked thumbs upfront makes the current focus group tangible. Users
  // can collapse it if they need vertical room; that preference is per-session.
  const [expanded, setExpanded] = useState(true);

  if (count === 0) return null;

  const idList = Array.from(ids);

  return (
    <div
      className="shrink-0 border-t border-subtle bg-card/95 backdrop-blur-sm"
      onClick={(e) => e.stopPropagation()}
    >
      {expanded && (
        <div className="max-h-24 overflow-x-auto overflow-y-hidden border-b border-subtle/60 px-4 py-2">
          <div className="flex items-center gap-1.5">
            {idList.slice(0, 60).map((id) => {
              const t = thumbFor?.(id);
              return (
                <div
                  key={id}
                  className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-card ring-1 ring-border/40"
                  title={id}
                >
                  {t ? (
                    <img src={t} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                  <button
                    type="button"
                    onClick={() => selectionStore.remove([id])}
                    className="absolute right-0.5 top-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-background/80 text-icon opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                    aria-label="Remove from selection"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            {count > 60 && (
              <span className="ml-1 shrink-0 text-body-sm text-muted-foreground tabular-nums">
                +{count - 60}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 px-4 py-2">
        <SelectionPill count={count} onClear={clear} variant="overlay" />



        <div className="ml-auto flex items-center gap-2">
          <SelectionActions
            count={count}
            onAnnotate={onAnnotate}
            onReview={onReview}
            onAskAgent={onAskAgent}
          />
          <span className="h-4 w-px bg-border/40" />
          <IconTooltip label={expanded ? "Collapse tray" : "Expand tray"}>
            <IconAction
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse tray" : "Expand tray"}
            >
              {expanded ? <ChevronDown /> : <ChevronUp />}
            </IconAction>
          </IconTooltip>
        </div>
      </div>
    </div>
  );
}
