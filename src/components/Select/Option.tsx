import { ComboboxOption } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconName,
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
        {selected && <Icon name={IconName.Check} size={Size.Sm} />}
      </span>
    </div>
  </ComboboxOption>
);

Option.displayName = "Option";
