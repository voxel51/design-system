import clsx from "clsx";
import { FC } from "react";

import { IconProps } from "@/components/Icons/types";

/**
 * An icon used to display a selected state of a radio control.
 *
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 *
 * @internal For use by the {@link Radio} component.
 */
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
