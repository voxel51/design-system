import { useMemo, useState } from "react";

import {
  Icon,
  IconName,
  Input,
  Pill,
  Size,
  Text,
  TextColor,
  TextVariant,
} from "@/index";
import { COLLECTIONS, DATASETS } from "@/v2/pages/demoData";

import { AppShell, IconButton, UserChip } from "./handRolled";

/**
 * Datasets, built with voodo 1.0. Same design and data as the v2 page.
 *
 * voodo's `Pill` covers the tag chips, which is the one place this page is
 * well served. Everything structural — the collections rail, the tag filter
 * with counts, the sort control, the row layout, pin state — is hand-built.
 *
 * The sort control is the sharpest example: voodo has `Select`, but it is a
 * bordered form field, and this design calls for an inline borderless
 * toolbar select. v2 ships that as `BorderlessSelect`; here it is a native
 * `<select>` with the chrome stripped, which loses the styled option list.
 */

const TABS = [
  { id: "work", label: "Work" },
  { id: "datasets", label: "Datasets", count: DATASETS.length },
  { id: "models", label: "Models", count: 4 },
  { id: "settings", label: "Settings" },
];

export function DatasetsPageV1() {
  const [tab, setTab] = useState("datasets");
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [sort, setSort] = useState<"recent" | "name" | "size">("recent");
  const [pinned, setPinned] = useState<string[]>(["quickstart"]);

  const inCollection = useMemo(() => {
    if (!collection) return DATASETS;
    const ids = COLLECTIONS.find((c) => c.id === collection)?.datasetIds ?? [];
    return DATASETS.filter((d) => ids.includes(d.id));
  }, [collection]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    inCollection.forEach((d) =>
      d.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [inCollection]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = inCollection.filter((d) => {
      if (q && !d.name.toLowerCase().includes(q) && !d.owner.toLowerCase().includes(q))
        return false;
      if (tags.length && !tags.every((t) => d.tags.includes(t))) return false;
      return true;
    });
    const sorted = [...filtered].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "size"
          ? b.mediaCount - a.mediaCount
          : a.createdDaysAgo - b.createdDaysAgo,
    );
    return [
      ...sorted.filter((d) => pinned.includes(d.id)),
      ...sorted.filter((d) => !pinned.includes(d.id)),
    ];
  }, [inCollection, query, tags, sort, pinned]);

  return (
    <AppShell tabs={TABS} activeTab={tab} onTabChange={setTab}>
      {/* No sidebar, rail or filter-group component in voodo. */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r-1 border-content-border-subtle p-4">
        <div className="mb-2">
          <Text variant={TextVariant.Label} color={TextColor.Muted}>
            Collections
          </Text>
        </div>
        <nav className="mb-6 space-y-0.5">
          <button
            type="button"
            onClick={() => setCollection(null)}
            className={
              "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm " +
              (collection === null
                ? "bg-content-bg-card-elevated text-content-text-primary"
                : "text-content-text-secondary hover:bg-content-bg-card-2")
            }
          >
            <span className="flex items-center gap-2">
              <Icon name={IconName.Workspaces} size={Size.Sm} /> All datasets
            </span>
            <span className="tabular-nums">{DATASETS.length}</span>
          </button>
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCollection(c.id)}
              className={
                "flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm " +
                (collection === c.id
                  ? "bg-content-bg-card-elevated text-content-text-primary"
                  : "text-content-text-secondary hover:bg-content-bg-card-2")
              }
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: `hsl(${c.color})` }}
                />
                {c.name}
              </span>
              <span className="tabular-nums">{c.datasetIds.length}</span>
            </button>
          ))}
        </nav>

        <div className="mb-2">
          <Text variant={TextVariant.Label} color={TextColor.Muted}>
            Tags
          </Text>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {tagCounts.map(([tag, count]) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setTags((s) => (s.includes(tag) ? s.filter((x) => x !== tag) : [...s, tag]))
              }
            >
              <Pill size={Size.Sm} isStatus={tags.includes(tag)}>
                {tag} {count}
              </Pill>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-8 pb-4 pt-6">
          <div className="flex-1">
            <Input
              icon={IconName.Search}
              placeholder="Search datasets"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {/* voodo Select is a bordered field; this design needs an inline one. */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-transparent text-sm text-content-text-secondary outline-none"
          >
            <option value="recent">Sort: Most recent</option>
            <option value="name">Sort: Name</option>
            <option value="size">Sort: Size</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <div className="rounded-lg bg-content-bg-card-1 py-2">
            {visible.map((d) => (
              <div
                key={d.id}
                className="group grid grid-cols-[minmax(220px,2fr)_minmax(0,1fr)_minmax(0,1fr)_90px] items-center gap-4 rounded px-3 py-3 hover:bg-content-bg-card-2"
              >
                <div className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-mono">
                      <Text variant={TextVariant.Md}>{d.name}</Text>
                    </span>
                    {pinned.includes(d.id) && (
                      <Icon name={IconName.Pin} size={Size.Sm} className="text-content-icon-brand" />
                    )}
                  </span>
                  <Text variant={TextVariant.Sm} color={TextColor.Secondary}>
                    {d.mediaCount.toLocaleString()} {d.mediaUnit} · {d.fields} fields
                  </Text>
                </div>
                <div className="flex min-w-0 flex-wrap gap-1">
                  {d.tags.slice(0, 2).map((t) => (
                    <Pill key={t} size={Size.Xs}>
                      {t}
                    </Pill>
                  ))}
                  {d.hiddenTagCount ? (
                    <Pill size={Size.Xs}>+{d.hiddenTagCount}</Pill>
                  ) : null}
                </div>
                <div className="min-w-0">
                  <UserChip name={d.owner} />
                </div>
                <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconButton
                    icon={IconName.Pin}
                    label={pinned.includes(d.id) ? "Unpin" : "Pin"}
                    onClick={() =>
                      setPinned((p) =>
                        p.includes(d.id) ? p.filter((x) => x !== d.id) : [...p, d.id],
                      )
                    }
                  />
                  <IconButton icon={IconName.MoreHorizontal} label="More actions" />
                </div>
              </div>
            ))}
            {visible.length === 0 && (
              <div className="py-16 text-center">
                <Text variant={TextVariant.Md} color={TextColor.Muted}>
                  No datasets match your filter.
                </Text>
              </div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
