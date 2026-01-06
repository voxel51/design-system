import clsx from "clsx";
import { FC } from "react";

import { IconProps } from "@/components/Icons/types";

export const RadioDotIcon: FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg
      className={clsx(
        "fill-action-primary-primary opacity-0 peer-checked:opacity-100",
        className
      )}
      viewBox="0 0 8 8"
      fill="none"
      {...props}
    >
      <circle cx="4" cy="4" r="1" />
    </svg>
  );
};
