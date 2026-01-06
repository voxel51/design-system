import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

export const Clickable: FC<HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span className={clsx("cursor-pointer", className)} {...props}>
      {children}
    </span>
  );
};

Clickable.displayName = "Clickable";
