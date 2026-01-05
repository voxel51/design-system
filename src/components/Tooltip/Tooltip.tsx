import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

import radiusStyles from "@/styles/radius";
import { Anchor, BackgroundColor, bgColorClass, Radius } from "@/types";
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

export const Tooltip: FC<TooltipProps> = ({
  anchor = Anchor.Top,
  content,
  children,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover className="relative" {...props}>
      <PopoverButton
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
            "relative",
            "py-0.75 px-2.5",
            "!overflow-visible",
            bgColorClass(BackgroundColor.Card2),
            radiusStyles(Radius.Sm),
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
