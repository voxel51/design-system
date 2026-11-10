import type { FC, SVGProps } from "react";

import { cn } from "@/util/classes";

import { IconBase, type IconProps } from "./IconBase";

const SpinnerSvg: FC<SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden
    className={cn("animate-spin", className)}
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="42"
      strokeDashoffset="14"
      opacity="0.9"
    />
  </svg>
);

/**
 * The spinning ring of {@link Spinner} as a plain icon, for a busy control's
 * icon slot (a button's `leadingIcon` while its action runs). It always spins
 * and is hidden from assistive tech: mark the control busy (`aria-busy`)
 * instead. For a standalone loading indicator use {@link Spinner}.
 *
 * @example
 * ```tsx
 * <Button leadingIcon={busy ? SpinnerIcon : PlayIcon} aria-busy={busy}>
 *   Run
 * </Button>
 * ```
 *
 * @param size A {@link Size} token or pixels; fills the parent when unset.
 * @param color Color of the icon; inherits the text color by default.
 * @param className `class` overrides to apply to the icon.
 * @param style `style` overrides to apply to the icon.
 */
export const SpinnerIcon: FC<IconProps> = (props) => (
  <IconBase {...props} svg={SpinnerSvg} />
);

SpinnerIcon.displayName = "SpinnerIcon";
