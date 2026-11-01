import {
  type FC,
  type HTMLAttributes,
  type KeyboardEvent,
  useMemo,
  useRef,
} from "react";

import { Combobox } from "@/components/Combobox";
import { CloseIcon } from "@/components/Icons";
import radiusStyles from "@/styles/radius";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface TagInputProps extends Omit<
  HTMLAttributes<HTMLLabelElement>,
  "onChange" | "children"
> {
  /** The committed tags, shown as chips. */
  value: string[];
  /** Fires with the next tag list when a tag is added or removed. */
  onChange: (tags: string[]) => void;
  /** Text being typed. Controlled, so the caller can drive a suggestion query from it. */
  inputValue: string;
  /** Fires with the next draft text. */
  onInputChange: (value: string) => void;
  /** Known tags to offer as the user types; already-picked tags are left out. */
  suggestions?: string[];
  /** Spinner in place of the suggestions while the caller's query is in flight. */
  loading?: boolean;
  /** Shown when there are no tags and no draft text. */
  placeholder?: string;
  disabled?: boolean;
}

/**
 * A field that collects free-form tags as chips.
 *
 * Enter, comma, Tab or blur commit the draft as a tag; Backspace on an empty
 * draft removes the last one, and each chip has its own remove button. With
 * `suggestions`, matching known tags drop down under the field as in a
 * {@link Combobox}; any other text is still accepted.
 *
 * @example
 * ```tsx
 * const [tags, setTags] = useState<string[]>([]);
 * const [draft, setDraft] = useState("");
 *
 * <TagInput
 *   value={tags}
 *   onChange={setTags}
 *   inputValue={draft}
 *   onInputChange={setDraft}
 *   suggestions={["demo", "video"]}
 *   placeholder="Add a tag and press Enter"
 * />
 * ```
 *
 * @param value The committed tags.
 * @param onChange Fires with the next tag list.
 * @param inputValue Controlled draft text.
 * @param onInputChange Fires with the next draft text.
 * @param suggestions Known tags to offer, filtered by the draft.
 * @param loading Show a spinner in place of the suggestions.
 * @param placeholder Shown when the field is empty.
 * @param disabled If `true`, tags cannot be added or removed.
 * @param className `class` overrides for the frame.
 * @param props Additional HTML properties for the frame; `aria-label` names the text field.
 */
export const TagInput: FC<TagInputProps> = ({
  value,
  onChange,
  inputValue,
  onInputChange,
  suggestions = [],
  loading = false,
  placeholder,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  ...props
}) => {
  const frame = useRef<HTMLLabelElement | null>(null);
  const picked = useRef<string | null>(null);

  const options = useMemo(() => {
    const draft = inputValue.trim().toLowerCase();
    return suggestions
      .filter((s) => !value.includes(s) && s.toLowerCase().includes(draft))
      .map((s) => ({ id: s, label: s }));
  }, [inputValue, suggestions, value]);

  const commit = (raw: string): void => {
    const tag = raw.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    onInputChange("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !inputValue && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <label
      {...props}
      ref={frame}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 border px-1.5 py-1",
        bgColorClass(BackgroundColor.Transparent),
        borderColorClass(BorderColor.Input),
        !disabled &&
          borderColorClass(BorderColor.InputHover, ElementState.Hover),
        "focus-within:border-content-border-input-focus",
        radiusStyles(Radius.Sm),
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {value.map((tag) => (
        <span
          key={tag}
          className={cn(
            "inline-flex max-w-40 items-center gap-1 rounded-full py-0.5 pr-1 pl-2.5 text-body-secondary",
            bgColorClass(BackgroundColor.CardElevated),
            textColorClass(TextColor.Primary)
          )}
        >
          <span className="truncate">{tag}</span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Remove ${tag}`}
            onClick={(): void => onChange(value.filter((t) => t !== tag))}
            className={cn(
              "inline-flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
              textColorClass(TextColor.Secondary),
              textColorClass(TextColor.Primary, ElementState.Hover),
              bgColorClass(BackgroundColor.CardNested, ElementState.Hover)
            )}
          >
            <CloseIcon size={10} />
          </button>
        </span>
      ))}
      <Combobox
        className="min-w-20 flex-1"
        borderless
        allowFreeText
        portal
        anchor={frame}
        disabled={disabled}
        loading={loading}
        options={options}
        value={null}
        inputValue={inputValue}
        emptyMessage={null}
        placeholder={value.length ? undefined : placeholder}
        aria-label={ariaLabel}
        inputProps={{ className: "h-7 py-1", onKeyDownCapture: onKeyDown }}
        onInputChange={(next): void => {
          if (next === picked.current) {
            picked.current = null;
            onInputChange("");
          } else if (next.endsWith(",")) {
            commit(next.slice(0, -1));
          } else {
            onInputChange(next);
          }
        }}
        onChange={(option): void => {
          if (!option) return;
          picked.current = option.label;
          commit(option.label);
        }}
      />
    </label>
  );
};
