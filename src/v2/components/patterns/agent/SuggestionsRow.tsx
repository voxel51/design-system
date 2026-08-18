import { ArrowUpRight } from "lucide-react";

export interface SuggestionsRowData {
  id: string;
  label?: string;
  suggestions: string[];
}

interface Props {
  data: SuggestionsRowData;
  onSelect?: (prompt: string) => void;
}

export function SuggestionsRow({ data, onSelect }: Props) {
  return (
    <div className="ml-8 flex flex-col gap-1.5">
      {data.label && (
        <div className="text-body-sm text-icon-subtle">{data.label}</div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {data.suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(s)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card-2 px-2.5 py-1 text-body-sm text-secondary-foreground transition-colors hover:border-border-hover hover:bg-background/40 hover:text-foreground"
          >
            <span>{s}</span>
            <ArrowUpRight className="h-3 w-3 text-icon-subtle" />
          </button>
        ))}
      </div>
    </div>
  );
}
