import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { FC, HTMLAttributes, useMemo } from "react";

import { Size } from "@/types";
import { randomString } from "@/util/random";

import { Radio, RadioProps } from "./Radio";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
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
  size?: RadioGroupSize;
  disabled?: boolean;
  radioProps?: RadioProps;
}

/**
 * A group of radio controls; supports selection via one-of semantics.
 *
 * This component operates exclusively as a controlled component. See `value` and `onChange` for controlled behavior.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string | null>(null);
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
 * @param options List of {@link RadioOption}s to display. Each option will correspond to a {@link Radio} component.
 * @param value The value of the group.
 * @param defaultValue The default value to use when no selection has been made.
 * @param onChange Callback triggered when the selection value changes.
 * @param name Optional name of the radio group.
 * @param size The size of the radio group; this property will be forwarded to the wrapped {@link Radio} components.
 *  See {@link Size}.
 * @param disabled If `true`, disables the radio group.
 * @param className `class` overrides to apply to the radio group.
 * @param radioProps Additional HTML properties to apply to each of the wrapped {@link Radio} components.
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
  ...props
}) => {
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
      className={className}
      {...props}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          size={size}
          disabled={disabled || option.disabled}
          {...radioProps}
        />
      ))}
    </HeadlessRadioGroup>
  );
};

RadioGroup.displayName = "RadioGroup";
