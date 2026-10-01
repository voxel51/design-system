import { Field, Switch as HeadlessSwitch, Label } from "@headlessui/react";
import { ButtonHTMLAttributes, type FC } from "react";

import { UnsetHint } from "@/components/UnsetHint";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  InteractiveColor,
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

type ToggleSize = `${Extract<Size, Size.Sm | Size.Md>}`;

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
  // Figma ToggleSwitch: 29×16 Small, 37×20 Medium.
  [Size.Sm]: "w-[29px] h-4",
  [Size.Md]: "w-[37px] h-5",
};

const thumbSizeStyles: Record<ToggleSize, string> = {
  [Size.Sm]: "size-[13px]",
  [Size.Md]: "size-[17px]",
};

const textStyles: Record<ToggleSize, string> = {
  [Size.Sm]: TEXT_STYLES[TextVariant.BodyTertiary],
  [Size.Md]: TEXT_STYLES[TextVariant.BodySecondary],
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
      return "group-data-checked:translate-x-[14.5px]";
    case Size.Md:
      return "group-data-checked:translate-x-[18.5px]";
    default:
      return "";
  }
};

/**
 * A component supporting a boolean toggle.
 *
 * This component operates exclusively as a controlled component. See `checked` and `onChange` for controlled behavior.
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
 * @param size Size of the toggle: `"sm"` or `"md"`. Defaults to `"md"`.
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
          "peer",
          "relative",
          "inline-flex",
          "cursor-pointer",
          "items-center",
          bgColorClass(BackgroundColor.CardElevated),
          // Figma: the track has no edge and no hover change
          "transition-colors",
          "focus:outline-none",
          "focus:ring-0",
          "focus-visible:outline-none",
          "focus-visible:ring-0",
          // when disabled
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          "disabled:pointer-events-none",
          // when checked
          bgColorClass(InteractiveColor.PrimaryDefault, ElementState.Checked),
          "data-checked:hover:bg-content-interactive-primary-pressed",
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
            // Figma: off-state thumb is dark (#18191A); turns white when active
            bgColorClass(BackgroundColor.Background),
            "group-data-checked:bg-white",
            "ring-0", // show focus on outside of track
            "transition-transform",
            "translate-x-[1.5px]",
            thumbSizeStyles[size],
            getThumbTranslateStyles(size)
          )}
        />
      </HeadlessSwitch>
      {label && (
        <Label
          className={cn(
            textColorClass(TextColor.Secondary),
            "peer-data-disabled:text-content-text-tertiary",
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
