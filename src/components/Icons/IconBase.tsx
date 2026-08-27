import clsx from "clsx";
import type { CSSProperties, FC, SVGProps } from "react";

import { type ThemeableColor, isColorToken, textColorClass } from "@/types";
import { Size } from "@/types/size";

type SvgComponent = FC<SVGProps<SVGSVGElement>>;

type IconSize = Exclude<Size, "Xs">;

const sizeMap: Partial<Record<IconSize, number>> = {
  [Size.Sm]: 12,
  [Size.Md]: 14,
  [Size.Lg]: 16,
  [Size.Xl]: 18,
};

export interface IconProps {
  size?: Size | number;
  /**
   * A theme-aware color token for anything the design system controls, or a
   * raw CSS color for anything the app controls (user-defined palettes,
   * data-driven colors) — a token can't exist for a color chosen at runtime
   * by app data, so this isn't a fallback, it's the correct tool for that
   * case.
   */
  color?: ThemeableColor | string;
  className?: string;
  style?: CSSProperties;
}

interface IconBaseProps extends IconProps {
  svg: SvgComponent;
}

/**
 * Shared rendering wrapper for the generated icon components in `icons.tsx`.
 *
 * We are making a strong opinion here that we should treat the SVG
 * as a square - the viewbox on the SVG will still handle the aspect
 * ratio but it's possible that VERY rectangular SVGs will not behave
 * as expected.
 *
 * @param svg The SVG component to render.
 * @param size The size of the icon. Accepts a {@link Size} token, or a raw
 * pixel number for cases the token scale doesn't cover. If unspecified,
 * fills the parent container.
 * @param className `class` overrides to apply to the component.
 * @param color Color of the icon. See {@link IconProps.color}. By default,
 * the icon inherits the text color of its container.
 * @param style `style` overrides to apply to the icon.
 */
export const IconBase: FC<IconBaseProps> = ({
  svg: Svg,
  size = undefined, // if no size specified, fill the parent container
  className,
  color,
  style,
  ...props
}) => {
  const iconSize =
    typeof size === "number" ? size : size ? sizeMap[size] : undefined;
  const isToken = color !== undefined && isColorToken(color);

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      className={clsx(isToken && textColorClass(color), className)}
      style={color && !isToken ? { color, ...style } : style}
      {...props}
    />
  );
};
