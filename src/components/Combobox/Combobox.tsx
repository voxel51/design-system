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
  useLayoutEffect,
  useRef,
  useState,
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";

import type { IconInput } from "@/components/Icons";
import { Input } from "@/components/Input";
import { MenuSectionTitle, menuPanelStyles } from "@/components/Menu";
import { Spinner } from "@/components/Spinner";
import { Text } from "@/components/Text";
import {
  BackgroundColor,
  bgColorClass,
  ElementState,
  Size,
  TextColor,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { cn } from "@/util/classes";

/** `data-*` attributes a host attaches to a part — a test id, a tracking hook. */
export type DataAttributes = Record<`data-${string}`, string | undefined>;

/** One row in a {@link Combobox}'s list. */
export interface ComboboxOption {
  /** Stable identity. Returned to `onChange`; not shown. */
  id: string;
  /** What the user reads, and what fills the field once picked. */
  label: string;
  /** Optional second line — a definition, a slug, an owner. */
  description?: ReactNode;
  /**
   * The section the row belongs to. A titled section starts wherever the
   * group changes, so pass the rows ordered by group.
   */
  group?: string;
  /** `data-*` attributes for the row — a test id, a tracking hook. */
  [dataAttribute: `data-${string}`]: string | undefined;
}

export interface ComboboxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "children"
> {
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
  /** Field size. See {@link Size}. Defaults to `"md"`. */
  size?: Size;
  disabled?: boolean;
  /** Spinner in place of the list while the caller's query is in flight. */
  loading?: boolean;
  /**
   * Shown when there are no options and nothing is loading. Pass `null` to
   * show no list at all in that case — for a field whose suggestions are a
   * convenience, not the point. A function receives `close`, so an action
   * offered in the empty state ("Create one…") can dismiss the list.
   */
  emptyMessage?: ReactNode | ((props: { close: () => void }) => ReactNode);
  /** Attributes for the field itself — a test id, a name. */
  inputProps?: HTMLAttributes<HTMLInputElement> & DataAttributes;
  /** Shown above the list's contents whenever the list is open — a notice. */
  header?: ReactNode;
  /** Attributes for the list — a test id. */
  listProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
  /** Fires when the list opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /**
   * Render the list in a portal, anchored to the field with floating UI, so
   * it escapes overflow-hidden ancestors — the treatment `Select` and
   * `Dropdown` give their panels. Defaults to `false`: in a plain form the
   * list can live in the flow.
   * @default false
   */
  portal?: boolean;
  /**
   * With `portal`, the element the list drops under and takes its width
   * from, instead of the field — for a field inside a larger frame, such as
   * a search bar, whose list spans the frame.
   */
  anchor?: RefObject<HTMLElement | null>;
  /**
   * The list always shows, in the flow under the field, with no frame of its
   * own — for a picker inside a popover, like a command palette. Escape and
   * picking still report `onOpenChange(false)`, so the host can close.
   */
  inline?: boolean;
  /** Explicit z-index for the list. A portaled list defaults to above-modal. */
  zIndex?: ZIndex;
  /**
   * Commit free text when the field loses focus. Defaults to `true`. Turn it
   * off where committing is an action — a search box runs its query on
   * Enter, not because the user clicked elsewhere.
   * @default true
   */
  commitOnBlur?: boolean;
  /** No frame on the field: for a combobox that sits flush in a bar. */
  borderless?: boolean;
  /** A leading icon in the field, saying what the field is for. */
  icon?: IconInput;
  /** Focus the field on mount — for a combobox that opens on demand. */
  focusOnMount?: boolean;
  /**
   * Highlight the first row whenever there is text, so Enter takes the top
   * match without an arrow key first. Off by default: with it off, Enter on
   * unmatched text commits free text (or nothing), never a row the user
   * has not pointed at.
   * @default false
   */
  autoHighlight?: boolean;
}

// An inline list sits on its popover's surface, so its highlight is the
// card one step up rather than the selection tint
const optionStyles = (active: boolean, inline: boolean): string =>
  cn(
    "flex w-full cursor-pointer flex-col items-start gap-0.5",
    "px-2 py-1.5 text-left",
    "rounded-md",
    active &&
      bgColorClass(
        inline ? BackgroundColor.Card : BackgroundColor.Selected,
        ElementState.None
      )
  );

/** The data-* attributes an option carries, for the row that renders it. */
const dataAttributes = (
  option: ComboboxOption
): Record<string, string | undefined> =>
  Object.fromEntries(
    Object.entries(option).filter(([key]) => key.startsWith("data-"))
  );

/** The list in the flow, or in a floating UI portal. */
const ListPortal: FC<{ portal: boolean; children: ReactNode }> = ({
  portal,
  children,
}) => (portal ? <FloatingPortal>{children}</FloatingPortal> : <>{children}</>);

ListPortal.displayName = "ListPortal";

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
 * and blur commits the text when `allowFreeText` is set (unless `commitOnBlur` is `false`).
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
 * <Combobox allowFreeText options={knownTypes} value={type} inputValue={text} onInputChange={setText} onChange={setType} />
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
 * @param emptyMessage Shown when there are no options; a function receives `close`.
 * @param className `class` overrides for the wrapper.
 * @param portal Render the list in a portal, anchored to the field.
 * @param anchor With `portal`, the element the list drops under instead of the field.
 * @param inline The list always shows, in the flow, unframed.
 * @param zIndex Explicit z-index for the list.
 * @param commitOnBlur Commit free text on blur (default `true`).
 * @param borderless No frame on the field.
 * @param icon A leading icon in the field.
 * @param focusOnMount Focus the field on mount.
 * @param autoHighlight Highlight the first row whenever there is text.
 * @param inputProps Attributes for the field itself.
 * @param header Shown above the list's contents whenever the list is open.
 * @param listProps Attributes for the list.
 * @param onOpenChange Fires when the list opens or closes.
 * @param props Additional HTML properties for the wrapper.
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
  anchor,
  inline = false,
  zIndex,
  commitOnBlur = true,
  borderless = false,
  icon,
  focusOnMount = false,
  autoHighlight = false,
  inputProps,
  header,
  listProps,
  onOpenChange,
  "aria-label": ariaLabel,
  ...props
}) => {
  const [open, setOpenState] = useState(false);
  // Mirrors `open` so a change can be detected outside the state updater:
  // StrictMode runs updaters twice, and a callback inside one would fire twice
  const openRef = useRef(false);
  const setOpen = useCallback(
    (next: boolean): void => {
      if (openRef.current === next) return;
      openRef.current = next;
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange]
  );
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
      // At least as wide as the field; content (a description) may widen it
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });
  const setWrapper = useCallback(
    (node: HTMLDivElement | null): void => {
      wrapper.current = node;
      if (!anchor) refs.setReference(node);
    },
    [refs, anchor]
  );
  // An ancestor's ref attaches after the field mounts, so the anchor is read
  // when the list opens
  useLayoutEffect((): void => {
    if (open && anchor?.current) refs.setReference(anchor.current);
  }, [open, anchor, refs]);

  // A fresh list means the old highlight index points at a different row.
  useEffect((): void => setActive(null), [options]);

  // Opt-in focus on mount, for a combobox that appears because the user asked
  // for it. Read once: a later flip of the prop is not a second request.
  const focusOnMountRef = useRef(focusOnMount);
  useEffect((): void => {
    if (focusOnMountRef.current) {
      wrapper.current?.querySelector("input")?.focus();
    }
  }, []);

  // `active` is what the user pointed at. With nothing pointed at, an
  // auto-highlighting combobox stands on the top row whenever there is text,
  // so Enter takes the top match — derived, not stored, so a fresh list or
  // fresh text never has to reset it.
  const highlighted =
    active ?? (autoHighlight && inputValue.trim() && options.length ? 0 : null);

  const close = useCallback((): void => {
    setOpen(false);
    // Hovering a row sets the highlight; if it survived the close, the next
    // Enter would pick a row the user can no longer see.
    setActive(null);
  }, [setOpen]);

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
    // Capture, so a press on a surface that stops propagation still counts
    document.addEventListener("pointerdown", onPointerDown, true);
    return (): void =>
      document.removeEventListener("pointerdown", onPointerDown, true);
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
      setActive(
        highlighted === null
          ? delta === 1
            ? 0
            : options.length - 1
          : (highlighted + delta + options.length) % options.length
      );
      return;
    }
    if (e.key === "Enter") {
      // An empty field means "no filter", so Enter must clear rather than
      // take whatever the list happens to be highlighting. Without this,
      // emptying the field and confirming re-applies the first suggestion —
      // the field reads as cleared while the caller still filters by it.
      if (!inputValue.trim() && highlighted === null) {
        e.preventDefault();
        if (value) onChange(null);
        close();
        return;
      }
      const option =
        open && highlighted !== null ? options[highlighted] : undefined;
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
    <div ref={setWrapper} className={cn("relative", className)} {...props}>
      <Input
        onKeyDown={onKeyDown}
        size={size}
        disabled={disabled}
        borderless={borderless}
        icon={icon}
        autoComplete="off"
        value={inputValue}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        {...inputProps}
        onFocus={(): void => setOpen(true)}
        onBlur={commitOnBlur ? commitText : undefined}
        onChange={(e): void => {
          onInputChange(e.target.value);
          setOpen(true);
          // Typing invalidates whatever was highlighted
          setActive(null);
          // Typing past a pick means the pick no longer describes the field.
          if (value && e.target.value !== value.label) onChange(null);
        }}
      />
      {(open || inline) &&
        (loading || options.length > 0 || emptyMessage !== null) && (
          <ListPortal portal={portal && !inline}>
            <div
              id={listId}
              role="listbox"
              {...listProps}
              ref={portal && !inline ? refs.setFloating : undefined}
              style={portal && !inline ? floatingStyles : undefined}
              className={
                inline
                  ? "mt-1 max-h-80 overflow-y-auto"
                  : cn(
                      portal
                        ? undefined
                        : "absolute top-full left-0 mt-1 w-full",
                      "max-h-64 overflow-y-auto",
                      menuPanelStyles(),
                      portal ? undefined : "max-w-none",
                      zIndexStyles(
                        zIndex ?? (portal ? ZIndex.AboveModal : ZIndex.Medium)
                      )
                    )
              }
            >
              {header}
              {loading && (
                <div className="flex justify-center py-2">
                  <Spinner size={Size.Md} />
                </div>
              )}
              {!loading && !options.length && (
                <div className="px-2 py-1.5">
                  <Text variant={TextVariant.Sm} color={TextColor.Tertiary}>
                    {typeof emptyMessage === "function"
                      ? emptyMessage({ close })
                      : emptyMessage}
                  </Text>
                </div>
              )}
              {!loading &&
                options.map((option, i) => [
                  option.group && option.group !== options[i - 1]?.group && (
                    <MenuSectionTitle
                      key={`group:${option.group}`}
                      className="pt-2 pb-1"
                    >
                      {option.group}
                    </MenuSectionTitle>
                  ),
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    // The visible row is label + description; the name is the label
                    aria-label={option.label}
                    {...dataAttributes(option)}
                    aria-selected={i === highlighted}
                    className={optionStyles(i === highlighted, inline)}
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
                    <Text
                      variant={TextVariant.BodySecondary}
                      color={TextColor.Primary}
                    >
                      {option.label}
                    </Text>
                    {option.description && (
                      <Text
                        variant={TextVariant.BodyTertiary}
                        color={TextColor.Secondary}
                      >
                        {option.description}
                      </Text>
                    )}
                  </button>,
                ])}
            </div>
          </ListPortal>
        )}
    </div>
  );
};

Combobox.displayName = "Combobox";
