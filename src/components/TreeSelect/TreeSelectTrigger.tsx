import React, { type FC, useState } from "react";

import { Icon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { Pill } from "@/components/Pill";
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
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";

export interface TreeSelectTriggerProps {
  multiSelect?: boolean;
  value: string | string[] | undefined;
  disabled?: boolean;
  placeholder?: string;
  isOpen: boolean;
  panelId: string;
  hasValue: boolean;
  getDisplayValue: (path: string | null) => string;
  onToggle: () => void;
  onClear: () => void;
  onRemoveOne: (path: string) => void;
}

function ChevronIndicator({
  isOpen,
  disabled,
}: {
  isOpen: boolean;
  disabled?: boolean;
}): React.ReactElement {
  return (
    <span
      className={cn(
        "pointer-events-none absolute right-2.5 flex items-center",
        "transition-transform duration-150",
        isOpen ? "-rotate-90" : "rotate-90",
        disabled && "opacity-50"
      )}
      aria-hidden
    >
      <Icon
        name={IconName.ChevronRight}
        size={Size.Sm}
        className={textColorClass(TextColor.Secondary)}
      />
    </span>
  );
}

function ClearButton({
  onClick,
}: {
  onClick: (e: React.MouseEvent) => void;
}): React.ReactElement {
  return (
    <button
      type="button"
      aria-label="Clear selection"
      onClick={onClick}
      className={cn(
        "group",
        "absolute right-7 flex items-center justify-center",
        "p-[5px]",
        "cursor-pointer",
        "rounded-full",
        "transition-[background-color] duration-150",
        bgColorClass(BackgroundColor.Card2, ElementState.Hover)
      )}
    >
      <Icon
        name={IconName.Close}
        size={Size.Sm}
        className={cn(
          textColorClass(TextColor.Secondary),
          "group-hover:text-content-text-primary",
          "transition-colors duration-150"
        )}
      />
    </button>
  );
}

/**
 * Trigger element for TreeSelect. Renders either a pill-based multi-select
 * trigger or a single-select read-only input, branching on `multiSelect`.
 *
 * @internal For use by TreeSelect.
 */
export const TreeSelectTrigger: FC<TreeSelectTriggerProps> = ({
  multiSelect,
  value,
  disabled,
  placeholder,
  isOpen,
  panelId,
  hasValue,
  getDisplayValue,
  onToggle,
  onClear,
  onRemoveOne,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClear = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onClear();
  };

  if (multiSelect) {
    return (
      <div
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="tree"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => {
          if (!disabled) onToggle();
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          inputStyle({ disabled }),
          "relative flex flex-wrap items-center gap-1",
          "h-auto",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
          hasValue ? "pr-14" : "pr-8"
        )}
      >
        {((value as string[] | undefined) ?? []).map((p) => (
          <Pill
            key={p}
            size={Size.Xs}
            onRemove={disabled ? undefined : () => onRemoveOne(p)}
            backgroundColor={BackgroundColor.CardElevated}
            className="py-0"
          >
            {getDisplayValue(p)}
          </Pill>
        ))}
        {!hasValue && placeholder && (
          <span className={textColorClass(TextColor.Tertiary)}>
            {placeholder}
          </span>
        )}
        <ChevronIndicator isOpen={isOpen} disabled={disabled} />
        {hasValue && !disabled && isHovered && (
          <ClearButton onClick={handleClear} />
        )}
      </div>
    );
  }

  return (
    <Stack
      align={Align.Center}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        readOnly
        autoComplete="off"
        role="combobox"
        aria-haspopup="tree"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        disabled={disabled}
        value={getDisplayValue((value as string | undefined) ?? null)}
        onClick={onToggle}
        placeholder={placeholder}
        className={cn(
          inputStyle({ disabled }),
          "w-full cursor-pointer",
          hasValue ? "pr-14" : "pr-8"
        )}
      />
      <ChevronIndicator isOpen={isOpen} disabled={disabled} />
      {hasValue && !disabled && isHovered && (
        <ClearButton onClick={handleClear} />
      )}
    </Stack>
  );
};

TreeSelectTrigger.displayName = "TreeSelectTrigger";
