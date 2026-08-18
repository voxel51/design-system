import * as React from "react";

/**
 * The seam between a pattern and the application's data.
 *
 * Patterns need to read and write application state — collections, selection,
 * a model registry, the current user. Three ways to wire that, and the first
 * two are worse:
 *
 * 1. Import the store directly. What the Lovable master does. A design system
 *    cannot: the store is application code, and the dependency runs the wrong
 *    way.
 * 2. Pass everything as props. Correct but it does not survive depth — a
 *    collections rail three components above a share dialog means threading
 *    six callbacks through components that do not use them.
 * 3. An adapter in context. The design system declares the interface it needs
 *    and reads it from a provider; the application supplies an implementation
 *    backed by whatever it actually uses — a store, react-query, Relay.
 *
 * The third also keeps ports mechanical: a component's body still calls
 * `useCollections()`, exactly as it did in the Lovable master, so importing a
 * page is still an import rewrite rather than a refactor.
 *
 * Every adapter ships an in-memory default so a pattern renders standalone in
 * Storybook without an application behind it. Forgetting the provider in an
 * app is then a silent no-op rather than a crash, which is why `strict` exists.
 *
 * @example
 * ```tsx
 * const [CollectionsProvider, useCollectionsAdapter] =
 *   createAdapterContext<CollectionsAdapter>("Collections", inMemoryCollections);
 *
 * // application
 * <CollectionsProvider value={myApiBackedAdapter}>{children}</CollectionsProvider>
 * ```
 */
export function createAdapterContext<T>(
  /** Name used in the error message when a strict adapter is missing. */
  name: string,
  /**
   * Fallback used when no provider is present. Supply an in-memory
   * implementation so Storybook and tests work unconfigured; pass `undefined`
   * with `strict` for adapters that have no sensible default.
   */
  fallback?: T,
): [
  React.FC<{ value: T; children: React.ReactNode }>,
  (options?: { strict?: boolean }) => T,
] {
  const Context = React.createContext<T | undefined>(undefined);
  Context.displayName = `${name}AdapterContext`;

  const Provider: React.FC<{ value: T; children: React.ReactNode }> = ({
    value,
    children,
  }) => <Context.Provider value={value}>{children}</Context.Provider>;
  Provider.displayName = `${name}Provider`;

  const useAdapter = ({ strict = false }: { strict?: boolean } = {}): T => {
    const value = React.useContext(Context);
    if (value !== undefined) return value;
    if (fallback !== undefined && !strict) return fallback;
    throw new Error(
      `${name} adapter is missing. Wrap this subtree in <${name}Provider value={...}>.`,
    );
  };

  return [Provider, useAdapter];
}

/**
 * Subscribe to an adapter's store-shaped source and re-render on change.
 *
 * The pattern recurs in every adapter: read once, subscribe, unsubscribe on
 * unmount. `subscribe` returns its own teardown.
 */
export function useAdapterValue<T>(
  read: () => T,
  subscribe: (listener: (next: T) => void) => () => void,
): T {
  const [value, setValue] = React.useState<T>(read);
  React.useEffect(() => {
    setValue(read());
    return subscribe(setValue);
    // Adapters are stable for the lifetime of their provider; re-subscribing
    // on every render would tear down the subscription each frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
