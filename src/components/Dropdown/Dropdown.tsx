import { Menu } from "@base-ui/react/menu";
import {
  isValidElement,
  useRef,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { actionMenuPanelStyles } from "@/components/Menu";
import { ZIndex, zIndexStyles } from "@/types";
import { cn } from "@/util/classes";

/**
 * Position of the dropdown menu panel relative to its trigger.
 * Values follow the `<side> <alignment>` convention — e.g. `BottomStart`
 * opens the menu below the trigger, left-aligned with it. The menu flips to
 * the other side when it would leave the viewport.
 */
export const DropdownAnchor = {
  /** Below the trigger, horizontally centered. */
  Bottom: "bottom",
  /** Below the trigger, aligned with its leading (start) edge. */
  BottomStart: "bottom start",
  /** Below the trigger, aligned with its trailing (end) edge. */
  BottomEnd: "bottom end",
  /** Above the trigger, horizontally centered. */
  Top: "top",
  /** Above the trigger, aligned with its leading (start) edge. */
  TopStart: "top start",
  /** Above the trigger, aligned with its trailing (end) edge. */
  TopEnd: "top end",
} as const;
export type DropdownAnchor =
  `${(typeof DropdownAnchor)[keyof typeof DropdownAnchor]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DropdownAnchor {
  export type Bottom = typeof DropdownAnchor.Bottom;
  export type BottomStart = typeof DropdownAnchor.BottomStart;
  export type BottomEnd = typeof DropdownAnchor.BottomEnd;
  export type Top = typeof DropdownAnchor.Top;
  export type TopStart = typeof DropdownAnchor.TopStart;
  export type TopEnd = typeof DropdownAnchor.TopEnd;
}

/** The consumer's trigger element, or the first focusable thing in it. */
const FOCUSABLE =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Props for {@link Dropdown}.
 */
export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The element that opens the dropdown when clicked.
   * Rendered inside the menu's trigger wrapper — any focusable element works.
   */
  trigger: ReactNode;
  /** Menu content. Use the Menu* primitive components as children. */
  children: ReactNode;
  /** Position of the menu panel relative to the trigger. */
  anchor?: DropdownAnchor;
  /**
   * Renders the menu panel in a portal so it escapes overflow-hidden
   * ancestors and stacks above complex layouts (modals, mosaic grids,
   * scrollable regions). Defaults to `true` — opt out by passing `false`
   * when the menu must stay inside its trigger's DOM subtree (e.g. tightly
   * scoped to a virtualized list).
   * @default true
   */
  portal?: boolean;
  /** Explicit z-index for the panel. Only applied when `portal` is `false`; a portaled panel always stacks above modals. */
  zIndex?: ZIndex;
  /**
   * If `true`, the trigger cannot open the menu. Also inferred automatically
   * when the `trigger` element has `disabled` set on its props.
   */
  disabled?: boolean;
}

/**
 * A click-triggered menu component. Composes with the Menu primitives:
 * {@link MenuTextItem}, {@link MenuIconTextItem}, {@link MenuCheckItem},
 * {@link MenuSubmenuItem}, {@link MenuSectionTitle}, and {@link MenuSeparator}.
 *
 * Built on Base UI's `Menu`, providing full keyboard navigation
 * (arrow keys, Enter, Escape, type-ahead), nested menus through
 * {@link MenuSubmenuItem}, and ARIA `role="menu"` semantics automatically.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Actions</DropdownTrigger>}>
 *   <MenuSectionTitle>Actions</MenuSectionTitle>
 *   <MenuIconTextItem
 *     icon={<ImageSearchIcon />}
 *     text="Sort by similarity"
 *     subtext="Find visually similar"
 *     onClick={() => {}}
 *   />
 *   <MenuIconTextItem
 *     icon={<EmbeddingsIcon />}
 *     text="Run embeddings"
 *     subtext="Compute vector embeddings"
 *     onClick={() => {}}
 *   />
 *   <MenuSeparator />
 *   <MenuTextItem destructive onClick={() => {}}>
 *     Delete
 *   </MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param trigger The trigger element that opens the menu.
 * @param children Menu content — use the Menu* primitive components.
 * @param anchor Position of the menu panel relative to the trigger. See {@link DropdownAnchor}.
 * @param portal If `true` (the default), renders the panel in a portal above modals.
 * @param zIndex Explicit z-index for the panel; only applied when `portal` is `false`.
 * @param disabled If `true`, the menu cannot be opened.
 * @param className `class` overrides for the root wrapper.
 * @param props Additional HTML properties for the root wrapper.
 */
export const Dropdown: FC<DropdownProps> = ({
  trigger,
  children,
  anchor = DropdownAnchor.BottomStart,
  portal = true,
  zIndex,
  disabled,
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

  // An unportaled panel renders here, inside the trigger's DOM subtree
  const inlineContainer = useRef<HTMLSpanElement>(null);
  // The trigger is the first focusable element in the root
  const root = useRef<HTMLDivElement>(null);
  const focusableTrigger = (): HTMLElement | null =>
    root.current?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
  const [side, align = "center"] = anchor.split(" ") as [
    "top" | "bottom",
    ("start" | "end")?,
  ];

  return (
    <div
      ref={root}
      className={cn("relative inline-block", className)}
      {...props}
    >
      <Menu.Root modal={false} disabled={isDisabled}>
        <Menu.Trigger
          disabled={isDisabled}
          nativeButton={false}
          // The wrapper only catches presses; the consumer's own element is
          // the button keyboard and assistive tech see, so the wrapper drops
          // the role and tab stop Base UI gives a non-native trigger
          render={(triggerProps) => (
            <div {...triggerProps} role={undefined} tabIndex={undefined} />
          )}
          className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {trigger}
        </Menu.Trigger>

        <Menu.Portal container={portal ? undefined : inlineContainer}>
          <Menu.Positioner
            side={side}
            align={align}
            sideOffset={4}
            className={panelZIndex}
          >
            <Menu.Popup
              className={actionMenuPanelStyles()}
              // Return focus to the consumer's trigger, not the wrapper
              finalFocus={focusableTrigger}
            >
              {children}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      {!portal && <span ref={inlineContainer} />}
    </div>
  );
};

Dropdown.displayName = "Dropdown";
