/**
 * View-model for the Search pattern — natural-language query interpretation.
 *
 * Ported from the Lovable master's `lib/nlQueryAgent` and `QueryBuilder`. The
 * agent that produces a resolution stays in the application; these components
 * only render one, so the shapes come here.
 */

export type QueryField =
  | "label"
  | "tag"
  | "confidence"
  | "filepath"
  | "metadata"
  | "id";

export type QueryOperator =
  | "contains"
  | "is"
  | "is not"
  | "starts with"
  | "ends with"
  | ">"
  | "<"
  | ">="
  | "<=";

export type ClauseConnector = "AND" | "OR";

export interface QueryClause {
  id: string;
  field: QueryField;
  operator: QueryOperator;
  value: string;
  /** Connector *before* this clause. Ignored on the first. */
  connector: ClauseConnector;
}

/** Primary intent, driving the icon and label on the interpretation strip. */
export type NlIntentKind = "filter" | "panel" | "sort" | "insight";

/**
 * Panel a query can open alongside results. Open-ended by design: the set of
 * panels is an application concern, so this is a string rather than a union
 * the design system would have to keep in step.
 */
export type NlPanelTarget = string;

export interface NlResolution {
  /** Original text the user submitted. */
  query: string;
  /** One-line plain-English read-back of what the agent understood. */
  summary: string;
  kind: NlIntentKind;
  /** Concrete filters applied to the grid. */
  clauses: QueryClause[];
  /** Panel the agent opens alongside the results, if the ask implies one. */
  panel?: { id: NlPanelTarget; label: string; reason: string };
  /** Sort key the agent switched to, if any. */
  sort?: { field: string; label: string };
  /** How sure the agent is. Under 0.7 the UI invites the user to refine. */
  confidence: number;
}

export interface NlSuggestion {
  /** Text inserted into the search field. */
  text: string;
  kind: NlIntentKind;
  /** Short right-aligned hint, e.g. "opens Embeddings". */
  hint?: string;
}
