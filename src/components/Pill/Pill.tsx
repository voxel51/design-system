import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Button } from "@/components/Button";
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
  Radius,
  SemanticColor,
  Shadow,
  Size,
  StatusColor,
  TextColor,
  Variant,
} from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";

export type PillSize = `${Exclude<Size, Size.Lg | Size.Xl>}`;
export type PillColor = `${BackgroundColor | SemanticColor | StatusColor}`;

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: PillSize;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColor;
  isStatus?: boolean;
  backgroundColor?: PillColor;
  icon?: IconInput;
  onRemove?: () => void;
}

// Figma pills all set type/caption (11/16). Xs is the Tag Pill (2/8 padding,
// 20px tall), Sm and Md the two StatusPill sizes (4/10 → 24px, 6/12 → 28px).
const sizeStyles: Record<PillSize, string> = {
  [Size.Xs]: "px-2 py-0.5",
  [Size.Sm]: "px-2.5 py-1",
  [Size.Md]: "px-3 py-1.5",
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
 * @param onRemove Callback triggered when the remove control is clicked. Providing this makes the pill
 *  removable: a trailing icon {@link Button} is rendered which calls `onRemove` when clicked. Omit it
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
            color={color}
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
        <Button
          type="button"
          variant={Variant.Icon}
          size={Size.Xs}
          aria-label="Remove"
          leadingIcon={CloseIcon}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          // Round corners so the hover affordance is a small circle, matching the pill shape.
          className="shrink-0 rounded-full p-0 size-4"
        />
      )}
    </Stack>
  );
};

Pill.displayName = "Pill";
