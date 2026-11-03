import { type ChangeEvent, type FC, type ReactNode } from "react";

import { Dropdown, DropdownTrigger } from "@/components/Dropdown";
import { IconAction } from "@/components/IconAction";
import { CloseIcon, SearchStrokeIcon } from "@/components/Icons";
import { MenuCheckItem } from "@/components/Menu";
import radiusStyles from "@/styles/radius";
import { TEXT_STYLES } from "@/styles/text";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
} from "@/types";
import { cn } from "@/util/classes";

import { Input, type InputProps } from "./Input";

export interface SearchScope {
  /** Stable identifier passed to `onScopeChange`. */
  id: string;
  /** Text shown in the scope menu and on the trigger. */
  label: ReactNode;
}

export interface SearchInputProps extends Omit<
  InputProps,
  "borderless" | "icon" | "type" | "onChange" | "value"
> {
  value: string;
  /** Called with the new text, and with `""` (no event) when the clear button is pressed. */
  onChange: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
  /** The dimensions the search can be narrowed to, such as name or tags. Omit for a plain search. */
  scopes?: SearchScope[];
  /** The `id` of the active scope. */
  scope?: string;
  onScopeChange?: (id: string) => void;
  /** Extra content at the trailing edge, before the clear button, such as a spinner. */
  trailing?: ReactNode;
}

/**
 * A framed search field with a leading search icon, an optional scope menu that narrows the search
 * to one dimension (name, tags, ...), and a clear button once there is text.
 *
 * @example
 * ```tsx
 * const [text, setText] = useState("");
 * const [scope, setScope] = useState("all");
 * <SearchInput
 *   value={text}
 *   onChange={setText}
 *   placeholder="Search datasets"
 *   scopes={[
 *     { id: "all", label: "All" },
 *     { id: "name", label: "Name" },
 *   ]}
 *   scope={scope}
 *   onScopeChange={setScope}
 * />
 * ```
 *
 * @param value The current text.
 * @param onChange Called with the new text and its change event; `""` and no event when cleared.
 * @param scopes The dimensions the search can be narrowed to. Omit for a plain search.
 * @param scope The `id` of the active scope.
 * @param onScopeChange Called with the `id` of the scope the user picks.
 * @param trailing Extra content before the clear button.
 * @param size The size of the field. Defaults to `"md"`.
 * @param className `class` overrides for the frame.
 * @param props Additional input properties, such as `placeholder` and `onKeyDown`.
 */
export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  scopes,
  scope,
  onScopeChange,
  trailing,
  size = Size.Md,
  className,
  disabled,
  ...props
}) => {
  const active = scopes?.find((s) => s.id === scope) ?? scopes?.[0];
  return (
    <div
      className={cn(
        "flex w-full items-center gap-1 border pl-3 pr-1",
        bgColorClass(BackgroundColor.Transparent),
        borderColorClass(BorderColor.Input),
        borderColorClass(BorderColor.InputHover, ElementState.Hover),
        "focus-within:border-content-border-input-focus",
        radiusStyles(Radius.Sm),
        disabled && "opacity-50",
        className
      )}
    >
      <SearchStrokeIcon
        size={size === Size.Sm ? Size.Sm : Size.Md}
        className={textColorClass(TextColor.Secondary)}
      />
      {scopes && active && (
        <Dropdown
          trigger={
            <DropdownTrigger
              borderless
              size={Size.Md}
              className="py-1"
              disabled={disabled}
              aria-label="Search scope"
            >
              {active.label}
            </DropdownTrigger>
          }
        >
          {scopes.map((s) => (
            <MenuCheckItem
              key={s.id}
              checked={s.id === active.id}
              onClick={() => onScopeChange?.(s.id)}
            >
              {s.label}
            </MenuCheckItem>
          ))}
        </Dropdown>
      )}
      {/* the frame's border sits outside the input; keep the field at its size */}
      <div className="-my-px min-w-0 flex-1">
        <Input
          {...props}
          borderless
          size={size}
          className={TEXT_STYLES[TextVariant.BodySecondary]}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value, e)}
        />
      </div>
      {trailing}
      {value && (
        <IconAction
          icon={CloseIcon}
          size={Size.Sm}
          aria-label="Clear search"
          onClick={() => onChange("")}
        />
      )}
    </div>
  );
};

SearchInput.displayName = "SearchInput";
