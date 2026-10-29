import { type FC, type ReactNode, type SyntheticEvent, useState } from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { CaretDownIcon } from "@/components/Icons";
import { Tooltip, TooltipLabel } from "@/components/Tooltip";
import { Size, Variant } from "@/types";

/**
 * Props for {@link DropdownTrigger}. Accepts {@link ButtonProps} except
 * `variant` and `trailingIcon`, which are fixed by the trigger preset
 * (secondary variant + caret-down icon).
 */
const PREFIX_ATTR = "data-trigger-prefix";

export type DropdownTriggerProps = Omit<
  ButtonProps,
  "variant" | "trailingIcon"
> & {
  /** What the value is, shown before it (`Sort by: Newest`); on a phone only in the tooltip. */
  prefix?: ReactNode;
};

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
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={
 *     <DropdownTrigger borderless leadingIcon={SlidersHorizontalIcon} prefix="Sort by">
 *       Newest
 *     </DropdownTrigger>
 *   }
 * >
 *   <MenuTextItem onClick={() => {}}>Oldest</MenuTextItem>
 * </Dropdown>
 * ```
 *
 * @param children Button label.
 * @param prefix What the value names, shown as `prefix: value`. Below 640px
 *  only the value shows and a tooltip reads prefix and value; the
 *  `aria-label` keeps both unless one is passed.
 * @param size Button size. Defaults to `"sm"`.
 * @param borderless No outline; a rounded fill appears on hover.
 * @param props Additional {@link ButtonProps} (excluding `variant` and `trailingIcon`).
 */
export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  children,
  size = Size.Sm,
  borderless,
  prefix,
  ...props
}) => {
  const [prefixHidden, setPrefixHidden] = useState(false);
  const named = typeof prefix === "string" && typeof children === "string";
  const button = (
    <Button
      variant={borderless ? Variant.Icon : Variant.Secondary}
      borderless={borderless}
      size={size}
      trailingIcon={CaretDownIcon}
      aria-label={named ? `${prefix}: ${children}` : undefined}
      {...props}
    >
      {prefix != null && (
        <span {...{ [PREFIX_ATTR]: "" }} className="hidden sm:mr-1 sm:inline">
          {prefix}:
        </span>
      )}
      {children}
    </Button>
  );
  if (prefix == null) return button;
  // a phone hides the prefix: the tooltip names it then
  const measure = (event: SyntheticEvent<HTMLElement>): void => {
    const el = event.currentTarget.querySelector(`[${PREFIX_ATTR}]`);
    setPrefixHidden(!!el && el.getClientRects().length === 0);
  };
  return (
    <Tooltip
      content={
        prefixHidden ? <TooltipLabel label={prefix} detail={children} /> : null
      }
      onMouseOverCapture={measure}
      onPointerDownCapture={measure}
    >
      {button}
    </Tooltip>
  );
};

DropdownTrigger.displayName = "DropdownTrigger";
