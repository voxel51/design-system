import { type FC, type KeyboardEvent, type Ref } from "react";

import { CloseIcon, SearchIcon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { Stack } from "@/components/Stack";
import {
  Align,
  BackgroundColor,
  bgColorClass,
  ElementState,
  Size,
  TextColor,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

export interface TreeSelectSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  inputRef: Ref<HTMLInputElement>;
  activeDescendantId?: string;
}

/**
 * Sticky search bar rendered at the top of the TreeSelect panel.
 * Owns the magnifier icon, text input, and clear button.
 *
 * @internal For use by TreeSelectPanel.
 */
export const TreeSelectSearchInput: FC<TreeSelectSearchInputProps> = ({
  value,
  onChange,
  onKeyDown,
  inputRef,
  activeDescendantId,
}) => {
  return (
    <div className={cn("shrink-0 p-1.5", bgColorClass(BackgroundColor.Card1))}>
      <Stack align={Align.Center} className="relative">
        <span className="pointer-events-none absolute left-2.5 flex items-center">
          <SearchIcon
            size={Size.Sm}
            className={textColorClass(TextColor.Tertiary)}
          />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={onKeyDown}
          aria-label="Search tree"
          aria-activedescendant={activeDescendantId}
          placeholder="Search..."
          className={cn(inputStyle({ disabled: false }), "w-full px-8")}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              if (inputRef && typeof inputRef === "object") {
                inputRef.current?.focus();
              }
            }}
            className={cn(
              "group",
              "absolute right-1 flex items-center justify-center",
              "p-[5px]",
              "cursor-pointer",
              "rounded-full",
              "transition-[background-color] duration-150",
              bgColorClass(BackgroundColor.Card2, ElementState.Hover)
            )}
          >
            <CloseIcon
              size={Size.Sm}
              className={cn(
                textColorClass(TextColor.Secondary),
                "group-hover:text-content-text-primary",
                "transition-colors duration-150"
              )}
            />
          </button>
        )}
      </Stack>
    </div>
  );
};

TreeSelectSearchInput.displayName = "TreeSelectSearchInput";
