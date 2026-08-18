import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../../ui/button";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { TextAction } from "../../ui/text-action";
import { cn } from "../../../lib/utils";

export interface ClarifyChoiceOption {
  value: string;
  label: string;
  description?: string;
}

export interface ClarifyChoiceCardData {
  id: string;
  question: string;
  helper?: string;
  options: ClarifyChoiceOption[];
  multi?: boolean;
  allowOther?: boolean;
}

interface Props {
  card: ClarifyChoiceCardData;
  onAnswer?: (cardId: string, values: string[]) => void;
  onSkip?: (cardId: string) => void;
  disabled?: boolean;
}

export function ClarifyChoiceCard({ card, onAnswer, onSkip, disabled = false }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherValue, setOtherValue] = useState("");
  const [showOther, setShowOther] = useState(false);
  const [submitted, setSubmitted] = useState<string[] | null>(null);

  const toggleMulti = (v: string) => {
    setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  };

  const hasOtherValue = showOther && otherValue.trim().length > 0;
  const canSubmit = hasOtherValue || selected.length > 0;
  const controlDisabled = disabled || submitted !== null;

  const submit = () => {
    const values = hasOtherValue ? [otherValue.trim()] : selected;
    if (values.length === 0) return;
    setSubmitted(values);
    onAnswer?.(card.id, values);
  };

  if (submitted) {
    const labels = submitted.map(
      (v) => card.options.find((o) => o.value === v)?.label ?? v,
    );
    return (
      <div className="ml-8 px-1 py-1">
        <div className="flex items-center gap-2 text-body-sm">
          <Check className="h-3.5 w-3.5 text-status-success shrink-0" />
          <span className="text-secondary-foreground truncate">
            <span className="text-foreground/80">{card.question}</span>
            <span className="mx-1.5 text-icon-subtle">·</span>
            <span className="text-foreground font-medium">{labels.join(", ")}</span>
          </span>
        </div>
      </div>
    );
  }

  const rowBase =
    "group flex items-start gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors text-left";
  const rowIdle =
    "border-input bg-transparent hover:border-primary";
  const rowActive =
    "border-primary bg-primary/10";

  const renderContent = (opt: ClarifyChoiceOption, active: boolean) => (
    <div className="flex-1 min-w-0">
      <div className={cn("text-body-sm font-medium leading-tight", active ? "text-primary" : "text-foreground")}>
        {opt.label}
      </div>
      {opt.description && (
        <div className="text-caption text-secondary-foreground mt-0.5 leading-snug">
          {opt.description}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("ml-8 rounded-xl border border-border/40 bg-card-2 overflow-hidden transition-opacity", disabled && "opacity-60")}>
      <header className="px-4 pt-3.5 pb-2.5">
        <h3 className="text-[14px] font-semibold text-foreground tracking-tight leading-snug">
          {card.question}
        </h3>
        {card.helper && (
          <p className="mt-1 text-body-sm text-secondary-foreground leading-snug">
            {card.helper}
          </p>
        )}
      </header>

      <div className="px-3 pb-2 space-y-1.5">
        {card.multi ? (
          <>
            {card.options.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label key={opt.value} className={cn(rowBase, checked ? rowActive : rowIdle)}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleMulti(opt.value)}
                    disabled={controlDisabled}
                    className="sr-only"
                  />
                  {renderContent(opt, checked)}
                </label>
              );
            })}
          </>
        ) : (
          <RadioGroup
            value={showOther ? "__other" : selected[0] ?? ""}
            onValueChange={(v) => {
              if (controlDisabled) return;
              if (v === "__other") {
                setShowOther(true);
                setSelected([]);
              } else {
                setShowOther(false);
                setSelected([v]);
              }
            }}
            className="space-y-1.5"
          >
            {card.options.map((opt) => {
              const active = !showOther && selected[0] === opt.value;
              return (
                <label key={opt.value} className={cn(rowBase, active ? rowActive : rowIdle)}>
                  <RadioGroupItem value={opt.value} disabled={controlDisabled} className="sr-only" />
                  {renderContent(opt, active)}
                </label>
              );
            })}
            {card.allowOther && (
              <div className={cn("rounded-lg border transition-colors", showOther ? "border-primary bg-primary/10" : "border-input hover:border-primary")}>
                <label className="flex cursor-pointer items-center gap-2.5 px-3 py-2.5">
                  <RadioGroupItem value="__other" disabled={controlDisabled} className="sr-only" />
                  <span className={cn("text-body-sm font-medium", showOther ? "text-primary" : "text-foreground")}>Something else</span>
                </label>
                {showOther && (
                  <div className="px-3 pb-2.5">

                  <Input
                    value={otherValue}
                    onFocus={() => {
                      if (!controlDisabled) {
                        setShowOther(true);
                        setSelected([]);
                      }
                    }}
                    onChange={(e) => setOtherValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canSubmit) submit();
                    }}
                    placeholder="Type your answer…"
                    disabled={controlDisabled}
                    className="h-8 rounded-lg border-input bg-transparent text-body-sm hover:border-input-hover focus:border-input-focus"
                  />
                  </div>
                )}
              </div>
            )}

          </RadioGroup>
        )}

        {showOther && card.multi && (
          <div className="pt-1">
            <Input
              autoFocus
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSubmit) submit();
              }}
              placeholder="Type your answer…"
              disabled={controlDisabled}
              className="h-8 rounded-lg border-input bg-transparent text-body-sm hover:border-input-hover focus:border-input-focus"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 px-3 py-2.5">
        <TextAction tone="muted" onClick={() => onSkip?.(card.id)} disabled={controlDisabled} className="rounded-lg px-3">
          Skip
        </TextAction>
        <Button
          size="sm"
          className="h-8 px-4"
          disabled={controlDisabled || !canSubmit}
          onClick={submit}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

