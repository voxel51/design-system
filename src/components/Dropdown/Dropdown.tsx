import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import {
  isValidElement,
  type FC,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { menuPanelStyles } from "@/components/Menu";
import { ZIndex, zIndexStyles } from "@/types";
import { cn } from "@/util/classes";

/**
 * Position of the dropdown menu panel relative to its trigger.
 * Values follow the `<edge> <alignment>` convention used by HeadlessUI's
 * floating UI — e.g. `BottomStart` opens the menu below the trigger,
 * left-aligned with it.
 */
export enum DropdownAnchor {
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

/**
 * Props for {@link Dropdown}.
 */
export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The element that opens the dropdown when clicked.
   * Rendered inside a `MenuButton` wrapper — any focusable element works.
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
  /** Explicit z-index override for the menu panel. */
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
 * {@link MenuSectionTitle}, and {@link MenuSeparator}.
 *
 * Built on HeadlessUI's `Menu`, providing full keyboard navigation
 * (arrow keys, Enter, Escape) and ARIA `role="menu"` semantics automatically.
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
 * @param portal If `true`, renders the panel in a portal with a high z-index.
 * @param zIndex Explicit z-index for the panel.
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

  return (
    <div className={cn("relative inline-block", className)} {...props}>
      <Menu>
        <MenuButton
          as="div"
          disabled={isDisabled}
          className={isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {trigger}
        </MenuButton>

        <MenuItems
          anchor={{ to: anchor, gap: 4 }}
          portal={portal}
          className={cn(menuPanelStyles(), panelZIndex)}
        >
          {children}
        </MenuItems>
      </Menu>
    </div>
  );
};

Dropdown.displayName = "Dropdown";
