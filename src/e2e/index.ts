/**
 * `@voxel51/voodo/e2e`: Playwright page objects for voodo components.
 *
 * Product e2e suites import these instead of writing their own selectors for
 * voodo components, so knowledge of how a component is driven lives once,
 * next to the component, and is verified here by the `*.pom.spec.ts` files.
 *
 * Every export is type-only at runtime with respect to Playwright: page objects
 * take `Locator` and `Page` values from the caller and never import
 * `@playwright/test` at runtime, so this entry adds no dependency to a suite.
 */
export * from "../components/ContextMenu/ContextMenu.pom";
export * from "../components/Select/Select.pom";
