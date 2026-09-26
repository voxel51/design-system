import type { FC } from "react";

import { IconProps } from "@/components/Icons/types";

export const SpinnerIcon: FC<IconProps> = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="42"
      strokeDashoffset="14"
      opacity="0.9"
    />
  </svg>
);

SpinnerIcon.displayName = "SpinnerIcon";
