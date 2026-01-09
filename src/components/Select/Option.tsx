import { ComboboxOption } from "@headlessui/react";
import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Text } from "@/components/Text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  IconName,
  Size,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  value?: unknown;
  selected?: boolean;
}

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
        cn(
          bgColorClass(BackgroundColor.Card1),
          selected && bgColorClass(BackgroundColor.CardElevated)
        ),
        bgColorClass(BackgroundColor.Card2, ElementState.Hover)
      )}
    >
      <Text>{children}</Text>
      <span
        className={clsx(
          "size-5 flex items-center",
          textColorClass(TextColor.Secondary)
        )}
      >
        {selected && <Icon name={IconName.Check} size={Size.Sm} />}
      </span>
    </div>
  </ComboboxOption>
);

Option.displayName = "Option";
