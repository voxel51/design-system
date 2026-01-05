import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Descriptor, Radius } from "@/types";
import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import { Option } from "./Option";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import clsx from "clsx";
import { inputStyle } from "@/components/Input";

export interface SelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  disabled?: boolean;
  exclusive?: boolean;
  onChange?: (value: string | string[] | null) => void;
  options?: Descriptor<{ label: string; content?: ReactNode }>[];
  value?: string | string[];
}

export const Select: FC<SelectProps> = ({
  className,
  disabled,
  exclusive,
  onChange,
  options,
  value,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectionState, setSelectionState] = useState<string[]>(() => []);

  useEffect(() => {
    if (value && value.length > 0) {
      setSelectionState([...value]);
    }
  }, [value]);

  const handleChange = useCallback(
    (value: string | string[] | null) => {
      if (value) {
        if (typeof value === "string") {
          setSelectionState([value]);
        } else {
          setSelectionState([...value]);
        }
      }

      onChange?.(value);
    },
    [onChange]
  );

  const getDisplayValue = useCallback(
    (v: string | string[] | null): string =>
      v && v.length > 0
        ? typeof v === "string"
          ? (options?.find((e) => e.id === v)?.data.label ?? "")
          : v
              .map((id) => options?.find((e) => e.id === id)?.data.label)
              .filter((e) => !!e)
              .join(", ")
        : "",
    [options]
  );

  return (
    <div className={className} {...props}>
      <Combobox
        disabled={disabled}
        value={value}
        onChange={handleChange}
        multiple={!exclusive}
      >
        <ComboboxInput
          displayValue={getDisplayValue}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          // We'd normally prefer to use `as={Input}`,
          // but ref forwarding doesn't work here properly in react 18,
          // which causes the dropdown menu to be anchored in the wrong place.
          // Until we switch to react 19,
          // we'll just style this component using the same classes as the `Input` component.
          className={inputStyle({ disabled })}
        />

        <ComboboxOptions
          static={open}
          anchor="bottom"
          className={clsx("mt-1", radiusStyles(Radius.Md))}
        >
          {options?.map((opt) => (
            <Option
              key={opt.id}
              value={opt.id}
              selected={(value ?? selectionState).includes(opt.id)}
            >
              <Text>{opt.data.content ?? opt.data.label}</Text>
            </Option>
          ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

Select.displayName = "Select";
