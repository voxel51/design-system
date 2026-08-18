import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "../../lib/utils";

/**
 * Switch — FiftyOne design system.
 *
 * State matrix:
 *
 * | State              | Track token             | Thumb        | Notes                           |
 * | ------------------ | ----------------------- | ------------ | ------------------------------- |
 * | Default (off)      | `bg-input`              | white        | Muted gray                      |
 * | Hover (off)        | `bg-border-strong`      | white        | Slightly brighter gray          |
 * | Active (on)        | `bg-primary`            | white        | Brand orange                    |
 * | Active hover (on)  | `bg-primary-hover`      | white        | Darker orange                   |
 * | Disabled (off)     | `bg-input` @ opacity-40 | white        | No hover; not-allowed cursor    |
 * | Disabled (on)      | `bg-primary` @ op-40    | white        | Orange still readable, dimmed   |
 *
 * Variants:
 *   • <Switch />           — bare toggle
 *   • <SwitchWithLabel />  — toggle + inline label (+ optional description)
 *
 * Always use `SwitchWithLabel` for label + switch rows — never hand-roll
 * `<div><Switch /><label /></div>`.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
      // Off state
      "data-[state=unchecked]:bg-input",
      "data-[state=unchecked]:hover:bg-border-strong",
      // On state
      "data-[state=checked]:bg-primary",
      "data-[state=checked]:hover:bg-primary-hover",
      // Focus
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      // Disabled — override hover for both on & off
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=unchecked]:disabled:hover:bg-input data-[state=checked]:disabled:hover:bg-primary",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

interface SwitchWithLabelProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label: React.ReactNode;
  /** Optional supporting line below the label. */
  description?: React.ReactNode;
  labelClassName?: string;
  /** Position the label before the switch (default: label after). */
  labelPosition?: "before" | "after";
}

/**
 * Switch + label row. Clicking the label toggles the switch (htmlFor → id).
 * Pass `id` for proper label association; one is auto-generated otherwise.
 */
const SwitchWithLabel = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchWithLabelProps
>(
  (
    { label, description, id, disabled, labelClassName, labelPosition = "after", className, ...props },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id ?? reactId;
    const switchEl = (
      <Switch
        ref={ref}
        id={inputId}
        disabled={disabled}
        className={cn(description && "mt-[2px]", className)}
        {...props}
      />
    );
    const labelEl = (
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
    );
    return (
      <div
        className={cn(
          "flex gap-3",
          description ? "items-start" : "items-center",
          disabled && "opacity-60",
        )}
      >
        {labelPosition === "before" ? (
          <>
            {labelEl}
            {switchEl}
          </>
        ) : (
          <>
            {switchEl}
            {labelEl}
          </>
        )}
      </div>
    );
  },
);
SwitchWithLabel.displayName = "SwitchWithLabel";

export { Switch, SwitchWithLabel };
