/**
 * Starter prompt handed to the agent when a selection is sent to it.
 *
 * Copy rather than mechanism, so it belongs with the pattern: the wording is
 * part of how the feature reads. Delivery is the application's — see
 * `onSendPrompt` on `SelectionActions`.
 */
export function buildSelectionPrompt(count: number): string {
  const s = count === 1 ? "" : "s";
  return [
    `Context: ${count.toLocaleString()} sample${s} selected.`,
    ``,
    `• Surface likely annotation issues or mislabels in this subset`,
    `• Find near-duplicates and visually similar samples I might've missed`,
    `• Summarize what these samples have in common (labels, metadata, visual patterns)`,
    `• Compare model predictions vs ground truth on just this subset`,
    `• Send these to a review queue or tag them for follow-up`,
  ].join("\n");
}
