import { Button as HeadlessButton } from "@headlessui/react";
import clsx from "clsx";
import { ButtonHTMLAttributes, FC, Fragment } from "react";

import { Icon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  ActionColor,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  IconName,
  Radius,
  Size,
  TextColor,
  textColorClass,
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

type ButtonSize = Exclude<Size, Size.Lg>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: ButtonSize;
  leadingIcon?: FC | IconName;
  trailingIcon?: FC | IconName;
  borderless?: boolean;
}

const variantStyles: Record<Variant, string> = {
  [Variant.Primary]: clsx(
    bgColorClass(ActionColor.PrimaryDefault),
    bgColorClass(ActionColor.PrimaryHover, ElementState.Hover),
    bgColorClass(ActionColor.PrimaryFocus, ElementState.Active)
  ),
  [Variant.Secondary]: clsx(
    "border-1",
    "bg-transparent",
    borderColorClass(BorderColor.Default),
    borderColorClass(BorderColor.Focus, ElementState.Hover), // design calls for focus color on hover
    borderColorClass(BorderColor.Focus, ElementState.Active),
    borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    bgColorClass(ActionColor.SecondaryFocus, ElementState.Active)
  ),
  [Variant.Success]: clsx(
    bgColorClass(ActionColor.SuccessDefault),
    bgColorClass(ActionColor.SuccessHover, ElementState.Hover),
    bgColorClass(ActionColor.SuccessFocus, ElementState.Active)
  ),
  [Variant.Danger]: clsx(
    bgColorClass(ActionColor.DangerDefault),
    bgColorClass(ActionColor.DangerHover, ElementState.Hover),
    bgColorClass(ActionColor.DangerFocus, ElementState.Active)
  ),
  [Variant.Icon]: clsx(
    "px-2.5 py-2.5",
    "bg-transparent",
    bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
  ),
  [Variant.Borderless]: clsx(
    "bg-transparent",
    "border-0",
    bgColorClass(BackgroundColor.CardElevated, ElementState.Hover),
    radiusStyles(Radius.Full)
  ),
};

const variantTextStyles: Record<Variant, string> = {
  [Variant.Primary]: textColorClass(ActionColor.PrimaryText),
  [Variant.Secondary]: textColorClass(ActionColor.SecondaryText),
  [Variant.Success]: textColorClass(ActionColor.SuccessText),
  [Variant.Danger]: textColorClass(ActionColor.DangerText),
  [Variant.Icon]: textColorClass(ActionColor.IconDefault),
  [Variant.Borderless]: clsx(
    textColorClass(TextColor.Secondary),
    textColorClass(ActionColor.PrimaryText, ElementState.Hover)
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("px-2.5 py-0.75", "text-xs/5"),
  [Size.Sm]: clsx("px-3.5 py-1.5", "text-sm/5"),
  [Size.Md]: clsx("px-4 py-2", "text-md/5"),
};

const iconStyles: Record<ButtonSize, string> = {
  [Size.Xs]: clsx("w-4 h-4", "leading-none"),
  [Size.Sm]: clsx("w-4 h-4", "leading-none"),
  [Size.Md]: clsx("w-5 h-5", "leading-none"),
};

/**
 * A basic button component.
 *
 * @example
 * ```tsx
 *   <Button onClick={() => alert("Button clicked")}>
 *     Click me
 *   </Button>
 * ```
 *
 * @param variant The button variant; this controls the general styling of the button. See {@link Variant}.
 * @param size The size of the button; this controls both the text size and the button size. See {@link Size}.
 * @param borderless Boolean controlling whether the button should be "borderless," removing any borders and
 *  rounding the corners.
 * @param leadingIcon Optional reference ({@link FC}) to an icon or an {@link IconName} which prefixes the button's content. See {@link Icon}.
 * @param trailingIcon Optional reference ({@link FC}) to an icon or an {@link IconName} which postfixes the button's content. See {@link Icon}.
 * @param className `class` overrides to apply to the component.
 * @param children Button content.
 * @param props Additional HTML properties to apply to the component.
 */
export const Button: FC<ButtonProps> = ({
  variant = Variant.Primary,
  size = Size.Md,
  borderless = false,
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...props
}) => {
  return (
    <HeadlessButton
      className={cn(
        "inline-flex items-center justify-center",
        borderless && "aspect-square min-w-0 shrink-0", // circular
        borderless ? radiusStyles(Radius.Full) : radiusStyles(Radius.Sm),
        "font-medium",
        "transition-colors",
        "hover:cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        sizeStyles[size],
        variantStyles[variant],
        borderless && "border-0",
        className
      )}
      {...props}
    >
      <div
        className={clsx(
          "flex flex-nowrap items-center justify-center gap-x-sm",
          variantTextStyles[variant]
        )}
      >
        <IconWrapper size={size} content={leadingIcon} />

        {children}

        <IconWrapper size={size} content={trailingIcon} />
      </div>
    </HeadlessButton>
  );
};

/**
 * Helper component which resolves {@link FC} | {@link IconName} | ``undefined`` to an FC.
 *
 * Wraps content in a fixed-sized span to constraint icon bounds.
 *
 * @param content Icon {@link FC}, icon name, or undefined
 * @param size Button size; forwarded to the icon
 */
const IconWrapper: FC<{
  content?: FC | IconName;
  size: ButtonSize;
}> = ({ content, size }) => {
  const Content =
    typeof content === "string"
      ? () => <Icon name={content} size={size} />
      : (content as FC);

  return content ? (
    <span
      className={clsx(iconStyles[size], "flex justify-center items-center")}
    >
      <Content />
    </span>
  ) : (
    <Fragment />
  );
};

Button.displayName = "Button";
