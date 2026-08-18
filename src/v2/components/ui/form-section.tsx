import { type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { TextAction } from "./text-action";
import { Label } from "./label";
import { cn } from "../../lib/utils";

/**
 * Shared form primitives used by all configuration forms across Model Training,
 * Model Evaluation, and Agentic Labeling. Consolidates chrome, labels, footer,
 * info banners, and segmented toggles so every form has the same rhythm.
 *
 * See `mem://design/form-patterns`.
 */

// ─── Top back bar ────────────────────────────────────────────────────────────

export function FormBackBar({ onCancel, label = "Cancel" }: { onCancel: () => void; label?: string }) {
  return (
    <div className="flex items-center gap-1 border-b border-border/30 px-3 py-2">
      <TextAction size="sm" onClick={onCancel} className="gap-1.5">
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{label}</span>
      </TextAction>
    </div>
  );
}

// ─── Title block with icon disk ──────────────────────────────────────────────

export function FormTitleBlock({
  icon,
  title,
  subtitle,
  trailing,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-card-elevated text-icon shrink-0 [&_svg]:h-3.5 [&_svg]:w-3.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-title font-medium text-foreground">{title}</div>
        {subtitle && (
          <div className="text-body-sm text-secondary-foreground">{subtitle}</div>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

// ─── Field ───────────────────────────────────────────────────────────────────

export function FormField({
  label,
  required,
  optional,
  hint,
  helper,
  children,
  className,
}: {
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  /** Helper shown between label and control. */
  hint?: ReactNode;
  /** Helper shown below the control (small mono / caption). */
  helper?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label !== undefined && (
        <div className="flex items-baseline gap-1.5">
          <Label className="text-body-sm text-secondary-foreground">
            {label}
            {required && <span className="text-status-failed ml-0.5">*</span>}
          </Label>
          {optional && <span className="text-body-sm text-icon-subtle">(optional)</span>}
        </div>
      )}
      {hint && <p className="text-body-sm text-secondary-foreground -mt-1">{hint}</p>}
      {children}
      {helper && (
        <div className="text-caption text-icon-subtle">{helper}</div>
      )}
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

export function FormFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-t border-border/30 px-4 py-3 flex items-center justify-end gap-2 shrink-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ─── Info banner ─────────────────────────────────────────────────────────────

export function FormInfoBanner({
  icon,
  children,
  tone = "neutral",
}: {
  icon?: ReactNode;
  children: ReactNode;
  tone?: "neutral" | "muted";
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-body-sm text-secondary-foreground",
        tone === "neutral"
          ? "bg-card-2/60 border-border-subtle/40"
          : "bg-transparent border-border-subtle/60",
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 text-icon-subtle">{icon}</span>}
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── Segmented toggle ────────────────────────────────────────────────────────

export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("inline-flex border border-border rounded-md overflow-hidden", className)}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
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
