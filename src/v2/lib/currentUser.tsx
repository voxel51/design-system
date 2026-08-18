import { createAdapterContext, useAdapterValue } from "./createAdapterContext";

/**
 * Who is looking at the screen.
 *
 * Cross-cutting rather than owned by any one pattern: collections check
 * ownership, sharing dialogs exclude you from the recipient list, activity
 * splits tenant usage from yours. Identity itself — auth, profile, avatar
 * URL — stays in the application; a pattern only ever needs the id.
 */
export interface CurrentUserAdapter {
  /** Current user id. */
  get(): string;
  /** Called when the id changes. Returns its own teardown. */
  subscribe(listener: (id: string) => void): () => void;
  /**
   * Switch users. Present because the Lovable master has a demo role
   * switcher; applications with real auth can make this a no-op.
   */
  set(id: string): void;
}

/** In-memory adapter, used when no provider is present. */
export function createInMemoryCurrentUser(initial = "u-you"): CurrentUserAdapter {
  let id = initial;
  const listeners = new Set<(id: string) => void>();
  return {
    get: () => id,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    set(next) {
      id = next;
      listeners.forEach((l) => l(id));
    },
  };
}

export const [CurrentUserProvider, useCurrentUserAdapter] =
  createAdapterContext<CurrentUserAdapter>(
    "CurrentUser",
    createInMemoryCurrentUser(),
  );

/**
 * Current user id and a setter, re-rendering on change.
 *
 * Tuple-shaped to match the Lovable master's `useCurrentUser`, so ported
 * components keep their destructuring.
 */
export function useCurrentUser(): [string, (id: string) => void] {
  const adapter = useCurrentUserAdapter();
  const id = useAdapterValue(
    () => adapter.get(),
    (listener) => adapter.subscribe(listener),
  );
  return [id, adapter.set];
}
