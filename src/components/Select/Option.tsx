import type { FC, HTMLAttributes } from "react";
import { ComboboxOption } from "@headlessui/react";
import { Text } from "@/components/Text";
import clsx from "clsx";
import {
  BackgroundColor,
  bgColorClass,
  TextColor,
  textColorClass,
} from "@/types";
import { CheckIcon } from "@/components/Icons/CheckIcon";
import { cn } from "@/util/classes";

export interface OptionProps extends HTMLAttributes<HTMLDivElement> {
  value?: any;
  selected?: boolean;
}

export const Option: FC<OptionProps> = ({
  children,
  className,
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
        "hover:bg-content-bg-card-2"
      )}
    >
      <Text>{children}</Text>
      <span
        className={clsx(
          "size-5 flex items-center",
          textColorClass(TextColor.Secondary)
        )}
      >
        {selected && <CheckIcon />}
      </span>
    </div>
  </ComboboxOption>
);

Option.displayName = "Option";
