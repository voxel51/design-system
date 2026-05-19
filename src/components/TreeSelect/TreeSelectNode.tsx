import { type FC, type MouseEvent, type PointerEvent } from "react";

import { Icon } from "@/components/Icons/Icon";
import { Pill } from "@/components/Pill";
import { Stack } from "@/components/Stack";
import { Text } from "@/components/Text";
import radiusStyles from "@/styles/radius";
import {
  Align,
  BackgroundColor,
  BrandColor,
  bgColorClass,
  ElementState,
  IconName,
  Justify,
  Orientation,
  Radius,
  Size,
  Spacing,
  TextColor,
  TextVariant,
  textColorClass,
} from "@/types";
import { cn } from "@/util/classes";

import type { ResolvedNode } from "./types";

const DEPTH_INDENT = "var(--spacing-md)";

export function rowId(prefix: string, path: string): string {
  return `${prefix}-${path.replace(/\//g, "-")}`;
}

export interface TreeSelectNodeProps {
  resolved: ResolvedNode;
  selectedPath?: string;
  activePath: string | null;
  expandedPaths: Set<string>;
  forceOpenPaths?: Set<string>;
  query?: string;
  onToggleExpand: (path: string) => void;
  onSelect: (path: string) => void;
  onActivate: (path: string) => void;
  rowIdPrefix: string;
}

function highlightMatch(text: string, query?: string): React.ReactNode {
  if (!query) return text;

  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);

  return (
    <>
      {before}
      <span className={textColorClass(BrandColor.Primary)}>{match}</span>
      {after}
    </>
  );
}

/**
 * Renders a single node row and, when expanded, recursively renders its
 * children. Fully controlled by the parent — expansion, active highlight,
 * and selection are all driven by props.
 *
 * @internal For use by TreeSelect.
 */
export const TreeSelectNode: FC<TreeSelectNodeProps> = ({
  resolved,
  selectedPath,
  activePath,
  expandedPaths,
  forceOpenPaths,
  query,
  onToggleExpand,
  onSelect,
  onActivate,
  rowIdPrefix,
}) => {
  const { node, path, depth, selectable, isLeaf, children } = resolved;
  const isBranch = !isLeaf;
  const isSelected = path === selectedPath;
  const isExpanded = expandedPaths.has(path);
  const effectiveOpen = forceOpenPaths?.has(path) || isExpanded;
  const isActive = activePath === path;

  const groupId = rowId(rowIdPrefix, path) + "-group";
  const textColor = node.deprecated ? TextColor.Muted : TextColor.Primary;

  const stopEvent = (e: MouseEvent | PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleChevronClick = (e: MouseEvent) => {
    stopEvent(e);
    onToggleExpand(path);
  };

  const handleRowClick = () => {
    if (selectable) {
      onSelect(path);
    } else if (isBranch) {
      onToggleExpand(path);
    }
  };

  const indentStyle = {
    paddingLeft: `calc(${depth - 1} * ${DEPTH_INDENT} + var(--spacing-xs))`,
  };

  const rowClasses = cn(
    "flex-nowrap",
    "py-1.5",
    radiusStyles(Radius.Sm),
    "cursor-pointer",
    bgColorClass(BackgroundColor.Card1),
    isSelected && bgColorClass(BackgroundColor.CardElevated),
    bgColorClass(BackgroundColor.Card2, ElementState.Hover),
    bgColorClass(BackgroundColor.Card2, ElementState.Active)
  );

  const chevron = isBranch ? (
    <button
      type="button"
      tabIndex={-1}
      aria-expanded={effectiveOpen}
      aria-controls={groupId}
      aria-label={
        effectiveOpen ? `Collapse ${node.name}` : `Expand ${node.name}`
      }
      onClick={handleChevronClick}
      onPointerDown={stopEvent}
      onPointerUp={stopEvent}
      className={cn(
        "group",
        "cursor-pointer",
        "shrink-0 flex items-center justify-center size-5 rounded-full",
        bgColorClass(BackgroundColor.CardElevated, ElementState.Hover)
      )}
    >
      <Icon
        name={IconName.ChevronRight}
        size={Size.Sm}
        className={cn(
          "text-content-text-secondary",
          "group-hover:text-content-text-primary",
          effectiveOpen && "rotate-90"
        )}
      />
    </button>
  ) : (
    <span className="size-5 shrink-0" />
  );

  const labelContent = (
    <>
      <Stack orientation={Orientation.Column} className="min-w-0 flex-1">
        <Stack align={Align.Center} spacing={Spacing.Xs}>
          {chevron}
          <Text variant={TextVariant.Sm} color={textColor} className="truncate">
            {highlightMatch(node.name, query)}
          </Text>
          {node.deprecated && (
            <Pill size={Size.Xs} color={TextColor.Muted}>
              deprecated
            </Pill>
          )}
        </Stack>
        {node.description && (
          <Text
            variant={TextVariant.Xs}
            color={TextColor.Tertiary}
            className="truncate"
            style={{
              paddingLeft: `calc(var(--spacing-md) + var(--spacing-xs))`,
            }}
          >
            {node.description}
          </Text>
        )}
      </Stack>

      <span
        className={cn(
          "size-5 shrink-0 flex items-center",
          textColorClass(TextColor.Secondary)
        )}
      >
        {isSelected && <Icon name={IconName.Check} size={Size.Sm} />}
      </span>
    </>
  );

  return (
    <>
      <div
        id={rowId(rowIdPrefix, path)}
        role="treeitem"
        aria-selected={selectable ? isSelected : undefined}
        aria-expanded={isBranch ? effectiveOpen : undefined}
        tabIndex={-1}
        data-active={isActive || undefined}
        onClick={handleRowClick}
        onMouseEnter={() => onActivate(path)}
      >
        <Stack
          align={Align.Center}
          justify={Justify.Between}
          spacing={Spacing.Md}
          className={rowClasses}
          style={indentStyle}
          data-active={isActive || undefined}
        >
          {labelContent}
        </Stack>
      </div>
      {isBranch && effectiveOpen && (
        <div role="group" id={groupId}>
          {children.map((child) => (
            <TreeSelectNode
              key={child.path}
              resolved={child}
              selectedPath={selectedPath}
              activePath={activePath}
              expandedPaths={expandedPaths}
              forceOpenPaths={forceOpenPaths}
              query={query}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
              onActivate={onActivate}
              rowIdPrefix={rowIdPrefix}
            />
          ))}
        </div>
      )}
    </>
  );
};

TreeSelectNode.displayName = "TreeSelectNode";
