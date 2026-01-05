import clsx from "clsx";
import { FC } from "react";

import { IconProps } from "@/components/Icons/types";

export const CheckmarkIcon: FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg
      className={clsx(
        "stroke-white opacity-0 group-data-checked:opacity-100",
        className
      )}
      viewBox="0 0 14 14"
      fill="none"
      {...props}
    >
      <path
        d="M3 8L6 11L11 3.5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
