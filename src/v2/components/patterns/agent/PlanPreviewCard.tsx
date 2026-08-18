import { useEffect, useState } from "react";
import { Check, ChevronDown, ChevronRight, ListChecks, Loader2 } from "lucide-react";

export interface PlanPreviewStep {
  label: string;
  detail?: string;
}

export interface PlanPreviewCardData {
  id: string;
  title?: string;
  steps: PlanPreviewStep[];
  /** ms between step reveals. Default 700. */
  stepIntervalMs?: number;
  /** If true, all steps show as done immediately (used when re-mounting). */
  preRevealed?: boolean;
}

interface Props {
  card: PlanPreviewCardData;
}

export function PlanPreviewCard({ card }: Props) {
  const interval = card.stepIntervalMs ?? 700;
  const [revealed, setRevealed] = useState(card.preRevealed ? card.steps.length : 0);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (card.preRevealed) return;
    if (revealed >= card.steps.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), interval);
    return () => clearTimeout(t);
  }, [revealed, card.steps.length, interval, card.preRevealed]);

  const done = revealed >= card.steps.length;
  // Auto-collapse a beat after done
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setExpanded(false), 900);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div className="ml-8 rounded-xl border border-border/40 bg-card-2 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        {done ? (
          <ListChecks className="h-3.5 w-3.5 text-icon shrink-0" />
        ) : (
          <Loader2 className="h-3.5 w-3.5 text-primary shrink-0 animate-spin" />
        )}
        <span className={`text-body-sm ${done ? "text-secondary-foreground" : "text-foreground/90"}`}>
          {done
            ? `${card.title ?? "Plan"} · ${card.steps.length} step${card.steps.length > 1 ? "s" : ""}`
            : card.title ?? "Thinking…"}
        </span>
        <span className="ml-auto text-icon-subtle">
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-2.5 pt-0.5 space-y-1.5 border-t border-border/30">
          {card.steps.map((step, i) => {
            const isDone = i < revealed;
            const isActive = i === revealed - 1 && !done;
            const isPending = i >= revealed;
            return (
              <div key={i} className="flex items-start gap-2 text-body-sm">
                <span className="mt-0.5 shrink-0">
                  {isDone && !isActive ? (
                    <Check className="h-3 w-3 text-status-success" />
                  ) : isActive ? (
                    <Loader2 className="h-3 w-3 text-primary animate-spin" />
                  ) : (
                    <span className="block h-3 w-3 rounded-full border border-border/50" />
                  )}
                </span>
                <span className={isPending ? "text-icon-subtle" : "text-foreground/85"}>
                  {step.label}
                  {step.detail && (
                    <span className="ml-1.5 text-muted-foreground">— {step.detail}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
