import { Plus } from "lucide-react";
import { toast } from "sonner";
import { CollectionsRail } from "./CollectionsRail";

import { TagFilter } from "./TagFilter";
import type { DatasetSummary } from "./types";

interface DatasetsSidebarProps {
  // Collections
  activeCollection: string | null;
  onSelectCollection: (id: string | null) => void;
  totalCount: number;
  // Tags (contextual to the active collection)
  tagDatasets: DatasetSummary[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearTags: () => void;
}

/**
 * Left navigation + filtering rail for the Datasets page.
 * New dataset CTA on top, Collections beneath (user-curated, always present),
 * then a contextual tag filter — Hugging Face style.
 */
export function DatasetsSidebar({
  activeCollection,
  onSelectCollection,
  totalCount,
  tagDatasets,
  selectedTags,
  onToggleTag,
  onClearTags,
}: DatasetsSidebarProps) {
  return (
    <aside className="w-[248px] shrink-0 border-r border-border/30 px-4 py-5 overflow-y-auto flex flex-col">
      <button
        type="button"
        onClick={() => toast.success("New dataset", { description: "Demo only" })}
        className="flex items-center justify-center gap-2 w-full h-10 rounded-lg bg-primary text-primary-foreground text-body font-medium hover:bg-primary/90 transition-colors mb-6"
      >
        <Plus className="h-4 w-4" /> New dataset
      </button>

      <CollectionsRail
        activeId={activeCollection}
        onSelect={onSelectCollection}
        totalCount={totalCount}
      />
      <TagFilter
        datasets={tagDatasets}
        selected={selectedTags}
        onToggle={onToggleTag}
        onClear={onClearTags}
      />
    </aside>
  );
}
