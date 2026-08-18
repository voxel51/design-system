import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * TextAction — borderless pill button for secondary actions.
 * Use anywhere you'd otherwise hand-roll a `rounded-full px-2 text-secondary-foreground hover:bg-card-2` button.
 * Works with icon + label, icon only, or label only. Pair with <IconAction> when the trigger is icon-only AND circular.
 *
 * Examples:
 *   <TextAction><Plus /> New chat</TextAction>
 *   <TextAction size="sm" onClick={...}>Save</TextAction>
 */
const textActionVariants = cva(
  "inline-flex items-center gap-1 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 [&_svg]:text-current [&_svg]:transition-none",
  {
    variants: {
      size: {
        sm: "h-7 px-2 text-body-sm [&_svg]:size-3",        // dense rails, footer rows
        md: "h-8 px-2.5 text-body [&_svg]:size-3.5",    // DEFAULT for headers, primary borderless CTAs
      },
      tone: {
        // Placed after the size variant so twMerge doesn't let the `text-body`
        // font-size class strip the text color (both share the `text-*` group).
        // Icons inherit `currentColor` and carry no transition of their own, so
        // they flip in lockstep with the label instead of lagging behind it.
        default: "text-secondary-foreground hover:bg-card-2 hover:text-foreground",
        muted: "text-muted-foreground hover:bg-card-2 hover:text-foreground",
        // Destructive borderless CTA (e.g. Delete). Idle = muted gray; hover fills
        // with --negative-hover (#9B2727), active deepens to --negative-pressed (#751D1D),
        // both flipping text/icon to white for contrast.
        danger:
          "text-muted-foreground hover:bg-negative-hover hover:text-negative-foreground active:bg-negative-pressed",
      },
    },

    defaultVariants: { size: "md", tone: "default" },
  },
);

export interface TextActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof textActionVariants> {
  asChild?: boolean;
}

export const TextAction = React.forwardRef<HTMLButtonElement, TextActionProps>(
  ({ className, size, tone, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type ?? "button"}
        className={cn(textActionVariants({ size, tone }), className)}
        {...props}
      />
    );
  },
);
TextAction.displayName = "TextAction";
