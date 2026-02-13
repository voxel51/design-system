import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import clsx from "clsx";
import { type FC, InputHTMLAttributes } from "react";

import { Icon } from "@/components/Icons/Icon";
import { UnsetHint } from "@/components/UnsetHint";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  ActionColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  IconName,
  Radius,
  Size,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

type ModifiedCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className"
>;

export interface CheckboxProps extends ModifiedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: Size;
  radius?: Radius;
  className?: string;
  labelClassName?: string;
  showUnsetHint?: boolean;
}

const sizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("w-3 h-3"),
  [Size.Sm]: clsx("w-4 h-4"),
  [Size.Md]: clsx("w-5 h-5"),
  [Size.Lg]: clsx("w-6 h-6"),
};

const checkmarkSizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("checked:after:text-xs"),
  [Size.Sm]: clsx("checked:after:text-sm"),
  [Size.Md]: clsx("checked:after:text-base"),
  [Size.Lg]: clsx("checked:after:text-lg"),
};

/**
 * A basic checkbox component.
 *
 * This component operates exclusively as a controlled component. See `checked` and `onChange` for controls.
 *
 * @param checked `checked` state of the checkbox.
 * @param onChange Change handler for when the checked state changes.
 * @param size Size of the checkbox; this controls both the checkbox itself and the associated label. See {@link Size}.
 * @param radius Border radius of the checkbox; this controls the styling of the checkbox itself. See {@link Radius}.
 * @param className `class` overrides to apply to the checkbox.
 * @param labelClassName `class` overrides for custom styling of the checkbox's label.
 * @param label Label to display alongside the checkbox.
 * @param showUnsetHint If `true`, displays a hint to the user for checkbox interaction.
 * @param props Additional HTML properties to apply to the checkbox.
 */
export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  size = Size.Md,
  radius = Radius.Xs,
  className,
  labelClassName,
  label,
  showUnsetHint,
  ...props
}) => {
  return (
    <Field className="group flex items-center gap-2">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        className={cn(
          "group",
          "relative",
          "cursor-pointer",
          "appearance-none",
          "border",
          borderColorClass(BorderColor.Default),
          "group-hover:border-action-primary-primary",
          radiusStyles(radius),
          sizeStyles[size],
          checkmarkSizeStyles[size],
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          bgColorClass(ActionColor.PrimaryDefault, ElementState.Checked),
          borderColorClass(BorderColor.Active, ElementState.Checked),
          className
        )}
        {...props}
      >
        <Icon
          name={IconName.Check}
          color="var(--color-content-text-primary)"
          className={clsx(
            // scale to the size of the checkbox
            "absolute inset-0 w-full h-full opacity-0 group-data-checked:opacity-100"
          )}
        />
      </HeadlessCheckbox>
      {label && (
        <Label
          className={cn(
            textColorClass(TextColor.Primary),
            TEXT_STYLES[size],
            "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      {showUnsetHint && (
        <UnsetHint value={checked} hint="Click the checkbox to set a value" />
      )}
    </Field>
  );
};

Checkbox.displayName = "Checkbox";
