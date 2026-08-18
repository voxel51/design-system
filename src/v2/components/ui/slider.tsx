import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../../lib/utils";
import { Input } from "./input";

/**
 * Base slider primitive.
 * - Track uses the elevated surface so the full bar is always visible.
 * - Thumb is a solid filled orange circle.
 * - Renders one thumb per value, so single and range (X & Y) work automatically.
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, ...props }, ref) => {
  const thumbCount =
    (value ?? defaultValue ?? [0]).length;

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      defaultValue={defaultValue}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-card-elevated">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }).map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 rounded-full bg-primary shadow-sm ring-offset-background transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

interface SliderFieldProps {
  /** Single value, or [min, max] for a range slider with two endpoints. */
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  /** Show number inputs bound to the slider value(s). */
  showInputs?: boolean;
  /** Labels for the inputs (range mode). Defaults to "Min" / "Max". */
  inputLabels?: [string, string];
  /** Optional single-input label (single mode). */
  inputLabel?: string;
  className?: string;
}

/**
 * SliderField — design-system slider with optional bound number inputs.
 *
 * Variants:
 *  - single thumb:            value={n}
 *  - range (two endpoints):   value={[lo, hi]}
 *  - with inputs:             showInputs (inputs render for each endpoint)
 */
function SliderField({
  value,
  onChange,
  min,
  max,
  step = 1,
  showInputs = false,
  inputLabels = ["Min", "Max"],
  inputLabel,
  className,
}: SliderFieldProps) {
  const isRange = Array.isArray(value);
  const values = isRange ? value : [value];

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const handleSlider = (next: number[]) => {
    if (isRange) onChange([next[0], next[1]] as [number, number]);
    else onChange(next[0]);
  };

  const handleInput = (index: number, raw: string) => {
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    const n = clamp(parsed);
    if (isRange) {
      const next: [number, number] = [...(value as [number, number])];
      next[index] = n;
      onChange(next);
    } else {
      onChange(n);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Slider min={min} max={max} step={step} value={values} onValueChange={handleSlider} />
      {showInputs && (
        <div className={cn("grid gap-3", isRange ? "grid-cols-2" : "grid-cols-1")}>
          {values.map((v, i) => (
            <div key={i} className="space-y-1.5">
              <label className="text-body-sm text-muted-foreground">
                {isRange ? inputLabels[i] : inputLabel}
              </label>
              <Input
                type="number"
                min={min}
                max={max}
                step={step}
                value={v}
                onChange={(e) => handleInput(i, e.target.value)}
                className="h-9 text-body tabular-nums"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { Slider, SliderField };
