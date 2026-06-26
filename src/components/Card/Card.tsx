import type { FC, HTMLAttributes, ReactNode } from "react";

import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Align,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Color,
  Justify,
  Orientation,
  Radius,
  Shadow,
  Spacing,
  TextColor,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export enum CardBackground {
  Primary = "primary",
  Secondary = "secondary",
  Elevated = "elevated",
}

export interface CardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  background?: CardBackground;
  border?: boolean;
  className?: string;
  compact?: boolean;
  shadow?: Shadow;
  outlined?: boolean;
  title?: ReactNode;
  subtitle?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
}

const bgColorMap: Record<CardBackground, Color> = {
  [CardBackground.Primary]: BackgroundColor.Card1,
  [CardBackground.Secondary]: BackgroundColor.Card2,
  [CardBackground.Elevated]: BackgroundColor.CardElevated,
};

/**
 * A styled container component with configurable background, shadow, and padding.
 *
 * Supports optional header composition via {@link CardProps.title},
 * {@link CardProps.subtitle}, {@link CardProps.header} and a {@link CardProps.footer}
 * region. When no composition props are supplied, the card renders `children`
 * directly, preserving its use as a plain container.
 *
 * @example
 * ```tsx
 * <Card
 *   title="Usage"
 *   subtitle="Last 30 days"
 *   footer={<Button>View report</Button>}
 *   divider
 * >
 *   Card content here
 * </Card>
 * ```
 *
 * @param background The background color variant. Defaults to {@link CardBackground.Primary}.
 * @param border Whether to render a border around the card.
 * @param className Additional CSS class names to apply to the card.
 * @param compact When true, reduces internal padding and spacing.
 * @param shadow The shadow depth applied to the card. Defaults to {@link Shadow.Md}.
 * @param outlined When true, replaces the shadow with a border outline.
 * @param title The card heading. Strings are wrapped in a {@link Text} heading;
 *   nodes are rendered as-is.
 * @param subtitle Secondary heading text rendered beneath the title. Strings are
 *   wrapped in muted {@link Text}; nodes are rendered as-is.
 * @param header A custom header region rendered to the right of the title block,
 *   useful for actions, badges, or controls.
 * @param footer Content pinned to the bottom of the card, separated from the body.
 * @param divider When true, renders a separating border below the header and
 *   above the footer.
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
  title,
  subtitle,
  header,
  footer,
  divider,
  ...props
}) => {
  const backgroundColor = bgColorMap[background];
  const hasHeader = title != null || subtitle != null || header != null;
  const dividerClass = borderColorClass(BorderColor.Default);

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
      <Stack
        orientation={Orientation.Column}
        spacing={compact ? Spacing.Sm : Spacing.Md}
        className={cn("w-full")}
      >
        {hasHeader && (
          <Stack
            orientation={Orientation.Row}
            justify={Justify.Between}
            align={Align.Start}
            className={cn(
              "w-full",
              divider && "border-b pb-3",
              divider && dividerClass
            )}
          >
            {(title != null || subtitle != null) && (
              <Stack orientation={Orientation.Column} spacing={Spacing.Xs}>
                {title != null &&
                  (typeof title === "string" ? (
                    <Text variant={TextVariant.Lg}>{title}</Text>
                  ) : (
                    title
                  ))}
                {subtitle != null &&
                  (typeof subtitle === "string" ? (
                    <Text color={TextColor.Muted}>{subtitle}</Text>
                  ) : (
                    subtitle
                  ))}
              </Stack>
            )}
            {header != null && <div>{header}</div>}
          </Stack>
        )}
        {children != null && <div className={cn("w-full")}>{children}</div>}
        {footer != null && (
          <div
            className={cn(
              "w-full",
              divider && "border-t pt-3",
              divider && dividerClass
            )}
          >
            {footer}
          </div>
        )}
      </Stack>
    </div>
  );
};

Card.displayName = "Card";
