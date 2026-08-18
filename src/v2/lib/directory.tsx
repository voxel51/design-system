import { createAdapterContext } from "./createAdapterContext";

/**
 * People and groups in the workspace.
 *
 * Cross-cutting: sharing dialogs list recipients, assignee pickers resolve a
 * name from an id, avatars need initials. Ported from the Lovable master's
 * `mocks/people`, which the patterns imported directly.
 *
 * Deliberately read-only. Creating a user, editing a profile or changing group
 * membership is administration, and no pattern should reach for it through a
 * sharing dialog.
 */

export interface Person {
  id: string;
  name: string;
  /** Precomputed initials for the avatar. */
  initials: string;
  email: string;
}

export interface UserGroup {
  id: string;
  name: string;
  memberIds: string[];
}

export interface DirectoryAdapter {
  /** Every person who can be granted access. */
  people(): Person[];
  /** Every group that can be granted access. */
  groups(): UserGroup[];
  /** Resolve one person; undefined when the id is unknown or deleted. */
  getPerson(id: string): Person | undefined;
  getGroup(id: string): UserGroup | undefined;
}

/** In-memory adapter, backing Storybook and tests. */
export function createInMemoryDirectory(
  people: Person[] = [],
  groups: UserGroup[] = [],
): DirectoryAdapter {
  return {
    people: () => people,
    groups: () => groups,
    getPerson: (id) => people.find((p) => p.id === id),
    getGroup: (id) => groups.find((g) => g.id === id),
  };
}

export const [DirectoryProvider, useDirectory] =
  createAdapterContext<DirectoryAdapter>(
    "Directory",
    createInMemoryDirectory(),
  );
