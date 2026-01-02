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
import { Field, Label, Switch as HeadlessSwitch } from "@headlessui/react";
import { ButtonHTMLAttributes, type FC } from "react";
import radiusStyles from "@/styles/radius";

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

export const Toggle: FC<ToggleProps> = ({
  checked = false,
  disabled = false,
  onChange = undefined,
  size = Size.Md,
  className,
  labelClassName,
  label,
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
          // when focused
          "focus:outline-none",
          "focus:ring-1",
          "focus:ring-action-primary-primary",
          "focus:ring-offset-2",
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
    </Field>
  );
};

Toggle.displayName = "Toggle";
