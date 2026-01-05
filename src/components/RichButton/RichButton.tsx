import type { FC, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/util/classes";
import {
  BorderColor,
  borderColorClass,
  ElementState,
  IconColor,
  Radius,
  TextColor,
  textColorClass,
} from "@/types";
import { Text } from "@/components/Text";
import { Clickable } from "@/components/Clickable";
import clsx from "clsx";
import radiusStyles from "@/styles/radius";

export interface RichButtonProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  description?: ReactNode;
  icon?: FC;
  label?: ReactNode;
  onClick?: () => void;
}

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
