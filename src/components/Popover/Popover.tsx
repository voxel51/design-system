import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  type Placement,
} from "@floating-ui/react";
import {
  isValidElement,
  useCallback,
  useState,
  type FC,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Shadow,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Position of the popover panel relative to its trigger.
 * Values follow the `<edge>-<alignment>` convention used by floating UI —
 * e.g. `BottomStart` opens the panel below the trigger, left-aligned with it.
 */
export enum PopoverAnchor {
  /** Below the trigger, horizontally centered. */
  Bottom = "bottom",
  /** Below the trigger, aligned with its leading (start) edge. */
  BottomStart = "bottom-start",
  /** Below the trigger, aligned with its trailing (end) edge. */
  BottomEnd = "bottom-end",
  /** Above the trigger, horizontally centered. */
  Top = "top",
  /** Above the trigger, aligned with its leading (start) edge. */
  TopStart = "top-start",
  /** Above the trigger, aligned with its trailing (end) edge. */
  TopEnd = "top-end",
}

/** What the panel's render function receives. */
export interface PopoverRenderProps {
  /** Closes the panel — for a "Done" button or a committed edit. */
  close: () => void;
}

/**
 * Shared visual styles for the popover panel: the card surface with its
 * border, the large radius and shadow, and a compact content padding — the
 * same surface an outlined {@link Card} has, so a popover reads as a card
 * that floats. There is no width cap: the content decides, or
 * `panelClassName` does.
 */
export const popoverPanelStyles = (): string =>
  cn(
    "min-w-[120px]",
    "p-2.5",
    "border-1",
    borderColorClass(BorderColor.Default),
    bgColorClass(BackgroundColor.Card1),
    radiusStyles(Radius.Lg),
    shadowStyles(Shadow.Lg),
    "focus:outline-none"
  );

/**
 * Props for {@link Popover}.
 */
export interface PopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /**
   * The element the panel anchors to. Uncontrolled, clicking it toggles the
   * panel; controlled, it is only the anchor and the caller decides.
   */
  trigger: ReactNode;
  /**
   * Panel content — arbitrary: forms, settings, rich pickers. A function
   * receives {@link PopoverRenderProps} so the content can close the panel.
   */
  children: ReactNode | ((props: PopoverRenderProps) => ReactElement);
  /**
   * Controls the panel from outside. Leave unset for a panel the trigger
   * opens and closes on its own; set it when something else decides —
   * an editor the caller opens after creating the thing it edits.
   */
  open?: boolean;
  /**
   * Fires when the panel wants to open or close: the trigger was clicked,
   * Escape was pressed, a click landed outside, or the content called
   * `close`. Required for `open` to be meaningful.
   */
  onOpenChange?: (open: boolean) => void;
  /** Position of the panel relative to the trigger. */
  anchor?: PopoverAnchor;
  /**
   * Renders the panel in a portal so it escapes overflow-hidden ancestors
   * and stacks above complex layouts (modals, mosaic grids, scrollable
   * regions). Defaults to `true`.
   * @default true
   */
  portal?: boolean;
  /** Explicit z-index override for the panel. */
  zIndex?: ZIndex;
  /**
   * If `true`, the trigger cannot open the panel. Also inferred automatically
   * when the `trigger` element has `disabled` set on its props.
   */
  disabled?: boolean;
  /** `class` overrides for the panel (e.g. an explicit width). */
  panelClassName?: string;
  /**
   * Moves focus into the panel when it opens and back to the trigger when
   * it closes. Defaults to `true`; turn it off for a panel that must not take
   * the keyboard, such as one that opens on its own.
   * @default true
   */
  focusOnOpen?: boolean;
}

/**
 * A click-triggered popover for content that is NOT a menu: settings forms,
 * filter builders, rich pickers. Where {@link Dropdown} closes on every item
 * click (menu semantics), a popover stays open while its content is worked
 * with, closing on Escape, on an outside click, or from the content itself
 * via the render function's `close`.
 *
 * Built on floating UI: the panel is anchored to the trigger, flips and
 * shifts to stay on screen, and follows it on scroll and resize. Focus is
 * managed while open and ARIA `dialog` semantics are applied. The panel
 * wears the outlined card surface, so it reads as a card that floats.
 *
 * Controlled with `open` + `onOpenChange` for panels something else opens —
 * an editor that appears for a just-created item — or uncontrolled for the
 * common trigger-toggles-panel case.
 *
 * @example
 * ```tsx
 * <Popover trigger={<DropdownTrigger>Search settings</DropdownTrigger>}>
 *   {({ close }) => (
 *     <Stack orientation={Orientation.Column} spacing={Spacing.Sm}>
 *       <Text variant={TextVariant.Label}>Similarity index</Text>
 *       <Select options={indexes} value={selected} onChange={pick} />
 *       <Button onClick={close}>Done</Button>
 *     </Stack>
 *   )}
 * </Popover>
 * ```
 *
 * @param trigger The element the panel anchors to; the toggle when uncontrolled.
 * @param children Panel content, or a function of {@link PopoverRenderProps}.
 * @param open Controlled open state.
 * @param onOpenChange Fires when the panel wants to open or close.
 * @param anchor Position of the panel relative to the trigger. See {@link PopoverAnchor}.
 * @param portal If `true`, renders the panel in a portal with a high z-index.
 * @param zIndex Explicit z-index for the panel.
 * @param disabled If `true`, the panel cannot be opened from the trigger.
 * @param panelClassName `class` overrides for the panel.
 * @param focusOnOpen Move focus into the panel on open.
 * @param className `class` overrides for the root wrapper.
 * @param props Additional HTML properties for the root wrapper.
 */
export const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  open: controlledOpen,
  onOpenChange,
  anchor = PopoverAnchor.BottomStart,
  portal = true,
  zIndex,
  disabled,
  panelClassName,
  focusOnOpen = true,
  className,
  ...props
}) => {
  const controlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!controlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange]
  );

  const triggerDisabled = isValidElement<{ disabled?: boolean }>(trigger)
    ? !!trigger.props.disabled
    : false;
  const isDisabled = disabled || triggerDisabled;

  const { refs, floatingStyles, context } = useFloating({
    placement: anchor as Placement,
    open,
    onOpenChange: setOpen,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: !controlled && !isDisabled });
  // A press inside another overlay layer — a Select menu or a nested popover
  // that portals out of this panel — is not a press outside it
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      const target = event.target as Element | null;
      return !target?.closest?.(
        "[data-headlessui-portal], [data-floating-ui-portal]"
      );
    },
  });
  const role = useRole(context, { role: "dialog" });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const panelZIndex = portal
    ? zIndexStyles(ZIndex.AboveModal)
    : zIndex
      ? zIndexStyles(zIndex)
      : zIndexStyles(ZIndex.High);

  const close = useCallback((): void => setOpen(false), [setOpen]);

  const panel = open ? (
    <FloatingFocusManager
      context={context}
      modal={false}
      disabled={!focusOnOpen}
      returnFocus={focusOnOpen}
      // Focus moving into a Select menu that portals out of the panel is not
      // the user leaving; dismissal is useDismiss's job
      closeOnFocusOut={false}
    >
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={cn(popoverPanelStyles(), panelZIndex, panelClassName)}
        {...getFloatingProps()}
      >
        {typeof children === "function" ? children({ close }) : children}
      </div>
    </FloatingFocusManager>
  ) : null;

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <div
        ref={refs.setReference}
        className={cn(
          "inline-block",
          !controlled && (isDisabled ? "cursor-not-allowed" : "cursor-pointer")
        )}
        {...getReferenceProps()}
      >
        {trigger}
      </div>
      {portal ? <FloatingPortal>{panel}</FloatingPortal> : panel}
    </div>
  );
};

Popover.displayName = "Popover";
