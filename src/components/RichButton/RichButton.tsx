import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Clickable } from "@/components/Clickable";
import { type IconInput, IconWrapper } from "@/components/Icons";
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
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

export interface RichButtonProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  disabled?: boolean;
  description?: ReactNode;
  icon?: IconInput;
  label?: ReactNode;
  onClick?: () => void;
}

/**
 * A component which supports a toggled "active" state with rich content.
 *
 * This component operates exclusively as a controlled component. See `active` and `onClick` for controlled behavior.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [active, setActive] = useState<boolean>(false);
 *
 *   const onClick = useCallback(() => setActive(prev => !prev), [setActive]);
 *
 *   return (
 *     <RichButton
 *       active={active}
 *       icon={DetectionIcon}
 *       label="Detection"
 *       description="Create a new detection"
 *       onClick={onClick}
 *     />
 *   );
 * };
 * ```
 *
 * @param active If `true`, renders the component in its active state.
 * @param disabled If `true`, the button is dimmed and ignores clicks and keys.
 * @param description Content to display as the description of the component. This is the component's secondary content.
 * @param icon Icon component to display in the component.
 * @param label Content to display as the label of the component. This is the component's primary content.
 * @param onClick Callback triggered when the component is clicked.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const RichButton: FC<RichButtonProps> = ({
  active,
  disabled,
  description,
  icon,
  label,
  onClick,
  className,
  style,
  ...props
}) => (
  <Clickable>
    <div
      className={clsx(
        // Lovable RichButton: 10/12 padding, radius/md, border/input at rest,
        // border/hover on hover, and Active as a border/active edge over a
        // light brand tint. The named group lets hover reach the icon without
        // reacting to a consumer's own `.group` ancestor.
        "group/rich-button",
        "border transition-colors",
        active
          ? clsx(
              borderColorClass(BorderColor.Active),
              "bg-content-bg-primary/10"
            )
          : clsx(
              borderColorClass(BorderColor.Input),
              !disabled &&
                borderColorClass(BorderColor.Hover, ElementState.Hover)
            ),
        disabled && "cursor-not-allowed opacity-50",
        "px-3 py-2.5",
        radiusStyles(Radius.Md),
        className
      )}
      style={style}
      onClick={disabled ? undefined : onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!disabled) onClick?.();
        }
      }}
      role="button"
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      <div className="flex flex-col gap-0.5">
        <span className="flex gap-2.5 items-center">
          <IconWrapper
            content={icon}
            size={16}
            className={cn(
              "flex shrink-0",
              // icon/default at rest, icon/emphasis on hover and when active.
              active
                ? textColorClass(IconColor.Emphasis)
                : clsx(
                    textColorClass(IconColor.Default),
                    !disabled &&
                      "group-hover/rich-button:text-content-icon-emphasis"
                  )
            )}
          />
          {label && (
            <Text
              variant={TextVariant.BodyPrimary}
              color={active ? TextColor.Accent : TextColor.Primary}
            >
              {label}
            </Text>
          )}
        </span>

        {description && (
          <Text variant={TextVariant.BodySecondary} color={TextColor.Secondary}>
            {description}
          </Text>
        )}
      </div>
    </div>
  </Clickable>
);

RichButton.displayName = "RichButton";
