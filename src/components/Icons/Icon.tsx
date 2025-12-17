import { IconProps } from "@/components/Icons/types";
import clsx from "clsx";
import type { FC } from "react";

export const Icon: FC<IconProps> = ({ className, children, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      className={clsx(className)}
      {...props}
    >
      {children}
    </svg>
  );
};
