import clsx from "clsx";
import { FC, HTMLAttributes, ReactNode, useState } from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  Radius,
  Shadow,
  TextColor,
  textColorClass,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

export type TooltipAnchor = Extract<
  Anchor,
  Anchor.Top | Anchor.Right | Anchor.Bottom | Anchor.Left
>;

export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  anchor?: TooltipAnchor;
  content: ReactNode;
  portal?: boolean;
  shadow?: Shadow;
  wrapperClassName?: string;
}

const panelPositionStyles: Record<TooltipAnchor, string> = {
  [Anchor.Top]: "bottom-full left-1/2 -translate-x-1/2 -translate-y-2",
  [Anchor.Right]: "left-full top-1/2 -translate-y-1/2 translate-x-4",
  [Anchor.Bottom]: "top-full left-1/2 -translate-x-1/2 translate-y-2",
  [Anchor.Left]: "right-full top-1/2 -translate-y-1/2 -translate-x-4",
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
 * @example
 * ```tsx
 * <Tooltip content={<Text>Tooltip content goes here</Text>}>
 *   <Text>Hover this text to see the tooltip</Text>
 * </Tooltip>
 * ```
 *
 * @param anchor Position to anchor the tooltip relative to its content. See {@link Anchor}.
 * @param content The content of the tooltip.
 * @param children The content which this component wraps; this acts as the element anchor and the hover trigger.
 * @param className `class` overrides to apply to the tooltip panel.
 * @param portal If `true`, applies a high z-index to ensure visibility in stacked contexts.
 * @param shadow The shadow to apply to the tooltip. See {@link Shadow}.
 * @param wrapperClassName Additional classes to apply to the outer wrapper element.
 * @param props Additional HTML properties to apply to the component.
 */
export const Tooltip: FC<TooltipProps> = ({
  anchor = Anchor.Top,
  content,
  children,
  className,
  portal = false,
  shadow = Shadow.Lg,
  wrapperClassName,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      {...props}
      className={cn("relative", wrapperClassName)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && (
        <div
          className={cn(
            "absolute",
            "w-max",
            panelPositionStyles[anchor],
            portal && zIndexStyles(ZIndex.AboveModal),
            "py-0.75 px-2.5",
            "!overflow-visible",
            bgColorClass(BackgroundColor.Card2),
            textColorClass(TextColor.Primary),
            radiusStyles(Radius.Sm),
            shadowStyles(shadow),
            className
          )}
        >
          <div className="max-w-[500px] break-words">{content}</div>
          <RotatedSquare anchor={anchor} />
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = "Tooltip";
