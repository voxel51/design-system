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
 * Always renders as a secondary button with a trailing caret-down icon
 * so users know the element opens a menu.
 *
 * @example
 * ```tsx
 * <Dropdown trigger={<DropdownTrigger>Actions</DropdownTrigger>}>
 *   <DropdownTextItem onClick={() => {}}>Edit</DropdownTextItem>
 * </Dropdown>
 * ```
 *
 * @param children Button label.
 * @param size Button size. Defaults to {@link Size.Sm}.
 * @param props Additional {@link ButtonProps} (excluding `variant` and `trailingIcon`).
 */
export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  children,
  size = Size.Sm,
  ...props
}) => (
  <Button
    variant={Variant.Secondary}
    size={size}
    trailingIcon={CaretDownIcon}
    {...props}
  >
    {children}
  </Button>
);

DropdownTrigger.displayName = "DropdownTrigger";
