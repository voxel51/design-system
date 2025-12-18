import radiusStyles from "@/styles/radius";
import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";
import { Field, Input as HeadlessInput } from "@headlessui/react";
import { InputHTMLAttributes, type FC } from "react";
import { IconProps } from "../Icons/types";
import { InputError } from "./InputError";
import { InputIcon } from "./InputIcon";
import { InputLabel } from "./InputLabel";
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
  label?: string;
  labelClassName?: string;
  secondaryLabel?: string;
  secondaryLabelClassName?: string;
  type?: InputType;
  error?: string;
  icon?: FC<IconProps>;
}

export const Input: FC<InputProps> = ({
  size = Size.Md,
  radius = Radius.Sm,
  type = InputType.Text,
  className,
  disabled,
  value,
  onChange,
  label,
  labelClassName,
  secondaryLabel,
  secondaryLabelClassName,
  error,
  icon: Icon,
  ...props
}) => {
  const inputClasses = cn(
    "w-full",
    "bg-content-background-primary",
    "text-content-text-primary",
    "placeholder:text-content-text-tertiary",
    "transition-colors",
    "border",
    error
      ? "border-semantic-destructive"
      : "border-content-border-secondary-primary",
    !disabled && !error && "hover:border-content-border-secondary-secondary",
    "focus:outline-none",
    "focus:ring-2",
    error
      ? "focus:ring-semantic-destructive"
      : "focus:ring-action-secondary-tertiary",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "disabled:border-content-border-secondary-disabled",
    radiusStyles(radius),
    sizeStyles[size],
    Icon ? paddingLeftStyles[size] : "pl-3",
    className
  );

  return (
    <Field className="flex flex-col gap-1">
      <InputLabel
        label={label}
        secondaryLabel={secondaryLabel}
        size={size}
        labelClassName={labelClassName}
        secondaryLabelClassName={secondaryLabelClassName}
      />
      <div className={cn("relative", Icon && "flex items-center")}>
        {Icon && <InputIcon Icon={Icon} size={size} />}
        <HeadlessInput
          className={inputClasses}
          disabled={disabled}
          type={type}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
      {error && <InputError error={error} size={size} />}
    </Field>
  );
};

Input.displayName = "Input";
