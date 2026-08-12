import { Field, Input as HeadlessInput } from "@headlessui/react";
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/Button";
import { LockIcon, type IconInput, UnlockIcon } from "@/components/Icons";
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
  Variant,
} from "@/types";
import { cn } from "@/util/classes";

import { InputIcon } from "./InputIcon";
import { numberInputStyles, paddingLeftStyles, sizeStyles } from "./styles";

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

/**
 * The set of border radii supported by {@link Input}.
 *
 * The fully-rounded ({@link Radius.Full}) option is intentionally excluded: a pill-shaped text input
 * is not part of the design spec and produces awkward results with longer values and prefix icons.
 */
export type InputRadius = Exclude<Radius, Radius.Full>;

export interface InputProps extends ModifiedInputProps {
  size?: Size;
  radius?: InputRadius;
  className?: string;
  type?: InputType;
  error?: boolean;
  icon?: IconInput;
}

/**
 * Characters permitted within a telephone ({@link InputType.Tel}) input.
 *
 * Allows digits plus the common formatting characters: `+`, `-`, `(`, `)`, and spaces.
 */
const TEL_ALLOWED_CHARACTER = /^[0-9+\-() ]$/;

/**
 * A reasonably strict email validation pattern. This is deliberately simple (it does not attempt to
 * implement the full RFC 5322 grammar) but is sufficient to surface obviously-invalid addresses.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * A utility function which returns the classes required for styling an input component.
 *
 * @param disabled If `true`, applies styling for a disabled input.
 * @param error If `true`, applies styling for the input error state.
 * @param icon If `true`, prefixes input content with padding to allow space for an icon.
 * @param radius Border radius of the input. See {@link InputRadius}.
 * @param size Size of the input; this controls the text size and padding. See {@link Size}.
 * @param trailingControl If `true`, reserves padding on the right for a trailing control (e.g. the
 *  password show/hide toggle).
 *
 * @internal For consistent application of input styling of native `input` elements.
 */
export const inputStyle = ({
  disabled,
  error,
  icon,
  radius = Radius.Sm,
  size = Size.Md,
  trailingControl,
}: {
  disabled?: boolean;
  error?: boolean;
  icon?: boolean;
  radius?: InputRadius;
  size?: Size;
  trailingControl?: boolean;
}): string =>
  cn(
    "w-full",
    // Keep the themed surface color in every state. `bg-transparent` lets the surrounding
    // surface show through; we also pin the autofill background so the browser does not paint a
    // white box over the field while typing / autofilling in dark mode.
    bgColorClass(BackgroundColor.Transparent),
    "autofill:bg-transparent",
    "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
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
    icon ? paddingLeftStyles[size] : "pl-3",
    trailingControl ? "pr-10" : "pr-3"
  );

/**
 * A basic input component.
 *
 * `Input` is the raw, standalone form control: it renders only the `input` element (plus an optional
 * prefix icon and, for password fields, a show/hide toggle). It does not render a label, description,
 * or error message. To compose an input with that surrounding form structure, wrap it in a
 * {@link FormField} (e.g. `<FormField control={<Input ... />} label="..." />`). There is no separate
 * `FormInput` component — `FormField` + `Input` is the intended pairing.
 *
 * This component operates exclusively as a controlled component. See `value` and `onChange` for controlled behavior.
 *
 * Several input {@link InputType}s receive additional behavior:
 * - {@link InputType.Tel}: non-numeric characters (other than common phone formatting characters)
 *   are blocked at entry.
 * - {@link InputType.Email}: the value is validated against a basic email pattern and the input is
 *   rendered in an error state when it is non-empty and invalid.
 * - {@link InputType.Password}: a show/hide toggle button is rendered which switches the rendered
 *   value between obscured and plain text.
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
 * @param radius The border radius of the input. The fully-rounded option is not supported. See {@link InputRadius}.
 * @param type The type of the input. This should adhere to the standard HTML `input` types. See {@link InputType}.
 * @param className `class` overrides to apply to the component.
 * @param disabled If `true`, disables the input.
 * @param value The controlled value of the input.
 * @param onChange Callback triggered when the input value changes.
 * @param error If `true`, formats the input to appear in an error state.
 * @param icon Optional icon component to prefix the input's value.
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
  onKeyDown,
  error,
  icon,
  ...props
}) => {
  // Password fields toggle their rendered type between "password" and "text".
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === InputType.Password;

  // Track the current value so validation / filled-state work whether the input is controlled
  // (via `value`) or uncontrolled (typed directly, no `value` prop).
  const [internalValue, setInternalValue] = useState(
    value != null ? String(value) : ""
  );
  const currentValue = value != null ? String(value) : internalValue;

  // Validate email values; surface an error state when the value is present but malformed.
  const emailInvalid =
    type === InputType.Email &&
    currentValue.trim().length > 0 &&
    !EMAIL_PATTERN.test(currentValue.trim());

  const hasError = Boolean(error) || emailInvalid;

  // Headless UI's <Input> does not forward `aria-invalid`, so set it directly
  // on the DOM node to keep the error state announced to assistive tech.
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (hasError) {
      el.setAttribute("aria-invalid", "true");
    } else {
      el.removeAttribute("aria-invalid");
    }
  }, [hasError]);

  // The native input type to render. Password fields swap to "text" while revealed.
  const renderedType = isPassword && showPassword ? InputType.Text : type;

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (type === InputType.Tel) {
      // Allow control / navigation keys (anything longer than a single character, e.g. "Backspace",
      // "ArrowLeft", "Tab") as well as shortcut combinations.
      const isSingleCharacter = event.key.length === 1;
      const isModified = event.ctrlKey || event.metaKey || event.altKey;

      if (
        isSingleCharacter &&
        !isModified &&
        !TEL_ALLOWED_CHARACTER.test(event.key)
      ) {
        event.preventDefault();
      }
    }

    onKeyDown?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (type === InputType.Tel) {
      // Strip any disallowed characters that slipped through (e.g. paste).
      event.target.value = event.target.value.replace(/[^0-9+\-() ]/g, "");
    }

    setInternalValue(event.target.value);
    onChange?.(event);
  };

  const inputClasses = cn(
    inputStyle({
      disabled,
      error: hasError,
      icon: !!icon,
      radius,
      size,
      trailingControl: isPassword,
    }),
    type === InputType.Number && numberInputStyles,
    className
  );

  // we track and change styles if the input has a value
  const hasText = currentValue.trim().length > 0;

  return (
    <Field className="flex flex-col gap-1">
      <div className={cn("relative", icon && "flex items-center")}>
        {icon && <InputIcon icon={icon} size={size} hasText={hasText} />}
        <HeadlessInput
          ref={inputRef}
          className={inputClasses}
          disabled={disabled}
          type={renderedType}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          {...props}
        />
        {isPassword && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              type="button"
              variant={Variant.Icon}
              size={Size.Sm}
              disabled={disabled}
              // tight padding so the toggle fits inside the field — the Icon
              // variant and size each add padding, which together made an
              // oversized square with a too-large hover background
              className="p-1.5"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              // TODO: replace with a dedicated eye / eye-off icon pair once added to the icon set.
              leadingIcon={showPassword ? UnlockIcon : LockIcon}
              onClick={() => setShowPassword((shown) => !shown)}
            />
          </span>
        )}
      </div>
    </Field>
  );
};

Input.displayName = "Input";
