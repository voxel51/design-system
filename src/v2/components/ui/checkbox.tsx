import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Checkbox — FiftyOne design system.
 *
 * Variants:
 *   • <Checkbox />            — just the box (no label)
 *   • <CheckboxWithLabel />   — box + inline label
 *
 * States:
 *   default        → 1.5px gray ring (border-strong), transparent fill
 *   hover          → 1.5px orange ring (border-primary)
 *   active         → filled orange (bg-primary) with white check/minus
 *   active hover   → darker orange (bg-primary-hover)
 *   disabled       → reduced opacity, no hover affordance
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Box
      "peer h-4 w-4 shrink-0 rounded-[3px] bg-transparent transition-colors",
      // Default ring (gray)
      "border-[1.5px] border-border-strong",
      // Hover ring (orange) — unchecked only
      "data-[state=unchecked]:hover:border-primary",
      // Active (checked / indeterminate) fill
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-icon-emphasis",
      "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:text-icon-emphasis",
      // Active hover — darker orange
      "data-[state=checked]:hover:bg-primary-hover data-[state=checked]:hover:border-primary-hover",
      "data-[state=indeterminate]:hover:bg-primary-hover data-[state=indeterminate]:hover:border-primary-hover",
      // Focus
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
      // Disabled — override hover
      "disabled:cursor-not-allowed disabled:opacity-40",
      "disabled:hover:border-border-strong data-[state=checked]:disabled:hover:bg-primary data-[state=checked]:disabled:hover:border-primary",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" strokeWidth={3} />
      ) : (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

interface CheckboxWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label: React.ReactNode;
  description?: React.ReactNode;
  labelClassName?: string;
}

/**
 * Checkbox + label row. Clicking the label toggles the checkbox (htmlFor → id).
 */
const CheckboxWithLabel = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxWithLabelProps
>(({ label, description, id, disabled, labelClassName, className, ...props }, ref) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  return (
    <div className={cn("flex items-center gap-2.5", disabled && "opacity-60")}>
      <Checkbox
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={className}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "text-body leading-none text-foreground select-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          labelClassName,
        )}
      >
        {label}
        {description && (
          <span className="mt-0.5 block text-body-sm text-secondary-foreground">
            {description}
          </span>
        )}
      </label>
    </div>
  );
});
CheckboxWithLabel.displayName = "CheckboxWithLabel";

export { Checkbox, CheckboxWithLabel };
