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
  [CardBackground.Primary]: BackgroundColor.Card1,
  [CardBackground.Secondary]: BackgroundColor.Card2,
  [CardBackground.Elevated]: BackgroundColor.CardElevated,
};

/**
 * A styled container component with configurable background, shadow, and padding.
 *
 * @example
 * ```tsx
 * <Card background={CardBackground.Secondary} compact>
 *   Card content here
 * </Card>
 * ```
 *
 * @param background The background color variant. Defaults to {@link CardBackground.Primary}.
 * @param border Whether to render a border around the card.
 * @param className Additional CSS class names to apply to the card.
 * @param compact When true, reduces internal padding.
 * @param shadow The shadow depth applied to the card. Defaults to {@link Shadow.Md}.
 * @param outlined When true, replaces the shadow with a border outline.
 * @param children The content of the card.
 * @param props Additional HTML properties to apply to the card.
 */
export const Card: FC<CardProps> = ({
  children,
  className,
  compact,
  background = CardBackground.Primary,
  outlined,
  shadow = Shadow.Md,
  ...props
}) => {
  const backgroundColor = bgColorMap[background];

  return (
    <div
      className={cn(
        outlined ? "border-1" : shadowStyles(shadow),
        outlined && borderColorClass(BorderColor.Default),
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
