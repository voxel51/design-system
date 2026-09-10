import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  Radius,
  Shadow,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

/**
 * Shared visual styles for the popover panel: the same floating surface the
 * menu panels wear (`menuPanelStyles`) — one background for every panel that
 * floats, whether it holds a menu, a list or a form — with a compact content
 * padding and no width cap: the content decides, or `panelClassName` does.
 */
export const popoverPanelStyles = (): string =>
  cn(
    "min-w-[120px]",
    "p-2.5",
    bgColorClass(BackgroundColor.Popover),
    // A floating surface owns its foreground: portaled to the body, it would
    // otherwise inherit whatever the host page paints its text
    textColorClass(TextColor.Primary),
    radiusStyles(Radius.Lg),
    shadowStyles(Shadow.Lg),
    "focus:outline-none"
  );
