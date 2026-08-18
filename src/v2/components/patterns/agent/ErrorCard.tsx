import { useState } from "react";
import { AlertCircle, Check, Copy, Wrench } from "lucide-react";
import { Button } from "../../ui/button";
import { TextAction } from "../../ui/text-action";
import { AppModal } from "../../ui/app-modal";
import { StatusPill } from "../../ui/status-pill";
import { toast } from "sonner";

export interface ErrorCardData {
  id: string;
  title: string;
  summary: string;
  /** Short human sentence describing what the fix will do. */
  fixLabel: string;
  fixHint?: string;
  /** Optional structured details for the "View details" modal. */
  details?: {
    code?: string;
    operator?: string;
    trace?: string;
  };
  /** Copy used in the resolved summary row. */
  resolvedLabel?: string;
}

interface Props {
  card: ErrorCardData;
  onFix?: (cardId: string) => void;
  disabled?: boolean;
}

export function ErrorCard({ card, onFix, disabled = false }: Props) {
  const [fixed, setFixed] = useState(false);
  const [open, setOpen] = useState(false);

  const applyFix = () => {
    setFixed(true);
    onFix?.(card.id);
  };

  if (fixed) {
    return (
      <div className="ml-8 px-1 py-1">
        <div className="flex items-center gap-2 text-body-sm">
          <Check className="h-3.5 w-3.5 shrink-0 text-status-success" />
          <span className="text-secondary-foreground truncate">
            <span className="text-foreground/80">{card.title}</span>
            <span className="mx-1.5 text-icon-subtle">·</span>
            <span className="text-foreground font-medium">
              {card.resolvedLabel ?? "Fixed"}
            </span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`ml-8 rounded-xl border border-border/40 bg-card-2 overflow-hidden transition-opacity ${
          disabled ? "opacity-60" : ""
        }`}
      >
        <div className="flex items-start gap-2.5 px-3.5 py-3">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-status-failed" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-body font-medium text-foreground">{card.title}</div>
              <StatusPill tone="failed" label="Error" />
            </div>
            <div className="text-body-sm text-secondary-foreground mt-1 leading-relaxed">
              {card.summary}
            </div>
            {card.fixHint && (
              <div className="text-body-sm text-foreground/80 mt-2 flex items-start gap-1.5">
                <Wrench className="h-3 w-3 shrink-0 mt-[3px] text-icon-subtle" />
                <span>{card.fixHint}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-1.5 px-2.5 py-2 border-t border-border/30">
          <TextAction size="sm" tone="muted" onClick={() => setOpen(true)}>
            View details
          </TextAction>
          <Button
            size="sm"
            variant="positive"
            className="h-8 px-3"
            disabled={disabled}
            onClick={applyFix}
          >
            <Wrench className="h-3 w-3" />
            {card.fixLabel}
          </Button>
        </div>
      </div>

      <ErrorDetailsModal card={card} open={open} onOpenChange={setOpen} onFix={applyFix} />
    </>
  );
}

function ErrorDetailsModal({
  card,
  open,
  onOpenChange,
  onFix,
}: {
  card: ErrorCardData;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onFix: () => void;
}) {
  const copy = () => {
    const payload = [
      card.details?.operator && `Operator: ${card.details.operator}`,
      card.details?.code && `\n${card.details.code}`,
      card.details?.trace && `\n${card.details.trace}`,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(payload || card.summary);
    toast.success("Error details copied", { duration: 1600, position: "bottom-right" });
  };

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title={card.title}
      headerAccessory={<StatusPill tone="failed" label="Error" />}
      description={card.summary}
      primaryAction={{
        label: (
          <>
            <Wrench className="h-3 w-3" />
            {card.fixLabel}
          </>
        ),
        onClick: () => {
          onFix();
          onOpenChange(false);
        },
      }}
      secondaryAction={{ label: "Close", onClick: () => onOpenChange(false) }}
    >
      <div className="px-6 py-5 space-y-4">
        {card.details?.operator && (
          <div>
            <div className="text-meta uppercase tracking-wider text-secondary-foreground mb-1.5">
              Operator
            </div>
            <div className="text-body-sm font-mono text-foreground">
              {card.details.operator}
            </div>
          </div>
        )}
        {(card.details?.code || card.details?.trace) && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-meta uppercase tracking-wider text-secondary-foreground">
                Traceback
              </div>
              <TextAction size="sm" tone="muted" onClick={copy}>
                <Copy /> Copy
              </TextAction>
            </div>
            <pre className="max-h-[280px] overflow-auto rounded-lg border border-border/30 bg-card p-3 text-[11.5px] leading-relaxed font-mono text-foreground/85 whitespace-pre">
{[card.details.code, card.details.trace].filter(Boolean).join("\n\n")}
            </pre>
          </div>
        )}
        {card.fixHint && (
          <div className="rounded-lg border border-border/30 bg-card-2 px-3 py-2.5 text-body-sm text-foreground/85 flex items-start gap-2">
            <Wrench className="h-3.5 w-3.5 shrink-0 mt-0.5 text-icon" />
            <span>
              <span className="text-secondary-foreground">Suggested fix · </span>
              {card.fixHint}
            </span>
          </div>
        )}
      </div>
    </AppModal>
  );
}
