import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import {
  CircleIcon,
  CloseIcon,
  type IconInput,
  resolveIconInput,
} from "@/components/Icons";
import { Stack } from "@/components/Stack";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { CAPTION_SIZE } from "@/styles/text";
import {
  BackgroundColor,
  ElementState,
  Radius,
  SemanticColor,
  Shadow,
  Size,
  StatusColor,
  TextColor,
} from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";

export type PillSize = `${Exclude<Size, Size.Lg | Size.Xl>}`;
export type PillColor = `${BackgroundColor | SemanticColor | StatusColor}`;

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: PillSize;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColor;
  /** Prefixes the content with a status dot. */
  isStatus?: boolean;
  /** Color of the status dot, when it differs from the text. Defaults to `color`. See {@link TextColor}. */
  dotColor?: TextColor;
  backgroundColor?: PillColor;
  icon?: IconInput;
  onRemove?: () => void;
}

// Figma pills all set type/caption (12/16). Xs is the Tag Pill (2/8 padding,
// 20px tall), Sm and Md the two StatusPill sizes (4/10 → 24px, 6/12 → 28px).
const sizeStyles: Record<PillSize, string> = {
  [Size.Xs]: "px-2 py-0.5",
  [Size.Sm]: "px-2.5 py-1",
  [Size.Md]: "px-3 py-1.5",
};

// The remove glyph follows the caption, a step smaller than the pill's text
const removeIconSizes: Record<PillSize, number> = {
  [Size.Xs]: 10,
  [Size.Sm]: 10,
  [Size.Md]: 12,
};

// The status dot is a 5px ellipse at Small and 6px at Medium.
const dotSizes: Record<PillSize, number> = {
  [Size.Xs]: 5,
  [Size.Sm]: 5,
  [Size.Md]: 6,
};

/**
 * A basic pill component.
 *
 * @example
 * ```tsx
 * <Pill isStatus size="md" color="text-success" backgroundColor="status-approved-bg">
 *   Approved
 * </Pill>
 * ```
 *
 * @param size The size of the pill: `"xs"`, `"sm"` or `"md"`. Defaults to `"sm"`. See {@link PillSize}.
 * @param icon Optional leading icon component, sized to the pill and tinted with `color`.
 * @param radius The border radius of the pill. See {@link Radius}.
 * @param shadow Optional drop shadow to apply to the pill. See {@link Shadow}.
 * @param color Text color of the pill. See {@link TextColor}.
 * @param backgroundColor Background color of the pill. Defaults to `"bg-card-elevated"`. See {@link PillColor}.
 * @param isStatus If `true`, prefixes the content with a bullet-like icon.
 * @param dotColor Color of the status dot, when it differs from the text. Defaults to `color`. See {@link TextColor}.
 * @param onRemove Callback triggered when the remove control is clicked. Providing this makes the pill
 *  removable: a trailing remove button, sized to the pill and in its text color, calls `onRemove`. Omit it
 *  for a non-removable pill.
 * @param className `class` overrides to apply to the component.
 * @param children Content of the pill.
 * @param props Additional HTML properties to apply to the component.
 */
export const Pill: FC<PillProps> = ({
  size = Size.Sm,
  radius = Radius.Full,
  shadow = undefined,
  color = TextColor.Primary,
  backgroundColor = BackgroundColor.CardElevated,
  icon,
  isStatus = false,
  dotColor = color,
  onRemove,
  className,
  children,
  ...props
}) => {
  const IconContent = resolveIconInput(icon);

  return (
    <Stack
      className={clsx(
        "items-center gap-1.5",
        CAPTION_SIZE, // colour is the prop
        textColorClass(color),
        bgColorClass(backgroundColor),
        radiusStyles(radius),
        shadowStyles(shadow),
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isStatus && (
        <div>
          <CircleIcon
            size={dotSizes[size]}
            color={dotColor}
            className="shrink-0"
          />
        </div>
      )}
      {IconContent && (
        <div>
          <IconContent size={size} color={color} />
        </div>
      )}
      <div>{children}</div>
      {onRemove && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          // Round, so the hover affordance is a small circle matching the pill shape.
          className={clsx(
            "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full",
            "opacity-70 hover:opacity-100",
            bgColorClass(BackgroundColor.CardNested, ElementState.Hover)
          )}
        >
          <CloseIcon size={removeIconSizes[size]} color={color} />
        </button>
      )}
    </Stack>
  );
};

Pill.displayName = "Pill";
