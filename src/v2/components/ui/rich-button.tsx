import * as React from "react";
import { ExternalLink, type LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * RichButton — large, card-like selectable button.
 *
 * Ported from the Voodo design system (RichButton / RichButtonGroup).
 * Used wherever a chunky icon + label (+ optional description) selector reads
 * better than a tight radio list, e.g. picking a Task type (Classification /
 * Detection / Caption).
 *
 * States:
 *   default  → bg-card, border-input, icon text-icon
 *   hover    → border-border-hover
 *   active   → border-primary, bg-primary/10, icon + label text-primary
 *   disabled → reduced opacity, no hover
 *
 * Pair with <RichButtonGroup> for selection state management; or use solo with
 * `active` + `onClick` for fully controlled cases.
 */

export interface RichButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  /** Renders an external-link affordance in the top-right. */
  href?: string;
  active?: boolean;
}

export const RichButton = React.forwardRef<HTMLButtonElement, RichButtonProps>(
  ({ label, description, icon: Icon, href, active, className, type, disabled, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        disabled={disabled}
        aria-pressed={active}
        onClick={(e) => {
          onClick?.(e);
          if (href && !e.defaultPrevented) window.open(href, "_blank", "noopener,noreferrer");
        }}
        className={cn(
          "group relative flex flex-1 items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
          active
            ? "border-primary bg-primary/10"
            : "border-input bg-transparent hover:border-border-hover",
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              "mt-px h-4 w-4 shrink-0 transition-colors",
              active ? "text-primary" : "text-icon",
            )}
          />
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={cn(
              "text-body font-medium leading-tight",
              active ? "text-primary" : "text-foreground",
            )}
          >
            {label}
          </span>
          {description && (
            <span className="text-body-sm leading-snug text-secondary-foreground">
              {description}
            </span>
          )}
        </div>
        {href && (
          <ExternalLink
            className={cn(
              "h-3.5 w-3.5 shrink-0 self-start mt-0.5 transition-colors",
              active ? "text-primary" : "text-icon-subtle",
            )}
          />
        )}
      </button>
    );
  },
);
RichButton.displayName = "RichButton";

/* ───────────── Group ───────────── */

export interface RichButtonOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: LucideIcon;
  href?: string;
  disabled?: boolean;
  className?: string;
}

type ExclusiveProps = {
  exclusive?: true;
  value?: string;
  onChange?: (value: string) => void;
};
type MultipleProps = {
  exclusive: false;
  value?: string[];
  onChange?: (value: string[]) => void;
};

export type RichButtonGroupProps = {
  buttons: RichButtonOption[];
  className?: string;
  /** Stack vertically instead of the default horizontal row. */
  orientation?: "horizontal" | "vertical";
} & (ExclusiveProps | MultipleProps);

export function RichButtonGroup({
  buttons,
  className,
  orientation = "horizontal",
  ...rest
}: RichButtonGroupProps) {
  const isMulti = rest.exclusive === false;
  const selected = new Set<string>(
    isMulti ? (rest.value ?? []) : rest.value ? [rest.value] : [],
  );

  return (
    <div
      role={isMulti ? "group" : "radiogroup"}
      className={cn(
        "flex gap-2",
        orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        className,
      )}
    >
      {buttons.map((b) => {
        const active = selected.has(b.value);
        return (
          <RichButton
            key={b.value}
            label={b.label}
            description={b.description}
            icon={b.icon}
            href={b.href}
            disabled={b.disabled}
            className={b.className}
            active={active}
            role={isMulti ? "checkbox" : "radio"}
            aria-checked={active}
            onClick={() => {
              if (isMulti) {
                const next = new Set(selected);
                active ? next.delete(b.value) : next.add(b.value);
                (rest as MultipleProps).onChange?.([...next]);
              } else {
                (rest as ExclusiveProps).onChange?.(b.value);
              }
            }}
          />
        );
      })}
    </div>
  );
}
