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
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { Icon } from "@/components/Icons";
import { inputStyle } from "@/components/Input";
import { SelectAnchor } from "@/components/Select";
import { Text } from "@/components/Text";
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
  TextVariant,
  ZIndex,
  zIndexStyles,
} from "@/types";
import { IconName } from "@/types/icons";
import { cn } from "@/util/classes";
import { useDebouncedCallback } from "@/util/useDebouncedCallback";

import {
  buildResolvedTree,
  filterTreeForQuery,
  flattenVisible,
  getNodeByPath,
  getParentPath,
} from "./tree";
import { TreeSelectNode, rowId } from "./TreeSelectNode";
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
  className,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [activePath, setActivePath] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const rowIdPrefix = useId();

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

  const visibleNodes = useMemo(() => {
    const tree = filtered?.tree ?? resolved;
    const force = filtered?.forceOpenPaths;
    return flattenVisible(
      tree,
      (p) => expandedPaths.has(p) || force?.has(p) === true
    );
  }, [filtered, resolved, expandedPaths]);

  const handleSelect = useCallback(
    (selected: string) => {
      setQuery("");
      onChange?.(selected);
    },
    [onChange]
  );

  const onToggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

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
        value && visibleNodes.some((n) => n.path === value)
          ? value
          : visibleNodes[0]?.path ?? null;
      setActivePath(initial);
    } else {
      setActivePath(null);
      setExpandedPaths(new Set());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only fire on isOpen toggle
  }, [isOpen]);

  // Reset active path when the filtered tree changes
  useEffect(() => {
    if (isOpen && debouncedQuery) {
      setActivePath(visibleNodes[0]?.path ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on query change only
  }, [debouncedQuery]);

  // Scroll active row into view
  useEffect(() => {
    if (!activePath) return;
    const el = document.getElementById(rowId(rowIdPrefix, activePath));
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activePath, rowIdPrefix]);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const currentIdx = activePath
        ? visibleNodes.findIndex((n) => n.path === activePath)
        : -1;
      const activeNode = currentIdx >= 0 ? visibleNodes[currentIdx] : null;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (currentIdx < visibleNodes.length - 1) {
            setActivePath(visibleNodes[currentIdx + 1].path);
          } else if (currentIdx === -1 && visibleNodes.length > 0) {
            setActivePath(visibleNodes[0].path);
          }
          break;
        }

        case "ArrowUp": {
          e.preventDefault();
          if (currentIdx > 0) {
            setActivePath(visibleNodes[currentIdx - 1].path);
          }
          break;
        }

        case "ArrowRight": {
          if (!activeNode || activeNode.isLeaf) break;
          e.preventDefault();
          const isNodeOpen =
            expandedPaths.has(activeNode.path) ||
            filtered?.forceOpenPaths?.has(activeNode.path);
          if (!isNodeOpen) {
            onToggleExpand(activeNode.path);
          } else if (activeNode.children.length > 0) {
            setActivePath(activeNode.children[0].path);
          }
          break;
        }

        case "ArrowLeft": {
          if (!activeNode) break;
          e.preventDefault();
          const isNodeExpanded =
            !activeNode.isLeaf &&
            (expandedPaths.has(activeNode.path) ||
              filtered?.forceOpenPaths?.has(activeNode.path));
          if (isNodeExpanded) {
            onToggleExpand(activeNode.path);
          } else {
            const parentPath = getParentPath(activeNode.path);
            if (parentPath) {
              const parentVisible = visibleNodes.some(
                (n) => n.path === parentPath
              );
              if (parentVisible) {
                setActivePath(parentPath);
              }
            }
          }
          break;
        }

        case "Enter": {
          if (!activeNode) break;
          e.preventDefault();
          if (activeNode.selectable) {
            handleSelect(activeNode.path);
          }
          break;
        }

        case "Escape": {
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          break;
        }
      }
    },
    [
      activePath,
      visibleNodes,
      expandedPaths,
      filtered,
      onToggleExpand,
      handleSelect,
    ]
  );

  return (
    <div ref={refs.setReference} className={cn(className, "w-full")} {...props}>
      <div className="relative flex items-center">
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
      </div>

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
                  onKeyDown={handleKeyDown}
                  aria-label="Search tree"
                  aria-activedescendant={
                    activePath
                      ? rowId(rowIdPrefix, activePath)
                      : undefined
                  }
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
              {debouncedQuery && !filtered ? (
                <div className="flex justify-center">
                  <Text
                    variant={TextVariant.Sm}
                    color={TextColor.Tertiary}
                    className="px-3 py-2"
                  >
                    No matches found
                  </Text>
                </div>
              ) : (
                (filtered?.tree ?? resolved).children.map((child) => (
                  <TreeSelectNode
                    key={child.path}
                    resolved={child}
                    selectedPath={value}
                    activePath={activePath}
                    expandedPaths={expandedPaths}
                    forceOpenPaths={filtered?.forceOpenPaths}
                    query={filtered ? query : undefined}
                    onToggleExpand={onToggleExpand}
                    onSelect={handleSelect}
                    onActivate={setActivePath}
                    rowIdPrefix={rowIdPrefix}
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
