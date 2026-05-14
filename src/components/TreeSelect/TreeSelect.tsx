import { Combobox, ComboboxInput, ComboboxOptions } from "@headlessui/react";
import clsx from "clsx";
import { type FC, useCallback, useMemo, useRef, useState } from "react";

import { Icon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { SelectAnchor } from "@/components/Select";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Radius,
  Shadow,
  Size,
  TextColor,
  textColorClass,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { IconName } from "@/types/icons";

import { buildResolvedTree, flattenForFilter, formatBreadcrumb, getNodeByPath } from "./tree";
import { TreeSelectNode } from "./TreeSelectNode";
import { TreeSelectOption } from "./TreeSelectOption";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const resolved = useMemo(
    () => buildResolvedTree(root, { leavesOnly }),
    [root, leavesOnly]
  );

  const flatMatches = useMemo(
    () => (query ? flattenForFilter(resolved, query) : null),
    [resolved, query]
  );

  const handleChange = useCallback(
    (selected: string | null) => {
      setQuery("");
      onChange?.(selected);

      window.setTimeout(() => {
        inputRef.current?.blur();
      }, 0);
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

      return formatBreadcrumb(v);
    },
    [root, displayValueProp]
  );

  return (
    <div className={clsx(className, "w-full")} {...props}>
      <Combobox
        disabled={disabled}
        value={value ?? null}
        onChange={handleChange}
        immediate
        onClose={() => setQuery("")}
      >
        <div className="relative flex items-center">
          <ComboboxInput
            ref={inputRef}
            autoComplete="off"
            displayValue={getDisplayValue}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={clsx(
              inputStyle({ disabled }),
              "w-full pr-8 cursor-pointer"
            )}
          />
          <span
            className={clsx(
              "pointer-events-none absolute right-2.5 flex items-center",
              disabled && "opacity-50"
            )}
            aria-hidden
          >
            <Icon
              name={IconName.CaretDown}
              size={Size.Sm}
              className={textColorClass(TextColor.Secondary)}
            />
          </span>
        </div>

        <ComboboxOptions
          anchor={anchor}
          portal={portal}
          className={clsx(
            "mt-1",
            "w-[var(--anchor-width)]",
            "max-h-72 overflow-y-auto",
            getZIndexClass(zIndex, portal),
            radiusStyles(Radius.Md),
            shadowStyles(Shadow.Md)
          )}
        >
          {flatMatches
            ? flatMatches.map((match) => (
                <TreeSelectOption
                  key={match.path}
                  value={match.path}
                  selected={match.path === value}
                  depth={0}
                  label={match.node.name}
                  description={match.node.description}
                  deprecated={match.node.deprecated}
                  breadcrumb={formatBreadcrumb(match.path)}
                />
              ))
            : resolved.children.map((child) => (
                <TreeSelectNode
                  key={child.path}
                  resolved={child}
                  selectedPath={value}
                />
              ))}
        </ComboboxOptions>
      </Combobox>
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
