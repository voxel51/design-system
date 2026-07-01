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
    "min-w-[120px] max-w-xs",
    "p-1.5",
    bgColorClass(BackgroundColor.Popover),
    radiusStyles(Radius.Lg),
    shadowStyles(Shadow.Lg),
    "focus:outline-none"
  );
