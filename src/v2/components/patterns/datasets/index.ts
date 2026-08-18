/**
 * Datasets pattern — the dataset list surface: collections rail, tag filter,
 * sidebar, and the sharing flow.
 *
 * Reads collections through the `CollectionsProvider` adapter and people
 * through `DirectoryProvider`. Both fall back to in-memory implementations,
 * so the pattern renders standalone.
 */
export { AddToCollectionMenu } from "./AddToCollectionMenu";
export { CollectionsRail } from "./CollectionsRail";
export { DatasetsSidebar } from "./DatasetsSidebar";
export { ShareCollectionDialog } from "./ShareCollectionDialog";
export { TagFilter } from "./TagFilter";
export {
  canAccess,
  COLLECTION_COLORS,
  CollectionsProvider,
  createInMemoryCollections,
  shareCount,
  useCollections,
  useCollectionsAdapter,
  type Collection,
  type CollectionSharing,
  type CollectionsAdapter,
} from "./collections";
export type { DatasetSummary } from "./types";
