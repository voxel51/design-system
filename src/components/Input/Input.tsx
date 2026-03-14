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
  IconName,
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
  icon?: FC<IconProps> | IconName;
}

/**
 * A utility function which returns the classes required for styling an input component.
 *
 * @param disabled If `true`, applies styling for a disabled input.
 * @param error If `true`, applies styling for the input error state.
 * @param icon If `true`, prefixes input content with padding to allow space for an icon.
 * @param radius Border radius of the input. See {@link Radius}.
 * @param size Size of the input; this controls the text size and padding. See {@link Size}.
 *
 * @internal For consistent application of input styling of native `input` elements.
 */
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
    bgColorClass(BackgroundColor.Transparent),
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

/**
 * A basic input component.
 *
 * This component operates exclusively as a controlled component. See `value` and `onChange` for controlled behavior.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string>("");
 *   const [error, setError] = useState<string | null>(null);
 *
 *   const onChange = useCallback((newValue: string) => {
 *       setValue(newValue);
 *       if (newValue.length < 5) {
 *         setError("Value must be at least 5 characters");
 *       } else {
 *         setError(null);
 *       }
 *     },
 *     [setError, setValue]
 *   );
 *
 *   return (
 *     <Input value={value} onChange={onChange} error={!!error} />
 *   );
 * };
 * ```
 *
 * @param size The size of the input. See {@link Size}.
 * @param radius The border radius of the input. See {@link Radius}.
 * @param type The type of the input. This should adhere to the standard HTML `input` types.
 * @param className `class` overrides to apply to the component.
 * @param disabled If `true`, disables the input.
 * @param value The controlled value of the input.
 * @param onChange Callback triggered when the input value changes.
 * @param error If `true`, formats the input to appear in an error state.
 * @param icon Optional reference ({@link FC}) to an icon or an {@link IconName} to prefix the input's value. See {@link Icon}.
 * @param props Additional HTML properties to apply to the component.
 */
export const Input: FC<InputProps> = ({
  size = Size.Md,
  radius = Radius.Sm,
  type = InputType.Text,
  className,
  disabled,
  value,
  onChange,
  error,
  icon,
  ...props
}) => {
  const inputClasses = cn(
    inputStyle({
      disabled,
      error,
      icon: !!icon,
      radius,
      size,
    }),
    className
  );

  // we track and change styles if the input has a value
  const hasText = Boolean(value && String(value).trim().length > 0);

  return (
    <Field className="flex flex-col gap-1">
      <div className={cn("relative", icon && "flex items-center")}>
        {icon && <InputIcon Icon={icon} size={size} hasText={hasText} />}
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
