import type { FC, HTMLAttributes } from "react";

import { Text } from "@/components/Text";
import { IconColor, TextColor, TextVariant } from "@/types";

export interface TextBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TextColor | IconColor;
}

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
