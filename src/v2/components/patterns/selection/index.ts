/**
 * Selection pattern — the tray, pill and action bar shown while samples are
 * selected.
 *
 * Selection is UI state rather than application data, so the design system
 * owns the store (`useSelection` from `lib/selectionStore`) instead of taking
 * an adapter. Sending a selection to the agent is application wiring and
 * arrives as `onSendPrompt`.
 */
export { SelectionActions } from "./SelectionActions";
export { SelectionPill } from "./SelectionPill";
export { SelectionTray } from "./SelectionTray";
export { buildSelectionPrompt } from "./prompt";
