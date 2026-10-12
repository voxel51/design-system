import clsx from "clsx";
import type { FC, HTMLAttributes, ReactNode } from "react";

import { Clickable } from "@/components/Clickable";
import { type IconInput, IconWrapper } from "@/components/Icons";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
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
 * @param description Content to display as the description of the component. This is the component's secondary content.
 * @param icon Icon component to display in the component.
 * @param label Content to display as the label of the component. This is the component's primary content.
 * @param onClick Callback triggered when the component is clicked.
 * @param className `class` overrides to apply to the component.
 * @param props Additional HTML properties to apply to the component.
 */
export const RichButton: FC<RichButtonProps> = ({
  active,
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
        // Figma RichButton: 12/16 padding, radius/sm, border/default at rest,
        // border/focus on hover, and Active tints with bg/selected behind a
        // border/active edge (node 708:879). The named group lets hover reach the
        // icon without reacting to a consumer's own `.group` ancestor.
        "group/rich-button",
        "border",
        active
          ? clsx(
              borderColorClass(BorderColor.Active),
              bgColorClass(BackgroundColor.Selected)
            )
          : borderColorClass(BorderColor.Default),
        !active && borderColorClass(BorderColor.Focus, ElementState.Hover),
        "px-4 py-3",
        radiusStyles(Radius.Sm),
        className
      )}
      style={style}
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
                    "group-hover/rich-button:text-content-icon-emphasis"
                  )
            )}
          />
          {label && <Text variant={TextVariant.HeadingSm}>{label}</Text>}
        </span>

        {description && (
          <Text variant={TextVariant.BodyTertiary} color={TextColor.Secondary}>
            {description}
          </Text>
        )}
      </div>
    </div>
  </Clickable>
);

RichButton.displayName = "RichButton";
