import { Input as HeadlessInput } from "@headlessui/react";
import {
  type ChangeEvent,
  type FC,
  type KeyboardEvent,
  InputHTMLAttributes,
  type MutableRefObject,
  type PointerEvent,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/Button";
import { LockIcon, type IconInput, UnlockIcon } from "@/components/Icons";
import formControlStyles from "@/styles/form-control.module.css";
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
import {
  numberInputStyles,
  paddingLeftStyles,
  paddingStyles,
  sizeStyles,
  toInputSize,
} from "./styles";

type ModifiedInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "className"
>;

export const InputType = {
  Text: "text",
  Email: "email",
  Password: "password",
  Number: "number",
  Tel: "tel",
  Url: "url",
  Search: "search",
} as const;
export type InputType = `${(typeof InputType)[keyof typeof InputType]}`;
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InputType {
  export type Text = typeof InputType.Text;
  export type Email = typeof InputType.Email;
  export type Password = typeof InputType.Password;
  export type Number = typeof InputType.Number;
  export type Tel = typeof InputType.Tel;
  export type Url = typeof InputType.Url;
  export type Search = typeof InputType.Search;
}

/**
 * The set of border radii supported by {@link Input}.
 *
 * The fully-rounded (`"full"`) option is intentionally excluded: a pill-shaped text input
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
  /** No frame: for a field that sits flush in a bar or header. */
  borderless?: boolean;
  /** Ref to the native input element, for a parent that must focus or measure it. */
  inputRef?: Ref<HTMLInputElement>;
  /**
   * For a `"number"` input: press and drag up to raise the value, down to lower
   * it. A press without a drag focuses the field for typing.
   */
  scrub?: boolean;
  /**
   * How far the value moves per pixel dragged when `scrub` is set. Defaults to
   * `step`, or 1. Holding Shift moves ten times as far, Alt a tenth as far.
   */
  scrubStep?: number;
  /** A scrub drag started moving the value. */
  onScrubStart?: () => void;
  /** A scrub drag that moved the value ended. */
  onScrubEnd?: () => void;
}

/** Pixels a press must travel before it scrubs rather than focuses. */
const SCRUB_THRESHOLD = 3;

/** The decimal places that show a value moving in increments of `rate`. */
const decimalsFor = (rate: number): number =>
  Math.min(20, Math.max(0, Math.ceil(-Math.log10(rate) - 1e-9)));

/** The decimal places `value` is written with. */
const decimalsOf = (value: number): number => {
  const [mantissa, exponent] = String(value).split("e");
  const fraction = mantissa.split(".")[1]?.length ?? 0;
  return Math.max(0, fraction - Number(exponent ?? 0));
};

/** A numeric prop as a finite number; `undefined` when unset, empty or not a number. */
const toFiniteNumber = (value: unknown): number | undefined => {
  if (typeof value === "number")
    return Number.isFinite(value) ? value : undefined;
  if (typeof value !== "string") return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Set a native input's value the way typing would, so React's `onChange` runs
 * for controlled and uncontrolled inputs alike.
 */
const setNativeValue = (el: HTMLInputElement, value: string): void => {
  // the prototype's setter, with `el` as receiver: React's own value tracker
  // overrides `value` on the element and would swallow the change
  Reflect.set(HTMLInputElement.prototype, "value", value, el);
  el.dispatchEvent(new Event("input", { bubbles: true }));
};

/**
 * Characters permitted within a telephone (`"tel"`) input.
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
  borderless,
  disabled,
  error,
  icon,
  radius = Radius.Sm,
  size: requestedSize = Size.Md,
  trailingControl,
}: {
  borderless?: boolean;
  disabled?: boolean;
  error?: boolean;
  icon?: boolean;
  radius?: InputRadius;
  size?: Size;
  trailingControl?: boolean;
}): string => {
  const size = toInputSize(requestedSize);
  return cn(
    "w-full",
    // Keep the themed surface color in every state. `bg-transparent` lets the surrounding
    // surface show through; we also pin the autofill background so the browser does not paint a
    // white box over the field while typing / autofilling in dark mode.
    bgColorClass(BackgroundColor.Transparent),
    "autofill:bg-transparent",
    "[&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]",
    textColorClass(TextColor.Primary),
    formControlStyles.control,
    "transition-colors",
    "focus:outline-none",
    // A borderless field sits flush in a bar or header: no frame, and no
    // hover/focus border either — its container carries the affordance
    !borderless && "border",
    !borderless &&
      (error
        ? borderColorClass(BorderColor.Error)
        : borderColorClass(BorderColor.Input)),
    !borderless &&
      !disabled &&
      !error &&
      borderColorClass(BorderColor.InputHover, ElementState.Hover),
    !borderless &&
      (error
        ? borderColorClass(BorderColor.Error, ElementState.Focus)
        : borderColorClass(BorderColor.InputFocus, ElementState.Focus)),
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    !borderless &&
      borderColorClass(BorderColor.Disabled, ElementState.Disabled),
    radiusStyles(radius),
    sizeStyles[size],
    paddingStyles[size],
    // A borderless field has no frame to inset from; its container sets the
    // rhythm, so the text sits close to whatever precedes it
    icon ? paddingLeftStyles[size] : borderless ? "pl-1.5" : undefined,
    trailingControl ? "pr-10" : borderless ? "pr-1.5" : undefined
  );
};

/**
 * A basic input component.
 *
 * `Input` is the raw, standalone form control: it renders only the `input` element (plus an optional
 * prefix icon and, for password fields, a show/hide toggle). It does not render a label, description,
 * or error message. To compose an input with that surrounding form structure, wrap it in a
 * {@link FormField} (e.g. `<FormField control={<Input ... />} label="..." />`). There is no separate
 * `FormInput` component — `FormField` + `Input` is the intended pairing.
 *
 * Works controlled (`value` + `onChange`) or uncontrolled; email validation and the icon state track the typed value either way.
 *
 * Several input {@link InputType}s receive additional behavior:
 * - `"tel"`: non-numeric characters (other than common phone formatting characters)
 *   are blocked at entry.
 * - `"email"`: the value is validated against a basic email pattern and the input is
 *   rendered in an error state when it is non-empty and invalid.
 * - `"password"`: a show/hide toggle button is rendered which switches the rendered
 *   value between obscured and plain text.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string>("");
 *   const [error, setError] = useState<string | null>(null);
 *
 *   const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
 *     const next = event.target.value;
 *     setValue(next);
 *     setError(next.length < 5 ? "Value must be at least 5 characters" : null);
 *   }, []);
 *
 *   return (
 *     <Input size="sm" value={value} onChange={onChange} error={!!error} />
 *   );
 * };
 *
 * // a number field that changes as the pointer drags up or down on it
 * <Input type="number" size="sm" step={0.01} scrub defaultValue={0.5} />
 * ```
 *
 * @param size The size of the input. Defaults to `"md"`. See {@link Size}.
 * @param radius The border radius of the input. The fully-rounded option is not supported. Defaults to `"sm"`. See {@link InputRadius}.
 * @param type The type of the input. This should adhere to the standard HTML `input` types. See {@link InputType}.
 * @param className `class` overrides to apply to the component.
 * @param disabled If `true`, disables the input.
 * @param value The controlled value of the input.
 * @param onChange Callback triggered when the input value changes.
 * @param error If `true`, formats the input to appear in an error state.
 * @param icon Optional icon component to prefix the input's value.
 * @param borderless If `true`, drops the frame so the field sits flush in a bar or header.
 * @param inputRef Ref to the native input element.
 * @param scrub For a `"number"` input, drag up or down on the field to change its value.
 * @param scrubStep How far the value moves per pixel dragged. Defaults to `step`, or 1.
 * @param onScrubStart Callback when a scrub drag starts moving the value.
 * @param onScrubEnd Callback when a scrub drag that moved the value ends.
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
  borderless,
  inputRef: forwardedRef,
  scrub,
  scrubStep,
  onScrubStart,
  onScrubEnd,
  onPointerDown,
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setRefs = (el: HTMLInputElement | null): void => {
    inputRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el);
    else if (forwardedRef)
      (forwardedRef as MutableRefObject<HTMLInputElement | null>).current = el;
  };
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

  // Scrubbing: pressed on a number field, the up/down cursor shows until release
  const [scrubbing, setScrubbing] = useState(false);
  const canScrub =
    Boolean(scrub) && type === InputType.Number && !disabled && !props.readOnly;

  // ends a scrub in progress; `unmounting` skips the state update and focus
  const endScrub = useRef<((unmounting?: boolean) => void) | null>(null);
  useEffect(() => () => endScrub.current?.(true), []);

  const handlePointerDown = (event: PointerEvent<HTMLInputElement>): void => {
    onPointerDown?.(event);

    const el = event.currentTarget;
    if (
      !canScrub ||
      event.defaultPrevented ||
      event.button !== 0 ||
      // a touch drag scrolls the page; touch taps the field to type
      event.pointerType === "touch" ||
      // a focused field is being typed in: a press places the caret
      document.activeElement === el ||
      endScrub.current
    ) {
      return;
    }

    // hold focus back until the press turns out to be a click, not a drag
    event.preventDefault();
    el.setPointerCapture(event.pointerId);

    const step = toFiniteNumber(props.step);
    const snap = step !== undefined && step > 0 ? step : undefined;
    const perPixel = scrubStep ?? snap ?? 1;
    const min = toFiniteNumber(props.min) ?? -Infinity;
    const max = toFiniteNumber(props.max) ?? Infinity;
    // the native step grid starts at `min`
    const base = Number.isFinite(min) ? min : 0;

    const startY = event.clientY;
    let lastY = event.clientY;
    let value = toFiniteNumber(el.value) ?? 0;
    let shown = el.value;
    let moved = false;

    const root = document.documentElement;
    const rootCursor = root.style.cursor;
    root.style.cursor = "ns-resize";
    setScrubbing(true);

    const move = (e: globalThis.PointerEvent): void => {
      if (!moved && Math.abs(startY - e.clientY) < SCRUB_THRESHOLD) {
        return;
      }

      if (!moved) {
        moved = true;
        lastY = e.clientY;
        onScrubStart?.();
        return;
      }

      // a controlled parent may have clamped or rounded the last value:
      // carry on from what it committed
      if (el.value !== shown) {
        value = toFiniteNumber(el.value) ?? value;
      }

      const rate = perPixel * (e.shiftKey ? 10 : e.altKey ? 0.1 : 1);
      // up is more: screen y grows downward
      value = Math.min(max, Math.max(min, value + (lastY - e.clientY) * rate));
      lastY = e.clientY;

      // on the step grid, so the field stays valid; otherwise at the drag's
      // own precision
      const next = snap
        ? Number(
            (base + Math.round((value - base) / snap) * snap).toFixed(
              decimalsOf(snap) + decimalsOf(base)
            )
          )
        : Number(value.toFixed(decimalsFor(rate)));
      const text = String(Math.min(max, Math.max(min, next)));
      if (text !== el.value) {
        setNativeValue(el, text);
      }
      shown = el.value;
    };

    const finish = (unmounting: boolean, focus: boolean): void => {
      endScrub.current = null;
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("lostpointercapture", end);
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      root.style.cursor = rootCursor;

      if (moved) {
        onScrubEnd?.();
      }

      if (!unmounting) {
        setScrubbing(false);
        if (focus) {
          el.focus();
          el.select();
        }
      }
    };

    // released, cancelled, or the capture was lost (the field hidden)
    const end = (e: globalThis.PointerEvent): void =>
      finish(false, !moved && e.type === "pointerup");

    endScrub.current = (unmounting = false) => finish(unmounting, false);

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);
  };

  const inputClasses = cn(
    inputStyle({
      borderless,
      disabled,
      error: hasError,
      icon: !!icon,
      radius,
      size,
      trailingControl: isPassword,
    }),
    type === InputType.Number && numberInputStyles,
    scrubbing && "cursor-ns-resize select-none",
    className
  );

  // we track and change styles if the input has a value
  const hasText = currentValue.trim().length > 0;

  return (
    <div className="flex flex-col gap-1">
      <div className={cn("relative", icon && "flex items-center")}>
        {icon && <InputIcon icon={icon} size={size} hasText={hasText} />}
        <HeadlessInput
          ref={setRefs}
          className={inputClasses}
          disabled={disabled}
          type={renderedType}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
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
    </div>
  );
};

Input.displayName = "Input";
