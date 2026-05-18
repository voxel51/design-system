import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import { type FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Icon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { SelectAnchor } from "@/components/Select";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Radius,
  Shadow,
  Size,
  TextColor,
  textColorClass,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";
import { useElementSize } from "@/util/useElementSize";

import { Text } from "@/components/Text";
import { TextVariant } from "@/types";

import { buildResolvedTree, filterTreeForQuery, getNodeByPath } from "./tree";
import { TreeSelectNode } from "./TreeSelectNode";
import type { TreeSelectProps } from "./types";

function getZIndexClass(zIndex?: ZIndex, portal?: boolean): string | undefined {
  if (portal) {
    return zIndexStyles(ZIndex.AboveModal);
  }
  if (zIndex) {
    return zIndexStyles(zIndex);
  }
  return undefined;
}

/**
 * A tree-shaped selection control that renders taxonomy nodes in a
 * searchable dropdown panel styled to match {@link Select}.
 *
 * Supports single-select.
 *
 * @example
 * ```tsx
 * const taxonomy: TreeNode = {
 *   name: "vehicle_type",
 *   values: [
 *     { name: "car", values: [{ name: "Honda" }, { name: "Toyota" }] },
 *     { name: "motorcycle" },
 *   ],
 * };
 *
 * const [value, setValue] = useState<string | undefined>();
 *
 * <TreeSelect
 *   root={taxonomy}
 *   value={value}
 *   onChange={(path) => setValue(path ?? undefined)}
 *   placeholder="Select a vehicle…"
 * />
 * ```
 *
 * @param root The root node of the taxonomy tree.
 * @param value Currently selected node path (slash-delimited).
 * @param onChange Fires when the user selects a node.
 * @param leavesOnly When `true`, only leaf nodes are selectable.
 * @param disabled If `true`, the component is disabled.
 * @param placeholder Placeholder text for the input.
 * @param anchor Position of the dropdown panel relative to the trigger.
 * @param portal If `true`, renders the panel in a portal.
 * @param zIndex Explicit z-index for the dropdown panel.
 * @param displayValue Custom formatter for the trigger display text.
 * @param className `class` overrides for the root wrapper.
 * @param props Additional HTML properties for the root wrapper.
 */
export const TreeSelect: FC<TreeSelectProps> = ({
  root,
  value,
  onChange,
  leavesOnly = false,
  disabled,
  placeholder,
  anchor = SelectAnchor.BottomStart,
  portal,
  zIndex,
  displayValue: displayValueProp,
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { ref: triggerRef, width: triggerWidth } = useElementSize();

  const resolved = useMemo(
    () => buildResolvedTree(root, { leavesOnly }),
    [root, leavesOnly]
  );

  const filtered = useMemo(
    () => (query ? filterTreeForQuery(resolved, query) : null),
    [resolved, query]
  );

  const handleChange = useCallback(
    (selected: string | null) => {
      setQuery("");
      onChange?.(selected);
    },
    [onChange]
  );

  const getDisplayValue = useCallback(
    (v: string | null): string => {
      if (!v) return "";

      const node = getNodeByPath(root, v);
      if (!node) return v;

      if (displayValueProp) {
        return displayValueProp(v, node);
      }

      return node.name;
    },
    [root, displayValueProp]
  );

  const toggleOpen = useCallback(() => {
    if (!disabled) setIsOpen((prev) => !prev);
  }, [disabled]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        wrapperRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
      setQuery("");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className={cn(className, "w-full")} {...props}>
      <Combobox
        disabled={disabled}
        value={value ?? null}
        onChange={handleChange}
      >
        <div ref={triggerRef} className="relative flex items-center">
          <ComboboxInput
            ref={inputRef}
            readOnly
            autoComplete="off"
            displayValue={getDisplayValue}
            onClick={() => {
              setQuery("");
              toggleOpen();
            }}
            placeholder={placeholder}
            className={cn(
              inputStyle({ disabled }),
              "w-full cursor-pointer",
              value ? "pr-14" : "pr-8"
            )}
          />
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
          {value && !disabled && (
            <button
              type="button"
              aria-label="Clear selection"
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
                setIsOpen(false);
                onChange?.(null);
              }}
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
          )}
        </div>

        {isOpen && (
          <ComboboxOptions
            ref={panelRef}
            static
            anchor={anchor}
            portal={portal}
            className={cn(
              "mt-1",
              "max-h-72 overflow-y-auto",
              "border",
              borderColorClass(BorderColor.Default),
              bgColorClass(BackgroundColor.Card1),
              getZIndexClass(zIndex, portal),
              radiusStyles(Radius.Lg),
              shadowStyles(Shadow.Lg),
              "focus:outline-none"
            )}
            style={triggerWidth ? { width: triggerWidth } : undefined}
          >
            <div
              className={cn(
                "sticky top-0 z-10 p-1.5",
                bgColorClass(BackgroundColor.Card1)
              )}
            >
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-2.5 flex items-center">
                  <Icon
                    name={IconName.Search}
                    size={Size.Sm}
                    className={textColorClass(TextColor.Tertiary)}
                  />
                </span>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                aria-label="Search tree"
                placeholder="Search..."
                  className={cn(
                    inputStyle({ disabled: false }),
                    "w-full pl-8",
                    query ? "pr-8" : "pr-3"
                  )}
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      searchInputRef.current?.focus();
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
                )}
              </div>
            </div>

            <div className="p-1.5 pt-0">
              {query && !filtered ? (
                <Text
                  variant={TextVariant.Sm}
                  color={TextColor.Tertiary}
                  className="px-3 py-2"
                >
                  No matches found
                </Text>
              ) : (
                (filtered?.tree ?? resolved).children.map((child) => (
                  <TreeSelectNode
                    key={child.path}
                    resolved={child}
                    selectedPath={value}
                    forceOpenPaths={filtered?.forceOpenPaths}
                  />
                ))
              )}
            </div>
          </ComboboxOptions>
        )}
      </Combobox>
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
