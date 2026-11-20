import { useEffect, useState } from "react";

/** Formats a duration as "12 s", "2 min 5 s" or "1 h 3 min". */
export const formatElapsed = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h) return `${h} h ${m} min`;
  if (m) return `${m} min ${s} s`;
  return `${s} s`;
};

/**
 * How long a wait has lasted, as `formatElapsed` writes it, ticking each
 * second while `active`; null without a start. A given `until` fixes the end.
 *
 * @example
 * ```tsx
 * const elapsed = useElapsed(run.startedAt);
 * ```
 *
 * @param since When the wait began (ms epoch, ISO string or Date).
 * @param active Whether to keep ticking. Defaults to `true`.
 * @param until When the wait ended; stops the ticking.
 */
export function useElapsed(
  since?: number | string | Date | null,
  active = true,
  until?: number | string | Date | null
): string | null {
  const start = since == null ? null : new Date(since).getTime();
  const end = until == null ? null : new Date(until).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (start == null || Number.isNaN(start) || !active || end != null)
      return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [start, active, end]);

  return start == null || Number.isNaN(start)
    ? null
    : formatElapsed((end != null && !Number.isNaN(end) ? end : now) - start);
}
