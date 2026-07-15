import clsx from "clsx";
import {
  type CSSProperties,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
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

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  anchor?: TooltipAnchor;
  content: ReactNode;
  portal?: boolean;
  shadow?: Shadow;
  wrapperClassName?: string;
}

const rotatedSquareStyles: Record<TooltipAnchor, string> = {
  [Anchor.Top]: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  [Anchor.Right]: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Bottom]: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
  [Anchor.Left]: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
};

const ANCHOR_GAP = 8;

function getFixedPosition(rect: DOMRect, anchor: TooltipAnchor): CSSProperties {
  switch (anchor) {
    case Anchor.Top:
      return {
        left: rect.left + rect.width / 2,
        top: rect.top - ANCHOR_GAP,
        transform: "translate(-50%, -100%)",
      };
    case Anchor.Bottom:
      return {
        left: rect.left + rect.width / 2,
        top: rect.bottom + ANCHOR_GAP,
        transform: "translateX(-50%)",
      };
    case Anchor.Right:
      return {
        left: rect.right + ANCHOR_GAP * 2,
        top: rect.top + rect.height / 2,
        transform: "translateY(-50%)",
      };
    case Anchor.Left:
      return {
        left: rect.left - ANCHOR_GAP * 2,
        top: rect.top + rect.height / 2,
        transform: "translate(-100%, -50%)",
      };
  }
}

const rotatedSquareBorderStyles: Record<TooltipAnchor, string> = {
  [Anchor.Top]: "border-b border-r",
  [Anchor.Bottom]: "border-t border-l",
  [Anchor.Right]: "border-b border-l",
  [Anchor.Left]: "border-t border-r",
};

const RotatedSquare: FC<{ anchor: TooltipAnchor; borderClass: string }> = ({
  anchor,
  borderClass,
}) => {
  return (
    <div
      className={clsx(
        "absolute",
        "w-2 h-2",
        "rotate-45",
        "bg-inherit",
        rotatedSquareBorderStyles[anchor],
        borderClass,
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
 * @param portal If `true`, renders the tooltip via a React portal into `document.body` with an
 * above-modal z-index, so it escapes ancestor stacking contexts (e.g. inside modals). The default
 * tooltip already uses fixed positioning, so it is never clipped by overflow-hidden/scroll ancestors.
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [positionStyle, setPositionStyle] = useState<CSSProperties>({});

  const handleMouseEnter = useCallback(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPositionStyle(getFixedPosition(rect, anchor));
    }
    setIsOpen(true);
  }, [anchor]);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Dismisses the tooltip when scrolling is detected; the fixed position is
  // measured on open and would otherwise go stale
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = (): void => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    return () =>
      window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [isOpen]);

  const borderClass = borderColorClass(BorderColor.Subtle);

  const panelClasses = cn(
    "w-max",
    "py-0.75 px-2.5",
    "border",
    borderClass,
    "!overflow-visible",
    bgColorClass(BackgroundColor.Card2),
    textColorClass(TextColor.Primary),
    radiusStyles(Radius.Sm),
    shadowStyles(shadow),
    className
  );

  // Fixed positioning keeps the tooltip out of ancestor overflow clipping
  // (e.g. scrollable panel frames) even when rendered inline; portal mode
  // additionally escapes ancestor stacking contexts
  const tooltipPanel = (
    <div
      className={cn(
        "fixed",
        zIndexStyles(portal ? ZIndex.AboveModal : ZIndex.High),
        panelClasses
      )}
      style={positionStyle}
    >
      <div className="max-w-[500px] break-words">{content}</div>
      <RotatedSquare anchor={anchor} borderClass={borderClass} />
    </div>
  );

  return (
    <div
      {...props}
      ref={wrapperRef}
      className={cn("relative", wrapperClassName)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isOpen &&
        (portal ? createPortal(tooltipPanel, document.body) : tooltipPanel)}
    </div>
  );
};

Tooltip.displayName = "Tooltip";
