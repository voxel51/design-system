import { useEffect, useState } from "react";

/**
 * Global auto-save status for the annotation surfaces.
 *
 * Annotation edits save constantly in the background. Rather than firing a
 * toast on every save (noisy when the annotator is making rapid, back-to-back
 * changes), success/saving state is surfaced as a single persistent dot in the
 * annotation header. Errors still escalate to the activity toast so they can't
 * be missed.
 *
 * This is a tiny module-level store (no context/provider needed) so any editor
 * can report a save transition and any header can render the dot.
 */

export type SaveState = "idle" | "saving" | "saved" | "error";

const EVENT = "save-status-change";
const MIN_SAVING_VISIBLE_MS = 900;

let current: SaveState = "idle";
let lastSavedAt: number | null = null;
let savingStartedAt: number | null = null;
let pendingSavedTimer: ReturnType<typeof setTimeout> | null = null;

export function getSaveState(): SaveState {
  return current;
}

export function getLastSavedAt(): number | null {
  return lastSavedAt;
}

function emitSaveStateChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT));
  }
}

export function reportSaveState(next: SaveState) {
  if (pendingSavedTimer && next !== "saved") {
    clearTimeout(pendingSavedTimer);
    pendingSavedTimer = null;
  }

  if (next === "saving") {
    savingStartedAt = Date.now();
  }

  if (next === "saved" && current === "saving" && savingStartedAt) {
    const elapsed = Date.now() - savingStartedAt;
    if (elapsed < MIN_SAVING_VISIBLE_MS) {
      if (pendingSavedTimer) clearTimeout(pendingSavedTimer);
      pendingSavedTimer = setTimeout(() => {
        pendingSavedTimer = null;
        lastSavedAt = Date.now();
        current = "saved";
        emitSaveStateChange();
      }, MIN_SAVING_VISIBLE_MS - elapsed);
      return;
    }
  }

  if (next === "saved") lastSavedAt = Date.now();
  current = next;
  emitSaveStateChange();
}

export function reportSaveCycle() {
  reportSaveState("saving");
  if (typeof window !== "undefined") {
    window.setTimeout(() => reportSaveState("saved"), MIN_SAVING_VISIBLE_MS);
  }
}

/** Subscribe to the global save state (re-renders on changes). */
export function useSaveState(): { state: SaveState; lastSavedAt: number | null } {
  const [, force] = useState(0);
  useEffect(() => {
    const sync = () => force((n) => n + 1);
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return { state: current, lastSavedAt };
}
