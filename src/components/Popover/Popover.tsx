import {
  Popover as HeadlessPopover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  isValidElement,
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
  Radius,
  Shadow,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Position of the popover panel relative to its trigger.
 * Values follow the `<edge> <alignment>` convention used by HeadlessUI's
 * floating UI — e.g. `BottomStart` opens the panel below the trigger,
 * left-aligned with it.
 */
export enum PopoverAnchor {
  /** Below the trigger, horizontally centered. */
  Bottom = "bottom",
  /** Below the trigger, aligned with its leading (start) edge. */
  BottomStart = "bottom start",
  /** Below the trigger, aligned with its trailing (end) edge. */
  BottomEnd = "bottom end",
  /** Above the trigger, horizontally centered. */
  Top = "top",
  /** Above the trigger, aligned with its leading (start) edge. */
  TopStart = "top start",
  /** Above the trigger, aligned with its trailing (end) edge. */
  TopEnd = "top end",
}

/** What the panel's render function receives. */
export interface PopoverRenderProps {
  /** Closes the panel — for a "Done" button or a committed edit. */
  close: () => void;
}

/**
 * Shared visual styles for the popover panel: the popover surface, radius,
 * shadow, and focus outline reset, with a small content padding. Unlike
 * {@link menuPanelStyles} there is no width cap — the content decides, or
 * `panelClassName` does.
 */
export const popoverPanelStyles = (): string =>
  cn(
    "min-w-[120px]",
    "p-2",
    bgColorClass(BackgroundColor.Popover),
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
   * The element that opens the popover when clicked.
   * Rendered inside a `PopoverButton` wrapper — any focusable element works.
   */
  trigger: ReactNode;
  /**
   * Panel content — arbitrary: forms, settings, rich pickers. A function
   * receives {@link PopoverRenderProps} so the content can close the panel.
   */
  children: ReactNode | ((props: PopoverRenderProps) => ReactElement);
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
}

/**
 * A click-triggered popover for content that is NOT a menu: settings forms,
 * filter builders, rich pickers. Where {@link Dropdown} closes on every item
 * click (menu semantics), a popover stays open while its content is worked
 * with, closing on Escape, on an outside click, or from the content itself
 * via the render function's `close`.
 *
 * Built on HeadlessUI's `Popover`, providing focus management and ARIA
 * semantics automatically. The panel wears the same surface as the menu
 * panels, so dropdowns and popovers read as one family.
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
 * @param trigger The trigger element that opens the panel.
 * @param children Panel content, or a function of {@link PopoverRenderProps}.
 * @param anchor Position of the panel relative to the trigger. See {@link PopoverAnchor}.
 * @param portal If `true`, renders the panel in a portal with a high z-index.
 * @param zIndex Explicit z-index for the panel.
 * @param disabled If `true`, the panel cannot be opened.
 * @param panelClassName `class` overrides for the panel.
 * @param className `class` overrides for the root wrapper.
 * @param props Additional HTML properties for the root wrapper.
 */
export const Popover: FC<PopoverProps> = ({
  trigger,
  children,
  anchor = PopoverAnchor.BottomStart,
  portal = true,
  zIndex,
  disabled,
  panelClassName,
  className,
  ...props
}) => {
  const panelZIndex = portal
    ? zIndexStyles(ZIndex.AboveModal)
    : zIndex
      ? zIndexStyles(zIndex)
      : zIndexStyles(ZIndex.High);

  const triggerDisabled = isValidElement<{ disabled?: boolean }>(trigger)
    ? !!trigger.props.disabled
    : false;
  const isDisabled = disabled || triggerDisabled;

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <HeadlessPopover>
        <PopoverButton
          as="div"
          disabled={isDisabled}
          className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {trigger}
        </PopoverButton>

        <PopoverPanel
          anchor={{ to: anchor, gap: 4 }}
          portal={portal}
          className={cn(popoverPanelStyles(), panelZIndex, panelClassName)}
        >
          {children}
        </PopoverPanel>
      </HeadlessPopover>
    </div>
  );
};

Popover.displayName = "Popover";
