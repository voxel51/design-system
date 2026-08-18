/**
 * View-model for the Datasets pattern.
 *
 * The summary a dataset list row renders. Ported from the Lovable master's
 * `mocks/datasets`; the data is the application's, the shape belongs to
 * whatever draws it.
 */
export interface DatasetSummary {
  id: string;
  name: string;
  mediaCount: number;
  /** Noun shown after the count — samples and scenes are not images. */
  mediaUnit: "image" | "images" | "samples" | "scenes";
  fields: number;
  createdDaysAgo: number;
  /** Display name of the owner, already resolved. */
  owner: string;
  tags: string[];
  /** Tags beyond those listed, rendered as a "+N" affordance. */
  hiddenTagCount?: number;
}
