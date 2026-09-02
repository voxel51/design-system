import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size as floatingSize,
  useFloating,
} from "@floating-ui/react";
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
  /**
   * Render the list in a portal, anchored to the field with floating UI, so
   * it escapes overflow-hidden ancestors — the treatment `Select` and
   * `Dropdown` give their panels. Defaults to `false`: in a plain form the
   * list can live in the flow.
   * @default false
   */
  portal?: boolean;
  /** Explicit z-index for the list. A portaled list defaults to above-modal. */
  zIndex?: ZIndex;
  /**
   * Commit free text when the field loses focus. Defaults to `true`. Turn it
   * off where committing is an action — a search box runs its query on
   * Enter, not because the user clicked elsewhere.
   * @default true
   */
  commitOnBlur?: boolean;
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
 * @param portal Render the list in a portal, anchored to the field.
 * @param zIndex Explicit z-index for the list.
 * @param commitOnBlur Commit free text on blur (default `true`).
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
  portal = false,
  zIndex,
  commitOnBlur = true,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  // `null` = nothing highlighted yet. The distinction matters for Enter: with
  // an untouched empty field it means "no filter", but once the user has
  // arrowed onto a row it means that row.
  const [active, setActive] = useState<number | null>(null);
  const wrapper = useRef<HTMLDivElement | null>(null);
  const listId = useId();

  // Only a portaled list is positioned by floating UI; in the flow the list
  // sits under the field as a plain absolute child.
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    open: open && portal,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const setWrapper = useCallback(
    (node: HTMLDivElement | null): void => {
      wrapper.current = node;
      refs.setReference(node);
    },
    [refs]
  );

  // A fresh list means the old highlight index points at a different row.
  useEffect((): void => setActive(null), [options]);

  const close = useCallback((): void => {
    setOpen(false);
    // Hovering a row sets the highlight; if it survived the close, the next
    // Enter would pick a row the user can no longer see.
    setActive(null);
  }, []);

  // Click outside closes without picking. Pointerdown rather than click so a
  // press that starts outside can't first blur-commit and then reopen.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: PointerEvent): void => {
      const target = e.target as Node;
      if (wrapper.current?.contains(target)) return;
      // A portaled list is not a DOM child of the wrapper
      if (refs.floating.current?.contains(target)) return;
      close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return (): void =>
      document.removeEventListener("pointerdown", onPointerDown);
  }, [close, open, refs.floating]);

  const pick = useCallback(
    (option: ComboboxOption): void => {
      onChange(option);
      onInputChange(option.label);
      close();
    },
    [close, onChange, onInputChange]
  );

  const commitText = useCallback((): void => {
    const text = inputValue.trim();
    // Emptying the field clears the selection whether or not free text is
    // allowed: "" is a valid answer for every combobox — it means no filter.
    if (!text) {
      if (value) onChange(null);
      return;
    }
    if (!allowFreeText) return;
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
      setActive((i) =>
        i === null
          ? delta === 1
            ? 0
            : options.length - 1
          : (i + delta + options.length) % options.length
      );
      return;
    }
    if (e.key === "Enter") {
      // An empty field means "no filter", so Enter must clear rather than
      // take whatever the list happens to be highlighting. Without this,
      // emptying the field and confirming re-applies the first suggestion —
      // the field reads as cleared while the caller still filters by it.
      if (!inputValue.trim() && active === null) {
        e.preventDefault();
        if (value) onChange(null);
        close();
        return;
      }
      const option = open && active !== null ? options[active] : undefined;
      if (option) {
        e.preventDefault();
        pick(option);
      } else {
        commitText();
        close();
      }
      return;
    }
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <div ref={setWrapper} className={cn("relative", className)}>
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
        onBlur={commitOnBlur ? commitText : undefined}
        onChange={(e): void => {
          onInputChange(e.target.value);
          setOpen(true);
          // Typing invalidates whatever was highlighted.
          setActive(null);
          // Typing past a pick means the pick no longer describes the field.
          if (value && e.target.value !== value.label) onChange(null);
        }}
      />
      {open && (
        <ListPortal portal={portal}>
          <div
            id={listId}
            role="listbox"
            ref={portal ? refs.setFloating : undefined}
            style={portal ? floatingStyles : undefined}
            className={cn(
              portal ? undefined : "absolute top-full left-0 mt-1 w-full",
              "max-h-64 overflow-y-auto",
              menuPanelStyles(),
              "max-w-none",
              zIndexStyles(
                zIndex ?? (portal ? ZIndex.AboveModal : ZIndex.Medium)
              )
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
        </ListPortal>
      )}
    </div>
  );
};

/** The list in the flow, or in a floating UI portal. */
const ListPortal: FC<{ portal: boolean; children: ReactNode }> = ({
  portal,
  children,
}) => (portal ? <FloatingPortal>{children}</FloatingPortal> : <>{children}</>);

Combobox.displayName = "Combobox";
