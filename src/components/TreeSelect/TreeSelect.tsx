import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Icon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { SelectAnchor } from "@/components/Select";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import shadowStyles from "@/styles/shadow";
import {
  Align,
  BackgroundColor,
  bgColorClass,
  BorderColor,
  borderColorClass,
  ElementState,
  Justify,
  Radius,
  Shadow,
  Size,
  TextColor,
  textColorClass,
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";
import { useDebouncedCallback } from "@/util/useDebouncedCallback";
import { useTree } from "@/util/useTree";

import { buildResolvedTree, filterTreeForQuery, getNodeByPath } from "./tree";
import { TreeSelectNode } from "./TreeSelectNode";
import type { TreeSelectProps } from "./types";

const ANCHOR_TO_PLACEMENT: Record<SelectAnchor, Placement> = {
  [SelectAnchor.Bottom]: "bottom",
  [SelectAnchor.BottomStart]: "bottom-start",
  [SelectAnchor.BottomEnd]: "bottom-end",
  [SelectAnchor.Top]: "top",
  [SelectAnchor.TopStart]: "top-start",
  [SelectAnchor.TopEnd]: "top-end",
};

function getZIndexClass(zIndex?: ZIndex, portal?: boolean): string | undefined {
  if (zIndex) {
    return zIndexStyles(zIndex);
  }
  if (portal) {
    return zIndexStyles(ZIndex.AboveModal);
  }
  return undefined;
}

function PortalWrapper({
  portal,
  children,
}: {
  portal?: boolean;
  children: ReactNode;
}) {
  if (portal) {
    return <FloatingPortal>{children}</FloatingPortal>;
  }
  return <>{children}</>;
}

/**
 * A tree-shaped selection control that renders taxonomy nodes in a
 * searchable dropdown panel styled to match {@link Select}.
 *
 * Supports single-select with full keyboard navigation (ARIA treeview pattern).
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
  defaultExpanded,
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles } = useFloating({
    placement: ANCHOR_TO_PLACEMENT[anchor],
    open: isOpen,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            minWidth: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const debouncedSetQuery = useDebouncedCallback(setDebouncedQuery, 200);

  useEffect(() => {
    if (!query) {
      debouncedSetQuery.cancel();
      setDebouncedQuery("");
      return;
    }
    debouncedSetQuery(query);
  }, [query, debouncedSetQuery]);

  const resolved = useMemo(
    () => buildResolvedTree(root, { leavesOnly }),
    [root, leavesOnly]
  );

  const filtered = useMemo(
    () =>
      debouncedQuery ? filterTreeForQuery(resolved, debouncedQuery) : null,
    [resolved, debouncedQuery]
  );

  const handleSelect = useCallback(
    (selected: string) => {
      setQuery("");
      onChange?.(selected);
    },
    [onChange]
  );

  const handleEscape = useCallback(() => {
    setIsOpen(false);
    setQuery("");
  }, []);

  const tree = useTree({
    tree: filtered?.tree ?? resolved,
    selectedPath: value,
    forceOpenPaths: filtered?.forceOpenPaths,
    defaultExpanded,
    onSelect: handleSelect,
    onEscape: handleEscape,
  });

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

  // Focus search input when panel opens; initialize active path
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
      const initial =
        value && tree.visibleNodes.some((n) => n.path === value)
          ? value
          : tree.visibleNodes[0]?.path ?? null;
      tree.setActivePath(initial);
    } else {
      tree.setActivePath(null);
      tree.resetExpansion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on isOpen toggle
  }, [isOpen]);

  // Reset active path when the filtered tree changes
  useEffect(() => {
    if (isOpen && debouncedQuery) {
      tree.setActivePath(tree.visibleNodes[0]?.path ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on query change only
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const reference = refs.reference.current as HTMLElement | null;
      const floating = refs.floating.current;
      if (reference?.contains(target) || floating?.contains(target)) {
        return;
      }
      setIsOpen(false);
      setQuery("");
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, refs.reference, refs.floating]);

  const panelId = tree.rowId("panel");

  return (
    <div ref={refs.setReference} className={cn(className, "w-full")} {...props}>
      <Stack align={Align.Center} className="relative">
        <input
          readOnly
          autoComplete="off"
          role="combobox"
          aria-haspopup="tree"
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          disabled={disabled}
          value={getDisplayValue(value ?? null)}
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
      </Stack>

      {isOpen && (
        <PortalWrapper portal={portal}>
          <div
            ref={refs.setFloating}
            id={panelId}
            role="tree"
            aria-label="Tree selection"
            style={floatingStyles}
            className={cn(
              "max-h-72 overflow-y-auto",
              "border",
              borderColorClass(BorderColor.Default),
              bgColorClass(BackgroundColor.Card1),
              getZIndexClass(zIndex, portal),
              radiusStyles(Radius.Lg),
              shadowStyles(Shadow.Lg),
              "focus:outline-none"
            )}
          >
            <div
              className={cn(
                "sticky top-0 z-10 p-1.5",
                bgColorClass(BackgroundColor.Card1)
              )}
            >
              <Stack align={Align.Center} className="relative">
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
                  onKeyDown={tree.handleKeyDown}
                  aria-label="Search tree"
                  aria-activedescendant={tree.activeDescendantId}
                  placeholder="Search..."
                  className={cn(inputStyle({ disabled: false }), "w-full px-8")}
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
              </Stack>
            </div>

            <div className="p-1.5 pt-0">
              {debouncedQuery && !filtered ? (
                <Stack justify={Justify.Center}>
                  <Text
                    variant={TextVariant.Sm}
                    color={TextColor.Tertiary}
                    className="px-3 py-2"
                  >
                    No matches found
                  </Text>
                </Stack>
              ) : (
                (filtered?.tree ?? resolved).children.map((child) => (
                  <TreeSelectNode
                    key={child.path}
                    resolved={child}
                    tree={tree}
                    query={filtered ? query : undefined}
                  />
                ))
              )}
            </div>
          </div>
        </PortalWrapper>
      )}
    </div>
  );
};

TreeSelect.displayName = "TreeSelect";
