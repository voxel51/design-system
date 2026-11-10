import type { FC, HTMLAttributes } from "react";

import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Color,
  Radius,
  Shadow,
} from "@/types";
import { cn } from "@/util/classes";

export const CardBackground = {
  Primary: "primary",
  Secondary: "secondary",
  Elevated: "elevated",
} as const;
export type CardBackground =
  `${(typeof CardBackground)[keyof typeof CardBackground]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CardBackground {
  export type Primary = typeof CardBackground.Primary;
  export type Secondary = typeof CardBackground.Secondary;
  export type Elevated = typeof CardBackground.Elevated;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  background?: CardBackground;
  border?: boolean;
  className?: string;
  compact?: boolean;
  shadow?: Shadow;
  outlined?: boolean;
}

const bgColorMap: Record<CardBackground, Color> = {
  [CardBackground.Primary]: BackgroundColor.Card,
  [CardBackground.Secondary]: BackgroundColor.CardNested,
  [CardBackground.Elevated]: BackgroundColor.CardElevated,
};

/**
 * A styled container component with configurable background, shadow, and padding.
 *
 * @example
 * ```tsx
 * <Card background="secondary" compact>
 *   Card content here
 * </Card>
 * ```
 *
 * @param background The background color variant. Defaults to `"primary"`.
 * @param border Draws a 1px subtle border, keeping the shadow; for cards
 *  that sit on a surface of a similar tone (list cards in a panel).
 * @param className Additional CSS class names to apply to the card.
 * @param compact When true, reduces internal padding.
 * @param shadow The shadow depth applied to the card. Defaults to `"none"`.
 * @param outlined When true, replaces the shadow with a border outline.
 * @param children The content of the card.
 * @param props Additional HTML properties to apply to the card.
 */
export const Card: FC<CardProps> = ({
  children,
  className,
  compact,
  background = CardBackground.Primary,
  border,
  outlined,
  // Figma Card: bg/card, radius 8, 20px padding, no shadow or edge
  shadow = Shadow.None,
  ...props
}) => {
  const backgroundColor = bgColorMap[background];

  return (
    <div
      className={cn(
        outlined ? "border-1" : shadowStyles(shadow),
        outlined && borderColorClass(BorderColor.Default),
        border && !outlined && "border-1",
        border && !outlined && borderColorClass(BorderColor.Subtle),
        bgColorClass(backgroundColor),
        compact ? "p-2.5" : "p-5",
        radiusStyles(Radius.Lg),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";
