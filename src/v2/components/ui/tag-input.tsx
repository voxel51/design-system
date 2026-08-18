import * as React from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * TagInput — FiftyOne design system.
 *
 * Multi-select / free-tag input. When values are selected they render as
 * pill chips inside a bordered container. New values are committed from the
 * inline text input on Enter or comma. Backspace on an empty input removes
 * the last chip.
 *
 * Visual reference: chips use bg-card-2 + rounded-full + a filled circular
 * remove affordance. Container follows Input border tokens
 * (border-input → hover:border-input-hover → focus-within:border-input-focus).
 *
 * Props:
 *   • value / onChange — controlled chip list
 *   • inputValue / onInputChange — controlled draft text
 *   • showClearAll (default true) — render the trailing clear-all X
 *   • showChevron (default false) — render a trailing chevron (when paired
 *     with a dropdown of preset options elsewhere)
 *   • onChevronClick — open the associated dropdown
 */
export interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  inputValue?: string;
  onInputChange?: (next: string) => void;
  placeholder?: string;
  showClearAll?: boolean;
  showChevron?: boolean;
  onChevronClick?: () => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value,
      onChange,
      inputValue,
      onInputChange,
      placeholder = "Type and press Enter",
      showClearAll = true,
      showChevron = false,
      onChevronClick,
      disabled,
      className,
      ...rest
    },
    ref,
  ) => {
    const [internalDraft, setInternalDraft] = React.useState("");
    const draft = inputValue ?? internalDraft;
    const setDraft = (next: string) => {
      if (onInputChange) onInputChange(next);
      else setInternalDraft(next);
    };

    const commit = (raw: string) => {
      const v = raw.trim().replace(/,$/, "").trim();
      if (!v) return;
      if (value.includes(v)) return;
      onChange([...value, v]);
    };

    const removeAt = (idx: number) => {
      onChange(value.filter((_, i) => i !== idx));
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        if (draft.trim()) {
          e.preventDefault();
          commit(draft);
          setDraft("");
        }
      } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
        e.preventDefault();
        onChange(value.slice(0, -1));
      }
    };

    return (
      <div
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md border border-input bg-transparent px-1.5 py-1 text-body transition-colors",
          "hover:border-input-hover focus-within:border-input-focus",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        onClick={(e) => {
          // Focus the inner input when clicking blank container area
          const target = e.target as HTMLElement;
          if (target.tagName !== "INPUT" && target.tagName !== "BUTTON") {
            const input = e.currentTarget.querySelector("input");
            input?.focus();
          }
        }}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5 min-w-0">
          {value.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="inline-flex items-center gap-1 rounded-full bg-card-elevated pl-2.5 pr-1 py-0.5 text-body-sm text-foreground"
            >
              <span className="truncate max-w-[160px]">{tag}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                disabled={disabled}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-icon hover:text-foreground hover:bg-card-3 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-2.5 w-2.5" strokeWidth={2.5} />
              </button>
            </span>
          ))}
          <input
            {...rest}
            ref={ref}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={() => {
              if (draft.trim()) {
                commit(draft);
                setDraft("");
              }
            }}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[80px] bg-transparent text-body text-foreground placeholder:text-placeholder-foreground outline-none px-1 py-0.5"
          />
        </div>
        {showClearAll && value.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange([]);
              setDraft("");
            }}
            disabled={disabled}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-icon hover:text-foreground transition-colors"
            aria-label="Clear all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {showChevron && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChevronClick?.();
            }}
            disabled={disabled}
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-icon hover:text-foreground transition-colors"
            aria-label="Open options"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);
TagInput.displayName = "TagInput";
