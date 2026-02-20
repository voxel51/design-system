import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import clsx from "clsx";
import {
  FC,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
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

/**
 * A select/combobox component which supports single/multi-selection and typeahead filtering.
 *
 * This component operates as both a controlled and uncontrolled component.
 * See `value` and `onChange` for controlled behavior.
 *
 * @example
 * ```tsx
 * // Single selection
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string | null>(null);
 *
 *   const onChange = useCallback((selected: string) => setValue(selected), [setSelected]);
 *
 *   const options: Descriptor<{label: string, content: ReactNode}>[] = useMemo(() => [
 *       {id: "id-a", data: {label: "A", content: "Option A"}},
 *       {id: "id-b", data: {label: "B", content: "Option B"}},
 *       {id: "id-c", data: {label: "C", content: "Option C"}},
 *     ],
 *     []
 *   );
 *
 *   return (
 *     <Select
 *       exclusive={true}
 *       value={value}
 *       onChange={onChange}
 *       options={options}
 *     />
 *   );
 * };
 * ```
 *
 * @example
 * ```tsx
 * // Multiple selection
 * const MyComponent = () => {
 *   const [value, setValue] = useState<string[]>(() => []);
 *
 *   const onChange = useCallback((selected: string[]) => setValue(selected), [setSelected]);
 *
 *   const options: Descriptor<{label: string, content: ReactNode}>[] = useMemo(() => [
 *       {id: "id-a", data: {label: "A", content: "Option A"}},
 *       {id: "id-b", data: {label: "B", content: "Option B"}},
 *       {id: "id-c", data: {label: "C", content: "Option C"}},
 *     ],
 *     []
 *   );
 *
 *   return (
 *     <Select
 *       value={value}
 *       onChange={onChange}
 *       options={options}
 *     />
 *   );
 * };
 * ```
 *
 * @param anchor Relative position to place the dropdown menu when focusing the component. See {@link SelectAnchor}.
 * @param className `class` overrides to apply to the component.
 * @param disabled If `true`, disables the component.
 * @param exclusive If `true`, allows only a single element to be selected;
 *  otherwise, multiple items can be selected concurrently.
 * @param onChange Callback triggered when selection state changes.
 *  The callback includes a list of selected option values.
 * @param options List of component descriptors which will be used to create {@link Option} child components.
 * @param portal If `true`, ensures a large z-index to supported layered components.
 * @param value List of values for selected options; this property allows for controlled selection.
 * @param props Additional HTML properties to apply to the component.
 */
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
  const [query, setQuery] = useState("");
  const [selectionState, setSelectionState] = useState<string[]>(() => []);

  const filteredOptions = useMemo(
    () =>
      query
        ? options?.filter((opt) =>
            opt.data.label.trim().toLowerCase().includes(query.toLowerCase())
          )
        : options,
    [options, query]
  );

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

      setQuery("");
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
    <div className={clsx(className, "w-full")} {...props}>
      <Combobox
        disabled={disabled}
        value={value}
        onChange={handleChange}
        multiple={!exclusive}
        immediate
        onClose={() => setQuery("")}
      >
        <ComboboxInput
          autoComplete="off" // interferes with dropdown menu
          displayValue={getDisplayValue}
          onChange={(e) => setQuery(e.target.value)}
          // We'd normally prefer to use `as={Input}`,
          // but ref forwarding doesn't work here properly in react 18,
          // which causes the dropdown menu to be anchored in the wrong place.
          // Until we switch to react 19,
          // we'll just style this component using the same classes as the `Input` component.
          className={clsx(inputStyle({ disabled }), "w-full")}
        />

        <ComboboxOptions
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
          {filteredOptions?.map((opt) => {
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
