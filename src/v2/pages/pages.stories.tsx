import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";

import {
  CollectionsProvider,
  createInMemoryCollections,
} from "../components/patterns/datasets";
import { CurrentUserProvider, createInMemoryCurrentUser } from "../lib/currentUser";
import { DirectoryProvider, createInMemoryDirectory } from "../lib/directory";
import { Toaster as SonnerToaster } from "../components/ui/sonner";
import { DatasetsPage } from "./DatasetsPage";
import { SettingsActivityPage } from "./SettingsActivityPage";
import { SettingsServicesPage } from "./SettingsServicesPage";
import { COLLECTIONS, GROUPS, GROUP_MEMBERS, PEOPLE } from "./demoData";

/**
 * Three complete pages, assembled only from this design system.
 *
 * Each is a port of the equivalent page in the Lovable master
 * (`voxel51/fiftyone-copilot-internal`), rebuilt on v2. Nothing here reaches
 * for MUI, styled-components or a second component library, and no page
 * hand-rolls a control that already exists.
 *
 * Worth comparing against the shipping equivalent: Settings → Services in
 * teams-app is 617 lines importing from MUI, voodo and
 * `@fiftyone/teams-components` at once, with a hand-written `cssVar()` bridge
 * to feed voodo tokens into MUI's `sx`. The version here is four imports.
 *
 * All data is seeded from `demoData.ts` and is deterministic — fixed clock,
 * no randomness — so Chromatic diffs reflect real changes rather than the
 * time of day.
 */
const meta: Meta = {
  title: "v2/Pages",
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
};
export default meta;

type Story = StoryObj;

/** Supplies the three adapters an application would provide at its root. */
const withAdapters = (Story: React.FC) => (
  <CurrentUserProvider value={createInMemoryCurrentUser("u_you")}>
    <DirectoryProvider value={createInMemoryDirectory(PEOPLE, GROUPS)}>
      <CollectionsProvider
        value={createInMemoryCollections(COLLECTIONS, GROUP_MEMBERS)}
      >
        <div className="h-screen">
          <SonnerToaster />
          <Story />
        </div>
      </CollectionsProvider>
    </DirectoryProvider>
  </CurrentUserProvider>
);

/**
 * Settings → Services. Four design-system pieces: `WorkspaceHeader`,
 * `SettingsShell`, `ServicesView` and a `UserBadge`. The table, status pills,
 * per-user instance rows, create sheet and menus all live inside the pattern.
 */
export const SettingsServices: Story = {
  decorators: [withAdapters],
  render: () => <SettingsServicesPage />,
};

/**
 * Settings → Activity. Plan headroom, a trend, then consumption in plain
 * language. Aggregation stays in the page: what a period total means for a
 * snapshot dimension is a business rule, not a rendering concern.
 */
export const SettingsActivity: Story = {
  decorators: [withAdapters],
  render: () => <SettingsActivityPage />,
};

/** The same page as a member — no scope switch, no tenant-only dimensions. */
export const SettingsActivityAsMember: Story = {
  decorators: [withAdapters],
  render: () => <SettingsActivityPage isAdmin={false} />,
};

/**
 * Datasets. Header and sidebar come from the design system; the list is
 * composed from atoms in the page, which is the honest split — a dataset row
 * is this product's table, not a reusable pattern.
 */
export const Datasets: Story = {
  decorators: [withAdapters],
  render: () => <DatasetsPage />,
};
