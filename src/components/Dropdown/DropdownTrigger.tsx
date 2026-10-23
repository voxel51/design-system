import type { FC } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { CaretDownIcon } from "@/components/Icons";
import { Size, Variant } from "@/types";

/**
 * Props for {@link DropdownTrigger}. Accepts {@link ButtonProps} except
 * `variant` and `trailingIcon`, which are fixed by the trigger preset
 * (secondary variant + caret-down icon).
 */
export type DropdownTriggerProps = Omit<
  ButtonProps,
  "variant" | "trailingIcon"
>;

/**
 * The standard trigger button for a {@link Dropdown}.
 * Renders as a secondary button with a trailing caret-down icon so users
 * know the element opens a menu. `borderless` drops the outline for a
 * rounded pill that fills only on hover, for toolbars and filter rows.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Actions</DropdownTrigger>}>
 *   <MenuTextItem onClick={() => {}}>Edit</MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param children Button label.
 * @param size Button size. Defaults to `"sm"`.
 * @param borderless No outline; a rounded fill appears on hover.
 * @param props Additional {@link ButtonProps} (excluding `variant` and `trailingIcon`).
 */
export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  children,
  size = Size.Sm,
  borderless,
  ...props
}) => (
  <Button
    variant={borderless ? Variant.Icon : Variant.Secondary}
    borderless={borderless}
    size={size}
    trailingIcon={CaretDownIcon}
    {...props}
  >
    {children}
  </Button>
);

DropdownTrigger.displayName = "DropdownTrigger";
