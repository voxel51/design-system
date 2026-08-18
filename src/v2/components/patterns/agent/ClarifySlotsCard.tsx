import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { TextAction } from "../../ui/text-action";
import { cn } from "../../../lib/utils";

export type SlotField =
  | {
      key: string;
      label: string;
      type: "select";
      options: { value: string; label: string }[];
      defaultValue?: string;
      hint?: string;
    }
  | {
      key: string;
      label: string;
      type: "text" | "number";
      defaultValue?: string;
      placeholder?: string;
      hint?: string;
    }
  | {
      key: string;
      label: string;
      type: "segmented";
      options: { value: string; label: string }[];
      defaultValue?: string;
      hint?: string;
    };

export interface ClarifySlotsCardData {
  id: string;
  title: string;
  helper?: string;
  fields: SlotField[];
  primaryLabel?: string;
}

interface Props {
  card: ClarifySlotsCardData;
  onSubmit?: (cardId: string, values: Record<string, string>) => void;
  onCancel?: (cardId: string) => void;
  disabled?: boolean;
}

/** Segmented toggle sized/tinted for use on subtle chat card surfaces. */
function InlineSegmented({
  value,
  onChange,
  options,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex border border-border rounded-md overflow-hidden">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            disabled={disabled}
            className={cn(
              "px-4 py-1.5 text-body font-medium transition-colors",
              active
                ? "bg-card-elevated text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function ClarifySlotsCard({ card, onSubmit, onCancel, disabled = false }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    card.fields.forEach((f) => {
      init[f.key] = f.defaultValue ?? "";
    });
    return init;
  });
  const [submitted, setSubmitted] = useState<Record<string, string> | null>(null);

  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  const canSubmit = card.fields.every((f) => (values[f.key] ?? "").toString().trim().length > 0);

  const submit = () => {
    if (!canSubmit) return;
    setSubmitted(values);
    onSubmit?.(card.id, values);
  };

  if (submitted) {
    const summary = card.fields
      .map((f) => {
        const raw = submitted[f.key];
        if (f.type === "select" || f.type === "segmented") {
          const found = f.options.find((o) => o.value === raw);
          return `${f.label}: ${found?.label ?? raw}`;
        }
        return `${f.label}: ${raw}`;
      })
      .join(" · ");
    return (
      <div className="ml-8 px-1 py-1">
        <div className="flex items-center gap-2 text-body-sm">
          <Check className="h-3.5 w-3.5 text-status-success shrink-0" />
          <span className="text-secondary-foreground truncate">{summary}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("ml-8 rounded-xl border border-border/40 bg-card-2 overflow-hidden transition-opacity", disabled && "opacity-60")}>
      <header className="px-4 pt-4 pb-3">
        <h3 className="text-[15px] font-semibold text-foreground tracking-tight leading-snug">
          {card.title}
        </h3>
        {card.helper && (
          <p className="mt-1 text-body-sm text-secondary-foreground leading-relaxed">
            {card.helper}
          </p>
        )}
      </header>

      <div className="px-4 pb-4 space-y-3.5">
        {card.fields.map((f) => (
          <div
            key={f.key}
            className={cn(
              f.type === "segmented"
                ? "flex items-center justify-between gap-4"
                : "space-y-1.5",
            )}
          >
            <label className="text-body-sm font-medium text-secondary-foreground">
              {f.label}
            </label>
            {f.type === "select" ? (
              <Select value={values[f.key] || undefined} onValueChange={(v) => set(f.key, v)}>
                <SelectTrigger disabled={disabled} className="h-9 text-body">
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent className="z-[100]">
                  {f.options.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-body">
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : f.type === "segmented" ? (
              <InlineSegmented
                value={values[f.key]}
                onChange={(v) => set(f.key, v)}
                options={f.options}
                disabled={disabled}
              />
            ) : (
              <Input
                value={values[f.key]}
                onChange={(e) => set(f.key, e.target.value)}
                placeholder={f.placeholder}
                type="text"
                inputMode={f.type === "number" ? "numeric" : "text"}
                disabled={disabled}
                className="h-9 text-body"
              />
            )}

            {f.hint && (
              <div className="text-caption text-icon-subtle pt-0.5">{f.hint}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 px-4 py-3">
        <TextAction tone="muted" onClick={() => onCancel?.(card.id)} disabled={disabled} className="rounded-lg px-3">
          Cancel
        </TextAction>
        <Button size="sm" className="h-8 px-4" disabled={disabled || !canSubmit} onClick={submit}>
          {card.primaryLabel ?? "Continue"}
        </Button>
      </div>
    </div>
  );
}
