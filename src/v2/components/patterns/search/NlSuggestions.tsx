import { CornerDownLeft, Filter, LayoutPanelLeft, ArrowUpDown, Sparkles } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { NlIntentKind, NlSuggestion } from "./types";

const intentIcon: Record<NlIntentKind, React.ComponentType<{ className?: string }>> = {
  filter: Filter,
  panel: LayoutPanelLeft,
  sort: ArrowUpDown,
  insight: Sparkles,
};

interface Props {
  suggestions: NlSuggestion[];
  activeIndex: number;
  onHover: (i: number) => void;
  onSelect: (s: NlSuggestion) => void;
  heading?: string;
}

/**
 * Agent suggestion list rendered under the natural-language search input.
 * Each row states the intent (filter / open panel / sort) so the user knows
 * what will happen before pressing Enter.
 */
export function NlSuggestions({ suggestions, activeIndex, onHover, onSelect }: Props) {
  if (!suggestions.length) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-md border border-border bg-popover shadow-xl">
      <ul className="py-1.5">
        {suggestions.map((s, i) => {
          const Icon = intentIcon[s.kind];
          const active = i === activeIndex;
          return (
            <li key={s.text}>
              <button
                type="button"
                onMouseEnter={() => onHover(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onSelect(s)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors",
                  active ? "bg-card" : "hover:bg-card",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-icon-subtle" />
                <span className="min-w-0 flex-1 truncate text-body-sm text-foreground">{s.text}</span>
                {s.hint && (
                  <span className="hidden shrink-0 text-meta text-icon-subtle sm:inline">{s.hint}</span>
                )}
                {active && <CornerDownLeft className="h-3 w-3 shrink-0 text-icon-subtle" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
