import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Shadow,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Shared visual styles for the popover panel: the card surface with its
 * border, the large radius and shadow, and a compact content padding — the
 * same surface an outlined `Card` has, so a popover reads as a card
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
