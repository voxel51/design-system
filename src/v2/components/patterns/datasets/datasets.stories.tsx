import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  AddToCollectionMenu,
  CollectionsProvider,
  CollectionsRail,
  CurrentUserProvider,
  DatasetsSidebar,
  DirectoryProvider,
  ShareCollectionDialog,
  SonnerToaster,
  TagFilter,
  createInMemoryCollections,
  createInMemoryCurrentUser,
  createInMemoryDirectory,
  type Collection,
  type DatasetSummary,
} from "@voxel51/voodo/v2";

/**
 * Datasets — the dataset list surface: collections rail, tag filter, sidebar
 * and the sharing flow.
 *
 * Reads collections through `CollectionsProvider` and people through
 * `DirectoryProvider`. Both fall back to in-memory implementations, so these
 * stories run with no application behind them — which is exactly what an
 * adapter is for.
 */
const meta: Meta<typeof CollectionsRail> = {
  title: "v2/Patterns/Datasets",
  component: CollectionsRail,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj<typeof CollectionsRail>;

const PEOPLE = [
  { id: "u_you", name: "Sejal Kotak", initials: "SK", email: "sejal@voxel51.com" },
  { id: "u_ritchie", name: "Ritchie Martori", initials: "RM", email: "ritchie@voxel51.com" },
  { id: "u_tim", name: "Tim Mendoza", initials: "TM", email: "tim@voxel51.com" },
];
const GROUPS = [{ id: "g_eng", name: "Engineering", memberIds: ["u_ritchie", "u_tim"] }];

const COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Automotive",
    color: "230 75% 62%",
    datasetIds: ["berkeley-drive", "diux-xview"],
    createdAt: 0,
    ownerId: "u_you",
    sharedWithAll: false,
    sharedUserIds: ["u_ritchie"],
    sharedGroupIds: [],
  },
  {
    id: "col-2",
    name: "Benchmarks",
    color: "172 70% 45%",
    datasetIds: ["quickstart"],
    createdAt: 0,
    ownerId: "u_you",
    sharedWithAll: true,
    sharedUserIds: [],
    sharedGroupIds: ["g_eng"],
  },
];

const DATASETS: DatasetSummary[] = [
  {
    id: "berkeley-drive",
    name: "berkeley-drive-annotate",
    mediaCount: 2056,
    mediaUnit: "images",
    fields: 22,
    createdDaysAgo: 7,
    owner: "Brian Moore",
    tags: ["automotive", "dashboard", "demo"],
    hiddenTagCount: 5,
  },
  {
    id: "diux-xview",
    name: "DIUx-XView",
    mediaCount: 1136,
    mediaUnit: "images",
    fields: 29,
    createdDaysAgo: 10,
    owner: "Mike DeCarlo",
    tags: ["GeoINT", "eval-demo"],
  },
  {
    id: "quickstart",
    name: "quickstart",
    mediaCount: 200,
    mediaUnit: "samples",
    fields: 12,
    createdDaysAgo: 30,
    owner: "Sejal Kotak",
    tags: ["demo"],
  },
];

/** Wires the three adapters a caller would supply in an application. */
const withAdapters = (Story: React.FC) => (
  <CurrentUserProvider value={createInMemoryCurrentUser("u_you")}>
    <DirectoryProvider value={createInMemoryDirectory(PEOPLE, GROUPS)}>
      <CollectionsProvider
        value={createInMemoryCollections(COLLECTIONS, { g_eng: ["u_ritchie", "u_tim"] })}
      >
        <SonnerToaster />
        <Story />
      </CollectionsProvider>
    </DirectoryProvider>
  </CurrentUserProvider>
);

export const Rail: Story = {
  decorators: [withAdapters],
  render: function RailStory() {
    const [active, setActive] = React.useState<string | null>(null);
    return (
      <div className="w-64">
        <CollectionsRail activeId={active} onSelect={setActive} totalCount={DATASETS.length} />
      </div>
    );
  },
};

export const Tags: Story = {
  decorators: [withAdapters],
  render: function TagsStory() {
    const [selected, setSelected] = React.useState<string[]>(["demo"]);
    return (
      <div className="w-64">
        <TagFilter
          datasets={DATASETS}
          selected={selected}
          onToggle={(t) =>
            setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
          }
          onClear={() => setSelected([])}
        />
      </div>
    );
  },
};

/** Rail and tag filter together, as the page composes them. */
export const Sidebar: Story = {
  decorators: [withAdapters],
  render: function SidebarStory() {
    const [collection, setCollection] = React.useState<string | null>(null);
    const [tags, setTags] = React.useState<string[]>([]);
    return (
      <div className="h-[36rem] w-72">
        <DatasetsSidebar
          activeCollection={collection}
          onSelectCollection={setCollection}
          totalCount={DATASETS.length}
          tagDatasets={DATASETS}
          selectedTags={tags}
          onToggleTag={(t) =>
            setTags((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]))
          }
          onClearTags={() => setTags([])}
        />
      </div>
    );
  },
};

/** Row-level affordance for filing a dataset into a collection. */
export const AddToCollection: Story = {
  decorators: [withAdapters],
  render: () => <AddToCollectionMenu datasetId="quickstart" />,
};

/** Sharing grants access to the collection only; datasets keep their own. */
export const Share: Story = {
  decorators: [withAdapters],
  render: () => <ShareCollectionDialog collection={COLLECTIONS[0]} onClose={() => {}} />,
};
