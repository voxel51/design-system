import { Field, Checkbox as HeadlessCheckbox, Label } from "@headlessui/react";
import clsx from "clsx";
import { type FC, InputHTMLAttributes } from "react";

import { CheckIcon, RemoveIcon } from "@/components/Icons";
import { UnsetHint } from "@/components/UnsetHint";
import radiusStyles from "@/styles/radius";
import { CAPTION_SIZE, TEXT_STYLES } from "@/styles/text";
import {
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  InteractiveColor,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

type ModifiedCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange" | "checked" | "disabled" | "className"
>;

export interface CheckboxProps extends ModifiedCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  size?: Size;
  radius?: Radius;
  className?: string;
  labelClassName?: string;
  showUnsetHint?: boolean;
}

const sizeStyles: Record<Size, string> = {
  // Figma Checkbox: 14px Small, 16px Medium, 18px Large.
  [Size.Xs]: "size-3",
  [Size.Sm]: "size-3.5",
  [Size.Md]: "size-4",
  [Size.Lg]: "size-4.5",
  [Size.Xl]: "size-5",
};

// Figma labels: 12/16 at Small, 14/20 at Medium, 15/20 at Large.
// Xs takes the caption size alone: the label sets its own colour below, and the
// full Caption style's tertiary colour would merge it away.
const labelStyles: Record<Size, string> = {
  [Size.Xs]: CAPTION_SIZE,
  [Size.Sm]: TEXT_STYLES[TextVariant.BodyTertiary],
  [Size.Md]: TEXT_STYLES[TextVariant.BodySecondary],
  [Size.Lg]: TEXT_STYLES[TextVariant.BodyPrimary],
  [Size.Xl]: TEXT_STYLES[TextVariant.BodyPrimary],
};

const checkmarkSizeStyles: Record<Size, string> = {
  [Size.Xs]: clsx("checked:after:text-xs"),
  [Size.Sm]: clsx("checked:after:text-sm"),
  [Size.Md]: clsx("checked:after:text-base"),
  [Size.Lg]: clsx("checked:after:text-lg"),
  [Size.Xl]: clsx("checked:after:text-xl"),
};

/**
 * A basic checkbox component.
 *
 * This component operates exclusively as a controlled component. See `checked` and `onChange` for controls.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [checked, setChecked] = useState<boolean>(false);
 *
 *   return (
 *     <Checkbox
 *       checked={checked}
 *       onChange={(newValue: boolean) => setChecked(newValue)}
 *       label={"Create new dataset"}
 *     />
 *   );
 * };
 * ```
 *
 * @param checked `checked` state of the checkbox.
 * @param onChange Change handler for when the checked state changes.
 * @param indeterminate When true (and `checked` is false), renders a dash icon,
 *  indicating partial selection among descendants. Ignored when `checked` is true.
 * @param size Size of the checkbox; this controls both the checkbox itself and the associated label. See {@link Size}.
 * @param radius Border radius of the checkbox; this controls the styling of the checkbox itself. See {@link Radius}.
 * @param className `class` overrides to apply to the checkbox.
 * @param labelClassName `class` overrides for custom styling of the checkbox's label.
 * @param disabled If `true`, disables the checkbox.
 * @param label Label to display alongside the checkbox.
 * @param showUnsetHint If `true`, displays a hint to the user for checkbox interaction.
 * @param props Additional HTML properties to apply to the checkbox.
 */
export const Checkbox: FC<CheckboxProps> = ({
  checked,
  onChange,
  indeterminate,
  size = Size.Md,
  radius = Radius.Sm,
  className,
  labelClassName,
  disabled,
  label,
  showUnsetHint,
  ...props
}) => {
  const showIndeterminate = !!indeterminate && !checked;

  return (
    <Field className="group flex items-center gap-2.5">
      <HeadlessCheckbox
        checked={checked}
        onChange={onChange}
        indeterminate={showIndeterminate}
        disabled={disabled}
        className={cn(
          "group",
          "peer",
          "relative",
          "cursor-pointer",
          "appearance-none",
          "border",
          // Figma: no fill at rest (the icon/emphasis paint is hidden) with an
          // icon/default edge, interactive/primary-default on hover,
          // icon/disabled when disabled.
          "bg-transparent",
          "border-content-icon-default",
          // Only when not disabled: `.group:hover .x` outranks `.x[data-disabled]`.
          !disabled && "group-hover:border-content-interactive-primary-default",
          // Headless renders a span, so only `data-disabled:` applies here.
          "data-disabled:border-content-icon-disabled",
          "data-disabled:cursor-not-allowed",
          radiusStyles(radius),
          sizeStyles[size],
          checkmarkSizeStyles[size],
          bgColorClass(InteractiveColor.PrimaryDefault, ElementState.Checked),
          borderColorClass(BorderColor.Active, ElementState.Checked),
          showIndeterminate &&
            clsx(
              bgColorClass(InteractiveColor.PrimaryDefault),
              borderColorClass(BorderColor.Active)
            ),
          // A checked or indeterminate box keeps a fill when disabled, but in
          // icon/disabled so it reads as disabled rather than as an enabled
          // checked box.
          "data-disabled:data-checked:bg-content-icon-disabled",
          "data-disabled:data-checked:border-content-icon-disabled",
          showIndeterminate &&
            clsx(
              "data-disabled:bg-content-icon-disabled",
              "data-disabled:border-content-icon-disabled"
            ),
          className
        )}
        {...props}
      >
        {showIndeterminate ? (
          <RemoveIcon
            // white mark on the brand-colored fill (fixed in both themes)
            className="absolute inset-0 w-full h-full text-white"
          />
        ) : (
          <CheckIcon
            className={clsx(
              "absolute inset-0 w-full h-full text-white opacity-0 group-data-checked:opacity-100"
            )}
          />
        )}
      </HeadlessCheckbox>
      {label && (
        <Label
          className={cn(
            // Figma: label is white when enabled, tertiary when disabled
            textColorClass(TextColor.Primary),
            "peer-data-disabled:text-content-text-tertiary",
            labelStyles[size],
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
