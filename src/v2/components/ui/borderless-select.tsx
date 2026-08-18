import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuOption,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

/**
 * BorderlessSelect — FiftyOne design system.
 *
 * A borderless, label-prefixed select used for list controls like
 * "Group by: None" or "Sort by: Due date". The trigger has no border or
 * background at rest; on hover (and while open) it fills with bg-card-elevated.
 * The label renders in muted gray, the selected value in foreground.
 *
 * Use for in-context list/grid controls (group, sort, filter presets).
 */
export interface BorderlessSelectOption<K extends string = string> {
  key: K;
  label: string;
}

export interface BorderlessSelectProps<K extends string = string> {
  /** Optional leading icon. */
  icon?: React.ReactNode;
  /** Prefix label, e.g. "Group by". */
  label: string;
  /** Currently selected option key. */
  value: K;
  options: BorderlessSelectOption<K>[];
  onChange: (key: K) => void;
  /** Dropdown alignment. Defaults to "end". */
  align?: "start" | "center" | "end";
  /** Hide the prefix label, showing only icon + value + chevron. */
  hideLabel?: boolean;
  className?: string;
  contentClassName?: string;
}

export function BorderlessSelect<K extends string = string>({
  icon,
  label,
  value,
  options,
  onChange,
  align = "end",
  hideLabel = false,
  className,
  contentClassName,
}: BorderlessSelectProps<K>) {
  const valueLabel = options.find((o) => o.key === value)?.label ?? "";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={hideLabel ? `${label}: ${valueLabel}` : undefined}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-body-sm text-muted-foreground transition-colors",
            "hover:bg-card-2 data-[state=open]:bg-card-2",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            "[&_svg]:shrink-0 [&_svg]:size-3.5 [&_svg]:text-icon",
            className,
          )}
        >
          {icon}
          {hideLabel ? (
            <span className="text-foreground">{valueLabel}</span>
          ) : (
            <>
              {label}: <span className="text-foreground">{valueLabel}</span>
            </>
          )}
          <ChevronDown className="!size-3 text-icon opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("w-44", contentClassName)}>
        <DropdownMenuLabel className="text-meta uppercase tracking-wider text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((o) => (
          <DropdownMenuOption
            key={o.key}
            onClick={() => onChange(o.key)}
            selected={value === o.key}
          >
            {o.label}
          </DropdownMenuOption>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
