import { useState } from "react";
import { Layers, Plus, MoreHorizontal, Pencil, Trash2, Users, Globe, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { IconAction } from "../../ui/icon-action";
import { Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip";
import { TextAction } from "../../ui/text-action";
import {
  canAccess,
  shareCount,
  useCollections,
  useCollectionsAdapter,
  type Collection,
} from "./collections";
import { useCurrentUser } from "../../../lib/currentUser";
import { ShareCollectionDialog } from "./ShareCollectionDialog";
import { notify } from "../../ui/notify-toast";

interface CollectionsRailProps {
  activeId: string | null; // null = "All datasets"
  onSelect: (id: string | null) => void;
  totalCount: number;
}

/**
 * Collections / Folders — user-curated, opinionated groupings that datasets
 * can belong to. Only collections the current user can access are shown.
 * Owners can share a collection (full access) with users, groups, or everyone.
 */
export function CollectionsRail({ activeId, onSelect, totalCount }: CollectionsRailProps) {
  const allCollections = useCollections();
  const [currentUser] = useCurrentUser();
  const collectionsAdapter = useCollectionsAdapter();
  const collections = allCollections.filter((c) => canAccess(c, currentUser, collectionsAdapter.groupMembers));
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<Collection | null>(null);

  // Keep the share dialog in sync with the latest store state.
  const liveShareTarget = shareTarget
    ? allCollections.find((c) => c.id === shareTarget.id) ?? null
    : null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-body-sm font-semibold text-foreground tracking-wide">Collections</h3>
        <IconAction
          size="sm"
          aria-label="New collection"
          onClick={() => {
            setEditingId(null);
            setCreating(true);
          }}
        >
          <Plus />
        </IconAction>
      </div>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 h-9 mb-1 transition-colors ${
          activeId === null ? "bg-card-elevated text-foreground" : "hover:bg-card text-secondary-foreground"
        }`}
      >
        <Layers className="h-3.5 w-3.5 text-icon shrink-0" />
        <span className="flex-1 text-left text-body">All datasets</span>
        <span className={`w-5 text-right text-body-sm tabular-nums ${activeId === null ? "text-foreground font-semibold" : "text-icon-subtle"}`}>{totalCount}</span>
      </button>

      {collections.map((c) => {
        const active = activeId === c.id;
        const isOwner = c.ownerId === currentUser;
        const shared = shareCount(c) > 0;
        if (editingId === c.id) {
          return (
            <CollectionEditor
              key={c.id}
              initialName={c.name}
              onSave={(name) => {
                collectionsAdapter.update(c.id, { name });
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          );
        }
        return (
          <div
            key={c.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(c.id)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(c.id)}
            className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 h-9 mb-1 cursor-pointer transition-colors ${
              active ? "bg-card-elevated text-foreground" : "hover:bg-card text-secondary-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-icon shrink-0" />
            <span className="flex-1 truncate text-left text-body">{c.name}</span>
            {shared && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="shrink-0 text-icon-subtle">
                    {c.sharedWithAll ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">{c.sharedWithAll ? "Shared with everyone" : "Shared"}</TooltipContent>
              </Tooltip>
            )}
            <div className="relative w-5 h-5 shrink-0 flex items-center justify-end">
              <span className={`text-body-sm tabular-nums group-hover:opacity-0 transition-opacity ${active ? "text-foreground font-semibold" : "text-icon-subtle"}`}>
                {c.datasetIds.length}
              </span>
              <DropdownMenu
                open={menuId === c.id}
                onOpenChange={(open) => setMenuId(open ? c.id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <IconAction
                    size="sm"
                    aria-label="Collection actions"
                    className={`absolute -right-0.5 top-1/2 -translate-y-1/2 transition-opacity ${
                      menuId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal />
                  </IconAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuId(null);
                      setCreating(false);
                      setEditingId(c.id);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                  </DropdownMenuItem>
                  {isOwner && (
                    <DropdownMenuItem
                      onClick={() => {
                        setMenuId(null);
                        setShareTarget(c);
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-2" /> Share
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setMenuId(null);
                      if (activeId === c.id) onSelect(null);
                      collectionsAdapter.remove(c.id);
                      notify.error(`Deleted “${c.name}”`);
                    }}
                    className="text-destructive focus:!bg-destructive focus:!text-destructive-foreground data-[highlighted]:!bg-destructive data-[highlighted]:!text-destructive-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      {creating && (
        <CollectionEditor
          initialName=""
          onSave={(name) => {
            const col = collectionsAdapter.create(name, currentUser);
            notify.success(`Created “${col.name}”`);
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      <ShareCollectionDialog collection={liveShareTarget} onClose={() => setShareTarget(null)} />
    </section>
  );
}

/** Inline editor shared by create + edit: set a name. */
function CollectionEditor({
  initialName,
  onSave,
  onCancel,
}: {
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);

  const commit = () => {
    if (name.trim()) onSave(name);
    else onCancel();
  };

  return (
    <div className="rounded-lg bg-card border border-border-subtle p-2.5 mb-1 space-y-3">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Collection name…"
        className="h-8 w-full min-w-0 rounded-md bg-background border border-input px-2.5 text-body text-foreground placeholder:text-icon outline-none hover:border-input-hover focus:border-input-focus transition-colors"
      />
      <div className="flex items-center justify-end gap-1">
        <TextAction size="sm" onClick={onCancel}>
          Cancel
        </TextAction>
        <TextAction size="sm" onClick={commit}>
          Save
        </TextAction>
      </div>
    </div>
  );
}
