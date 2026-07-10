import clsx from "clsx";
import type { FC, HTMLAttributes } from "react";

/**
 * A wrapper component which applies styling to make its children appear clickable to the user.
 *
 * Clickable components have their cursor set to the `pointer` cursor option when hovering.
 *
 * @example
 * ```tsx
 * <Clickable onClick={() => deleteEntry()}}>
 *   <DeleteIcon />
 * </Clickable>
 * ```
 *
 * @param children Content wrapped by this component.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
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
