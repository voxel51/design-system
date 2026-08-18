import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip root. Provides its own `TooltipPrimitive.Provider`, so a tooltip
 * works anywhere without the application mounting one first.
 *
 * The Lovable master relies on a single `TooltipProvider` at the app root.
 * That is a fine app decision and a bad library one: any pattern containing a
 * tooltip — `ServicesView`, `IconAction`, `PanelHeader` — would throw
 * "`Tooltip` must be used within `TooltipProvider`" when rendered on a page
 * that forgot it, which is a runtime crash the type system cannot catch.
 * Current shadcn does the same thing.
 *
 * Nesting providers is safe; the innermost wins. Mount `TooltipProvider`
 * yourself only to set a shared `delayDuration` across many tooltips.
 */
const Tooltip = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) => (
  <TooltipPrimitive.Provider delayDuration={200}>
    <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);
Tooltip.displayName = "Tooltip";

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "pointer-events-none z-50 overflow-hidden rounded-lg bg-tooltip px-2.5 py-1.5 text-body-sm font-medium text-tooltip-foreground shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
