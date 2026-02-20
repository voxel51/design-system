import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { IconColor, TextColor, TextVariant } from "@/types";

export interface TextBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TextColor | IconColor;
}

/**
 * A simple badge-like component for displaying text in an opinionated way.
 *
 * This component is an alias for {@link Text} with {@link TextVariant.Label}.
 *
 * @example
 * ```tsx
 * <TextBadge color={TextColor.Success}>
 *   completed
 * </TextBadge>
 * ```
 *
 * @param color Color of the content. See {@link Color}.
 * @param children Content wrapped by this component.
 * @param props Additional HTML properties to apply to the component.
 */
export const TextBadge: FC<TextBadgeProps> = ({
  color = IconColor.Brand,
  children,
  ...props
}) => (
  <Text color={color} variant={TextVariant.Label} {...props}>
    {children}
  </Text>
);

TextBadge.displayName = "TextBadge";
