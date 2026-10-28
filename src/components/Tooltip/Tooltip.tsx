import {
  arrow,
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useFloating,
} from "@floating-ui/react";
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
import { TEXT_STYLES } from "@/styles/text";
import {
  Anchor,
  BackgroundColor,
  bgColorClass,
  Radius,
  Shadow,
  TextColor,
  textColorClass,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

export type TooltipAnchor = `${Extract<
  Anchor,
  Anchor.Top | Anchor.Right | Anchor.Bottom | Anchor.Left
>}`;

export interface TooltipProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  anchor?: TooltipAnchor;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  content: ReactNode;
  interactive?: boolean;
  portal?: boolean;
  shadow?: Shadow;
  wrapperClassName?: string;
}

const ANCHOR_GAP = 8;
const ARROW_SIZE = 8;
const DEFAULT_COLLISION_PADDING = 8;
// long enough for the pointer to cross the gap into an interactive panel
const INTERACTIVE_CLOSE_DELAY = 150;
// how long a press must be held to show the tooltip where there is no hover
const LONG_PRESS_DURATION = 500;
// how long the tooltip then stays
const TOUCH_SHOW_DURATION = 1500;
// a touch is followed by emulated mouse events, which are not a hover
const EMULATED_MOUSE_WINDOW = 800;

const OPPOSITE_SIDE: Record<TooltipAnchor, TooltipAnchor> = {
  [Anchor.Top]: Anchor.Bottom,
  [Anchor.Right]: Anchor.Left,
  [Anchor.Bottom]: Anchor.Top,
  [Anchor.Left]: Anchor.Right,
};

const sideOf = (placement: Placement): TooltipAnchor =>
  placement.split("-")[0] as TooltipAnchor;

/**
 * A tooltip which appears when hovering over the wrapped content, or for a
 * moment after a long press on a touch screen (a tap does not show it). It stays
 * inside the viewport: it flips to the opposite side when its own side has no
 * room, slides along that side near an edge with its arrow still on the
 * content, and follows the content on scroll and resize.
 *
 * @example
 * ```tsx
 * <Tooltip content={<Text>Tooltip content goes here</Text>}>
 *   <Text>Hover this text to see the tooltip</Text>
 * </Tooltip>
 * ```
 *
 * @param anchor Preferred position of the tooltip relative to its content: `"top"`, `"right"`, `"bottom"` or `"left"`. Defaults to `"top"`. See {@link TooltipAnchor}.
 * @param avoidCollisions If `true` (the default), the tooltip flips and shifts to stay inside the viewport.
 * @param collisionPadding Minimum distance, in pixels, kept between the tooltip and the viewport edge. Defaults to `8`.
 * @param content The content of the tooltip. `null` shows none, leaving only the wrapped content.
 * @param children The content which this component wraps; this acts as the element anchor and the hover trigger.
 * @param className `class` overrides to apply to the tooltip panel.
 * @param interactive If `true`, the tooltip stays open while the pointer moves from the content
 * into the panel, so the panel can hold links or buttons.
 * @param portal If `true` (the default), renders the tooltip via a React portal into `document.body`
 * with an above-modal z-index, so no ancestor's overflow, transform or stacking context can clip
 * or bury it. With `false` the panel renders in place with fixed positioning.
 * @param shadow The shadow to apply to the tooltip. See {@link Shadow}.
 * @param wrapperClassName Additional classes to apply to the outer wrapper element.
 * @param props Additional HTML properties to apply to the component.
 */
export const Tooltip: FC<TooltipProps> = ({
  anchor = Anchor.Top,
  avoidCollisions = true,
  collisionPadding = DEFAULT_COLLISION_PADDING,
  content,
  children,
  className,
  interactive = false,
  portal = true,
  // Figma Tooltip: bg/popover, radius 4, 4/10 padding, no edge. Figma also
  // shows no shadow, but in light mode bg/popover and bg/card are both white,
  // so a flat tooltip vanishes over a card; the shadow is kept as the edge.
  shadow = Shadow.Lg,
  wrapperClassName,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const arrowRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pressTimer = useRef<number | undefined>(undefined);
  const lastTouch = useRef(0);

  const { refs, floatingStyles, placement, middlewareData } = useFloating({
    open: isOpen,
    placement: anchor,
    strategy: "fixed",
    middleware: [
      offset(({ placement }) => {
        const side = sideOf(placement);
        return side === Anchor.Left || side === Anchor.Right
          ? ANCHOR_GAP * 2
          : ANCHOR_GAP;
      }),
      avoidCollisions && flip({ padding: collisionPadding }),
      avoidCollisions && shift({ padding: collisionPadding }),
      arrow({ element: arrowRef, padding: ARROW_SIZE / 2 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(pressTimer.current);
    },
    []
  );

  const open = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    // The portaled panel is a React child of the wrapper, so leaving it fires
    // both mouseleaves; a second timer must not orphan the first
    window.clearTimeout(closeTimer.current);
    if (interactive) {
      closeTimer.current = window.setTimeout(
        () => setIsOpen(false),
        INTERACTIVE_CLOSE_DELAY
      );
      return;
    }
    setIsOpen(false);
  }, [interactive]);

  const side = sideOf(placement);
  const arrowStyle: CSSProperties = {
    left: middlewareData.arrow?.x,
    top: middlewareData.arrow?.y,
    [OPPOSITE_SIDE[side]]: -ARROW_SIZE / 2,
  };

  const tooltipPanel = (
    <div
      ref={refs.setFloating}
      role="tooltip"
      data-side={side}
      className={cn(
        zIndexStyles(portal ? ZIndex.AboveModal : ZIndex.High),
        "w-max",
        "py-1 px-2.5",
        TEXT_STYLES[TextVariant.BodySecondary],
        "!overflow-visible",
        bgColorClass(BackgroundColor.Popover),
        textColorClass(TextColor.Primary),
        radiusStyles(Radius.Sm),
        shadowStyles(shadow),
        className
      )}
      style={floatingStyles}
      onMouseEnter={interactive ? open : undefined}
      onMouseLeave={interactive ? close : undefined}
    >
      <div className="max-w-[500px] break-words">{content}</div>
      {/* Borderless like the panel: with Tailwind's preflight any `border-*`
          side here would paint a currentColor hairline on the arrow */}
      <div
        ref={arrowRef}
        className={clsx("absolute", "w-2 h-2", "rotate-45", "bg-inherit")}
        style={arrowStyle}
      />
    </div>
  );

  return (
    <div
      {...props}
      ref={refs.setReference}
      className={cn("relative", wrapperClassName)}
      onMouseEnter={() => {
        if (Date.now() - lastTouch.current > EMULATED_MOUSE_WINDOW) open();
      }}
      onMouseLeave={close}
      onPointerDown={(event) => {
        props.onPointerDown?.(event);
        // A touch screen has no hover: a long press shows the tooltip for a
        // moment, so a tap or a swipe never covers the content
        if (event.pointerType !== "touch") return;
        lastTouch.current = Date.now();
        window.clearTimeout(pressTimer.current);
        pressTimer.current = window.setTimeout(() => {
          open();
          closeTimer.current = window.setTimeout(
            () => setIsOpen(false),
            TOUCH_SHOW_DURATION
          );
        }, LONG_PRESS_DURATION);
      }}
      onPointerUp={(event) => {
        props.onPointerUp?.(event);
        lastTouch.current = Date.now();
        window.clearTimeout(pressTimer.current);
      }}
      onPointerCancel={(event) => {
        props.onPointerCancel?.(event);
        window.clearTimeout(pressTimer.current);
      }}
    >
      {children}
      {isOpen &&
        content != null &&
        (portal ? createPortal(tooltipPanel, document.body) : tooltipPanel)}
    </div>
  );
};

Tooltip.displayName = "Tooltip";
