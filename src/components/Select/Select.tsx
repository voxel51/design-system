import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import clsx from "clsx";
import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

import { inputStyle } from "@/components/Input";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import { Descriptor, Radius, Shadow } from "@/types";

import { Option } from "./Option";


export enum SelectAnchor {
  Bottom = "bottom",
  BottomStart = "bottom start",
  BottomEnd = "bottom end",
  Top = "top",
  TopStart = "top start",
  TopEnd = "top end",
}

export interface SelectProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  anchor?: SelectAnchor;
  disabled?: boolean;
  exclusive?: boolean;
  onChange?: (value: string | string[] | null) => void;
  options?: Descriptor<{ label: string; content?: ReactNode }>[];
  portal?: boolean;
  value?: string | string[];
}

export const Select: FC<SelectProps> = ({
  anchor = SelectAnchor.BottomStart,
  className,
  disabled,
  exclusive,
  onChange,
  options,
  portal,
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

      // Close dropdown after selection in exclusive (single-select) mode
      if (exclusive) {
        setOpen(false);
      }

      onChange?.(value);
    },
    [onChange, exclusive]
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
    <div className={clsx(className, "w-full")} {...props}>
      <Combobox
        disabled={disabled}
        value={value}
        onChange={handleChange}
        multiple={!exclusive}
      >
        <ComboboxInput
          autoComplete="off" // interferes with dropdown menu
          displayValue={getDisplayValue}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          // We'd normally prefer to use `as={Input}`,
          // but ref forwarding doesn't work here properly in react 18,
          // which causes the dropdown menu to be anchored in the wrong place.
          // Until we switch to react 19,
          // we'll just style this component using the same classes as the `Input` component.
          className={clsx(inputStyle({ disabled }), "w-full")}
        />

        <ComboboxOptions
          static={open}
          anchor={anchor}
          portal={portal}
          className={clsx(
            "mt-1",
            "w-[var(--anchor-width)]",
            portal && "z-[var(--z-above-modal)]",
            radiusStyles(Radius.Md),
            shadowStyles(Shadow.Md)
          )}
        >
          {options?.map((opt) => {
            // Support both single-select (string) and multi-select (string[]) modes
            const currentValue = value ?? selectionState;
            const isSelected = Array.isArray(currentValue)
              ? currentValue.includes(opt.id)
              : currentValue === opt.id;
            return (
              <Option
                key={opt.id}
                value={opt.id}
                selected={isSelected}
                className={clsx("cursor-pointer")}
              >
                <Text>{opt.data.content ?? opt.data.label}</Text>
              </Option>
            );
          })}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

Select.displayName = "Select";
