import * as React from "react";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { IconTooltip, WorkspaceHeader } from "../components/chrome";
import {
  AddToCollectionMenu,
  DatasetsSidebar,
  useCollections,
} from "../components/patterns/datasets";
import { BorderlessSelect } from "../components/ui/borderless-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IconAction } from "../components/ui/icon-action";
import { MetaChip } from "../components/ui/meta-chip";
import { UserBadge } from "../components/ui/user-badge";
import { DATASETS } from "./demoData";

/**
 * Datasets, assembled end to end.
 *
 * Header and sidebar come from the design system; the list is composed from
 * atoms in the page, which is the honest split — a dataset row is this
 * product's table, not a reusable pattern.
 *
 * Filtering, sorting and pinning are local state here. The Lovable master
 * keeps them in `datasetsStore` and `pinsStore`; either is fine, and neither
 * belongs in the design system.
 */

type SortKey = "recent" | "name" | "size";

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: DATASETS.length },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

export function DatasetsPage() {
  const [query, setQuery] = React.useState("");
  const [collection, setCollection] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);
  const [sort, setSort] = React.useState<SortKey>("recent");
  const [pinned, setPinned] = React.useState<string[]>(["quickstart"]);

  const collections = useCollections();

  // Collection scopes the list; tags then filter within that scope, which is
  // why the tag counts in the sidebar are computed from `inCollection`.
  const inCollection = React.useMemo(() => {
    if (!collection) return DATASETS;
    const ids = collections.find((c) => c.id === collection)?.datasetIds ?? [];
    return DATASETS.filter((d) => ids.includes(d.id));
  }, [collection, collections]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = inCollection.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q) && !d.owner.toLowerCase().includes(q))
        return false;
      if (tags.length && !tags.every((t) => d.tags.includes(t))) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "size") return b.mediaCount - a.mediaCount;
      return a.createdDaysAgo - b.createdDaysAgo;
    });

    // Pinned float to the top, keeping their relative order.
    return [
      ...sorted.filter((d) => pinned.includes(d.id)),
      ...sorted.filter((d) => !pinned.includes(d.id)),
    ];
  }, [inCollection, query, tags, sort, pinned]);

  const togglePin = (id: string) =>
    setPinned((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <WorkspaceHeader
        tabs={TABS}
        activeId="datasets"
        user={<UserBadge name="Sejal Kotak" />}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 shrink-0 border-r border-border/20">
          <DatasetsSidebar
            activeCollection={collection}
            onSelectCollection={setCollection}
            totalCount={DATASETS.length}
            tagDatasets={inCollection}
            selectedTags={tags}
            onToggleTag={(t) =>
              setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
            }
            onClearTags={() => setTags([])}
          />
        </div>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-8 pb-4 pt-6">
            <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-input px-3 transition-colors hover:border-input-hover focus-within:border-input-focus">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search datasets"
                className="w-full bg-transparent text-body text-foreground outline-none placeholder:text-muted-foreground"
              />
              {query && (
                <IconAction
                  size="sm"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X />
                </IconAction>
              )}
              <span className="shrink-0 text-body tabular-nums text-muted-foreground">
                {visible.length}/{DATASETS.length}
              </span>
            </div>

            <BorderlessSelect
              label="Sort"
              value={sort}
              onChange={setSort}
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              options={[
                { key: "recent", label: "Most recent" },
                { key: "name", label: "Name" },
                { key: "size", label: "Size" },
              ]}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8">
            <div className="rounded-lg bg-card py-3">
              <div className="grid grid-cols-[minmax(220px,2fr)_minmax(0,1fr)_minmax(0,1fr)_120px] items-center gap-4 px-3 pb-2 text-meta uppercase tracking-wider text-muted-foreground">
                <div>Dataset</div>
                <div>Tags</div>
                <div>Owner</div>
                <div />
              </div>

              {visible.length === 0 && (
                <div className="py-16 text-center text-body text-muted-foreground">
                  No datasets match your filter.
                </div>
              )}

              {visible.map((d) => (
                <div
                  key={d.id}
                  className="group grid grid-cols-[minmax(220px,2fr)_minmax(0,1fr)_minmax(0,1fr)_120px] items-center gap-4 rounded-md px-3 py-3 hover:bg-card-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-body font-medium text-foreground">
                        {d.name}
                      </span>
                      {pinned.includes(d.id) && (
                        <Pin className="h-3 w-3 shrink-0 text-icon-brand" />
                      )}
                    </div>
                    <div className="text-body-sm text-secondary-foreground">
                      {d.mediaCount.toLocaleString()} {d.mediaUnit} · {d.fields} fields
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center gap-1">
                    {d.tags.slice(0, 2).map((t) => (
                      <MetaChip key={t} size="sm">
                        {t}
                      </MetaChip>
                    ))}
                    {d.hiddenTagCount ? (
                      <MetaChip size="sm">+{d.hiddenTagCount}</MetaChip>
                    ) : null}
                  </div>

                  <div className="min-w-0">
                    <UserBadge name={d.owner} />
                  </div>

                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <AddToCollectionMenu datasetId={d.id} />
                    <IconTooltip label={pinned.includes(d.id) ? "Unpin" : "Pin"}>
                      <IconAction
                        aria-label={pinned.includes(d.id) ? "Unpin" : "Pin"}
                        onClick={() => togglePin(d.id)}
                      >
                        {pinned.includes(d.id) ? <PinOff /> : <Pin />}
                      </IconAction>
                    </IconTooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconAction aria-label="More actions">
                          <MoreHorizontal />
                        </IconAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-3.5 w-3.5" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
