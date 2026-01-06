import { Field, Input as HeadlessInput } from "@headlessui/react";
import { type FC, InputHTMLAttributes } from "react";

import { IconProps } from "@/components/Icons/types";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

import { InputIcon } from "./InputIcon";
import { paddingLeftStyles, sizeStyles } from "./styles";

type ModifiedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
>;

export enum InputType {
  Text = "text",
  Email = "email",
  Password = "password",
  Number = "number",
  Tel = "tel",
  Url = "url",
  Search = "search",
}

export interface InputProps extends ModifiedInputProps {
  size?: Size;
  radius?: Radius;
  className?: string;
  type?: InputType;
  error?: boolean;
  icon?: FC<IconProps>;
}

export const inputStyle = ({
  disabled,
  error,
  icon,
  radius = Radius.Sm,
  size = Size.Md,
}: {
  disabled?: boolean;
  error?: boolean;
  icon?: boolean;
  radius?: Radius;
  size?: Size;
}): string =>
  cn(
    "w-full",
    bgColorClass(BackgroundColor.Background),
    textColorClass(TextColor.Primary),
    "placeholder:text-content-text-tertiary",
    "transition-colors",
    "border",
    error
      ? borderColorClass(BorderColor.Error)
      : borderColorClass(BorderColor.Default),
    !disabled &&
      !error &&
      borderColorClass(BorderColor.Hover, ElementState.Hover),
    "focus:outline-none",
    error
      ? borderColorClass(BorderColor.Error, ElementState.Focus)
      : borderColorClass(BorderColor.Focus, ElementState.Focus),
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    radiusStyles(radius),
    sizeStyles[size],
    icon ? paddingLeftStyles[size] : "pl-3"
  );

export const Input: FC<InputProps> = ({
  size = Size.Md,
  radius = Radius.Sm,
  type = InputType.Text,
  className,
  disabled,
  value,
  onChange,
  error,
  icon: Icon,
  ...props
}) => {
  const inputClasses = cn(
    inputStyle({
      disabled,
      error,
      icon: !!Icon,
      radius,
      size,
    }),
    className
  );

  // we track and change styles if the input has a value
  const hasText = Boolean(value && String(value).trim().length > 0);

  return (
    <Field className="flex flex-col gap-1">
      <div className={cn("relative", Icon && "flex items-center")}>
        {Icon && <InputIcon Icon={Icon} size={size} hasText={hasText} />}
        <HeadlessInput
          className={inputClasses}
          disabled={disabled}
          type={type}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    </Field>
  );
};

Input.displayName = "Input";
