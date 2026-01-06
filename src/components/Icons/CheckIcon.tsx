import { FC } from "react";

import { IconProps } from "@/components/Icons/types";

export const CheckIcon: FC<IconProps> = ({ className, ...props }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
    {...props}
  >
    <path
      d="M3.52691 5.76093L9.34753 0.25656C9.5284 0.0855199 9.7586 0 10.0381 0C10.3176 0 10.5478 0.0855199 10.7287 0.25656C10.9096 0.4276 11 0.645287 11 0.909621C11 1.17396 10.9096 1.39164 10.7287 1.56268L4.21749 7.72012C4.02018 7.90671 3.78999 8 3.52691 8C3.26383 8 3.03363 7.90671 2.83632 7.72012L0.2713 5.29446C0.0904335 5.12342 0 4.90573 0 4.6414C0 4.37707 0.0904335 4.15938 0.2713 3.98834C0.452167 3.8173 0.682362 3.73178 0.961883 3.73178C1.24141 3.73178 1.4716 3.8173 1.65247 3.98834L3.52691 5.76093Z"
      fill="currentColor"
    />
  </svg>
);

CheckIcon.displayName = "CheckIcon";
