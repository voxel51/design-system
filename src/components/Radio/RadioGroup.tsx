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

export type RadioGroupSize = Exclude<Size, Size.Xs>;

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  className?: string;
  defaultValue?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  size?: RadioGroupSize;
  disabled?: boolean;
  radioProps?: RadioProps;
}

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
