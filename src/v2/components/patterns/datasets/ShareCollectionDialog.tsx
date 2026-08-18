import { useMemo, useState } from "react";
import { Search, X, Users, Globe, Lock, Share2 } from "lucide-react";
import { AppModal } from "../../ui/app-modal";
import { Switch } from "../../ui/switch";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { IconAction } from "../../ui/icon-action";
import { Button } from "../../ui/button";
import { useCollectionsAdapter, type Collection } from "./collections";
import { useDirectory } from "../../../lib/directory";

interface ShareCollectionDialogProps {
  collection: Collection | null;
  onClose: () => void;
}

/**
 * Share dialog — owner grants full access (view/edit/delete) to specific
 * users, groups, or everyone. Access to the collection only; datasets inside
 * keep their own permissions.
 */
export function ShareCollectionDialog({ collection, onClose }: ShareCollectionDialogProps) {
  const [query, setQuery] = useState("");
  const collectionsAdapter = useCollectionsAdapter();
  const directory = useDirectory();

  const owner = collection ? directory.getPerson(collection.ownerId) : undefined;

  // Candidates not yet shared (and not the owner) matching the query.
  const results = useMemo(() => {
    if (!collection) return { users: [], groups: [] };
    const q = query.trim().toLowerCase();
    const users = directory.people().filter(
      (p) =>
        p.id !== collection.ownerId &&
        !collection.sharedUserIds.includes(p.id) &&
        (q === "" || p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)),
    );
    const groups = directory.groups().filter(
      (g) =>
        !collection.sharedGroupIds.includes(g.id) &&
        (q === "" || g.name.toLowerCase().includes(q)),
    );
    return { users, groups };
  }, [collection, query, directory]);

  if (!collection) return null;

  const addUser = (id: string) =>
    collectionsAdapter.setSharing(collection.id, {
      sharedWithAll: collection.sharedWithAll,
      sharedUserIds: [...collection.sharedUserIds, id],
      sharedGroupIds: collection.sharedGroupIds,
    });

  const removeUser = (id: string) =>
    collectionsAdapter.setSharing(collection.id, {
      sharedWithAll: collection.sharedWithAll,
      sharedUserIds: collection.sharedUserIds.filter((u) => u !== id),
      sharedGroupIds: collection.sharedGroupIds,
    });

  const addGroup = (id: string) =>
    collectionsAdapter.setSharing(collection.id, {
      sharedWithAll: collection.sharedWithAll,
      sharedUserIds: collection.sharedUserIds,
      sharedGroupIds: [...collection.sharedGroupIds, id],
    });

  const removeGroup = (id: string) =>
    collectionsAdapter.setSharing(collection.id, {
      sharedWithAll: collection.sharedWithAll,
      sharedUserIds: collection.sharedUserIds,
      sharedGroupIds: collection.sharedGroupIds.filter((g) => g !== id),
    });

  const toggleAll = (next: boolean) =>
    collectionsAdapter.setSharing(collection.id, {
      sharedWithAll: next,
      sharedUserIds: collection.sharedUserIds,
      sharedGroupIds: collection.sharedGroupIds,
    });

  const hasResults = results.users.length > 0 || results.groups.length > 0;

  return (
    <AppModal
      open={!!collection}
      onOpenChange={(o) => !o && onClose()}
      title={`Share “${collection.name}”`}
      description="Members can view, edit, and delete this collection. Dataset permissions stay unchanged."
      contentClassName="space-y-4"
      footer={
        <div className="flex justify-end gap-2 px-6 py-4">
          <Button variant="default" size="sm" onClick={onClose}>
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        </div>
      }
    >
        {/* Add people / groups */}
        <div>
          <div className="flex items-center gap-2 rounded-lg border border-input px-3 h-9 transition-colors focus-within:border-input-focus">
            <Search className="h-3.5 w-3.5 shrink-0 text-icon" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Add people or groups…"
              className="flex-1 bg-transparent text-body text-foreground placeholder:text-icon outline-none"
            />
          </div>

          {query.trim() !== "" && (
            <div className="mt-1.5 max-h-44 overflow-y-auto rounded-lg border border-border-subtle bg-card p-1">
              {!hasResults && (
                <p className="px-2 py-2 text-body-sm text-icon-subtle">No matches</p>
              )}
              {results.groups.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    addGroup(g.id);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 h-9 text-left transition-colors hover:bg-card-2"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                    <Users className="h-3.5 w-3.5 text-icon" />
                  </span>
                  <span className="flex-1 truncate text-body text-foreground">{g.name}</span>
                  <span className="text-meta text-icon-subtle">{g.memberIds.length} members</span>
                </button>
              ))}
              {results.users.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    addUser(p.id);
                    setQuery("");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 h-9 text-left transition-colors hover:bg-card-2"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-muted text-caption text-foreground">
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-body text-foreground">{p.name}</span>
                  <span className="truncate text-meta text-icon-subtle">{p.email}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Everyone toggle */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border-subtle px-3 py-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
            {collection.sharedWithAll ? (
              <Globe className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-icon" />
            )}
          </span>
          <div className="flex-1">
            <p className="text-body text-foreground">All users</p>
            <p className="text-meta text-icon-subtle">
              {collection.sharedWithAll
                ? "Everyone in the org has full access"
                : "Only people added below have access"}
            </p>
          </div>
          <Switch checked={collection.sharedWithAll} onCheckedChange={toggleAll} />
        </div>

        {/* Who has access */}
        <div>
          <p className="mb-1.5 text-meta uppercase tracking-wide text-icon-subtle">Who has access</p>
          <div className="max-h-56 overflow-y-auto">
            {/* Owner */}
            <div className="flex items-center gap-2.5 px-1 h-11">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-muted text-caption text-foreground">
                  {owner?.initials ?? "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-body text-foreground">{owner?.name ?? "Owner"}</p>
                <p className="truncate text-meta text-icon-subtle">{owner?.email}</p>
              </div>
              <span className="text-body-sm text-icon-subtle">Owner</span>
            </div>

            {/* Shared groups */}
            {collection.sharedGroupIds.map((gid) => {
              const g = directory.getGroup(gid);
              if (!g) return null;
              return (
                <div key={gid} className="group flex items-center gap-2.5 px-1 h-11">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                    <Users className="h-3.5 w-3.5 text-icon" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-body text-foreground">{g.name}</p>
                    <p className="truncate text-meta text-icon-subtle">{g.memberIds.length} members</p>
                  </div>
                  <span className="text-body-sm text-icon-subtle mr-1">Full access</span>
                  <IconAction size="sm" onClick={() => removeGroup(gid)} aria-label={`Remove ${g.name}`}>
                    <X />
                  </IconAction>
                </div>
              );
            })}

            {/* Shared users */}
            {collection.sharedUserIds.map((uid) => {
              const p = directory.getPerson(uid);
              if (!p) return null;
              return (
                <div key={uid} className="group flex items-center gap-2.5 px-1 h-11">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-muted text-caption text-foreground">
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-body text-foreground">{p.name}</p>
                    <p className="truncate text-meta text-icon-subtle">{p.email}</p>
                  </div>
                  <span className="text-body-sm text-icon-subtle mr-1">Full access</span>
                  <IconAction size="sm" onClick={() => removeUser(uid)} aria-label={`Remove ${p.name}`}>
                    <X />
                  </IconAction>
                </div>
              );
            })}
          </div>
        </div>
    </AppModal>
  );
}
