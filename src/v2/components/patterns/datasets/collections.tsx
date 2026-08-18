import {
  createAdapterContext,
  useAdapterValue,
} from "../../../lib/createAdapterContext";

/**
 * Collections — named, shareable groupings of datasets.
 *
 * Ported from the Lovable master's `lib/collectionsStore`, which the pattern
 * imported directly. The design system declares the operations it performs
 * and reads an implementation from context; persistence, permissions and
 * transport belong to the application.
 */

export interface Collection {
  id: string;
  name: string;
  /** Accent color as an HSL triple, matching the token format. */
  color: string;
  datasetIds: string[];
  createdAt: number;
  /** User id of the owner. */
  ownerId: string;
  /** When true, every user has full access. */
  sharedWithAll: boolean;
  /** Users granted full access. */
  sharedUserIds: string[];
  /** Groups granted full access. */
  sharedGroupIds: string[];
}

/** Full share configuration for a collection. */
export interface CollectionSharing {
  sharedWithAll: boolean;
  sharedUserIds: string[];
  sharedGroupIds: string[];
}

/** Everything the datasets pattern does to a collection. Nothing more. */
export interface CollectionsAdapter {
  getAll(): Collection[];
  subscribe(listener: (collections: Collection[]) => void): () => void;
  create(name: string, ownerId: string, color?: string): Collection;
  update(id: string, patch: { name?: string; color?: string }): void;
  remove(id: string): void;
  setSharing(id: string, sharing: CollectionSharing): void;
  /** Add the dataset if absent, remove it if present. */
  toggleDataset(collectionId: string, datasetId: string): void;
  /**
   * Group membership, for access checks. Returns the member ids of a group,
   * or an empty array for an unknown group. Kept on the adapter because group
   * membership is application data.
   */
  groupMembers(groupId: string): string[];
}

/** Default accent colors, cycled when a collection is created without one. */
export const COLLECTION_COLORS = [
  "265 80% 65%",
  "230 75% 62%",
  "190 85% 55%",
  "172 70% 45%",
  "150 60% 50%",
  "38 92% 55%",
  "340 82% 60%",
  "220 15% 55%",
];

/**
 * In-memory adapter. Backs Storybook and tests; an application supplies its
 * own. `groups` maps group id to member ids for access checks.
 */
export function createInMemoryCollections(
  seed: Collection[] = [],
  groups: Record<string, string[]> = {},
): CollectionsAdapter {
  let all = [...seed];
  const listeners = new Set<(c: Collection[]) => void>();
  const write = (next: Collection[]) => {
    all = next;
    listeners.forEach((l) => l(all));
  };

  return {
    getAll: () => all,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    create(name, ownerId, color) {
      const collection: Collection = {
        id: `col-${all.length + 1}`,
        name: name.trim() || "Untitled collection",
        color: color ?? COLLECTION_COLORS[all.length % COLLECTION_COLORS.length],
        datasetIds: [],
        createdAt: 0,
        ownerId,
        sharedWithAll: false,
        sharedUserIds: [],
        sharedGroupIds: [],
      };
      write([...all, collection]);
      return collection;
    },
    update(id, patch) {
      write(
        all.map((c) =>
          c.id === id
            ? {
                ...c,
                name: patch.name?.trim() ? patch.name.trim() : c.name,
                color: patch.color ?? c.color,
              }
            : c,
        ),
      );
    },
    remove(id) {
      write(all.filter((c) => c.id !== id));
    },
    setSharing(id, sharing) {
      write(all.map((c) => (c.id === id ? { ...c, ...sharing } : c)));
    },
    toggleDataset(collectionId, datasetId) {
      write(
        all.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                datasetIds: c.datasetIds.includes(datasetId)
                  ? c.datasetIds.filter((d) => d !== datasetId)
                  : [...c.datasetIds, datasetId],
              }
            : c,
        ),
      );
    },
    groupMembers: (groupId) => groups[groupId] ?? [],
  };
}

export const [CollectionsProvider, useCollectionsAdapter] =
  createAdapterContext<CollectionsAdapter>(
    "Collections",
    createInMemoryCollections(),
  );

/** All collections, re-rendering on change. */
export function useCollections(): Collection[] {
  const adapter = useCollectionsAdapter();
  return useAdapterValue(
    () => adapter.getAll(),
    (listener) => adapter.subscribe(listener),
  );
}

/**
 * Whether a user can see a collection: they own it, it is shared with
 * everyone, they are named directly, or they belong to a group it is shared
 * with.
 */
export function canAccess(
  c: Collection,
  userId: string,
  groupMembers: (groupId: string) => string[],
): boolean {
  if (c.ownerId === userId) return true;
  if (c.sharedWithAll) return true;
  if (c.sharedUserIds.includes(userId)) return true;
  return c.sharedGroupIds.some((gid) => groupMembers(gid).includes(userId));
}

/** Distinct users, groups and "everyone" a collection is shared with. */
export function shareCount(c: Collection): number {
  return (
    (c.sharedWithAll ? 1 : 0) +
    c.sharedUserIds.length +
    c.sharedGroupIds.length
  );
}
