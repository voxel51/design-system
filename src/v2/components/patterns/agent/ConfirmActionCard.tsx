import { useState } from "react";
import { AlertTriangle, Check, X, Pencil } from "lucide-react";
import { Button } from "../../ui/button";

export type ConfirmDecision = "approve" | "modify" | "skip";

export interface ConfirmActionCardData {
  id: string;
  title: string;
  description?: string;
  approveLabel?: string;
  showModify?: boolean;
  tone?: "neutral" | "warning";
}

interface Props {
  card: ConfirmActionCardData;
  onDecide?: (cardId: string, decision: ConfirmDecision) => void;
  disabled?: boolean;
}

export function ConfirmActionCard({ card, onDecide, disabled = false }: Props) {
  const [decision, setDecision] = useState<ConfirmDecision | null>(null);

  const decide = (d: ConfirmDecision) => {
    setDecision(d);
    onDecide?.(card.id, d);
  };

  if (decision) {
    const label =
      decision === "approve"
        ? `Approved · ${card.approveLabel ?? "Run"}`
        : decision === "skip"
        ? "Skipped"
        : "Modifying…";
    const Icon = decision === "approve" ? Check : decision === "skip" ? X : Pencil;
    const color =
      decision === "approve"
        ? "text-status-success"
        : decision === "skip"
        ? "text-status-failed"
        : "text-secondary-foreground";
    return (
      <div className="ml-8 px-1 py-1">
        <div className="flex items-center gap-2 text-body-sm">
          <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
          <span className="text-secondary-foreground truncate">
            <span className="text-foreground/80">{card.title}</span>
            <span className="mx-1.5 text-icon-subtle">·</span>
            <span className="text-foreground font-medium">{label}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`ml-8 rounded-xl border border-border/40 bg-card-2 overflow-hidden transition-opacity ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-2 px-3.5 py-3">
        <AlertTriangle
          className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
            card.tone === "warning" ? "text-status-warning" : "text-primary"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="text-body font-medium text-foreground">{card.title}</div>
          {card.description && (
            <div className="text-body-sm text-secondary-foreground mt-0.5">{card.description}</div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end gap-1.5 px-2.5 py-2 border-t border-border/30">
        <Button size="sm" variant="negative" className="h-8 px-3" disabled={disabled} onClick={() => decide("skip")}>
          Skip
        </Button>
        {card.showModify !== false && (
          <Button size="sm" variant="secondary" className="h-8 px-3" disabled={disabled} onClick={() => decide("modify")}>
            <Pencil className="h-3 w-3" />
            Modify
          </Button>
        )}
        <Button size="sm" variant="positive" className="h-8 px-3" disabled={disabled} onClick={() => decide("approve")}>
          <Check className="h-3 w-3" />
          {card.approveLabel ?? "Approve & run"}
        </Button>
      </div>
    </div>
  );
}
