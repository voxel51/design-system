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
import {
  BackgroundColor,
  Radius,
  SemanticColor,
  Shadow,
  Size,
  Spacing,
  StatusColor,
  TextColor,
  Variant,
} from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";

export type PillSize = Exclude<Size, Size.Lg | Size.Xl>;
export type PillColor = BackgroundColor | SemanticColor | StatusColor;

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

const sizeStyles: Record<PillSize, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

/**
 * A basic pill component.
 *
 * @example
 * ```tsx
 * <Pill isStatus={true}>
 *   Success
 * </Pill>
 * ```
 *
 * @param size The size of the pill. See {@link Size}.
 * @param radius The border radius of the pill. See {@link Radius}.
 * @param shadow Optional drop shadow to apply to the pill. See {@link Shadow}.
 * @param color Text color of the pill. See {@link TextColor}.
 * @param backgroundColor Background color of the pill. See {@link BackgroundColor}.
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
  color = TextColor.Muted,
  backgroundColor = BackgroundColor.Muted,
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
      spacing={Spacing.Xs}
      className={clsx(
        "items-center",
        "font-small",
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
          <CircleIcon size={Size.Xs} color={color} style={{ minWidth: 10 }} />
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
          variant={Variant.Icon}
          size={Size.Xs}
          aria-label="Remove"
          leadingIcon={CloseIcon}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          // Fit the icon button to the pill: tight padding + round corners so the hover
          // affordance is a small circle rather than a large square that fights the pill shape.
          className="shrink-0 rounded-full p-0.5"
        />
      )}
    </Stack>
  );
};

Pill.displayName = "Pill";
