import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-body font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-transparent hover:border-border-hover hover:text-foreground",
        secondary: "border border-border bg-transparent text-secondary-foreground [&_svg]:text-icon hover:border-border-hover hover:text-secondary-foreground active:border-border-focus disabled:border-border-disabled disabled:text-secondary-foreground/60",
        "secondary-danger": "border border-border bg-transparent text-status-failed-bg [&_svg]:text-status-failed-bg hover:border-status-failed-bg hover:bg-status-failed-bg/10 active:bg-status-failed-bg/15 disabled:border-border-disabled disabled:text-status-failed-bg/50 disabled:[&_svg]:text-status-failed-bg/50",
        ghost: "!rounded-full hover:bg-card hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-status-success/85 text-icon-emphasis hover:bg-status-success",
        danger: "bg-status-failure/80 text-icon-emphasis hover:bg-status-failure",
        positive: "bg-positive text-positive-foreground hover:bg-positive-hover active:bg-positive-pressed",
        negative: "bg-negative text-negative-foreground hover:bg-negative-hover active:bg-negative-pressed",
      },
      size: {
        default: "h-9 px-4 py-2 text-heading",
        sm: "h-9 rounded px-3",
        lg: "h-10 rounded px-5 text-heading",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
