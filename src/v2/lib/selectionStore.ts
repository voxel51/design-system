/**
 * Global sample-selection store — the "focus group" of samples currently
 * selected across the workspace, regardless of entry point (grid click,
 * embeddings lasso, or any future panel).
 *
 * Selection accumulates: new sources (grid + embeddings + more grid) union
 * into the same set until `clear()` is called. Per-id origin is tracked in
 * `sources` for a future source-chip UX (not surfaced yet).
 */

import { useSyncExternalStore } from "react";

export type SelectionSource = "grid" | "embeddings" | "panel";

type State = {
  ids: Set<string>;
  sources: Record<string, SelectionSource>;
};

let state: State = { ids: new Set(), sources: {} };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function setState(next: State) {
  state = next;
  emit();
}

export const selectionStore = {
  getSnapshot: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  add(ids: string[], source: SelectionSource) {
    if (ids.length === 0) return;
    const nextIds = new Set(state.ids);
    const nextSources = { ...state.sources };
    let changed = false;
    ids.forEach((id) => {
      if (!nextIds.has(id)) {
        changed = true;
        nextIds.add(id);
      }
      if (nextSources[id] !== source) {
        changed = true;
        nextSources[id] = source;
      }
    });
    if (changed) setState({ ids: nextIds, sources: nextSources });
  },
  remove(ids: string[]) {
    if (ids.length === 0) return;
    const nextIds = new Set(state.ids);
    const nextSources = { ...state.sources };
    let changed = false;
    ids.forEach((id) => {
      if (nextIds.has(id)) {
        changed = true;
        nextIds.delete(id);
        delete nextSources[id];
      }
    });
    if (changed) setState({ ids: nextIds, sources: nextSources });
  },
  toggle(id: string, source: SelectionSource) {
    if (state.ids.has(id)) selectionStore.remove([id]);
    else selectionStore.add([id], source);
  },
  replace(ids: string[], source: SelectionSource) {
    const nextIds = new Set(ids);
    const nextSources: Record<string, SelectionSource> = {};
    ids.forEach((id) => (nextSources[id] = source));
    setState({ ids: nextIds, sources: nextSources });
  },
  /**
   * Replace only the ids that came from `source`, preserving everything from
   * other sources. Used to sync a scoped surface (e.g. the embeddings viewer)
   * into the global focus group without wiping grid-originated selections.
   */
  replaceForSource(ids: string[], source: SelectionSource) {
    const nextIds = new Set<string>();
    const nextSources: Record<string, SelectionSource> = {};
    // Keep everything from other sources.
    state.ids.forEach((id) => {
      if (state.sources[id] !== source) {
        nextIds.add(id);
        nextSources[id] = state.sources[id];
      }
    });
    // Add the new set from this source.
    ids.forEach((id) => {
      nextIds.add(id);
      nextSources[id] = source;
    });
    // Skip emit if unchanged.
    if (nextIds.size === state.ids.size) {
      let same = true;
      for (const id of nextIds) {
        if (!state.ids.has(id) || state.sources[id] !== nextSources[id]) {
          same = false;
          break;
        }
      }
      if (same) return;
    }
    setState({ ids: nextIds, sources: nextSources });
  },

  clear() {
    if (state.ids.size === 0) return;
    setState({ ids: new Set(), sources: {} });
  },
};

/**
 * React hook — subscribes to the selection store and returns the current
 * focus group along with mutation helpers.
 */
export function useSelection() {
  const snapshot = useSyncExternalStore(
    selectionStore.subscribe,
    selectionStore.getSnapshot,
    selectionStore.getSnapshot,
  );
  return {
    ids: snapshot.ids,
    sources: snapshot.sources,
    count: snapshot.ids.size,
    add: selectionStore.add,
    remove: selectionStore.remove,
    toggle: selectionStore.toggle,
    replace: selectionStore.replace,
    clear: selectionStore.clear,
  };
}
