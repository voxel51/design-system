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

export enum CardBackground {
  Primary = "primary",
  Secondary = "secondary",
  Elevated = "elevated",
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
 * A basic card to display to the user.
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
