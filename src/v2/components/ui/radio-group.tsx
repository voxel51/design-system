import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "../../lib/utils";

/**
 * Radio group — FiftyOne design system.
 *
 * Variants:
 *   • <RadioGroupItem />            — just the button (no label)
 *   • <RadioGroupItemWithLabel />   — button + inline label (+ optional description)
 *
 * State matrix (both variants):
 *
 * | State                | Ring                          | Dot                      | Notes                       |
 * | -------------------- | ----------------------------- | ------------------------ | --------------------------- |
 * | Default              | 1.5px `border-strong`         | —                        | Gray, always visible        |
 * | Hover (unchecked)    | 1.5px `border-primary`        | —                        | Thin orange preview         |
 * | Active (checked)     | 2px `border-primary`          | 8px `bg-primary`         | Filled brand orange         |
 * | Active hover         | 2px `border-primary-hover`    | 8px `bg-primary-hover`   | Darker orange               |
 * | Disabled (unchecked) | 1.5px `border-strong` @ op-40 | —                        | No hover; not-allowed       |
 * | Disabled (checked)   | 2px `border-primary` @ op-40  | 8px `bg-primary` @ op-40 | Orange readable but dimmed  |
 *
 * Focus ring uses `ring-primary/40` (neutral orange halo), never a solid orange border.
 */

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn("grid gap-2", className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Box
        "group relative aspect-square h-[18px] w-[18px] rounded-full bg-transparent transition-colors",
        // Default ring (gray)
        "border-[1.5px] border-border-strong",
        // Hover ring (orange, thin) — unchecked only
        "data-[state=unchecked]:hover:border-primary",
        // Checked (active): orange 2px ring
        "data-[state=checked]:border-[2px] data-[state=checked]:border-primary",
        // Checked hover (active hover): darker orange ring
        "data-[state=checked]:hover:border-primary-hover",
        // Focus
        "ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        // Disabled — override any hover state
        "disabled:cursor-not-allowed disabled:opacity-40",
        "disabled:hover:border-border-strong data-[state=checked]:disabled:hover:border-primary",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="block h-2 w-2 rounded-full bg-primary transition-colors group-hover:bg-primary-hover" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

interface RadioGroupItemWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label: React.ReactNode;
  /** Optional supporting line below the label. */
  description?: React.ReactNode;
  labelClassName?: string;
}

/**
 * Radio + label row. Clicking the label also activates the radio (htmlFor → id).
 * Pass `id` for proper label association; one is auto-generated otherwise.
 */
const RadioGroupItemWithLabel = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemWithLabelProps
>(({ label, description, id, disabled, labelClassName, className, ...props }, ref) => {
  const reactId = React.useId();
  const inputId = id ?? reactId;
  return (
    <div
      className={cn(
        "flex gap-3",
        description ? "items-start" : "items-center",
        disabled && "opacity-60",
      )}
    >
      <RadioGroupItem
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={cn(description && "mt-[2px]", className)}
        {...props}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "text-body text-foreground select-none",
          description ? "leading-snug" : "leading-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          labelClassName,
        )}
      >
        {label}
        {description && (
          <span className="mt-1 block text-body-sm leading-snug text-secondary-foreground">
            {description}
          </span>
        )}
      </label>
    </div>
  );
});
RadioGroupItemWithLabel.displayName = "RadioGroupItemWithLabel";

export { RadioGroup, RadioGroupItem, RadioGroupItemWithLabel };
