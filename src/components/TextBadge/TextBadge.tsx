import type { FC, HTMLAttributes } from "react";
import { TextColor, TextVariant } from "@/types";
import { Text } from "@/components/Text";

export interface TextBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: TextColor;
}

export const TextBadge: FC<TextBadgeProps> = ({
  color = TextColor.BrandPrimary,
  children,
  ...props
}) => (
  <Text color={color} variant={TextVariant.Label} {...props}>
    {children}
  </Text>
);

TextBadge.displayName = "TextBadge";
