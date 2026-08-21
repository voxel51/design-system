import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { Input } from "@/components/Input";
import { menuPanelStyles } from "@/components/Menu";
import { Spinner } from "@/components/Spinner";
import { Text } from "@/components/Text";
import { textStyles } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

/** One row in a {@link Combobox}'s list. */
export interface ComboboxOption {
  /** Stable identity. Returned to `onChange`; not shown. */
  id: string;
  /** What the user reads, and what fills the field once picked. */
  label: string;
  /** Optional second line — a definition, a slug, an owner. */
  description?: ReactNode;
}

export interface ComboboxProps {
  /**
   * Rows to offer. Filtering is the CALLER's job: a combobox over a remote
   * collection filters on the server, and one over a local list filters in
   * the parent. Whatever is passed is what renders, in order.
   */
  options: ComboboxOption[];
  /** The picked option, or `null` when nothing is picked. */
  value: ComboboxOption | null;
  /** Text in the field. Controlled, so the caller can drive a query from it. */
  inputValue: string;
  /** Fires on every keystroke with the next field text. */
  onInputChange: (value: string) => void;
  /**
   * Fires when the user picks a row, clears the field, or — with
   * `allowFreeText` — commits text that matches no row (as an option whose
   * `id` and `label` are both that text).
   */
  onChange: (option: ComboboxOption | null) => void;
  /**
   * Accept text that matches no row. Use it when the field's domain is open
   * (an event type the server will accept but this list doesn't know yet);
   * leave it off when only a real row is a valid answer.
   */
  allowFreeText?: boolean;
  /** Shown when the field is empty. */
  placeholder?: string;
  /** Field size. See {@link Size}. Defaults to {@link Size.Md}. */
  size?: Size;
  disabled?: boolean;
  /** Spinner in place of the list while the caller's query is in flight. */
  loading?: boolean;
  /** Shown when there are no options and nothing is loading. */
  emptyMessage?: ReactNode;
  /** `class` overrides for the wrapper. */
  className?: string;
  /** Accessible name for the field. */
  "aria-label"?: string;
}

const optionStyles = (active: boolean): string =>
  cn(
    "flex w-full cursor-pointer flex-col items-start gap-0.5",
    "px-2 py-1.5 text-left",
    "rounded-md",
    active && bgColorClass(BackgroundColor.Selected, ElementState.None)
  );

/**
 * A text field that suggests rows as you type.
 *
 * Use it where a {@link Select} can't reach: the list is long, remote, or
 * unknown until the user types. The caller owns the options and the field
 * text, so the same component serves a local filter and a server-side
 * typeahead — pass `loading` while a query is in flight.
 *
 * Keyboard: ArrowDown / ArrowUp move the highlight (opening the list if
 * closed), Enter picks the highlighted row, Escape closes without picking,
 * and blur commits the text when `allowFreeText` is set.
 *
 * @example
 * ```tsx
 * // Remote typeahead: only a real dataset is a valid answer.
 * const [text, setText] = useState("");
 * const [dataset, setDataset] = useState<ComboboxOption | null>(null);
 * const { data, isLoading } = useDatasetSearch(text);
 *
 * <Combobox
 *   options={data ?? []}
 *   value={dataset}
 *   inputValue={text}
 *   onInputChange={setText}
 *   onChange={setDataset}
 *   loading={isLoading}
 *   placeholder="All datasets"
 *   emptyMessage={text ? "No matching datasets" : "Type to search"}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Open domain: suggestions help, but any string is allowed.
 * <Combobox allowFreeText options={knownTypes} ... />
 * ```
 *
 * @param options Rows to offer, already filtered by the caller.
 * @param value The picked option, or `null`.
 * @param inputValue Controlled field text.
 * @param onInputChange Fires with the next field text.
 * @param onChange Fires when a row is picked, the field is cleared, or free text is committed.
 * @param allowFreeText Accept text that matches no row.
 * @param placeholder Shown when the field is empty.
 * @param size Field size. See {@link Size}.
 * @param disabled If `true`, the field cannot be interacted with.
 * @param loading Show a spinner in place of the list.
 * @param emptyMessage Shown when there are no options.
 * @param className `class` overrides for the wrapper.
 */
export const Combobox: FC<ComboboxProps> = ({
  options,
  value,
  inputValue,
  onInputChange,
  onChange,
  allowFreeText = false,
  placeholder,
  size = Size.Md,
  disabled = false,
  loading = false,
  emptyMessage = "No matches",
  className,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapper = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  // A fresh list means the old highlight index points at a different row.
  useEffect((): void => setActive(0), [options]);

  // Click outside closes without picking. Pointerdown rather than click so a
  // press that starts outside can't first blur-commit and then reopen.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: PointerEvent): void => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return (): void =>
      document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const pick = useCallback(
    (option: ComboboxOption): void => {
      onChange(option);
      onInputChange(option.label);
      setOpen(false);
    },
    [onChange, onInputChange]
  );

  const commitText = useCallback((): void => {
    const text = inputValue.trim();
    if (!allowFreeText) return;
    if (!text) {
      if (value) onChange(null);
      return;
    }
    if (value?.label === text) return;
    onChange({ id: text, label: text });
  }, [allowFreeText, inputValue, onChange, value]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      if (!options.length) return;
      const delta = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + delta + options.length) % options.length);
      return;
    }
    if (e.key === "Enter") {
      const option = open ? options[active] : undefined;
      if (option) {
        e.preventDefault();
        pick(option);
      } else {
        commitText();
        setOpen(false);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <Input
        onKeyDown={onKeyDown}
        size={size}
        disabled={disabled}
        value={inputValue}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={props["aria-label"]}
        onFocus={(): void => setOpen(true)}
        onBlur={commitText}
        onChange={(e): void => {
          onInputChange(e.target.value);
          setOpen(true);
          // Typing past a pick means the pick no longer describes the field.
          if (value && e.target.value !== value.label) onChange(null);
        }}
      />
      {open && (
        <div
          id={listId}
          role="listbox"
          className={cn(
            "absolute top-full left-0 mt-1 w-full",
            "max-h-64 overflow-y-auto",
            menuPanelStyles(),
            "max-w-none",
            zIndexStyles(ZIndex.Medium)
          )}
        >
          {loading && (
            <div className="flex justify-center py-2">
              <Spinner size={Size.Md} />
            </div>
          )}
          {!loading && !options.length && (
            <div className="px-2 py-1.5">
              <Text variant={TextVariant.Sm} color={TextColor.Tertiary}>
                {emptyMessage}
              </Text>
            </div>
          )}
          {!loading &&
            options.map((option, i) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={i === active}
                className={optionStyles(i === active)}
                // The field owns focus; hovering only moves the highlight so
                // pointer and keyboard agree on what Enter would pick.
                onMouseEnter={(): void => setActive(i)}
                // Mousedown, not click: click lands after blur, and blur has
                // already committed or closed by then.
                onMouseDown={(e): void => {
                  e.preventDefault();
                  pick(option);
                }}
              >
                <span
                  className={cn(
                    textStyles(TextVariant.Sm),
                    textColorClass(TextColor.Primary)
                  )}
                >
                  {option.label}
                </span>
                {option.description && (
                  <span
                    className={cn(
                      textStyles(TextVariant.Xs),
                      textColorClass(TextColor.Tertiary)
                    )}
                  >
                    {option.description}
                  </span>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

Combobox.displayName = "Combobox";
