import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { CircleIcon, CloseIcon, type IconProps } from "@/components/Icons";
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
} from "@/types";
import { bgColorClass, textColorClass } from "@/types/color";
import { cn } from "@/util/classes";

export type PillSize = Exclude<Size, Size.Lg | Size.Xl>;
export type PillColor = BackgroundColor | SemanticColor | StatusColor;

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  size?: PillSize;
  radius?: Radius;
  shadow?: Shadow;
  color?: TextColor;
  isStatus?: boolean;
  backgroundColor?: PillColor;
  icon?: FC<IconProps>;
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
  icon: IconContent,
  isStatus = false,
  onRemove,
  className,
  children,
  ...props
}) => {
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
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="shrink-0 cursor-pointer group"
        >
          <CloseIcon
            size={Size.Xs}
            color={color}
            className={cn(
              "min-w-[10px]",
              "group-hover:text-content-text-primary",
              "transition-colors duration-150"
            )}
          />
        </button>
      )}
    </Stack>
  );
};

Pill.displayName = "Pill";
