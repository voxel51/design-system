import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  InteractiveColor,
  Radius,
  Shadow,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Shared visual styles for menu panels (Dropdown, ContextMenu, etc.).
 *
 * Provides the popover background, padding, min/max-width, radius, shadow,
 * and focus outline reset that define the menu's visual identity.
 */
export const menuPanelStyles = (): string =>
  cn(
    // 20rem is Tailwind's `--container-xs`, i.e. what the named
    // max-width utility for that size is meant to resolve to. The named
    // utility can't be used here: our theme defines
    // `--spacing-xs: 0.25rem`, which shadows `--container-xs` for that
    // key, so the utility compiles to `max-width: var(--spacing-xs)` —
    // 4px. Floored by the min-width, that pinned every menu panel to
    // exactly 120px. Written as an arbitrary value so the panel width
    // can't be captured by a spacing token again.
    "min-w-[120px] max-w-[20rem]",
    // Figma ActionMenu: bg/card, border/default edge, radius 6, 6px padding,
    // soft drop shadow
    "p-1.5",
    bgColorClass(BackgroundColor.Card),
    "border",
    borderColorClass(BorderColor.Default),
    radiusStyles(Radius.Md),
    shadowStyles(Shadow.Md),
    "focus:outline-none"
  );

/**
 * Panel styles for action menus (Dropdown, ContextMenu, submenu flyouts):
 * {@link menuPanelStyles} plus the width floor of the Figma ActionMenu, so a
 * menu of short labels is not squeezed to a sliver. Lists sized to an input,
 * such as Combobox, keep the plain panel styles.
 *
 * @internal
 */
export const actionMenuPanelStyles = (): string =>
  // Figma ActionMenu: 226px wide (214px rows inside 6px panel padding)
  cn(menuPanelStyles(), "min-w-[226px]");

/**
 * State the menu row styles depend on. Base UI reports `highlighted` for
 * both pointer hover and keyboard focus, so one flag drives the fill.
 *
 * @internal
 */
export interface MenuRowState {
  readonly highlighted: boolean;
  readonly disabled: boolean;
}

/**
 * Shared row styles for menu items (text, icon-text, check and submenu rows).
 *
 * Figma Action Menu Row: 6/10 padding, radius 8, bg/card-nested fill on
 * hover and focus. Destructive rows fill danger-default with white content.
 *
 * @internal
 */
export const menuRowStyles = (
  { highlighted, disabled }: MenuRowState,
  destructive = false
): string =>
  cn(
    "flex w-full items-center",
    "px-2.5 py-1.5",
    radiusStyles(Radius.Lg),
    "text-left select-none outline-none",
    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
    highlighted &&
      !disabled &&
      bgColorClass(
        destructive
          ? InteractiveColor.DangerDefault
          : BackgroundColor.CardNested
      ),
    // White content on the danger fill
    highlighted && !disabled && destructive && "[&_*]:text-white"
  );
