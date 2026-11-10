import type { FC, ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { Dropdown, DropdownAnchor } from "@/components/Dropdown";
import { ChevronDownStrokeIcon } from "@/components/Icons";
import { cn } from "@/util/classes";

export interface SplitButtonProps extends Omit<
  ButtonProps,
  "trailingIcon" | "collapse"
> {
  /** Menu content for the chevron half: the Menu* primitives, such as other ways to run the action. */
  menu?: ReactNode;
  /** Accessible name of the chevron that opens the menu. Defaults to `"More options"`. */
  menuLabel?: string;
}

/**
 * A button joined to a chevron that opens a menu of related choices, such as
 * running an action now or scheduling it.
 *
 * @example
 * ```tsx
 * <SplitButton
 *   onClick={run}
 *   menu={
 *     <>
 *       <MenuCheckItem select checked={mode === "now"} onClick={() => setMode("now")}>
 *         Execute
 *       </MenuCheckItem>
 *       <MenuCheckItem select checked={mode === "later"} onClick={() => setMode("later")}>
 *         Schedule
 *       </MenuCheckItem>
 *     </>
 *   }
 * >
 *   Execute
 * </SplitButton>
 * ```
 *
 * @param menu Menu content for the chevron half; without it the button renders alone.
 * @param menuLabel Accessible name of the chevron. Defaults to `"More options"`.
 * @param variant The variant of both halves. Defaults to `"primary"`.
 * @param size The size of both halves. Defaults to `"md"`.
 * @param disabled Disables both halves.
 * @param className `class` overrides for the main button.
 * @param props Additional {@link Button} properties for the main button.
 */
export const SplitButton: FC<SplitButtonProps> = ({
  menu,
  menuLabel = "More options",
  variant,
  size,
  disabled,
  className,
  ...props
}) => {
  if (!menu) {
    return (
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  }

  return (
    <div className="inline-flex items-stretch gap-px">
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        className={cn("rounded-r-none", className)}
        {...props}
      />
      <Dropdown
        anchor={DropdownAnchor.BottomEnd}
        className="flex [&>div]:flex"
        disabled={disabled}
        trigger={
          <Button
            variant={variant}
            size={size}
            disabled={disabled}
            aria-label={menuLabel}
            leadingIcon={ChevronDownStrokeIcon}
            className="h-full rounded-l-none py-0"
          />
        }
      >
        {menu}
      </Dropdown>
    </div>
  );
};
