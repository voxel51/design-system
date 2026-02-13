import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Clickable } from "@/components/Clickable";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BorderColor,
  borderColorClass,
  ElementState,
  IconColor,
  Radius,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface RichButtonProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  description?: ReactNode;
  icon?: FC;
  label?: ReactNode;
  onClick?: () => void;
}

/**
 * A component which supports a toggled "active" state with rich content.
 *
 * This component operates exclusively as a controlled component. See `active` and `onClick` for controlled behavior.
 *
 * @param active If `true`, renders the component in its active state.
 * @param description Content to display as the description of the component. This is the component's secondary content.
 * @param icon Icon reference ({@link FC}) to display in the component. See {@link Icon}.
 * @param label Content to display as the label of the component. This is the component's primary content.
 * @param onClick Callback triggered when the component is clicked.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const RichButton: FC<RichButtonProps> = ({
  active,
  description,
  icon: Icon,
  label,
  onClick,
  className,
  ...props
}) => (
  <Clickable>
    <div
      className={clsx(
        "border",
        active
          ? borderColorClass(BorderColor.Active)
          : borderColorClass(BorderColor.Default),
        !active && borderColorClass(BorderColor.Hover, ElementState.Hover),
        "p-3",
        radiusStyles(Radius.Md),
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      role="button"
      tabIndex={0}
      {...props}
    >
      <div className="flex flex-col">
        <span className="flex gap-x-md items-center">
          {Icon && (
            <span
              className={cn(
                "size-5",
                active
                  ? textColorClass(IconColor.Brand)
                  : textColorClass(IconColor.Default)
              )}
            >
              <Icon />
            </span>
          )}
          {label && <Text>{label}</Text>}
        </span>

        {description && <Text color={TextColor.Secondary}>{description}</Text>}
      </div>
    </div>
  </Clickable>
);

RichButton.displayName = "RichButton";
