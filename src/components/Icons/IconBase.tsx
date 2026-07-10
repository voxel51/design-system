import clsx from "clsx";
import type { CSSProperties, FC, SVGProps } from "react";

import { BrandColor, IconColor, TextColor, textColorClass } from "@/types";
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
  size?: Size;
  className?: string;
  color?: TextColor | IconColor | BrandColor;
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
 * @param size The size of the icon. If unspecified, fills the parent container. See {@link Size}.
 * @param className `class` overrides to apply to the component.
 * @param color Color of the icon. By default, the icon inherits the text color of its container.
 * @param style `style` overrides to apply to the icon.
 */
export const IconBase: FC<IconBaseProps> = ({
  svg: Svg,
  size = undefined, // if no size specified, fill the parent container
  className,
  color,
  ...props
}) => {
  const iconSize = size ? sizeMap[size] : undefined;

  return (
    <Svg
      width={iconSize}
      height={iconSize}
      className={clsx(color && textColorClass(color), className)}
      {...props}
    />
  );
};
