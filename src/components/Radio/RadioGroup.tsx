import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { FC, HTMLAttributes, useMemo } from "react";

import { Size, Spacing } from "@/types";
import { cn } from "@/util/classes";
import { randomString } from "@/util/random";

import { Radio, RadioProps } from "./Radio";

export interface RadioOption {
  value: string;
  label: string;
  /** A secondary line under the label: what picking this option means. */
  description?: string;
  disabled?: boolean;
  /** Additional HTML properties for this option's row alone */
  fieldProps?: RadioProps["fieldProps"];
}

export type RadioGroupSize = `${Exclude<Size, Size.Xs>}`;

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  className?: string;
  defaultValue?: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  name?: string;
  /** @deprecated Figma draws one radio size; forwarded to {@link Radio}, which ignores it. */
  size?: RadioGroupSize;
  disabled?: boolean;
  radioProps?: RadioProps;
  /**
   * Vertical gap between the options, a {@link Spacing} token. Defaults to
   * `"sm"` when any option has a description, else `"none"`.
   */
  spacing?: Spacing;
}

const spacingStyles: Record<Spacing, string> = {
  [Spacing.None]: "",
  [Spacing.Xs]: "flex flex-col gap-xs",
  [Spacing.Sm]: "flex flex-col gap-sm",
  [Spacing.Md]: "flex flex-col gap-md",
  [Spacing.Lg]: "flex flex-col gap-lg",
  [Spacing.Xl]: "flex flex-col gap-xl",
};

/**
 * A group of radio controls; supports selection via one-of semantics.
 *
 * Controlled via `value` + `onChange`, or uncontrolled with `defaultValue`.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string>("car");
 *
 *   const onChange = useCallback((selectedValue: string) => {
 *       setValue(selectedValue);
 *     },
 *     [setValue]
 *   );
 *
 *   const options: RadioOption[] = useMemo(() => {
 *       return [
 *         {value: "car", label: "Car"},
 *         {value: "truck", label: "Truck"},
 *         {value: "bus", label: "Bus"},
 *       ];
 *     },
 *     []
 *   );
 *
 *   return (
 *     <RadioGroup
 *       value={value}
 *       onChange={onChange}
 *       options={options}
 *     />
 *   );
 * };
 * ```
 *
 * @param options List of {@link RadioOption}s to display. Each option will correspond to a {@link Radio} component;
 *  an option's `description` draws a secondary line under its label.
 * @param value The value of the group.
 * @param defaultValue The default value to use when no selection has been made.
 * @param onChange Callback triggered when the selection value changes.
 * @param name Optional name of the radio group.
 * @param size Deprecated; Figma draws a single radio size, so the wrapped {@link Radio} components ignore it.
 * @param disabled If `true`, disables the radio group.
 * @param className `class` overrides to apply to the radio group.
 * @param radioProps Additional HTML properties to apply to each of the wrapped {@link Radio} components.
 * @param spacing Vertical gap between the options. See {@link Spacing}. Defaults to `"sm"` when an
 *  option has a description, else `"none"`.
 * @param props Additional HTML properties to apply to the component.
 */
export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  defaultValue,
  onChange,
  name,
  size = Size.Sm,
  disabled = false,
  className,
  radioProps,
  spacing,
  ...props
}) => {
  const gap =
    spacing ?? (options.some((o) => o.description) ? Spacing.Sm : Spacing.None);
  const groupName = useMemo(
    () => name || `radio-group-${randomString()}`,
    [name]
  );

  return (
    <HeadlessRadioGroup
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      name={groupName}
      disabled={disabled}
      className={cn(spacingStyles[gap], className)}
      {...props}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          size={size}
          disabled={disabled || option.disabled}
          {...radioProps}
          fieldProps={{
            ...radioProps?.fieldProps,
            ...option.fieldProps,
            className: cn(
              radioProps?.fieldProps?.className,
              option.fieldProps?.className
            ),
          }}
        />
      ))}
    </HeadlessRadioGroup>
  );
};

RadioGroup.displayName = "RadioGroup";
