import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Design-system segmented toggles. Only TWO variants exist — never invent new ones.
 *
 * `variant="standard"` (default) — the toggle used on Work (Tasks / Projects) and the
 * Annotate tab: a bordered `rounded-md` group, selected item `bg-card-elevated`.
 *
 * `variant="soft"` — the toggle used in the annotation toolbar to switch annotation
 * tools: a soft `bg-border/60 rounded-lg p-0.5` track with `rounded-md` items,
 * selected item `bg-popover text-accent`.
 */

const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      standard: "overflow-hidden rounded-md border border-border",
      soft: "gap-px rounded-lg bg-border/60 p-0.5",
    },
  },
  defaultVariants: { variant: "standard" },
});

const toggleItemVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-strong disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        standard:
          "text-muted-foreground hover:text-foreground data-[state=on]:bg-card-elevated data-[state=on]:text-foreground",
        soft:
          "rounded-md text-muted-foreground hover:text-foreground data-[state=on]:bg-popover data-[state=on]:text-accent",
      },
      size: {
        sm: "h-7 text-body-sm",
        md: "h-8 text-body",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: false, size: "sm", class: "px-3" },
      { iconOnly: false, size: "md", class: "px-4" },
      { iconOnly: true, size: "sm", class: "w-7" },
      { iconOnly: true, size: "md", class: "w-8" },
    ],
    defaultVariants: { variant: "standard", size: "sm", iconOnly: false },
  },
);

type Ctx = {
  variant: "standard" | "soft";
  size: "sm" | "md";
};
const ToggleGroupContext = React.createContext<Ctx>({ variant: "standard", size: "sm" });

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupVariants> & { size?: "sm" | "md" }
>(({ className, variant = "standard", size = "sm", children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant }), className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant: variant ?? "standard", size: size ?? "sm" }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> & {
    variant?: "standard" | "soft";
    size?: "sm" | "md";
    iconOnly?: boolean;
  }
>(({ className, variant, size, iconOnly, children, ...props }, ref) => {
  const ctx = React.useContext(ToggleGroupContext);
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleItemVariants({
          variant: variant ?? ctx.variant,
          size: size ?? ctx.size,
          iconOnly,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem, toggleItemVariants };
