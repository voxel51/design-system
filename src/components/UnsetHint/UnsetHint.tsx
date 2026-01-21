import type { FC } from "react";

import { Text, TextProps } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { isNullish } from "@/util/type-check";

export interface UnsetHintProps extends TextProps {
  value?: unknown;
  hint: string;
}

export const UnsetHint: FC<UnsetHintProps> = ({ value, hint, ...props }) => {
  const isUnset = isNullish(value);

  return isUnset ? (
    <Text color={TextColor.Muted} variant={TextVariant.Xxs} {...props}>
      {hint}
    </Text>
  ) : null;
};

UnsetHint.displayName = "UnsetHint";
