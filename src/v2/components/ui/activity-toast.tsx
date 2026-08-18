import { useEffect, useState } from "react";
import { StatusIndicator, type StatusState } from "./status-indicator";

/**
 * activityToast — imperative wrapper around the design-system StatusIndicator
 * ("activity toast" with the green check / processing spinner). Use this for
 * processing → success / error feedback so the agentic workflows share one
 * consistent activity toast instead of ad-hoc sonner calls.
 *
 * Usage:
 *   activityToast.processing("Saving…")
 *   activityToast.success("Saved")
 *   activityToast.error("Couldn't save", "Please try again.")
 *
 * Mount <ActivityToaster /> once near the app root.
 */

interface ActivitySnapshot {
  state: StatusState;
  processingText?: string;
  successText?: string;
  errorTitle?: string;
  errorDescription?: string;
}

let current: ActivitySnapshot = { state: "idle" };
const listeners = new Set<() => void>();
/** Errors/successes auto-clear so a stale message can't linger over later, unrelated work. */
let autoClear: ReturnType<typeof setTimeout> | undefined;

function emit() {
  for (const l of listeners) l();
}

function set(next: ActivitySnapshot, autoClearMs?: number) {
  current = next;
  if (autoClear) clearTimeout(autoClear);
  autoClear = undefined;
  if (autoClearMs) {
    autoClear = setTimeout(() => {
      if (current === next) set({ state: "idle" });
    }, autoClearMs);
  }
  emit();
}

export const activityToast = {
  processing(text = "Working…") {
    set({ state: "processing", processingText: text });
  },
  success(text = "Done") {
    set({ state: "success", successText: text }, 4000);
  },
  error(title = "Something went wrong", description?: string) {
    set({ state: "error", errorTitle: title, errorDescription: description }, 6000);
  },
  reset() {
    set({ state: "idle" });
  },
};


export function ActivityToaster() {
  const [snap, setSnap] = useState<ActivitySnapshot>(current);

  useEffect(() => {
    const listener = () => setSnap({ ...current });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <StatusIndicator
      state={snap.state}
      processingText={snap.processingText}
      successText={snap.successText}
      errorTitle={snap.errorTitle}
      errorDescription={snap.errorDescription}
      onDismiss={() => activityToast.reset()}
    />
  );
}
