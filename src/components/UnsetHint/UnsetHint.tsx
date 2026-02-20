import type { FC } from "react";

import { Text, TextProps } from "@/components/Text";
import { TextColor, TextVariant } from "@/types";
import { isNullish } from "@/util/type-check";

export interface UnsetHintProps extends TextProps {
  value?: unknown;
  hint: string;
}

/**
 * A basic hint to display to the user.
 *
 * This is an alias for {@link Text} with {@link TextVariant.Xxs}.
 *
 * @param value A value used to determine whether to display the hint.
 *  If this value is nullish, then the hint is shown.
 *  See {@link isNullish}.
 * @param hint The hint to display when `value` is nullish.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by VOODO form controls.
 */
export const UnsetHint: FC<UnsetHintProps> = ({ value, hint, ...props }) => {
  const isUnset = isNullish(value);

  return isUnset ? (
    <Text color={TextColor.Muted} variant={TextVariant.Xxs} {...props}>
      {hint}
    </Text>
  ) : null;
};

UnsetHint.displayName = "UnsetHint";
