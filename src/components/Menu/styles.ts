import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { BackgroundColor, bgColorClass, Radius, Shadow } from "@/types";
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
    "p-1.5",
    bgColorClass(BackgroundColor.Popover),
    radiusStyles(Radius.Lg),
    shadowStyles(Shadow.Lg),
    "focus:outline-none"
  );
