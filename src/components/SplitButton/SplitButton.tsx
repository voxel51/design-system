import type { FC, HTMLAttributes, MouseEvent, ReactNode } from "react";

import { Button } from "@/components/Button";
import { Dropdown, type DropdownAnchor } from "@/components/Dropdown";
import { ChevronBottomIcon } from "@/components/Icons";
import shadowStyles from "@/styles/shadow";
import { TEXT_STYLES } from "@/styles/text";
import {
  BorderColor,
  borderColorClass,
  Shadow,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

export interface SplitButtonProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onClick" | "children"
> {
  /** The primary action's label. */
  children: ReactNode;
  /** Fires for the primary action. */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Menu content for the attached dropdown; use the Menu* primitives. */
  menu: ReactNode;
  /** Where the menu opens relative to the trigger. */
  anchor?: DropdownAnchor;
  /** Disables both the action and the menu. */
  disabled?: boolean;
  /** Accessible name for the menu trigger. */
  menuLabel?: string;
}

// Figma split button: a Secondary button with a border/strong edge, medium
// 14/20 label and a 36×36 chevron segment sharing the edge.
const segment = cn(
  borderColorClass(BorderColor.Strong),
  borderColorClass(BorderColor.Strong, "hover"),
  shadowStyles(Shadow.Sm)
);

/**
 * A button with a primary action plus an attached dropdown for related
 * secondary actions.
 *
 * @example
 * ```tsx
 * <SplitButton onClick={schedule} menu={<MenuTextItem>Run now</MenuTextItem>}>
 *   Schedule
 * </SplitButton>
 * ```
 *
 * @param children The primary action's label.
 * @param onClick Handler for the primary action.
 * @param menu Menu items for the attached dropdown.
 * @param anchor Where the menu opens. See {@link DropdownAnchor}.
 * @param disabled Disables both segments.
 * @param menuLabel Accessible name for the chevron trigger.
 * @param className `class` overrides for the wrapper.
 * @param props Additional HTML properties for the wrapper.
 */
export const SplitButton: FC<SplitButtonProps> = ({
  children,
  onClick,
  menu,
  anchor,
  disabled,
  menuLabel = "More actions",
  className,
  ...props
}) => (
  <div className={cn("inline-flex items-stretch", className)} {...props}>
    <Button
      variant={Variant.Secondary}
      size={Size.Md}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        segment,
        "rounded-r-none border-r-0",
        TEXT_STYLES[TextVariant.HeadingSm],
        textColorClass(TextColor.Primary)
      )}
    >
      {children}
    </Button>
    <Dropdown
      anchor={anchor}
      disabled={disabled}
      trigger={
        <Button
          variant={Variant.Secondary}
          size={Size.Md}
          disabled={disabled}
          leadingIcon={ChevronBottomIcon}
          aria-label={menuLabel}
          className={cn(segment, "rounded-l-none p-2.5")}
        />
      }
    >
      {menu}
    </Dropdown>
  </div>
);

SplitButton.displayName = "SplitButton";
