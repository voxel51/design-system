/**
 * Agent pattern — the cards an assistant renders into a conversation:
 * clarification prompts, a plan preview before acting, action confirmation,
 * errors, and follow-up suggestions.
 *
 * Self-contained: this group had no application couplings, so it ported
 * without needing a prop seam.
 */
export * from "./ClarifyChoiceCard";
export * from "./ClarifySlotsCard";
export * from "./ConfirmActionCard";
export * from "./ErrorCard";
export * from "./PlanPreviewCard";
export * from "./SuggestionsRow";
