import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { Anchor, BackgroundColor, bgColorClass, Radius, Shadow } from "@/types";
import { cn } from "@/util/classes";

export type TooltipAnchor = Extract<
  Anchor,
  Anchor.Top | Anchor.Right | Anchor.Bottom | Anchor.Left
>;

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  anchor?: TooltipAnchor;
  content: ReactNode;
  portal?: boolean;
  /** Elevation / drop shadow. Use Shadow.Xs through Shadow.Xl. */
  shadow?: Shadow;
}

const anchorStyles: Record<TooltipAnchor, string> = {
  [Anchor.Top]: "-translate-y-2",
  [Anchor.Right]: "translate-x-4",
  [Anchor.Bottom]: "translate-y-2",
  [Anchor.Left]: "-translate-x-4",
};

const rotatedSquareStyles: Record<TooltipAnchor, string> = {
  [Anchor.Top]: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  [Anchor.Right]: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Bottom]: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Left]: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
};

const RotatedSquare: FC<{ anchor: TooltipAnchor }> = ({ anchor }) => {
  return (
    <div
      className={clsx(
        "absolute",
        "w-2 h-2",
        "rotate-45",
        "bg-inherit",
        rotatedSquareStyles[anchor]
      )}
    />
  );
};

/**
 * A tooltip which appears when hovering over the wrapped content.
 *
 * @param anchor Position to anchor the tooltip relative to its content. See {@link Anchor}.
 * @param content The content of the tooltip.
 * @param children The content which this component wraps; this acts as the element anchor and the hover trigger.
 * @param className `class` overrides to apply to the component.
 * @param portal If `true`, applies a high z-index to ensure visibility in stacked contexts.
 * @param shadow The shadow to apply to the tooltip. See {@link Shadow}.
 * @param props Additional HTML properties to apply to the component.
 */
export const Tooltip: FC<TooltipProps> = ({
  anchor = Anchor.Top,
  content,
  children,
  className,
  portal = false,
  shadow = Shadow.Lg,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover className="relative" {...props}>
      <PopoverButton
        as="div"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="focus:outline-none"
      >
        {children}
      </PopoverButton>

      {isOpen && (
        <PopoverPanel
          static
          anchor={anchor}
          className={cn(
            portal && "z-[10000]",
            "relative",
            "py-0.75 px-2.5",
            "!overflow-visible",
            bgColorClass(BackgroundColor.Card2),
            radiusStyles(Radius.Sm),
            shadowStyles(shadow),
            anchorStyles[anchor],
            className
          )}
        >
          <div className="max-w-[500px] break-words">{content}</div>
          <RotatedSquare anchor={anchor} />
        </PopoverPanel>
      )}
    </Popover>
  );
};

Tooltip.displayName = "Tooltip";
