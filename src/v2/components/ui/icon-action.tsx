import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

/**
 * IconAction — design system component for icon-only actions.
 * Round hover surface, icon-token coloring, consistent sizing across the app.
 * Use for kebab triggers, close buttons, toolbar icon affordances, etc.
 *
 * Pass `tooltip` to attach a native design-system tooltip (preferred for icon-only
 * actions so they always have an accessible, hover-discoverable label).
 */
const iconActionVariants = cva(
  "inline-flex items-center justify-center rounded-full text-icon transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      // S/M/L scale — see voxel-design-system.md → Icon actions
      size: {
        sm: "h-6 w-6 [&_svg]:size-3.5",   // 24px hit area, 14px icon — dense rails, panel headers
        md: "h-7 w-7 [&_svg]:size-3.5",   // 28px hit area, 14px icon — DEFAULT for back/close/kebab
        lg: "h-8 w-8 [&_svg]:size-4",     // 32px hit area, 16px icon — prominent toolbar actions
      },
      tone: {
        default:
          "hover:bg-card-2 hover:text-foreground data-[state=open]:bg-card-2 data-[state=open]:text-foreground",
        danger:
          "hover:bg-negative hover:text-negative-foreground data-[state=open]:bg-negative data-[state=open]:text-negative-foreground",
      },
    },
    defaultVariants: { size: "md", tone: "default" },
  },
);


export interface IconActionProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconActionVariants> {
  asChild?: boolean;
  /** Native tooltip label. When set, the action is wrapped in a design-system tooltip. */
  tooltip?: React.ReactNode;
  /** Side the tooltip appears on. Defaults to "bottom". */
  tooltipSide?: "top" | "right" | "bottom" | "left";
}

export const IconAction = React.forwardRef<HTMLButtonElement, IconActionProps>(
  ({ className, size, tone, asChild = false, type, tooltip, tooltipSide = "bottom", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const button = (
      <Comp
        ref={ref}
        type={asChild ? undefined : type ?? "button"}
        className={cn(iconActionVariants({ size, tone }), className)}
        {...props}
      />
    );

    if (tooltip == null) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
IconAction.displayName = "IconAction";
