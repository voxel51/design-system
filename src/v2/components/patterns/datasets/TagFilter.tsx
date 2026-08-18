import { useMemo } from "react";

import { TextAction } from "../../ui/text-action";
import type { DatasetSummary } from "./types";

interface TagFilterProps {
  /** Datasets in the current scope (e.g. active collection) — drives the tag set + counts. */
  datasets: DatasetSummary[];
  selected: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

/**
 * Contextual tag filter for the left sidebar (Hugging Face style).
 * Tags + counts recompute from whatever dataset subset is passed in, so they
 * update with the active collection.
 */
export function TagFilter({
  datasets,
  selected,
  onToggle,
  onClear,
}: TagFilterProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    datasets.forEach((d) => d.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [datasets]);

  return (
    <section>
      <div className="flex items-center justify-between mb-3 h-7">
        <h3 className="text-body-sm font-semibold text-foreground tracking-wide">Tags</h3>
        {selected.length > 0 && (
          <TextAction size="sm" onClick={onClear}>
            Clear
          </TextAction>
        )}
      </div>

      {counts.length === 0 ? (
        <p className="text-body-sm text-icon px-0.5">No tags here yet</p>
      ) : (
        <>


          <div className="flex flex-wrap gap-1.5">
            {counts.map(([tag, n]) => {
              const active = selected.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggle(tag)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-body leading-none transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-secondary-foreground hover:bg-card-2 hover:text-foreground"
                  }`}
                >
                  <span>{tag}</span>
                  <span
                    className={`tabular-nums text-meta ${
                      active ? "text-primary-foreground/70" : "text-icon-subtle"
                    }`}
                  >
                    {n}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
