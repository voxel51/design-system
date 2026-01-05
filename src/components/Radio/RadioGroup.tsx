import { Stack } from "@/components/Stack";
import { Orientation, Radius, Size, Spacing } from "@/types";
import { randomString } from "@/util/random";
import { FC, HTMLAttributes } from "react";
import { Radio } from "./Radio";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
  orientation?: Orientation;
  spacing?: Spacing;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  name,
  size = Size.Sm,
  radius = Radius.Full,
  disabled = false,
  orientation = Orientation.Column,
  spacing = Spacing.Md,
  className,
  ...props
}) => {
  const groupName = name || `radio-group-${randomString()}`;

  return (
    <Stack
      orientation={orientation}
      spacing={spacing}
      className={className}
      {...props}
    >
      {options.map((option) => (
        <Radio
          key={option.value}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          label={option.label}
          name={groupName}
          size={size}
          radius={radius}
          disabled={disabled || option.disabled}
        />
      ))}
    </Stack>
  );
};

RadioGroup.displayName = "RadioGroup";
