import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * ExpressiveButton — high-emphasis gradient CTA for spotlighting new
 * features / ideas. Uses the `--gradient-expressive` token (warm orange →
 * magenta → violet). Reserve for moments that deserve extra delight; for
 * standard actions use <Button>, for borderless ones use <TextAction>.
 *
 *   <ExpressiveButton>Auto label</ExpressiveButton>
 *   <ExpressiveButton size="sm"><Check /> Got it</ExpressiveButton>
 */
const expressiveButtonVariants = cva(
  "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-lg font-medium text-primary-foreground shadow-[0_6px_20px_-8px_hsl(var(--gradient-expressive-glow)/0.6)] transition-all duration-300 hover:shadow-[0_8px_28px_-6px_hsl(var(--gradient-expressive-glow)/0.75)] hover:-translate-y-px active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-body-sm",
        md: "h-9 px-4 text-body",
        lg: "h-10 px-5 text-heading",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const iconSize = { sm: "[&_svg]:size-3.5", md: "[&_svg]:size-4", lg: "[&_svg]:size-4" } as const;

export interface ExpressiveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof expressiveButtonVariants> {}

export const ExpressiveButton = React.forwardRef<HTMLButtonElement, ExpressiveButtonProps>(
  ({ className, size = "md", type, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(expressiveButtonVariants({ size }), className)}
        style={{ backgroundImage: "var(--gradient-expressive)" }}
        {...props}
      >
        {/* sheen sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
        <span className={cn("relative z-[1] inline-flex items-center gap-2 [&_svg]:shrink-0", iconSize[size ?? "md"])}>
          {children}
        </span>
      </button>
    );
  },
);
ExpressiveButton.displayName = "ExpressiveButton";
