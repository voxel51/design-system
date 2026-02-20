import { Field, Switch as HeadlessSwitch, Label } from "@headlessui/react";
import { ButtonHTMLAttributes, type FC } from "react";

import { UnsetHint } from "@/components/UnsetHint";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

type ModifiedToggleProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "size" | "onChange" | "checked" | "disabled" | "className" | "value"
>;

type ToggleSize = Extract<Size, Size.Sm | Size.Md>;

export interface ToggleProps extends ModifiedToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
  labelClassName?: string;
  showUnsetHint?: boolean;
}

const trackSizeStyles: Record<ToggleSize, string> = {
  [Size.Sm]: cn("w-8 h-4"),
  [Size.Md]: cn("w-9 h-5"),
};

const thumbSizeStyles: Record<ToggleSize, string> = {
  [Size.Sm]: cn("w-3 h-3"),
  [Size.Md]: cn("w-4 h-4"),
};

const textStyles: Record<ToggleSize, string> = {
  [Size.Sm]: TEXT_STYLES[TextVariant.Sm],
  [Size.Md]: TEXT_STYLES[TextVariant.Md],
};

/**
 * Gets the translate styles for the thumb based on the
 * size of the toggle. A-B-C syntax where:
 *  A - The width of the track
 *  B - The width of the thumb
 *  C - padding/gaps on the side
 * @param size - The size of the toggle
 * @returns The translate styles for the thumb
 */
const getThumbTranslateStyles = (size: Size): string => {
  switch (size) {
    case Size.Sm:
      return "group-data-checked:translate-x-[calc(2.3rem-1rem-0.28rem)]";
    case Size.Md:
      return "group-data-checked:translate-x-[calc(2.8rem-1.5rem-0.28rem)]";
    default:
      return "";
  }
};

/**
 * A component supporting a boolean toggle.
 *
 * This component operates exclusively as a controlled component. See `value` and `onChange` for controlled behavior.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [enabled, setEnabled] = useState<boolean>(false);
 *
 *   const onChange = useCallback((status: boolean) => setEnabled(status), [setEnabled]);
 *
 *   return (
 *     <Toggle
 *       checked={enabled}
 *       onChange={onChange}
 *       label="Run with debug enabled"
 *     />
 *   );
 * };
 * ```
 *
 * @param checked If `true`, renders the toggle in the "active" state.
 * @param disabled If `true`, disables the toggle.
 * @param onChange Callback triggered when the toggle value changes.
 * @param size Size of the toggle. See {@link Size}.
 * @param className `class` overrides to apply to the component.
 * @param labelClassName `class` overrides to apply to the toggle's label.
 * @param label Optional label for the toggle.
 * @param showUnsetHint If `true`, displays a hint to the user to initialize the toggle's value.
 * @param props Additional HTML properties to apply to the component.
 */
export const Toggle: FC<ToggleProps> = ({
  checked,
  disabled = false,
  onChange,
  size = Size.Md,
  className,
  labelClassName,
  label,
  showUnsetHint,
  ...props
}) => {
  return (
    <Field className="flex items-center gap-2">
      <HeadlessSwitch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "group",
          "relative",
          "inline-flex",
          "cursor-pointer",
          "items-center",
          bgColorClass(BackgroundColor.CardElevated),
          "border",
          borderColorClass(BorderColor.Default),
          "transition-colors",
          // when hovered
          "hover:bg-[#999999]", // TODO - current scheme doesn't have a light grey
          "focus:outline-none",
          "focus:ring-0",
          "focus-visible:outline-none",
          "focus-visible:ring-0",
          // when disabled
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          // when checked
          "data-checked:bg-action-primary-primary",
          "data-checked:border-action-primary-primary",
          trackSizeStyles[size],
          radiusStyles(Radius.Full), // intentionally require Full radius
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none",
            // center the thumb vertically
            "absolute",
            "top-1/2",
            "-translate-y-1/2",
            "inline-block",
            "rounded-full",
            "bg-content-bg-card-1",
            "group-data-checked:bg-white",
            "shadow-sm",
            "ring-0", // show focus on outside of track
            "transition-transform",
            "translate-x-0.5",
            thumbSizeStyles[size],
            getThumbTranslateStyles(size)
          )}
        />
      </HeadlessSwitch>
      {label && (
        <Label
          className={cn(
            textColorClass(TextColor.Muted),
            textStyles[size],
            "cursor-pointer",
            labelClassName
          )}
        >
          {label}
        </Label>
      )}
      {showUnsetHint && (
        <UnsetHint value={checked} hint={"Click the toggle to set a value"} />
      )}
    </Field>
  );
};

Toggle.displayName = "Toggle";
