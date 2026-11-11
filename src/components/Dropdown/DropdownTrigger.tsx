import {
  type FC,
  type ReactNode,
  type SyntheticEvent,
  useMemo,
  useState,
} from "react";

import { Button, type ButtonProps } from "@/components/Button";
import { LABEL_ATTR } from "@/components/Button/labelAttr";
import {
  CaretDownIcon,
  ChevronDownStrokeIcon,
  type IconInput,
  type IconProps,
  IconWrapper,
} from "@/components/Icons";
import { Tooltip, TooltipLabel } from "@/components/Tooltip";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  IconColor,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";
import { useOverflowRowCompact } from "@/util/compact";

const MUTED_ICON = textColorClass(IconColor.Default);

// Lovable's borderless filters: a 14px leading icon and a 12px caret, both muted
const BorderlessCaret: FC<IconProps> = () => (
  <span className={MUTED_ICON}>
    <ChevronDownStrokeIcon size={12} className="block opacity-70" />
  </span>
);

const mutedLeading = (icon: IconInput): FC<IconProps> => {
  const Leading: FC<IconProps> = () => (
    <IconWrapper content={icon} size={14} className={MUTED_ICON} />
  );
  return Leading;
};

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
  /** A borderless trigger whose value is set: a soft filled pill. */
  active?: boolean;
  /** Spans its container: the label truncates on the left, the caret sits at the far right (a form picker). */
  fullWidth?: boolean;
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
 * @param prefix What the value names, shown as `prefix: value`. Below 640px,
 *  or in a row out of room (`useCompactRow`, `OverflowRow`), only the value
 *  shows and a tooltip reads prefix and value; the `aria-label` keeps both
 *  unless one is passed.
 * @param size Button size. Defaults to `"sm"`.
 * @param active Marks a borderless trigger whose value is set: a soft filled pill.
 * @param borderless No outline; a rounded fill appears on hover. The leading
 *  icon shrinks to 14px and both icons take the muted icon colour.
 * @param leadingIcon Optional icon before the label.
 * @param fullWidth Span the container, label truncating left and caret at the far right.
 * @param props Additional {@link ButtonProps} (excluding `variant` and `trailingIcon`).
 */
export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  children,
  size = Size.Sm,
  borderless,
  prefix,
  fullWidth,
  active = false,
  leadingIcon,
  className,
  ...props
}) => {
  const leading = useMemo(
    () => (borderless && leadingIcon ? mutedLeading(leadingIcon) : leadingIcon),
    [borderless, leadingIcon]
  );
  const [prefixHidden, setPrefixHidden] = useState(false);
  // a row that is out of room drops the prefix before its items leave
  const compact = useOverflowRowCompact();
  const named = typeof prefix === "string" && typeof children === "string";
  const button = (
    <Button
      variant={borderless ? Variant.Icon : Variant.Secondary}
      borderless={borderless}
      size={size}
      leadingIcon={leading}
      trailingIcon={borderless ? BorderlessCaret : CaretDownIcon}
      aria-label={named ? `${prefix}: ${children}` : undefined}
      className={cn(
        // the Icon variant's label is medium; a menu trigger reads as regular body text
        borderless &&
          TEXT_STYLES[
            size === Size.Md
              ? TextVariant.BodySecondary
              : TextVariant.BodyTertiary
          ],
        borderless && size === Size.Md && "h-7 py-1",
        borderless && size === Size.Sm && "h-6 py-0.5",
        borderless && active && bgColorClass(BackgroundColor.CardNested),
        prefix != null && textColorClass(TextColor.Primary),
        fullWidth && "w-full min-w-0 [&>div]:w-full [&>div]:justify-between",
        className
      )}
      {...props}
    >
      {prefix != null && (
        <span
          {...{ [PREFIX_ATTR]: "" }}
          className={cn(
            "hidden",
            !compact && "sm:mr-1 sm:inline",
            textColorClass(TextColor.Secondary)
          )}
        >
          {prefix}:
        </span>
      )}
      {fullWidth ? (
        <span
          {...{ [LABEL_ATTR]: "" }}
          className="min-w-0 flex-1 truncate text-left"
        >
          {children}
        </span>
      ) : (
        children
      )}
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
