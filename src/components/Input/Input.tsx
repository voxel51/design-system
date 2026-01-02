import radiusStyles from "@/styles/radius";
import { Radius, Size } from "@/types";
import { cn } from "@/util/classes";
import { Field, Input as HeadlessInput } from "@headlessui/react";
import { InputHTMLAttributes, type FC } from "react";
import { IconProps } from "../Icons/types";
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
    "w-full",
    "bg-content-background-primary",
    "text-content-text-primary",
    "placeholder:text-content-text-tertiary",
    "transition-colors",
    "border",
    error ? "border-semantic-destructive" : "border-content-border-default",
    !disabled && !error && "hover:border-content-border-hover",
    "focus:outline-none",
    error
      ? "focus:border-semantic-destructive"
      : "focus:border-content-border-focus",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "disabled:border-content-border-disabled",
    radiusStyles(radius),
    sizeStyles[size],
    Icon ? paddingLeftStyles[size] : "pl-3",
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
