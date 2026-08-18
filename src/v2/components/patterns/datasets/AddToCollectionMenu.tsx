import { useState } from "react";
import { FolderPlus, Plus, Check, Layers } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../ui/dropdown-menu";
import { IconAction } from "../../ui/icon-action";
import {
  canAccess,
  useCollections,
  useCollectionsAdapter,
} from "./collections";
import { useCurrentUser } from "../../../lib/currentUser";
import { notify } from "../../ui/notify-toast";

interface AddToCollectionMenuProps {
  datasetId: string;
}

/** Row-level "add to collection" affordance. */
export function AddToCollectionMenu({ datasetId }: AddToCollectionMenuProps) {
  const allCollections = useCollections();
  const [currentUser] = useCurrentUser();
  const collectionsAdapter = useCollectionsAdapter();
  const collections = allCollections.filter((c) => canAccess(c, currentUser, collectionsAdapter.groupMembers));
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  const commitCreate = () => {
    const trimmed = name.trim();
    if (trimmed) {
      const col = collectionsAdapter.create(trimmed, currentUser);
      collectionsAdapter.toggleDataset(col.id, datasetId);
      notify.success(`Created “${col.name}” and added dataset`);
    }
    setName("");
    setCreating(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <IconAction
          aria-label="Add to collection"
          className={open ? "bg-card-elevated text-foreground" : undefined}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <FolderPlus />
        </IconAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="text-meta uppercase tracking-wide text-icon-subtle">
          Add to collection
        </DropdownMenuLabel>
        {collections.map((c) => {
          const inIt = c.datasetIds.includes(datasetId);
          return (
            <DropdownMenuItem
              key={c.id}
              onSelect={(e) => {
                e.preventDefault();
                collectionsAdapter.toggleDataset(c.id, datasetId);
                if (inIt) {
                  notify.info(`Removed from “${c.name}”`);
                } else {
                  notify.success(`Added to “${c.name}”`);
                }
              }}
              className="gap-2"
            >
              <Layers className="h-3.5 w-3.5 text-icon shrink-0" />
              <span className="flex-1 truncate text-body">{c.name}</span>
              {inIt && <Check className="h-3.5 w-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        {creating ? (
          <div className="px-2 py-1.5">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCreate();
                if (e.key === "Escape") {
                  setCreating(false);
                  setName("");
                }
              }}
              onBlur={commitCreate}
              placeholder="New collection name…"
              className="h-8 w-full rounded-md bg-card border border-input px-2 text-body text-foreground placeholder:text-icon outline-none hover:border-input-hover focus:border-input-focus transition-colors"
            />
          </div>
        ) : (
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setCreating(true);
            }}
            className="gap-2 text-secondary-foreground"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-body">New collection…</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
