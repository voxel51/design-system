import { ComboboxOption } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { CheckIcon } from "@/components/Icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Radius,
  Size,
  BrandColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  value?: unknown;
  selected?: boolean;
}

/**
 * A selectable option.
 *
 * @param children The content to render in the list option.
 * @param selected If `true`, the list option is rendered with a selected state.
 * @param value The value of the list option.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by {@link Select}.
 */
export const Option: FC<OptionProps> = ({
  children,
  selected,
  value,
  ...props
}) => (
  <ComboboxOption value={value} {...props}>
    <div
      className={clsx(
        "flex flex-nowrap items-center justify-between",
        "gap-x-md",
        "py-2 px-3",
        radiusStyles(Radius.Sm),
        cn(
          // Use a single subtle base surface for all rows instead of aggressive
          // alternating backgrounds; selection is conveyed via the dedicated
          // `Selected` surface token plus the accent check icon.
          bgColorClass(BackgroundColor.Card1),
          selected && bgColorClass(BackgroundColor.Selected)
        ),
        bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
      )}
    >
      <Text>{children}</Text>
      <span
        className={clsx(
          "size-5 flex items-center",
          textColorClass(BrandColor.Primary)
        )}
      >
        {selected && <CheckIcon size={Size.Sm} />}
      </span>
    </div>
  </ComboboxOption>
);

Option.displayName = "Option";
