import { FC, HTMLAttributes, ReactNode, useState } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import clsx from "clsx";
import { cn } from "@/util/classes";
import { BackgroundColor, bgColorClass, Radius } from "@/types";
import radiusStyles from "@/styles/radius";

export enum Anchor {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  anchor?: Anchor;
  content: ReactNode;
}

const anchorStyles: Record<Anchor, string> = {
  [Anchor.Top]: "-translate-y-2",
  [Anchor.Right]: "translate-x-4",
  [Anchor.Bottom]: "translate-y-2",
  [Anchor.Left]: "-translate-x-4",
};

const rotatedSquareStyles: Record<Anchor, string> = {
  [Anchor.Top]: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  [Anchor.Right]: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Bottom]: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Left]: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
};

const RotatedSquare: FC<{ anchor: Anchor }> = ({ anchor }) => {
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
