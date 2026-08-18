import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * ColorPicker — shared swatch picker for choosing an accent color.
 * Used anywhere the app needs a color choice (collections, services, …).
 *
 * Each option carries an `id` (the stored value) and an `hsl` triple
 * (e.g. "265 80% 65%") used to render the swatch. For palettes that store
 * the raw HSL string as their value, pass id === hsl.
 *
 *   <ColorPicker value={color} onChange={setColor} options={COLLECTION_COLORS.map(c => ({ id: c, hsl: c }))} />
 */
export interface ColorOption {
  id: string;
  /** HSL triple without the hsl() wrapper, e.g. "265 80% 65%". */
  hsl: string;
}

interface ColorPickerProps {
  value: string;
  onChange: (id: string) => void;
  options: readonly ColorOption[];
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: { swatch: "h-6 w-6", check: "h-3 w-3" },
  md: { swatch: "h-7 w-7", check: "h-3.5 w-3.5" },
} as const;

export function ColorPicker({ value, onChange, options, size = "md", className }: ColorPickerProps) {
  const s = sizes[size];
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-label={`Select color ${opt.id}`}
            aria-pressed={selected}
            onClick={() => onChange(opt.id)}
            className={cn(
              "flex items-center justify-center rounded-full transition-all",
              s.swatch,
              selected
                ? "ring-2 ring-offset-2 ring-offset-background ring-foreground/60"
                : "hover:scale-110",
            )}
            style={{ background: `hsl(${opt.hsl})` }}
          >
            {selected && <Check className={cn(s.check, "text-background")} />}
          </button>
        );
      })}
    </div>
  );
}
